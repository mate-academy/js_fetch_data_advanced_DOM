'use strict';

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';

function createDiv(divClass, divTitle, divListItem) {
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="${divClass}">
      <h2 style="text-decoration: underline; color: #fc4b3b">${divTitle}</h2>
      ${divListItem}
    </div>
  `);
}

const request = (url, timeout = 0) => {
  return fetch(`${BASE_URL}${url}.json`)
    .then(response => {
      setTimeout(() => {
        if (!response.ok) {
          return `${response.status} - ${response.statusText}`;
        }
      }, timeout);

      return response.json();
    });
};

const getFirstReceivedDetails = () => {
  request('/phones')
    .then(phones => {
      return Promise.race(phones.map(phone => request(`/phones/${phone.id}`)));
    })
    .then(phones => {
      createDiv(
        'first-received',
        'First Received',
        [phones].map(element => `
          <span>
            [Name]: ${element.name}
            <br>
            [ID]: ${element.id}
          </span>
        `));
    });
};

const getThreeFastestDetails = () => {
  request('/phones')
    .then(phones => {
      return Promise.allSettled([
        Promise.race(phones.map(phone => request(`/phones/${phone.id}`))),
        Promise.race(phones.map(phone => request(`/phones/${phone.id}`))),
        Promise.race(phones.map(phone => request(`/phones/${phone.id}`))),
      ]);
    })
    .then(phones => {
      createDiv(
        'three-fastest-received',
        'Three Fastest',
        phones.map(element => `
          <li>
            [Name]: ${element.value.name}
            <br>
            [ID]: ${element.value.id}
          </li>
          <br>
        `).join(''));
    });
};

const getAllSuccessfulDetails = () => {
  request('/phones')
    .then(phones => {
      return Promise.allSettled(
        phones.map(phone => request(`/phones/${phone.id}`)));
    })
    .then(phones => {
      createDiv(
        'all-successful',
        'All Successful',
        [...phones].map(element => `
          <li>
            [Name]: ${element.value.name}
            <br>
            [ID]: ${element.value.id}
          </li>
          <br>
      `).join(''));
    });
};

getFirstReceivedDetails();
getThreeFastestDetails();
getAllSuccessfulDetails();
