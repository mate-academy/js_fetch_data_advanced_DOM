'use strict';

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';
const ENDPOINTS = {
  phones: '/phones.json',
  phoneById: (id) => `/phones/${id}.json`,
};

const createDOM = (className, title, ids, position) => {
  document.querySelector('body').insertAdjacentHTML(position, `
    <div class="${className}">
      <h2>${title}</h2>
      <ul>
        ${ids.map(id => `<li>${id.name}</li>`).join('')}
      </ul>
    </div>
  `);
};

const request = (url) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }

      return Promise.reject(new Error(`${response.status}`));
    });
};

const getPhones = () => request(ENDPOINTS.phones);

const mapId = (ids) => ids.map(id => request(ENDPOINTS.phoneById(id)));

const getAllSuccessfulDetails = (ids) => {
  return Promise.all(mapId(ids))
    .then(data => {
      createDOM('all-successful', 'All Successful', data, 'beforeend');
    });
};

const getFirstSuccessfulDetails = (ids) => {
  return Promise.race(mapId(ids))
    .then(data => {
      createDOM('first-received', 'First Received', [data], 'afterbegin');
    });
};

const getThreeFastestDetails = (ids) => {
  const firstReceived = [];

  for (let i = 0; i < 3; i++) {
    firstReceived.push(Promise.race((mapId(ids))));
  }

  Promise.all(firstReceived).then(data => console.log(data)) // eslint-disable-line
};

getPhones().then(data => {
  const ids = data.map(phone => phone.id);

  getAllSuccessfulDetails(ids);
  getFirstSuccessfulDetails(ids);
  getThreeFastestDetails(ids);
});
