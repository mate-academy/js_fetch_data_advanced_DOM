'use strict';

const BASE_URL = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones.json';
const DETAILS = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones/:phoneId.json';

const body = document.querySelector('body');

const createList = (className, headerText) => {
  const detail = document.createElement('ul');
  const header = document.createElement('h1');

  detail.className = className;
  header.innerText = headerText;
  detail.append(header);
  body.insertBefore(detail, body.lastElementChild);
};

const createListItem = (id, nameOfPhone, className) => {
  const phone = document.createElement('li');

  phone.innerText = `ID: ${id} NAME: ${nameOfPhone}`;
  body.querySelector(`.${className}`).append(phone);
};

function requestIds() {
  return fetch(BASE_URL)
    .then(response => response.json())
    .then(phones => {
      const phonesIds = phones.map(phone => phone.id);

      getFirstReceivedDetails(phonesIds)
        .then(fastestDetails => {
          createList('first-received', 'First Received');

          createListItem(fastestDetails.id, fastestDetails.name,
            'first-received');
        })
        .catch(error => new Error(error));

      getAllSuccessfulDetails(phonesIds)
        .then(details => {
          createList('all-successful', 'All Successful');

          details.forEach(detail => {
            createListItem(detail.id, detail.name, 'all-successful');
          });
        });

      getThreeFastestDetails(phonesIds)
        .then(details => {
          createList('three-fastest-successful', 'Three Fastest Successful');

          details.forEach(detail => {
            createListItem(detail.id, detail.name, 'three-fastest-successful');
          });
        })
        .catch(error => new Error(error));
    });
};

function getFirstReceivedDetails(ids) {
  return Promise.race(ids.map(id => {
    return fetch(DETAILS.replace(':phoneId', id))
      .then(details => details.json());
  }));
};

function getAllSuccessfulDetails(ids) {
  return Promise.all(ids.map(id => {
    return fetch(DETAILS.replace(':phoneId', id))
      .then(details => details.json());
  }));
};

function getThreeFastestDetails(ids) {
  const listOfdetails = ids.map(id => {
    return fetch(DETAILS.replace(':phoneId', id))
      .then(details => details.json());
  });

  return Promise.all([
    Promise.race(listOfdetails),
    Promise.race(listOfdetails),
    Promise.race(listOfdetails),
  ]);
};

requestIds();
