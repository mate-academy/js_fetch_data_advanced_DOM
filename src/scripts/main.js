'use strict';

// write code here
const BASE_URL = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones.json';
const forDetailUrl = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones/';

function getPhones(url) {
  return fetch(`${url}`)
    .then(response => {
      if (!response.ok) {
        return setTimeout(() => Promise.reject(
          new Error(`${response.status} - ${response.statusText}`)), 5000);
      }

      return response.json();
    })
    .catch(error => window.console.warn(error));
}

function getFirstReceivedDetails(IDs) {
  return Promise.race(IDs.map(id =>
    getPhones(`${forDetailUrl}${id}.json`)));
}

function getAllSuccessfulDetails(IDs) {
  return Promise.allSettled(IDs.map(id =>
    getPhones(`${forDetailUrl}${id}.json`)));
}

getPhones(BASE_URL)
  .then(phones => {
    const IDs = phones.map(phone => phone.id);

    return IDs;
  })
  .then(IDs => getFirstReceivedDetails(IDs))
  .then(details => {
    window.console.log('First details: ', details);

    const elem = document.createElement('div');
    const h3 = document.createElement('h3');

    elem.className = 'first-received';
    h3.textContent = 'First Received';
    elem.textContent = details.name;
    elem.prepend(h3);
    document.body.append(elem);
  });

getPhones(BASE_URL)
  .then(phones => {
    const IDs = phones.map(phone => phone.id);

    return IDs;
  })
  .then(IDs => getAllSuccessfulDetails(IDs))
  .then(details => {
    window.console.log('All details: ', details);

    const elem = document.createElement('div');
    const h3 = document.createElement('h3');
    const list = document.createElement('ul');

    elem.className = 'all-successful';
    h3.textContent = 'All Successful';

    list.innerHTML = `
      ${details.map(detail => `
        <li>
          ${detail.value.name}
        </li>
        `).join('')}
    `;
    elem.append(h3);
    elem.append(list);
    document.body.append(elem);
  });
