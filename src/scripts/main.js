'use strict';

// write code here

const BASE_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const DETAILS_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';

const body = document.querySelector('body');
const phonesId = [];
let phoneDetails;

const getPhones = () => {
  return fetch(BASE_URL)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(
          `${response.status} - ${response.statusText}`
        ));
      }

      if (!response.headers.get('content-type').includes('application/json')) {
        return Promise.reject(new Error(
          `Content-type is not supported - ${response.status}`
        ));
      }

      return response.json();
    })
    .then(result => result);
};

const getFirstReceivedDetails = () => {
  getPhones()
    .then(phones => {
      phones.forEach(phone => phonesId.push(phone.id));

      phoneDetails = phonesId.map(itemId =>
        fetch(`${DETAILS_URL}${itemId}.json`)
          .then(response => response.json()));

      createTable('first-received', 'First Received');

      Promise.race(phoneDetails)
        .then(result =>
          addPhoneToTable('first-received', result.name));
    })
    .catch(error => new Error(error));
};

getFirstReceivedDetails();

const getAllSuccessfulDetails = () => {
  getPhones()
    .then(phones => {
      phones.forEach(phone => phonesId.push(phone.id));

      phoneDetails = phonesId.map(itemId =>
        fetch(`${DETAILS_URL}${itemId}.json`)
          .then(response => response.json()));

      createTable('all-successful', 'All Successful');

      Promise.allSettled(phoneDetails)
        .then(results => {
          results.forEach(result => {
            if (result.status === 'fulfilled') {
              addPhoneToTable('all-successful', result.value.name);
            }
          });
        });
    })
    .catch(error => new Error(error));
};

getAllSuccessfulDetails();

const getThreeFastestDetails = () => {
  getPhones()
    .then(phones => {
      phones.forEach(phone => phonesId.push(phone.id));

      phoneDetails = phonesId.map(itemId =>
        fetch(`${DETAILS_URL}${itemId}.json`)
          .then(response => response.json()));

      createTable('three-fastest', 'Three Fastest');

      return Promise.all([
        Promise.race(phoneDetails)
          .then(result =>
            addPhoneToTable('three-fastest', result.name)),

        Promise.race(phoneDetails)
          .then(result =>
            addPhoneToTable('three-fastest', result.name)),

        Promise.race(phoneDetails)
          .then(result =>
            addPhoneToTable('three-fastest', result.name)),
      ]);
    })
    .catch(error => new Error(error));
};

getThreeFastestDetails();

function createTable(className, headerText) {
  const table = document.createElement('table');

  table.className = className;
  body.prepend(table);

  table.insertAdjacentHTML('beforeend', `
    <tr>
      <th>${headerText}</th>
    </tr>
 `);
}

function addPhoneToTable(className, phonesName) {
  body.querySelector(`.${className}`).insertAdjacentHTML('beforeend', `
    <tr>
      <td>${phonesName}</td>
    </tr>`);
}
