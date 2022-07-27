'use strict';

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
      <h1>${title}</h1>
      <ul>
        ${data.map(phone => `<li>${phone.name}</li>`).join('')}
      </ul>
    </div>
  `);
};

const getFirstReceivedDetails = () => request();
const getAllSuccessfulDetails = () => request();
const getThreeFastestDetails = () => request();

getFirstReceivedDetails()
  .then(phones => Promise.race(phones.map(phone => request(`/${phone.id}`))))
  .then(phone => {
    const phoneArr = [phone];

    createElement('first-received', 'First Fastest', phoneArr);
  });

getAllSuccessfulDetails()
  .then(phones => Promise.all(phones.map(phone => request(`/${phone.id}`))))
  .then(phones => createElement('all-successful', 'All received', phones));

getThreeFastestDetails()
  .then(phones => {
    return Promise.all([
      Promise.race(phones.map(phone => request(`/${phone.id}`))),
      Promise.race(phones.map(phone => request(`/${phone.id}`))),
      Promise.race(phones.map(phone => request(`/${phone.id}`))),
    ]);
  })
  .then(phones => createElement('three-fastest', 'Three fastest', phones));
