'use strict';

// write code here

const body = document.querySelector('body');

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';

function request(url) {
  return fetch(`${BASE_URL}${url}`)
    .then(response => response.json());
}

const getPhones = () => request('/phones.json');
const phoneDetails = (id) => request(`/phones/${id}.json`);

getPhones()
  .then(getAllSuccessfulDetails)
  .then(getFirstReceivedDetails);

function getAllSuccessfulDetails(phones) {
  const arrNameAndIds = phones.map(phone => {
    phoneDetails(phone.id);

    return `${phone.id.toUpperCase()} --- ${phone.name}`;
  });

  createBlock('All Successful', 'all-successful', arrNameAndIds);

  return Promise.race(phones);
}

function getFirstReceivedDetails(phone) {
  const fastesPromise = [`${phone.id.toUpperCase()} --- ${phone.name}`];

  createBlock('First Received', 'first-received', fastesPromise);
}

function createBlock(text, className, arrWithNamesAndIds) {
  const block = document.createElement('div');
  const description = document.createElement('h3');
  const ul = document.createElement('ul');

  block.classList.add(className);
  description.innerText = text;

  arrWithNamesAndIds.forEach(el => {
    const li = document.createElement('li');

    li.innerText = el;

    ul.append(li);
  });

  block.append(description, ul);
  body.append(block);
}
