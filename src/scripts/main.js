'use strict';

const BASE_URL
= 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const request = (url = '') => {
  return fetch(`${BASE_URL}${url}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Something wrong');
      }

      return response.json();
    });
};

const getFirstReceivedDetails = () => request;
const getAllSuccessfulDetails = () => request;
const getThreeFastestDetails = () => request;

getFirstReceivedDetails()
  .then(array => {
    return Promise.race(array.map(phone => request(`${phone.id}`)));
  })
  .then(array => {
    elementMaker('first-received', 'first fastest', [array]);
  })
  .catch();

getAllSuccessfulDetails()
  .then(array => {
    return Promise.all(array.map(phone => request(`${phone.id}`)));
  })
  .then(array => {
    elementMaker('all-successful', 'All Succesful', array);
  })
  .catch();

getThreeFastestDetails()
  .then(array => {
    return Promise.all([
      Promise.race(array.map(phone => request(`/${phone.id}`))),
      Promise.race(array.map(phone => request(`/${phone.id}`))),
      Promise.race(array.map(phone => request(`/${phone.id}`))),
    ]);
  })
  .then(array => {
    elementMaker('three-fasters', 'Three fasters', array);
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
}
