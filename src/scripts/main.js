'use strict';

const baseUrl = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const body = document.querySelector('body');

const request = (url = '') => {
  return fetch(`${baseUrl}${url}.json`)
    .then(response => response.json());
};

const getPhones = () => {
  request()
    .then(phones => {
      getFirstReceivedDetails(phones);
      getAllSuccessfulDetails(phones);
      getThreeFastestDetails(phones);
    })
    .catch(error => new Error(error));
};

const getFirstReceivedDetails = (arr) => {
  Promise.race(arr.map(({ id }) =>
    request(`/${id}`)))
    .then(phones =>
      createDom([phones], 'first-received', 'First Received'));
};

const getAllSuccessfulDetails = (arr) => {
  Promise.all(arr.map(({ id }) =>
    request(`/${id}`)))
    .then(phones =>
      createDom(phones, 'all-successful', 'All Successful'));
};

const getThreeFastestDetails = (arr) => {
  const el1 = Promise.race(arr.map(({ id }) => request(`/${id}`)));
  const el2 = Promise.race(arr.map(({ id }) => request(`/${id}`)));
  const el3 = Promise.race(arr.map(({ id }) => request(`/${id}`)));

  Promise.all([el1, el2, el3]).then(phones =>
    createDom(phones, 'first-three', 'First Three Received'));
};

const createDom = (phones, className, header) => {
  body.insertAdjacentHTML('beforeend', `
    <div class=${className}>
      <h3>${header}</h3>
      <ul>
        ${phones.map(({ id, name }) => `<li>id: ${id} name: ${name}</li>`).join('')}
      </ul>
    </div>
  `);
};

getPhones();
