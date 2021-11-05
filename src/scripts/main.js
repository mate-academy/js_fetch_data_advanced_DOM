'use strict';

const BASE_URL = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones';

function request(url) {
  return fetch(url)
    .then(responce => responce.json());
}

const phonesIdListArray
  = request(`${BASE_URL}.json`)
    .then(result => result)
    .then(arrayPhonesResult => {
      return arrayPhonesResult.map(phone => {
        return request(`${BASE_URL}/${phone.id}.json`);
      });
    });

function getFirstReceivedDetails(phones) {
  return phones
    .then(response => Promise.any(response));
};

function getAllSuccessfulDetails(phones) {
  return phones
    .then(response => {
      return Promise.allSettled(response)
        .then(results => results.filter(result => {
          return result.status === 'fulfilled';
        }))
        .then(result => {
          const resultArr = [];

          for (const object of result) {
            resultArr.push(object.value);
          };

          return resultArr;
        });
    });
};

function getThreeFastestDetails(phones) {
  return getAllSuccessfulDetails(phones)
    .then(allPhones => allPhones.slice(0, 3));
};

function printNotify(list, notify, title) {
  const divElement = document.createElement('div');

  divElement.className = notify;
  divElement.textContent = title;
  document.body.append(divElement);

  divElement.insertAdjacentHTML('beforeend', `
    <ul>
      ${list.map(phone => `
      <li>
        Name: ${phone.name}
        </br>
        ID: ${phone.id.toUpperCase()}
        </br>
      </li>
  `).join('')}
    </ul>
  `);

  document.body.append(divElement);
};

getFirstReceivedDetails(phonesIdListArray)
  .then(phone => {
    const phoneArr = [];

    phoneArr.push(phone);
    printNotify(phoneArr, 'first-received', 'First Received');
  });

getAllSuccessfulDetails(phonesIdListArray)
  .then(phoneArr =>
    printNotify(phoneArr, 'all-successful', 'All Successful'));

getThreeFastestDetails(phonesIdListArray)
  .then(phoneArr =>
    printNotify(phoneArr, 'three-successful', 'Three Successful'));
