'use strict';

const url
  = `https://mate-academy.github.io/phone-catalogue-static/api/phones.json`;
const details
  = `https://mate-academy.github.io/phone-catalogue-static/api/phones/`;

function getPhones(link) {
  return new Promise((resolve, reject) => {
    fetch(link)
      .then((obj) => obj.json())
      .then((res) => {
        resolve(res);
      });

    setTimeout(() => {
      reject(new Error('timeOut'));
    }, 5000);
  });
}

const divFirstReceived = document.createElement('div');
const h3FirstReceived = document.createElement('h3');

h3FirstReceived.innerText = 'first Received';

const li = document.createElement('li');

divFirstReceived.append(li);

const ul1 = document.createElement('ul');

ul1.append(li);
divFirstReceived.append(ul1);
divFirstReceived.append(h3FirstReceived);
divFirstReceived.classList.add('first-received');

document.body.append(divFirstReceived);

function getFirstReceivedDetails(phonesIdArr) {
  const promises = phonesIdArr.map((id) => fetch(`${details}${id}.json`));

  return Promise.race(promises)
    .then((res) => res.json())
    .then((obj) => (li.innerText = obj.id));
}

const divAllSuccess = document.createElement('div');

divAllSuccess.classList.add('all-successful');

const h3AllSuccess = document.createElement('h3');

h3AllSuccess.innerText = 'All Successful';

const ul = document.createElement('ul');

divAllSuccess.append(ul);
divAllSuccess.append(h3AllSuccess);

function getAllSuccessfulDetails(phonesIdArr) {
  const resultArr = phonesIdArr.map((id) => {
    return fetch(`${details}${id}.json`)
      .then((obj) => obj.json())
      .then((obj) => {
        const li1 = document.createElement('li');

        li1.innerText = `${obj.id.toUpperCase()} === ${obj.name.toUpperCase()}`;
        ul.append(li1);
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
      document.body.append(divAllSuccess)
    );
  });
