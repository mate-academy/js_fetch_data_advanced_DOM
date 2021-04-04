'use strict';

const listUrl
= 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';

function getPhonesAllSuccessful(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(result => Promise.all(result))
      .then(phones => resolve(phones.map(phone => phone.id)));

    setTimeout(() => {
      reject(new Error());
    }, 5000);
  });
}

const body = document.querySelector('body');
let countOfMessages = 1;

function getListForAllSuccessful(phones) {
  const listOfAllSuccessful = document.createElement('ul');
  const headingOfSuccessful = document.createElement('h3');

  headingOfSuccessful.textContent = 'All Successful';
  headingOfSuccessful.classList.add('all-successful', 'heading');

  listOfAllSuccessful.append(headingOfSuccessful);

  phones.map(item => {
    const listItem = document.createElement('li');

    listItem.textContent = item;
    listItem.classList.add('all-successful');
    listItem.style.top = 30 * countOfMessages + 'px';
    countOfMessages++;
    listOfAllSuccessful.append(listItem);
  });

  body.append(listOfAllSuccessful);
};

getPhonesAllSuccessful(listUrl)
  .then(getListForAllSuccessful);

function getPhoneFirstReceived(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(result => Promise.race(result))
      .then(phone => resolve(phone.id));

    setTimeout(() => {
      reject(new Error());
    }, 5000);
  });
}

function getListForFirstReceived(phone) {
  const listOfFirstReceived = document.createElement('ul');
  const headingOfFirstReceived = document.createElement('h3');

  headingOfFirstReceived.textContent = 'First Received';
  headingOfFirstReceived.classList.add('first-received', 'heading');

  listOfFirstReceived.append(headingOfFirstReceived);

  const listItem = document.createElement('li');

  listItem.textContent = phone;
  listItem.classList.add('first-received');

  listOfFirstReceived.append(listItem);

  body.append(listOfFirstReceived);
};

getPhoneFirstReceived(listUrl)
  .then(getListForFirstReceived);

function getPhonesThree(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(result => Promise.all(result))
      .then(phones => resolve(phones.map(phone => phone.id).slice(0, 3)));

    setTimeout(() => {
      reject(new Error());
    }, 5000);
  });
}

let countOfLines = 1;

function getListForThree(phones) {
  const listOfThree = document.createElement('ul');
  const headingOfThree = document.createElement('h3');

  headingOfThree.textContent = 'Three Received';
  headingOfThree.classList.add('three', 'heading');

  listOfThree.append(headingOfThree);

  phones.map(item => {
    const listItem = document.createElement('li');

    listItem.textContent = item;
    listItem.classList.add('three');
    listItem.style.top = 30 * countOfLines + 'px';
    countOfLines++;
    listOfThree.append(listItem);
  });

  body.append(listOfThree);
};

getPhonesThree(listUrl)
  .then(getListForThree);
