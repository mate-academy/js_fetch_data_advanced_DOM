/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
'use strict';

const url
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const body = document.querySelector('body');

const getPhones = () => {
  return fetch(url)
    .then(response => response.json())
    .then(list => list.map(x => x.id));
};

const getFirstReceivedDetails = (phones) => {
  const arr = [];

  for (const key of phones) {
    const request = fetch(`${url.slice(0, -5)}/${key}.json`)
      .then(response => response.json());

    arr.push(request);
  };

  const result = Promise.race(arr);

  return result;
};

function printFirstReceivedDetails(detail) {
  const div = document.createElement('div');
  const title = document.createElement('h3');
  const ul = document.createElement('ul');
  const li = document.createElement('li');

  title.textContent = 'First Received';
  div.className = 'first-received';
  li.textContent = `Name: ${detail['name']} Id: ${detail['id']}`;
  div.append(title, ul, li);
  body.append(div);
};

getPhones()
  .then(getFirstReceivedDetails)
  .then(printFirstReceivedDetails);

const getAllSuccessfulDetails = (phones) => {
  const arr = [];

  for (const key of phones) {
    const request = fetch(`${url.slice(0, -5)}/${key}.json`)
      .then(response => response.json());

    arr.push(request);
  };

  const result = Promise.all(arr);

  return result;
};

function printAllSuccessfulDetails(details) {
  const div = document.createElement('div');
  const title = document.createElement('h3');
  const ul = document.createElement('ul');

  title.textContent = 'All Successful';
  div.className = 'all-successful';

  div.append(title, ul);
  body.append(div);

  for (const key of details) {
    const li = document.createElement('li');

    li.textContent = `Name: ${key['name']} Id: ${key['id']}`;

    ul.append(li);
  };
};

getPhones()
  .then(getAllSuccessfulDetails)
  .then(printAllSuccessfulDetails);
