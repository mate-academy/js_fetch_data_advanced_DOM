'use strict';

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';

const request = (url) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}-${response.statusText}`
        );
      }

      return response.json();
    });
};

const getPhones = () => request(`/phones.json`);
const getDetailsOfPhone = (phoneId) => request(`/phones/${phoneId}.json`);

function displayMessage(divClassName, header, array) {
  const div = document.createElement('div');
  const h3 = document.createElement('h3');
  const ul = document.createElement('ul');

  div.className = divClassName;
  h3.textContent = header;
  div.append(h3);
  div.append(ul);

  array.forEach(el => {
    const li = document.createElement('li');

    li.textContent = `${el.id.toUpperCase()} ${el.name}`;
    ul.append(li);
  });

  document.body.append(div);
};

const getFirstReceivedDetails = () => {
  return getPhones()
    .then(arr => Promise.race(arr.map(phone => getDetailsOfPhone(phone.id))));
};

const getAllSuccessfulDetails = () => {
  return getPhones()
    .then(arr =>
      Promise.allSettled(arr.map(phone => getDetailsOfPhone(phone.id))))
    .then(arr => arr.filter(phone => phone.status === 'fulfilled'))
    .then(arr => arr.map(phone => phone.value));
};

getFirstReceivedDetails()
  .then(result => {
    displayMessage('first-received', 'First Received', [result]);
  })
  .catch(error => console.warn('Error occured:', error));

getAllSuccessfulDetails()
  .then(result => {
    displayMessage('all-successful', 'All Successful', result);
  })
  .catch(error => console.warn('Error occured:', error));
