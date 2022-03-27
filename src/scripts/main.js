'use strict';

const PHONES_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const DETAILS_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';
const body = document.querySelector('body');

function getPhones() {
  return fetch(PHONES_URL)
    .then(response => response.json())
    .then(response => response.map(phone => phone.id));
}

function getFirstReceivedDetails(phoneIDs) {
  return Promise.race(phoneIDs.map(id => {
    return fetch(`${DETAILS_URL}${id}.json`)
      .then(response => response.json());
  }));
}

function getAllSuccessfulDetails(phoneIDs) {
  return Promise.allSettled(phoneIDs.map(id => {
    return fetch(`${DETAILS_URL}${id}.json`)
      .then(response => response.json());
  }));
}

function getThreeFastestDetails(phoneIDs) {
  let order = 0;

  return Promise.all(phoneIDs.map(id => {
    return fetch(`${DETAILS_URL}${id}.json`)
      .then(response => ({
        response,
        order: order++,
      }));
  }))
    .then(response => response.sort((a, b) => a.order - b.order))
    .then(response => response.slice(0, 3))
    .then(response => Promise.all(response.map(resp => resp.response.json())));
}

function createFirstReceivedElement(phone) {
  const element = document.createElement('div');

  element.classList.add('first-received');

  element.innerHTML = `
    <h2 class="li-header">First Received</h2>
    <ul>
        <li>${phone.name}</li>
    </ul>
  `;
  body.append(element);
}

function createAllSuccessfulElements(data) {
  const element = document.createElement('div');

  element.classList.add('all-successful');

  element.innerHTML = `
    <h2 class="li-header">All Successful</h2>
    <ul>
        ${data.map(wrapper => wrapper.status === 'fulfilled'
    ? `<li>${wrapper.value.name}</li>`
    : '').join('')}
    </ul>
  `;
  body.append(element);
}

function createThreeFastestDetails(data) {
  const element = document.createElement('div');

  element.classList.add('three-successful');

  element.innerHTML = `
    <h2 class="li-header">First Three</h2>
    <ul>
        ${data.map(phone => `<li>${phone.name}</li>`).join('')}
    </ul>
  `;
  body.append(element);
}

getPhones()
  .then(response => getFirstReceivedDetails(response))
  .then(response => createFirstReceivedElement(response));

getPhones()
  .then(response => getAllSuccessfulDetails(response))
  .then(response => createAllSuccessfulElements(response));

getPhones()
  .then(response => getThreeFastestDetails(response))
  .then(response => createThreeFastestDetails(response));
