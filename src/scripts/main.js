'use strict';

// write code here
const baseUrl = `
  https://mate-academy.github.io/phone-catalogue-static/api/`;

const createTableInfo = (classElement, phone = '') => {
  const blockPhones = document.createElement('div');

  blockPhones.innerHTML = `
  <h2>
    ${classElement === 'first-received' ? 'First Received' : 'All Successful'}
  </h2>
  <p>${phone}</p>
  `;
  blockPhones.className = classElement;
  document.body.append(blockPhones);

  return blockPhones;
};

const createNotification = (info) => {
  const notification = document.createElement('div');

  notification.innerHTML = info;
  notification.style = 'position:relative; top: -300px; padding: 20px;';
  document.body.append(notification);

  setTimeout(() => notification.remove(), 1000);
};

const getIdPhones = () => {
  return fetch(baseUrl + 'phones.json')
    .then(response => response.json())
    .catch(err => setTimeout(() => err, 5000));
};

const getIdPhoneDetails = (id) => {
  return fetch(baseUrl + 'phones/' + id + '.json')
    .then(response => response.json())
    .catch(err => err);
};

const getFirstReceivedDetails = (arrIdPhones) => {
  Promise.race(arrIdPhones.map(phone => getIdPhoneDetails(phone)))
    .then(response => {
      createTableInfo('first-received', response.name);
      createNotification('<h2>recived first details phone succes!!!</h2>');
    });
};

const getAllSuccessfulDetails = (arrIdPhones) => {
  const blockPhones = createTableInfo('all-successful');

  const ulPhones = document.createElement('ul');

  Promise.all(arrIdPhones.map(phone => getIdPhoneDetails(phone)))
    .then(arr => {
      arr.map(elem => {
        ulPhones.innerHTML += `<li
         style="background-color: rgb(235, 243, 201);
         margin: 5px;
         padding: 4px;
         width: 380px;
        ">${elem.name}</li>`;
      });
      blockPhones.append(ulPhones);
      createNotification('<h2>recived all details phones succes!!!</h2>');
    });
};

getIdPhones().then(arr => {
  const listId = arr.map(phone => phone.id);

  getFirstReceivedDetails(listId);
  getAllSuccessfulDetails(listId);
});
