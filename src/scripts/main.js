'use strict';

const body = document.querySelector('body');
const BASIC_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';

const request = (url) => {
  return fetch(`${BASIC_URL}${url}`)
    .then(response => response.json())
    .catch((error) => new Error(error));
};

const getPhones = () => request('/phones.json');
const getPhone = (url) => request(`/phones/${url}.json`);

getPhones('/phones.json')
  .then(response => response.map(phone => phone.id))
  .then(phoneIDs => {
    const allSuccessful = getAllSuccessfulDetails(phoneIDs);

    allSuccessful
      .then(phones => {
        generateList(phones, 'all-successful', 'All Successful');
      });

    return allSuccessful;
  })
  .then(allSuccessfulList => {
    const firstRecived = getFirstReceivedDetails(allSuccessfulList);

    firstRecived
      .then(phones => {
        generateList([phones], 'first-received', 'First Received');
      });

    return allSuccessfulList;
  })
  .then(idList => {
    getThreeFastestDetails(idList);
  });

function generateList(list, className, headerText) {
  const div = document.createElement('div');
  const header = document.createElement('h3');
  const ul = document.createElement('ul');

  div.classList.add(className);
  header.innerText = headerText;
  div.append(header, ul);

  list.forEach(phone => {
    const li = document.createElement('li');
    const phoneId = phone.value.id.toUpperCase();
    const phoneName = phone.value.name;

    li.innerText = `${phoneId} ${phoneName}`;
    ul.appendChild(li);
  });

  body.appendChild(div);
};

function getAllSuccessfulDetails(list) {
  const phoneDetails = list.map(id => {
    return getPhone(id);
  });

  return Promise.allSettled(phoneDetails);
};

function getFirstReceivedDetails(list) {
  const firstRecived = Promise.race(list);

  return firstRecived;
};

function getThreeFastestDetails(list) {
  const threeFasted = [];

  for (let i = 0; i < 3; i++) {
    const first = Promise.race(list);

    first
      .then(phone => {
        const index = list.indexOf(phone);

        threeFasted.push(list.splice(index, 1)[0].value.id);
      });
  };
  /* eslint-disable no-console */
  console.log('Three Fastest Details', threeFasted);
}
