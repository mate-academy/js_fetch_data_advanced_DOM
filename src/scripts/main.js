'use strict';

// eslint-disable-next-line max-len
const baseURL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

function request(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}

function createList(arr, className, title) {
  document.body.insertAdjacentHTML('beforeend', `
    <ul class="${className}">
      <h1>${title}</h1>

      ${arr.map((phone) => `
        <li>${phone.id.toUpperCase()}</li>
      `).join('')}
    </ul>
  `);
}

function getAllSuccessfulDetails(arr) {
  const allPromises = arr.map((id) => {
    return request(`${baseURL}/${id}.json`);
  });

  Promise.all(allPromises).then(phones => {
    createList(phones, 'all-successful', 'All Successful text');
  });
}

function getFirstReceivedDetails(arr) {
  const firstPromise = arr.map((id) => {
    return request(`${baseURL}/${id}.json`);
  });

  Promise.race(firstPromise).then(phone => {
    createList([phone], 'first-received ', 'First Received');
  });
}

function getThreeFastestDetails(arr) {
  const allPromises = arr.map((id) => {
    return request(`${baseURL}/${id}.json`);
  });

  const threeFirstPronise = allPromises.slice(0, 3);

  Promise.all(threeFirstPronise).then(phone => {
    createList(phone, 'first-tree-received ', 'First Tree Received');
  });
}

const getPhones = () => {
  return request(`${baseURL}.json`)
    .then(phones => {
      return phones;
    });
};

getPhones()
  .then(phones => {
    const ids = phones.map(({ id }) => id);

    getAllSuccessfulDetails(ids);
    getFirstReceivedDetails(ids);
    getThreeFastestDetails(ids);
  })
  .catch(error => new Error('Error:', error));
