'use strict';

const url = `https://mate-academy.github.io/phone-catalogue-static/`
  + `api/phones.json`;

const body = document.querySelector('body');

const getPhones = () => {
  return fetch(url)
    .then((response) => response.json());
};

function createElem(classBlock, classList, titleText) {
  body.insertAdjacentHTML('beforeend', `
    <div class="${classBlock}">
      <h3>${titleText}</h3>
      <ul class="${classList}"></ul>
    </div>
  `);
}

function createList(listClass, text) {
  const list = document.querySelector(`.${listClass}`);

  list.insertAdjacentHTML('beforeend', `
    <li>${text}</li>
  `);
}

const getFirstReceivedDetails = () => {
  getPhones()
    .then(phone => Promise.race(phone).then(value => {
      createElem('first-received', 'first-list', 'First Received');
      createList('first-list', value.name);
    }));
};

const getAllSuccessfulDetails = () => {
  getPhones()
    .then(phone => Promise.all(phone).then(value => {
      createElem('all-successful', 'all-list', 'All Successful');
      value.map(elem => createList('all-list', elem.id.toUpperCase()));
    }));
};

getPhones()
  .then(getFirstReceivedDetails)
  .then(getAllSuccessfulDetails)
  .catch();
