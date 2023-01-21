'use strict';
require('regenerator-runtime/runtime');

// eslint-disable-next-line max-len
const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const request = (url) => {
  return fetch(`${BASE_URL}${url}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};

const getPhones = () => {
  return request('.json')
    .then(result => {
      return result;
    });
};

const createList = (arr, className, title) => {
  document.body.insertAdjacentHTML('beforeend', `
    <ul class="${className}">
      <h1>${title}</h1>
      ${arr.map((phone) => `
        <li>${phone.id.toUpperCase()}</li>
      `).join('')}
    </ul>
  `);
};

const getFirstReceivedDetails = (ids) => {
  const allReceivedPromises = ids.map((id) => {
    return request(`/${id}.json`);
  });

  Promise.race(allReceivedPromises).then(detail => {
    createList([detail], 'first-received', 'First received');
  });
};

const getAllSuccessfulDetails = (ids) => {
  const allReceivedPromises = ids.map((id) => {
    return request(`/${id}.json`);
  });

  Promise.all(allReceivedPromises).then(phones => {
    createList(phones, 'all-successful', 'All Successful');
  });
};

getPhones()
  .then(phones => {
    const ids = phones.map(({ id }) => id);

    getAllSuccessfulDetails(ids);
    getFirstReceivedDetails(ids);
  })
  .catch(error => new Error('Error:', error));
