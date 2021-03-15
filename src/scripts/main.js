'use strict';

const LIST_URL = 'https://mate-academy.github.io'
  + '/phone-catalogue-static/api/phones.json';
const DETAILS_BASE_URL = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones';

const getListOfIds = function() {
  const resolver = function(resolve) {
    fetch(LIST_URL)
      .then(res => res.json())
      .then(list => resolve(list.map(item => item.id)));
  };

  return new Promise(resolver);
};

const fetchDetails = function(id) {
  const url = `${DETAILS_BASE_URL}/${id}.json`;
  const resolver = function(resolve) {
    fetch(url)
      .then(res => {
        // Если получил ошибку то резолвлю пустой строкой
        if (res.ok) {
          return res.json();
        } else {
          return '';
        }
      })
      .then(details => resolve(details));
  };

  return new Promise(resolver);
};

const getFirstReceivedDetails = function(listOfIds) {
  return Promise.race(listOfIds.map(id => fetchDetails(id)));
};

const getAllSuccessfulDetails = function(listOfIds) {
  return Promise.all(listOfIds.map(id => fetchDetails(id)))
    .then(list => list.filter(item => item !== ''));
};

const pushNotification = function(header, data, useClass) {
  const root = document.querySelector('body');
  const notification = document.createElement('div');

  notification.classList.add(useClass);

  notification.innerHTML = `
    <h3>${header}</h3>
    <ul>
      ${data.map(item => `<li>${item.id.toUpperCase()}</li>`).join('')}
    </ul>
  `;

  root.append(notification);
};

getListOfIds()
  .then(list => getFirstReceivedDetails(list))
  .then(details => {
    pushNotification('First Received', [details], 'first-received');
  });

getListOfIds()
  .then(list => getAllSuccessfulDetails(list))
  .then(details => {
    pushNotification('All Successful', details, 'all-successful');
  });
