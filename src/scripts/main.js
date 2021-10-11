'use strict';

// write code here
const listURL
= `https://mate-academy.github.io/phone-catalogue-static/api/phones.json`;

const detailsURL
= `https://mate-academy.github.io/phone-catalogue-static/api/phones/`;

function getPhones() {
  return fetch(listURL)
    .then(response => response.json());
}

function getPhoneDetails(id) {
  return fetch(`${detailsURL}` + `${id}.json`)
    .then(response => response.json());
}

function createElement(classname, h3Name, data) {
  const div = document.createElement('div');
  const list = document.createElement('ul');
  const head = document.createElement('h3');

  div.classList.add(`${classname}`);
  head.textContent = h3Name;
  div.appendChild(head);
  div.appendChild(list);
  document.body.insertAdjacentElement('beforeend', div);

  data.forEach(element => {
    list.insertAdjacentHTML('beforeend', `
    <li>
    PHONE NAME: ${element.name}
    <br>
    PHONE ID: ${element.id}
    </li>
    `);
  });
}

function getFirstReceivedDetails(phoneArr) {
  Promise.race([...phoneArr])
    .then(res => createElement('first-received', 'First Received', [res]));
}

function getAllSuccessfulDetails(phoneArr) {
  Promise.all([...phoneArr])
    .then(res => createElement('all-successful', 'All Successful', [...res]));
}

getPhones().then(result => {
  const phonesIds = result.map(phone => getPhoneDetails(phone.id));

  getFirstReceivedDetails(phonesIds);
  getAllSuccessfulDetails(phonesIds);
});
