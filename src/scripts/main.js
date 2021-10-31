'use strict';

const BASE_URL = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones';

function getPones() {
  return fetch(`${BASE_URL}.json`)
    .then(response => response.json())
    .then(phones => phones.map(phone => phone.id));
};

function getFirstReceivedDetails(phones) {
  const request = phones.map(phoneId =>
    fetch(`${BASE_URL}/${phoneId}.json`));

  return Promise.race(request)
    .then(response => response.json());
};

function getAllSuccessfulDetails(phones) {
  const request = phones.map(phoneId =>
    fetch(`${BASE_URL}/${phoneId}.json`));

  return Promise.all(request)
    .then(responses => Promise.all(responses.map(phone => phone.json())));
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

getPones()
  .then(getFirstReceivedDetails)
  .then(phones => {
    const phoneArr = [];

    phoneArr.push(phones);
    printNotify(phoneArr, 'first-received', 'First Received');
  })
  .catch(error => error);

getPones()
  .then(getAllSuccessfulDetails)
  .then(phones => printNotify(phones, 'all-successful', 'All Successful'));

getPones()
  .then(getAllSuccessfulDetails)
  .then(phones => {
    const phonesArr = [];

    for (let i = 0; i < 3; i++) {
      phonesArr.push(phones[i]);
    }
    printNotify(phonesArr, 'three-successful', 'Three successful');
  });
