'use strict';

const body = document.querySelector('body');
const url
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';

const request = () => {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw Error('error');
      }

      return response.json();
    });
};

const createList = (className, title) => {
  body.insertAdjacentHTML('beforeend', `
    <ul class="${className}">
      <h3>${title}</h3>
    </ul>
  `);
};

const createItemsList = (list, items) => {
  const ul = document.querySelector(`.${list}`);

  ul.insertAdjacentHTML('beforeend', `
    <li>${items}</li>
  `);
};

const getFirstReceivedDetails = () => {
  request()
    .then(phone => Promise.race(phone).then(value => {
      createList('first-received', 'First Received', value.name);
      createItemsList('first-received', value.name);
    }));
};

const getAllSuccessfulDetails = () => {
  request()
    .then(phone => Promise.all(phone).then(value => {
      createList('all-successful', 'All Successful', value.name);

      for (const item of value) {
        createItemsList('all-successful', item.name);
      }
    }));
};

getFirstReceivedDetails();
getAllSuccessfulDetails();
