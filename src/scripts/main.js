/* eslint-disable prefer-promise-reject-errors */
'use strict';

const body = document.querySelector('body');
const BASE_URL = `https://mate-academy.github.io/`
  + `phone-catalogue-static/api/`;

const phonesID = [];

const request = (url) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(
          `${response.status}`
        );
      }

      return response.json();
    });
};

const getPhonesID = () => request('phones.json');

getPhonesID()
  .then(phones => phones.forEach(phone =>
    phonesID.push(`phones/${phone.id}.json`)))
  .then(() => getFirstReceivedDetails(phonesID))
  .then(() => getAllSuccessfulDetails(phonesID))
  .then(() => getThreeFastestDetails(phonesID));

function getFirstReceivedDetails(arr) {
  Promise.race(arr.map(request))
    .then(phone => {
      const element = document.createElement('div');

      element.setAttribute('class', 'first-received');
      element.innerText = phone.name;
      body.appendChild(element);
    });
}

function getThreeFastestDetails(arr) {
  let clone = arr.slice();
  const list = createList('Three Fastest', '');

  Promise.race(clone.map(request))
    .then(phone => {
      const element = document.createElement('li');

      element.innerText = phone.name;
      list.appendChild(element);

      return phone;
    })
    .then((result) => {
      clone = clone.filter(x => x !== `phones/${result.id}.json`);

      Promise.race(clone.map(request))
        .then(phone => {
          const element = document.createElement('li');

          element.innerText = phone.name;
          list.appendChild(element);

          return phone;
        })
        .then((newResult) => {
          clone = clone.filter(x => x !== `phones/${newResult.id}.json`);

          Promise.race(clone.map(request))
            .then(phone => {
              const element = document.createElement('li');

              element.innerText = phone.name;
              list.appendChild(element);
            })
            .then(() => body.appendChild(list));
        });
    });
}

function createList(header, phrase) {
  const list = document.createElement('ul');
  const h3 = document.createElement('h3');

  h3.innerText = `${header}`;
  list.setAttribute('class', `${phrase}`);
  list.appendChild(h3);

  return list;
}

function getAllSuccessfulDetails(arr) {
  const list = createList('All Successful', 'all-successful');

  arr.forEach(ID => request(ID)
    .then(phone => {
      const li = document.createElement('li');

      li.setAttribute('id', `${phone.id}`);
      li.innerText = phone.name;

      list.appendChild(li);
    }));

  body.appendChild(list);
}
