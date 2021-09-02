'use strict';

const phonesUrl
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const detailUrl
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';

function newElement(titleText, className, array) {
  const element = document.createElement('ul');
  const title = document.createElement('h2');

  document.body.append(element);
  element.append(title);
  element.classList = className;
  title.textContent = titleText;

  array.forEach(phone => {
    const addedPhone = document.createElement('li');

    addedPhone.innerHTML = `
    <p>${phone.id}</p>
    <p>${phone.name}</p>
    `;
    element.append(addedPhone);
  });
};

const getPhones = () => {
  return fetch(phonesUrl)
    .then((response) => response.json());
};

const getPhonesDetails = (id) => {
  return fetch(`${detailUrl}` + `${id}.json`)
    .then((response) => response.json());
};

const getFirstReceivedDetails = (phonesArray) => {
  return Promise.race([...phonesArray])
    .then(first => {
      newElement('First Received', 'first-received', [first]);
    });
};

const getAllSuccessfulDetails = (phonesArray) => {
  return Promise.all([...phonesArray])
    .then(all => {
      newElement('All Successful', 'all-successful', [...all]);
    });
};

getPhones()
  .then(result => {
    const phonesIndex = result.map(phone => getPhonesDetails(phone.id));

    getFirstReceivedDetails(phonesIndex);
    getAllSuccessfulDetails(phonesIndex);
  });
