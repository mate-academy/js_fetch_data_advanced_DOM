/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-console */
'use strict';

const request = (url) => {
  return fetch(`${'https://mate-academy.github.io/phone-catalogue-static/api'}${url}`) /* eslint-disable-line */
    .then(response => {
      return response.json();
    });
};

const idList = [];

request('/phones.json')
  .then(list => {
    const phoneIdsList = list.map(phone => phone.id);

    Object.assign(idList, phoneIdsList);

    getFirstReceivedDetails(idList);
    getAllSuccessfulDetails(idList);
  });

function getFirstReceivedDetails(someIdList) {
  console.log(someIdList);

  Promise.race(
    someIdList.map(currentId => {
      return new Promise((resolve, reject) => {
        resolve(request(`/phones/${currentId}.json`));

        setTimeout(() => {
          reject('Bruh u got error');
        }, 5000);
      });
    })
  )
    .then(result => console.log(result));
};

function getAllSuccessfulDetails(someIdList) {
  console.log(someIdList);

  Promise.allSettled(
    someIdList.map(currentId => {
      return new Promise((resolve, reject) => {
        resolve(request(`/phones/${currentId}.json`));

        setTimeout(() => {
          reject('Bruh u got error');
        }, 5000);
      });
    })
  )
    .then(results => console.log(results));
};
