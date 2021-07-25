'use strict';

const baseUrl = 'https://mate-academy.github.io/phone-catalogue-static/api/';

function request(url = '') {
  return fetch(`${baseUrl}phones${url}.json`)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(
          new Error(`${response.status} - ${response.statusText}`)
        );
      }

      if (!response.headers.get('content-type').includes('application/json')) {
        return Promise.reject(
          new Error('Content type is not supported')
        );
      }

      return response.json();
    });
}

function getFirstReceivedDetails() {
  return request()
    .then(phones => Promise.race(phones
      .map(phone => new Promise(resolve =>
        resolve(request(`/${phone.id}`))
      ))));
};

function getAllSuccessfulDetails() {
  return request()
    .then(phones => Promise.allSettled(phones
      .map(phone => new Promise(resolve => resolve(request(`/${phone.id}`)))
      )))
    .then(phones => phones.filter(phone => phone.status === 'fulfilled'))
    .then(phones => phones.map(phone => phone.value));
}

getFirstReceivedDetails()
  .then(res => addNotification(res, 'First Received', 'first-received'));

getAllSuccessfulDetails()
  .then(res => addNotification(res, 'All Successful', 'all-successful'));

function addNotification(details, headerText, notificationClass) {
  const notification = document.createElement('div');
  const header = document.createElement('h3');
  const list = document.createElement('ul');
  const detailsLength = details.length || 1;

  header.textContent = headerText;
  header.classList.add('li-header');

  for (let i = 0; i < detailsLength; i++) {
    const detail = details[i] || details;

    list.insertAdjacentHTML('beforeend', `
      <li>Name: ${detail.name}, ID: ${detail.id}</li>
    `);
  }

  notification.classList.add(notificationClass);

  notification.append(header);
  notification.append(list);
  document.body.append(notification);
}
