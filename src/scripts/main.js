'use strict';

/* eslint-disable */
const listPhonesURL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const listDetailsURL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';
/* eslint-enable */
const body = document.querySelector('.first-elements');
const threeElementsBlock = document.querySelector('.three-elements');

const getListOfPhonesId = function(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const listIdOfPhones = data.map(phone => phone.id);

      return listIdOfPhones;
    })
    .catch(() => new Error('Some problems with server'));
};

const getFirstReceivedDetails = function(url) {
  const list = getListOfPhonesId(listPhonesURL);

  list.then(response => {
    const promisesList = response.map(id => {
      return fetch(url + id + '.json')
        .then(data => data.json())
        .catch(() => new Error('Wow, something bad with your code'));
    });

    Promise.race(promisesList)
      .then((phone) => {
        const firstRecievedElement = document.createElement('div');

        firstRecievedElement.className = 'first-received';

        firstRecievedElement.innerHTML = `
          <h1>First Received</h1>
          <p>${phone.name}</p>
          <p><b>ID - </b>${phone.id.toUpperCase()}</p>
        `;
        body.append(firstRecievedElement);
      });

    Promise.all(promisesList)
      .then((phones) => {
        const allSuccessElements = document.createElement('ul');

        allSuccessElements.className = 'all-successful';
        allSuccessElements.innerHTML = `<h1>All Successful</h1>`;

        phones.map(phone => {
          const phoneItem = document.createElement('li');

          phoneItem.innerHTML = `
          <p>${phone.name}</p>
          <p><b>ID - </>${phone.id.toUpperCase()}</p>
          `;
          allSuccessElements.append(phoneItem);
        });
        body.append(allSuccessElements);
      });
  });
};

const getThreeFastestDetails = function(url) {
  const list = getListOfPhonesId(listPhonesURL);

  list.then(response => {
    const promisesList = response.map(id => {
      return fetch(url + id + '.json')
        .then(data => data.json())
        .catch(() => new Error('Wow, something bad with your code'));
    });

    Promise.all(promisesList.splice(0, 3))
      .then((phones) => {
        const threeRecievedElement = document.createElement('div');

        threeRecievedElement.className = 'first-received';
        threeRecievedElement.innerHTML = `<h1>First three elements</h1>`;

        phones.map(phone => {
          const element = document.createElement('p');

          element.textContent = phone.name;
          threeRecievedElement.append(element);
        });
        threeElementsBlock.append(threeRecievedElement);

        const allSuccessElements = document.createElement('ul');

        allSuccessElements.innerHTML = `<h1>All Successful</h1>`;
        allSuccessElements.className = 'all-successful';

        phones.map(phone => {
          const phoneItem = document.createElement('li');
          /* eslint-disable */
          phoneItem.innerHTML = `
          <p>${phone.name}</p>
          <img src="https://mate-academy.github.io/phone-catalogue-static/${phone.images[0]}"></img>
          <p>${phone.id.toUpperCase()}</p>
          `;
          /* eslint-enable */
          allSuccessElements.append(phoneItem);
        });
        threeElementsBlock.append(allSuccessElements);
      });
  });
};

getFirstReceivedDetails(listDetailsURL);
getThreeFastestDetails(listDetailsURL);
