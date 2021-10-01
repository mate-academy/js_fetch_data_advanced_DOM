'use strict';

// write code here
const BASE_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';
const rootElement = document.querySelector('body');

function getPhonesId() {
  return fetch(`${BASE_URL}.json`)
    .then(response => response.json())
    .then(phones => [...phones].map(phone => phone.id));
}

function getFirstReceivedDetails(data) {
  const requests = data.map(id => fetch(`${BASE_URL}/${id}.json`));

  return Promise.race(requests)
    .then(response => response.json());
}

function getAllSuccessfulDetails(data) {
  const requests = data.map(id => fetch(`${BASE_URL}/${id}.json`));

  return Promise.all(requests)
    .then(responses => Promise.all(responses.map(val => val.json())));
}

function printFirstList(phoneDetails) {
  const divFirst = document.createElement('div');

  divFirst.className = 'first-received';

  divFirst.insertAdjacentHTML('afterbegin', `
    <h3>First Received</h3>
    <ul>
      <li>
        ${phoneDetails.id}
      </li>
    </ul>
  `);

  rootElement.append(divFirst);

  return phoneDetails;
}

function allListPrint(phoneDetails) {
  const divAll = document.createElement('div');

  divAll.className = 'all-successful';

  divAll.insertAdjacentHTML('afterbegin', `
    <h3>First Received</h3>
    <ul>
      ${phoneDetails.map(phone => `
        <li>
          Name: ${phone.name}
          </br>
          ID: ${phone.id}
        </li>
        <span>_____</span>
      `).join('')}
    </ul>
  `);

  rootElement.append(divAll);

  return phoneDetails;
}

getPhonesId()
  .then(getFirstReceivedDetails)
  .then(printFirstList)
  .catch(error => {
    alert('Error', error);
  });

getPhonesId()
  .then(getAllSuccessfulDetails)
  .then(allListPrint);
