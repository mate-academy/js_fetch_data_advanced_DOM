'use strict';

const url = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

function getPhoneIds() {
  return fetch(url + '.json')
    .then(res => res.json())
    .then(phones => phones.map(phone => phone.id));
}

async function getFirstReceivedDetails(phonesID) {
  return Promise.race(phonesID.map(id => fetch(`${url}/${id}.json`)
    .then(res => res.json())));
}

async function getAllSuccessfulDetails(phonesID) {
  return Promise.all(phonesID.map(id => fetch(`${url}/${id}.json`)
    .then(res => res.json())));
}

const createList = (array, className, header) => {
  const block = document.createElement('div');

  block.classList.add(className);

  block.innerHTML = `
    <h3>${header}</h3>
    <ul>
      ${array.map(el => `<li>${el.id.toUpperCase()}</li>`).join('')}
    </ul>
  `;

  document.body.append(block);
};

getPhoneIds().then(phoneIds => {
  getFirstReceivedDetails(phoneIds).then(res => {
    createList([res], 'first-received', 'First Received');
  });

  getAllSuccessfulDetails(phoneIds).then(res => {
    createList(res, 'all-successful', 'All Successful');
  });
});
