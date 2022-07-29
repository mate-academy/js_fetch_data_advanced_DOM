'use strict';

const BASE_URL = 'https://mate-academy.github.io/'
+ 'phone-catalogue-static/api/phones';

const request = (url = '') => {
  return fetch(`${BASE_URL}${url}.json`)
    .then(response => {
      if (!response.ok) {
        return new Error('Error');
      }

      return response.json();
    });
};

const getPhones = () => request();

function getFirstReceivedDetails(arr) {
  return Promise.race(arr.map(phone => request(`/${phone.id}`)))
    .then(result => {
      firstReceivedShow('first-received', 'First Received', result);
    });
}

function getAllSuccessfulDetails(arr) {
  return Promise.allSettled(arr.map(phone => request(`/${phone.id}`)))
    .then(result => result.map(item => item.value))
    .then(data => allReceivedShow('all-successful', 'All Successful', data));
}

function getThreeFastestDetails(arr) {
  return Promise.all([
    Promise.race(arr.map(phone => request(`/${phone.id}`))),
    Promise.race(arr.map(phone => request(`/${phone.id}`))),
    Promise.race(arr.map(phone => request(`/${phone.id}`))),
  ])
    .then(result => {
      allReceivedShow('three-received', 'Three Fastest', result);
    });
}

getPhones()
  .then(result => {
    getFirstReceivedDetails(result);
  });

getPhones()
  .then(result => {
    getThreeFastestDetails(result);
  });

getPhones()
  .then(result => {
    getAllSuccessfulDetails(result);
  });

function firstReceivedShow(nameClass, title, result) {
  document.body.insertAdjacentHTML('afterbegin', `
  <div class="${nameClass}">
    <h3>${title}</h3>
    <ul>
    <li>${result.name}</li>
    </ul>
  </div>
  `
  );
}

function allReceivedShow(nameClass, title, result) {
  document.body.insertAdjacentHTML('afterbegin', `
  <div class="${nameClass}">
    <h3>${title}</h3>
    <ul>
    ${result.map(phone => `<li>${phone.name}</li>`).join('')}
    </ul>
  </div>
  `
  );
}
