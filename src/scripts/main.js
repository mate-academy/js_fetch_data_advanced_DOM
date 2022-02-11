'use strict';

const BASE_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const request = (url = '') => {
  return fetch(`${BASE_URL}${url}.json`)
    .then(response => {
      if (!response) {
        throw new Error('Something wrong');
      }

      return response.json();
    });
};

const getFirstReceivedDetails = () => request();
const getAllSuccessfulDetails = () => request();
const getThreeFastestDetails = () => request();

getFirstReceivedDetails()
  .then(arr => {
    return Promise.race(arr.map(phone => request(`/${phone.id}`)));
  })
  .then(arr => {
    elementMaker('first-received', 'First Fastest', [arr]);
  })
  .catch();

getAllSuccessfulDetails()
  .then(arr => {
    return Promise.all(arr.map(phone => request(`/${phone.id}`)));
  })
  .then(arr => {
    elementMaker('all-successful', 'All Successful', arr);
  })
  .catch();

getThreeFastestDetails()
  .then(arr => {
    return Promise.all([
      Promise.race(arr.map(phone => request(`/${phone.id}`))),
      Promise.race(arr.map(phone => request(`/${phone.id}`))),
      Promise.race(arr.map(phone => request(`/${phone.id}`))),
    ]);
  })
  .then(arr => {
    elementMaker('three-fasters', 'Three fasters', arr);
  })
  .catch();

function elementMaker(className, title, data) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="${className}">
      <h3>${title}</h3>
      <ul>
      ${data.map(el => `<li>${el.name}</li>`).join('')}
      </ul>
    </div>
  `);
};
