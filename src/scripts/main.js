'use strict';

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api/';

const request = (url = '') => {
  return fetch(`${BASE_URL}phones${url}.json`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    });
};

const getFirstReceivedDetails = () => {
  return request()
    .then(phones => Promise.race(phones.map(phone => new Promise(
      resolve => resolve(request(`/${phone.id}`)),
    ))));
};

const getAllSuccessfulDetails = () => {
  return request()
    .then(phones => Promise.allSettled(phones.map(phone => new Promise(
      resolve => resolve(request(`/${phone.id}`)),
    ))))
    .then(phones => phones.filter(phone => phone.status === 'fulfilled'))
    .then(phones => phones.map(phone => phone.value));
};

getFirstReceivedDetails()
  .then(response => {
    const firstReceived = document.createElement('div');

    firstReceived.classList.add('first-received');

    firstReceived.insertAdjacentHTML('afterbegin', `
      <h3>First Received</h3>
      <ul>
        <li>${JSON.stringify(response)}</li>
      </ul>
    `);

    document.body.append(firstReceived);
  });

getAllSuccessfulDetails()
  .then(response => {
    const allSuccessful = document.createElement('div');

    allSuccessful.classList.add('all-successful');

    allSuccessful.insertAdjacentHTML('afterbegin', `
      <h3>All Successful</h3>
    `);

    const list = document.createElement('ul');

    for (const el of response) {
      list.insertAdjacentHTML('afterbegin', `
          <li>
            <h4>${el.id.toUpperCase()}</h4>
            <p>${JSON.stringify(el)}</p>
          </li>
     `);
    }

    allSuccessful.append(list);
    document.body.append(allSuccessful);
  });

const getThreeFastestDetails = () => {
  return Promise.all([
    getFirstReceivedDetails(),
    getFirstReceivedDetails(),
    getFirstReceivedDetails(),
  ]);
};

getThreeFastestDetails()
  .then(result => {
    const threeFastest = document.createElement('div');

    threeFastest.insertAdjacentHTML('afterbegin', `
      <h3>Three were received</h3>
    `);

    document.body.append(threeFastest);
  });
