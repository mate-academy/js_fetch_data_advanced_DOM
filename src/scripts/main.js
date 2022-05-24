'use strict';

const url
= 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const body = document.body;

function getPhones() {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}

function elemPattern(className, title, phoneName) {
  body.insertAdjacentHTML('afterbegin', `
    <div class="${className}">
      <h1>${title}</h1>
      <p>${phoneName}</p>
    </div>
  `);
}

function getFirstReceivedDetails() {
  getPhones()
    .then(phones => Promise.race(phones))
    .then(phone => elemPattern('first-received', 'First Received', phone.name));
}

function getAllSuccessfulDetails() {
  getPhones()
    .then(phones => Promise.all(phones))
    .then(phonesArr =>
      elemPattern('all-successful', 'All Successful',
        phonesArr.map(phone => `<br>${phone.name}`)));
}

function getThreeFastestDetails() {
  getPhones()
    .then(phoneList => {
      return Promise.all([
        Promise.race(phoneList.map(phone => phone.name)),

        Promise.race(phoneList.map(phone => `<br>${phone.name}`)),

        Promise.race(phoneList.map(phone => `<br>${phone.name}`)),
      ]);
    })
    .then(phones => elemPattern('three-received', 'Three Received', phones));
}

getPhones()
  .then(getFirstReceivedDetails)
  .then(getAllSuccessfulDetails)
  .then(getThreeFastestDetails);
