'use strict';

// write code here
const BASE_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const request = (url = '') => {
  return fetch(`${BASE_URL}${url}.json`)
    .then(response => {
      return response.ok
        ? response.json()
        : setTimeout(() => {
          throw new Error(`${response.status} - ${response.statusText}`);
        }, 5000);
    });
};

function createElement(className, title, data) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="${className}">
      <h3>${title}</h3>
      <ul>
        ${data.map(element => `<li>${element.name}</li>`).join('')}
      </ul>
    </div>
  `);
};

const getFirstReceivedDetails = () => request();
const getAllSuccessfulDetails = () => request();
const getThreeFastestDetails = () => request();

getFirstReceivedDetails()
  .then(phones => {
    return Promise.race(phones.map(phone => request(`/${phone.id}`)));
  })
  .then(phones => {
    createElement('first-received', 'First Fastest', [phones]);
  });

getAllSuccessfulDetails()
  .then(phones => {
    return Promise.all(phones.map(phone => request(`/${phone.id}`)));
  })
  .then(phones => {
    createElement('all-successful', 'All Successful', phones);
  });

getThreeFastestDetails()
  .then(phones => {
    return Promise.all([
      Promise.race(phones.map(phone => request(`/${phone.id}`))),
      Promise.race(phones.map(phone => request(`/${phone.id}`))),
      Promise.race(phones.map(phone => request(`/${phone.id}`))),
    ]);
  })
  .then(phones => {
    createElement('three-fastest', 'Three Fastest', phones);
  });
