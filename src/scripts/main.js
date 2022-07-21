'use strict';

const { ENDPOINTS, request } = require('./request');

const getPhones = () => request(ENDPOINTS.phones);
const getPhoneDetails = (id) => request(ENDPOINTS.phoneById(id));

const createInfo = (type, heading, data) => {
  const div = document.createElement('div');
  const list = document.createElement('ul');
  const dataFormated = Array.isArray(data) ? data : [data];

  dataFormated.forEach(element => {
    list.insertAdjacentHTML('beforeend', `<li>${element.name}</li>`);
  });

  div.classList.add(type);
  div.innerHTML = `<h2>${heading}</h2>`;
  div.append(list);

  document.body.append(div);
};

const getFirstReceivedDetails = (details) => {
  return Promise.race(details.map(el => getPhoneDetails(el)))
    .then(data => {
      createInfo('first-received', 'First Received', data);
    });
};

const getAllSuccessfulDetails = (details) => {
  return Promise.all(details.map(el => getPhoneDetails(el)))
    .then(data => {
      createInfo('all-successful', 'All Successful', data);
    });
};

const getThreeFastestDetails = (details) => {
  const firstThree = [];

  for (let i = 0; i < 3; i++) {
    Promise.race(details.map(el => getPhoneDetails(el)))
      .then(el => firstThree.push(el));
  }

  return firstThree;
};

getPhones()
  .then(phones => {
    const phonesIds = phones.map(phone => phone.id);

    getFirstReceivedDetails(phonesIds);
    getAllSuccessfulDetails(phonesIds);
    getThreeFastestDetails(phonesIds);
  });
