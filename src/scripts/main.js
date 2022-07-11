'use strict';

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';
const ENDPOINTS = {
  phones: '/phones.json',
  phoneById: (id) => `/phones/${id}.json`,
};
const body = document.body;

const request = (url) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        Promise.reject(
          new Error(`${response.status}: ${response.statusText}`)
        );
      }

      return response.json();
    });
};

const elementMaker = (className, title, data) => {
  body.insertAdjacentHTML('beforeend', `
    <div class="${className}">
      <h3>${title}</h3>
      <ul>
        ${data.map(el => `<li>${el.name}</li>`).join('')}
      </ul>
    </div>
  `);
};

const getFirstReceivedDetails = () => {
  request(ENDPOINTS.phones)
    .then(phones => {
      return Promise.race(phones.map(phone =>
        request(ENDPOINTS.phoneById(phone.id))));
    })
    .then(res => {
      elementMaker('first-received', 'First Fastest', [res]);
    });
};

getFirstReceivedDetails();

const getAllSuccessfulDetails = () => {
  request(ENDPOINTS.phones)
    .then(phones => {
      return Promise.allSettled(phones.map(phone =>
        request(ENDPOINTS.phoneById(phone.id))));
    })
    .then(res => {
      elementMaker('all-successful', 'All Successful',
        res.filter(item => item.status === 'fulfilled')
          .map(phone => phone.value));
    });
};

getAllSuccessfulDetails();

const getThreeFastestDetails = () => {
  request(ENDPOINTS.phones)
    .then(phones => {
      const promises = [];

      for (let i = 0; i < 3; i++) {
        promises.push(Promise.race(phones.map(phone =>
          request(ENDPOINTS.phoneById(phone.id)))));
      }

      return Promise.all(promises);
    })
    .then(res => console.log(res)); // eslint-disable-line
};

getThreeFastestDetails();
