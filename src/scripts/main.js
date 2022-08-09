/* eslint-disable no-console */
'use strict';

const MAIN_URL = 'https://mate-academy.github.io/phone-catalogue-static/api/';

document.body.insertAdjacentHTML('beforeend', `
  <div class="first-received">
    <h3>
      First Received
    </h3>
    <ul></ul>
  </div>
  <div class="all-successful">
    <h3>
      All Successful
    </h3>
    <ul></ul>
  </div>
`);

const request = (url) => {
  return fetch(`${MAIN_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};

const renderElements = (selector, innerText) => {
  const list = document.querySelector(selector).querySelector('ul');
  const item = document.createElement('li');

  item.innerText = innerText;

  list.append(item);
};

const getFirstReceivedDetails = (ids) => {
  return Promise.race(ids.map(id => request(`phones/${id}.json`)))
    .then(received => {
      renderElements('.first-received', received.name);
    });
};

const getAllSuccessfulDetails = (ids) => {
  return Promise.allSettled(ids.map(id => request(`phones/${id}.json`)))
    .then(results => {
      results.forEach((result) => {
        if (result.status !== 'fulfilled') {
          return;
        }

        renderElements('.all-successful', result.value.name);
      });
    });
};

const getPhones = () => request('phones.json');

getPhones()
  .then(response => {
    const phoneIds = response.map(p => p.id);

    return Promise.all([
      getFirstReceivedDetails(phoneIds),
      getAllSuccessfulDetails(phoneIds),
    ]);
  })
  .catch(error => console.error(error));
