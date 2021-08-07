'use strict';

const baseURL
= 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const idURL
= 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';

const allPhonesList = getAllPhones();

allPhonesList
  .then(data => {
    const phoneIds = data.map(phone => phone.id);

    const allSuccessfulDetails = getAllSuccessfulDetails(phoneIds);

    const firstReceived = getFirstReceived(phoneIds);

    const firstThreeReceived = getFirstThree(phoneIds);

    allSuccessfulDetails
      .then(responses => {
        const successfullResponses = responses.filter(response => {
          return response.status === 'fulfilled';
        });

        const successfulDetailsList
        = successfullResponses.map(response => response.value);

        createNotification(successfulDetailsList);
      });

    firstReceived
      .then(phone => createNotification([phone], 'first-received'));

    firstThreeReceived
      .then(phones => createNotification(phones, 'first-three'));
  });

function getAllPhones() {
  return fetch(baseURL)
    .then(response => response.json());
}

function getAllSuccessfulDetails(data) {
  const promises = data.map(id => {
    return fetch(idURL + `${id}.json`)
      .then(response => response.json());
  });

  return Promise.allSettled(promises);
}

function getFirstReceived(data) {
  const promises = data.map(id => {
    return fetch(idURL + `${id}.json`)
      .then(response => response.json());
  });

  return Promise.race(promises);
}

function getFirstThree(phones) {
  return new Promise((resolve, reject) => {
    const phonesDetails = [];

    phones.map(id => {
      fetch(idURL + `${id}.json`)
        .then(response => response.json())
        .then(phone => {
          if (phonesDetails.length < 3) {
            phonesDetails.push(phone);
          }

          if (phonesDetails.length === 3) {
            resolve(phonesDetails);
          }
        });
    });
  });
}

function createNotification(list, type = 'all') {
  const notification = document.createElement('div');
  const header = document.createElement('h2');
  const notificationContent = document.createElement('ul');

  notification.className = type === 'all'
    ? 'all-successful'
    : type === 'first-received'
      ? 'first-received'
      : 'first-three';

  header.innerText = type === 'all'
    ? 'All successful'
    : type === 'first-received'
      ? 'First received'
      : 'First three';

  list.forEach(phone => {
    notificationContent.insertAdjacentHTML('beforeend', `
    <li>
      Phone name: ${phone.name}, phone ID: ${phone.id}
      </li>
      `);
  });

  notification.append(header);
  notification.append(notificationContent);
  document.body.append(notification);
};
