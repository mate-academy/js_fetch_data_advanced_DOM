'use strict';

const baseUrl = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones';

const detailsUrl = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones/';

const firstReceived = document.createElement('div');

firstReceived.classList.add('first-received');

const receivedHeading = document.createElement('h3');

receivedHeading.innerText = 'First Received';

const receivedList = document.createElement('ul');

firstReceived.append(receivedHeading, receivedList);

const allSuccessful = document.createElement('div');

allSuccessful.classList.add('all-successful');

const allSuccessfulHeading = document.createElement('h3');

allSuccessfulHeading.innerText = 'All Successful';

const successfulList = document.createElement('ul');

allSuccessful.append(allSuccessfulHeading, successfulList);

document.body.append(firstReceived, allSuccessful);

function getPhones() {
  return fetch(`${baseUrl}.json`)
    .then(response => response.json());
}

getPhones()
  .then(response => {
    const phonesIds = response.map(phone => phone.id);

    getFirstReceivedDetails(phonesIds);

    getAllSuccessfulDetails(phonesIds);
  });

function getFirstReceivedDetails(array) {
  Promise.race(array)
    .then(response => fetch(`${detailsUrl}` + `${response}.json`))
    .then(result =>
      result.json().then(res =>
        receivedList.insertAdjacentHTML('beforeend', `
        <li>Phone name: ${res.name}</li>
        <li>Phone ID: ${res.id}</li>
      `)));
}

function getAllSuccessfulDetails(array) {
  Promise.allSettled(array.map(phoneId =>
    fetch(`${detailsUrl}` + `${phoneId}.json`)))
    .then(response => {
      response.filter(el =>
        el.status === 'fulfilled').map(el => el.value.json().then(result => {
        successfulList.insertAdjacentHTML('beforeend', `
          <li>Phone name: ${result.name}</li>
          <li>Phone ID: ${result.id}</li>
        `);
      }));
    });
}
