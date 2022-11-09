'use strict';

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';

const body = document.querySelector('body');

const request = (endPoint) => {
  return fetch(`${BASE_URL}${endPoint}.json`)
    .then(response => {
      if (!response.ok) {
        return new Error('Error');
      };

      return response.json();
    });
};

const getPhones = () => {
  return request('/phones');
};

const getPhonesDetails = (id) => {
  return request(`/phones/${id}`);
};

const getFirstReceivedDetails = (arrPromise) => {
  return Promise.race(arrPromise)
    .then(details => {
      const div = document.createElement('div');
      const h3 = document.createElement('h3');
      const list = document.createElement('ul');

      div.className = 'first-received';
      h3.textContent = 'First Received';
      div.append(list);
      list.append(h3);

      list.insertAdjacentHTML('beforeend', `
        <li>Phone-id: ${details.id}</li>
        <li>Phone-name: ${details.name}</li>
      `);

      body.append(div);
    });
};

const getAllSuccessfulDetails = (arrPromise) => {
  return Promise.all(arrPromise)
    .then(details => {
      const div = document.createElement('div');
      const h3 = document.createElement('h3');
      const list = document.createElement('ul');

      div.className = 'all-successful';
      h3.textContent = 'All Successful';
      div.append(list);
      list.append(h3);

      details.map(phone => {
        list.insertAdjacentHTML('beforeend', `
          <li>Phone-id: ${phone.id}</li>
          <li>Phone-name: ${phone.name}</li>
        `);
      });

      body.append(div);
    });
};

getPhones()
  .then(phones => {
    const arrPhonesId = phones.map(phone => getPhonesDetails(phone.id));

    getFirstReceivedDetails(arrPhonesId);
    getAllSuccessfulDetails(arrPhonesId);
  });
