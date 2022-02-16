'use strict';

const link
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';

function getPhones() {
  return new Promise((resolve, reject) => {
    fetch(link)
      .then(result => {
        return resolve(result.json());
      })
      .catch(error => reject(new Error('Error', error)));
  });
}

function getFirstReceivedDetails() {
  return new Promise((resolve, reject) => {
    getPhones()
      .then(result => {
        return Promise.race(result);
      })
      .then(result => {
        return resolve([result]);
      })
      .catch(error => reject(new Error('Error', error)));
  });
}

function getAllSuccessfulDetails() {
  return new Promise((resolve, reject) => {
    getPhones()
      .then(result => {
        return resolve(Promise.all(result));
      })
      .catch(error => reject(new Error('Error', error)));
  });
}

function getThreeFastestDetails() {
  return new Promise((resolve, reject) => {
    getPhones()
      .then(result => {
        return resolve(Promise.all([
          Promise.race(result),
          Promise.race(result),
          Promise.race(result),
        ]));
      })
      .catch(error => reject(new Error('Error', error)));
  });
}

function createElement(divClass, title, func) {
  const div = document.createElement('div');

  document.body.append(div);
  div.classList.add(divClass);

  div.insertAdjacentHTML('beforeend', `
    <h2>${title}</h2>
    <ul class="list"></ul>
  `);

  func()
    .then(result => {
      result.map(item => {
        div.children[1].insertAdjacentHTML('beforeend', `
          <li>${item.name} - ${item.id}</li>
        `);
      });
    });
}

createElement('all-successful', 'All Successful', getAllSuccessfulDetails);
createElement('first-received', 'First Received', getFirstReceivedDetails);
createElement('three-fatest', 'Three Fastest Received', getThreeFastestDetails);
