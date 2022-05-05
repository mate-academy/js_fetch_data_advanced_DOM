'use strict';

const BASE_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const printReceivedList = (type, title) => {
  const list = document.createElement('ul');

  list.className = `${type}`;
  list.innerText = `${title}`;

  document.body.append(list);
};

const printReceivedItem = (item, type) => {
  const listItem = document.createElement('li');

  listItem.innerText = `Name: ${item.name} ID: ${item.id}`;

  const list = document.querySelector(`.${type}`);

  list.append(listItem);
};

const getPromises = (arrayOfIds) => {
  const arrayOfPromises = [];

  for (const id of arrayOfIds) {
    const promise = fetch(`${BASE_URL}/${id}.json`)
      .then(response => response.json())
      .catch(error => new Error(error.status));

    arrayOfPromises.push(promise);
  }

  return arrayOfPromises;
};

const request = () => {
  return fetch(`${BASE_URL}.json`)
    .then(response => response.json())
    .catch(error => new Error(error.status));
};

const getFirstReceivedDetails = (ids, type) => {
  printReceivedList(`${type}`, 'First Received');

  Promise.race(getPromises(ids)).then(phone => {
    printReceivedItem(phone, `${type}`);
  });
};

const getAllSuccessfulDetails = (ids, type) => {
  printReceivedList(`${type}`, 'All Successful');

  Promise.all(getPromises(ids)).then(phone => {
    phone.forEach(detail => {
      printReceivedItem(detail, `${type}`);
    });
  });
};

const getThreeFastestDetails = (ids, type) => {
  printReceivedList(`${type}`, 'Three Fastest Received');

  for (let i = 1; i <= 3; i++) {
    Promise.race(getPromises(ids)).then(phone => {
      printReceivedItem(phone, `${type}`);
    });
  }

  const thirdList = document.querySelector(`.${type}`);
  const firstList = document.querySelector(`.first-received`);

  firstList.prepend(thirdList);
};

request()
  .then(phones => {
    const phonesId = phones.map(phone => phone.id);

    getFirstReceivedDetails(phonesId, 'first-received');
    getAllSuccessfulDetails(phonesId, 'all-successful');
    getThreeFastestDetails(phonesId, 'three-fastest');
  });
