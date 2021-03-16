'use strict';
require('regenerator-runtime/runtime');

const body = document.querySelector('body');

const BASE_URL = `https://mate-academy.github.io/phone-catalogue-static`
  + `/api`;

async function getPhonesIds() {
  const response = await fetch(`${BASE_URL}/phones.json`);
  const data = await response.json();

  return data.map(phone => phone.id);
}

async function getFirstReceivedDetails(phonesIds) {
  const responses = await phonesIds.map(
    id => fetch(`${BASE_URL}/phones/${id}.json`));
  const data = await Promise.race(responses);

  const result = await data.json();

  body.insertAdjacentHTML('beforeend', `
  <div class="first-received">
    <h3> First-received </h3>
    <ul>
      <li> ${result.name} <li>
    </ul>
  </div>
  `);

  return phonesIds;
}

async function getAllSuccessfulDetails(phonesIds) {
  const requests = await phonesIds.map(id => {
    return fetch(`${BASE_URL}/phones/${id}.json`)
      .then(response => response.json());
  });

  const results = await Promise.all(requests);

  const phonesList = results.map(
    result => (`<li>${result.id.toUpperCase()}</li>`)
  ).join('');

  body.insertAdjacentHTML('beforeend', `
  <div class="all-successful">
    <h3> All Successful </h3>
    <ul>
      ${phonesList}
    </ul>
  </div>
  `);
}

getPhonesIds()
  .then(getFirstReceivedDetails)
  .then(getAllSuccessfulDetails);
