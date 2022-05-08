'use strict';

const BASE_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/';

const body = document.body;

const getPhonesId = (url) => {
  return fetch(`${url}phones.json`)
    .then(response => response.json())
    .then(result => result.map(phone => phone.id));
};

const getFirstReceivedDetails = (url, idList) => {
  Promise.race(idList.map(id => fetch(`${url}phones/${id}.json`)))
    .then(response => response.json())
    .then(phone => {
      body.insertAdjacentHTML('beforeend', `
        <div class="first-received">
          <h3>First Received</h3>
          <ul class="first"><li>${phone.name}</li></ul>
        </div>
      `);
    });
};

const getAllSuccessfulDetails = (url, idList) => {
  Promise.all(idList.map(id => fetch(`${url}phones/${id}.json`)))
    .then(responses => Promise.all(responses.map(el => el.json())))
    .then(result => {
      body.insertAdjacentHTML('beforeend', `
        <div class="all-successful">
          <h3>All Successful</h3>
          <ul class="all"></ul>
        </div>
      `);

      const ul = document.querySelector('.all');

      result.map(phone => {
        ul.insertAdjacentHTML('beforeend', `
          <li>${phone.name}</li>
        `);
      });
    });
};

const getThreeFastestDetails = (url, idList) => {
  Promise.all(idList.map(id => fetch(`${url}phones/${id}.json`)))
    .then(responses => Promise.all(responses.map(el => el.json())))
    .then(result => {
      body.insertAdjacentHTML('beforeend', `
        <div class="three-fastest">
          <h3>Three Successful</h3>
          <ul class="three"></ul>
        </div>
      `);

      const ul = document.querySelector('.three');

      result.filter((el, i) => i < 3).map(phone => {
        ul.insertAdjacentHTML('beforeend', `
          <li>${phone.name}</li>
        `);
      });
    });
};

getPhonesId(BASE_URL)
  .then(result => getFirstReceivedDetails(BASE_URL, result))
  .catch(error => new Error(error));

getPhonesId(BASE_URL)
  .then(result => getAllSuccessfulDetails(BASE_URL, result))
  .catch(error => new Error(error));

getPhonesId(BASE_URL)
  .then(result => getThreeFastestDetails(BASE_URL, result))
  .catch(error => new Error(error));
