'use strict';

// eslint-disable-next-line max-len
const phoneDetailsUrl = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const body = document.querySelector('body');

const getPhones = () => {
  return fetch(phoneDetailsUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      return response.json();
    });
};

function createElement(className, title, phoneName) {
  body.insertAdjacentHTML('afterbegin', `
    <div class="${className}">
      <h3>${title}</h3>
      <p>${phoneName}</p>
    </div>
  `);
}

const getFirstReceivedDetails = () => {
  getPhones()
    .then(phone => Promise.race(phone)
      .then(item => {
        createElement('first-received', 'First Received', `${item.name}`);
      })
    );
};

const getAllSuccessfulDetails = () => {
  getPhones()
    .then(phone => Promise.all(phone)
      .then(item => {
        createElement('all-successful', 'All Successful', `${item.map(
          el => '<br>' + el.name)
        }`
        );
      })
    );
};

const getThreeFastestDetails = () => {
  getPhones()
    .then(phone => Promise.all(phone)
      .then(item => {
        createElement('three-fastest', 'Three Fastest', `${item.filter(
          (el, i) => i < 3)
          .map(el => '<br>' + el.name)
        }`
        );
      })
    );
};

getPhones()
  .then(getFirstReceivedDetails)
  .then(getAllSuccessfulDetails)
  .then(getThreeFastestDetails)
  .catch();
