'use strict';

const url
  = `https://mate-academy.github.io/phone-catalogue-static/api/phones.json`;
const details
  = `https://mate-academy.github.io/phone-catalogue-static/api/phones/`;

function getPhones(link) {
  return new Promise((resolve, reject) => {
    fetch(link)
      .then((listOfPhonesDetailes) => listOfPhonesDetailes.json())
      .then((res) => {
        resolve(res);
      });

    setTimeout(() => {
      reject(new Error('timeOut'));
    }, 5000);
  });
}

const firstRecievedArea = document.createElement('div');
const firstRecievedTitle = document.createElement('p');

firstRecievedTitle.innerText = 'First Received';

const li = document.createElement('li');

firstRecievedArea.append(li);

const listOfPhones = document.createElement('ul');

listOfPhones.append(li);
firstRecievedArea.append(listOfPhones);
firstRecievedArea.append(firstRecievedTitle);
firstRecievedArea.classList.add('first-received');

document.body.append(firstRecievedArea);

function getFirstReceivedDetails(phonesIdArr) {
  const promises = phonesIdArr.map((id) => fetch(`${details}${id}.json`));

  return Promise.race(promises)
    .then((res) => res.json())
    .then((listOfPhonesDetailes) => (li.innerText = listOfPhonesDetailes.id));
}

const allSuccessArea = document.createElement('div');

allSuccessArea.classList.add('all-successful');

const allSuccessText = document.createElement('p');

allSuccessText.innerText = 'All Successful';

const ul = document.createElement('ul');

allSuccessArea.append(ul);
allSuccessArea.append(allSuccessText);

function getAllSuccessfulDetails(phonesIdArr) {
  const resultArr = phonesIdArr.map((id) => {
    return fetch(`${details}${id}.json`)
      .then((listOfPhonesDetailes) => listOfPhonesDetailes.json())
      .then((listOfPhonesDetailes) => {
        const listItem = document.createElement('li');

        listItem.innerText
          = `${listOfPhonesDetailes.id} === ${listOfPhonesDetailes.name}`;
        ul.append(listItem);
      });
  });

  return Promise.allSettled(resultArr);
}

const phones = getPhones(url);

const phonesIDArr = [];

phones
  .then((res) => {
    for (const phone of res) {
      phonesIDArr.push(phone.id);
    }

    return phonesIDArr;
  })
  .then((array) => {
    getFirstReceivedDetails(array);

    getAllSuccessfulDetails(array).then(() =>
      document.body.append(allSuccessArea)
    );
  });
