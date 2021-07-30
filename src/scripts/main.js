'use strict';

const bURL = `https://mate-academy.github.io/phone-catalogue-static/api/phones`;
const body = document.querySelector('body');

const request = (url) => {
  return fetch(`${bURL}${url}`)
    .then(response => {
      return response.json();
    });
};

const getPhoneIds = () => request('.json');

function createPromise(id) {
  const resolver = (resolve) => {
    resolve(id);
  };

  return new Promise(resolver);
};

const phoneIds = getPhoneIds()
  .then(result => {
    const idsPromises = [];

    for (let i = 0; i < result.length; i++) {
      const prom = createPromise(result[i]);

      idsPromises.push(prom);
    }

    return idsPromises;
  })
  .catch();

const getFirstReceivedDetails = () => phoneIds;
const getAllSuccessfulDetails = () => phoneIds;

getFirstReceivedDetails()
  .then(result => Promise.race(result))
  .then(result => {
    body.insertAdjacentHTML('afterbegin',
      `<div class="first-received">
        <h3>First Received</h3>
        <ul>
          <li>${result.name} --- ${result.id}</li>
        </ul>
      </div>`);
  })
  .catch();

getAllSuccessfulDetails()
  .then(result => Promise.all(result))
  .then(result => {
    body.insertAdjacentHTML('afterbegin',
      `<div class="all-successful">
        <h3>All Successful</h3>
        <ul>
          ${result.map((text) => `<li>${text.name} - ${text.id}</li>`).join('')}
        </ul>
      </div>`);
  })
  .catch();
