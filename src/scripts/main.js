'use strict';

const BASE_LINK = `https://mate-academy.github.io/
phone-catalogue-static/api/phones.json`;
const linkBase = `https://mate-academy.github.io/
phone-catalogue-static/api/phones/`;

function getPhones(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(result => {
        return resolve(result.json());
      })
      .catch(error => reject(new Error('Error', error)));
  });
}

function getIds() {
  return getPhones(BASE_LINK)
    .then(result => {
      return result.map(phone => {
        return phone.id;
      });
    });
}

function getAllSuccessfulDetails(massId, resolves) {
  return new Promise(function(resolve, reject) {
    getIds()
      .then(result => {
        return result.map(item => {
          return getPhones(`${linkBase}${item}.json`);
        });
      })
      .then(result => {
        return Promise.allSettled(result);
      })
      .then(result => {
        const mass = [];

        result.forEach(element => {
          if (element.status === 'fulfilled') {
            mass.push(element.value);
          }
        });

        return resolve(mass);
      })
      .catch(error => reject(new Error('Error', error)));
  });
}

function getFirstReceivedDetails(massId, resolves) {
  return new Promise(function(resolve, reject) {
    getIds()
      .then(result => {
        return result.map(item => {
          return getPhones(`${linkBase}${item}.json`);
        });
      })
      .then(result => {
        return Promise.rase(result);
      })
      .then(result => {
        return resolve([result]);
      })
      .catch(error => reject(new Error('Error', error)));
  });
}

function getThreeFastestDetails(massId, resolves) {
  return new Promise(function(resolve, reject) {
    getIds()
      .then(result => {
        return result.map(item => {
          return getPhones(`${linkBase}${item}.json`);
        });
      })
      .then(result => {
        return Promise.all([
          Promise.race(result),
          Promise.race(result),
          Promise.race(result),
        ]);
      })
      .then(result => {
        return resolve(result);
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
