'use strict';

const BASE_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const firstReceivedDiv = document.querySelector('.first-received');
const allSuccesfulDiv = document.querySelector('.all-successful');

getPhones(`${BASE_URL}.json`)
  .then(phones => {
    const idArr = phones.map(phone => phone.id);

    getFirstReceivedDetails(idArr);
    getAllSuccessfulDetails(idArr);
    // getThreeFastestDetails(idArr);
  })
  .catch(error => new Error(error));

function getFirstReceivedDetails(phoneIds) {
  const promises = [];

  phoneIds.forEach(phoneId => {
    promises.push(request(`${BASE_URL}/${phoneId}.json`));
  });

  Promise.any(promises)
    .then(phone => {
      const li = document.createElement('li');
      const h3 = document.createElement('h3');

      h3.innerText = phone.name;
      li.appendChild(h3);
      firstReceivedDiv.appendChild(li);
    });
}

function getAllSuccessfulDetails(phoneIds) {
  const promises = [];

  phoneIds.forEach(phoneId => {
    promises.push(request(`${BASE_URL}/${phoneId}.json`));
  });

  Promise.all(promises)
    .then(phones => {
      phones.forEach(phone => {
        const li = document.createElement('li');
        const h3 = document.createElement('h3');

        h3.innerText = phone.name;
        li.appendChild(h3);
        allSuccesfulDiv.appendChild(li);
      });
    });
}

function request(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(
          Error(`Error: ${response.status} - ${response.statusText}`)
        );
      }

      if (!response.headers.get('content-type').includes('application/json')) {
        return Promise.reject(
          Error('Error: Content type is not supported!')
        );
      }

      return response.json();
    });
}

function getPhones(url) {
  return request(url);
}
