'use strict';

const phonesUrl
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const detailUrl
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';

function createList(titleText, className, array) {
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
      createList('First Received', 'first-received', [first]);
    });
};

const getAllSuccessfulDetails = (phonesArray) => {
  return Promise.allSettled(phonesArray)
    .then(all => {
      const allowed = all.map(item => {
        if (item.status === 'fulfilled') {
          return item.value;
        }
      });

      createList('All Successful', 'all-successful', allowed);
    });
};

getPhones()
  .then(result => {
    const phonesIndex = result.map(phone => getPhonesDetails(phone.id));

    getFirstReceivedDetails(phonesIndex);
    getAllSuccessfulDetails(phonesIndex);
  });
