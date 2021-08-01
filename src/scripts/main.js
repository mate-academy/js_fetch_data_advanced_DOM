'use strict';

const baseURL
= 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const idURL
= 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';

const globalList = getAllIds();

globalList
  .then(data => {
    const idsList = data.map(phone => phone.id);

    const allSuccessful = getAllSuccessful(idsList);

    const firstReceived = getFirstReceived(idsList);

    const firstThreeWinners = getFirstThreeWinners(idsList);

    allSuccessful
      .then(allSuccessfulList => createNotification(allSuccessfulList));

    firstReceived
      .then(winner => {
        const winners = [];

        winners.push(winner);

        createNotification(winners, 'first');
      });

    firstThreeWinners
      .then(result => createNotification(result, 'first three'));
  });

function getAllIds() {
  return fetch(baseURL)
    .then(response => response.json());
}

function getAllSuccessful(list) {
  const promises = list.map(id => {
    return fetch(idURL + `${id}.json`)
      .then(response => response.json());
  });

  return Promise.all(promises);
}

function getFirstReceived(list) {
  const promises = list.map(id => {
    return fetch(idURL + `${id}.json`)
      .then(response => response.json());
  });

  return Promise.race(promises);
}

function getFirstThreeWinners(list) {
  const promises = list.map(id => {
    return fetch(idURL + `${id}.json`)
      .then(response => response.json());
  });

  const firstThreeWinnersList = [];

  for (let i = 0; i < 3; i++) {
    const winner = Promise.race(promises);

    firstThreeWinnersList.push(winner);
  }

  return Promise.all(firstThreeWinnersList);
}

function createNotification(allSuccessfulList, type = 'success') {
  const notification = document.createElement('div');
  const header = document.createElement('h3');
  const notificationContent = document.createElement('ul');

  notification.className = type === 'success'
    ? 'all-successful'
    : type === 'first'
      ? 'first-received'
      : 'first-three';

  header.textContent = type === 'success'
    ? 'All successful'
    : type === 'first'
      ? 'First received'
      : 'Fastest three';

  allSuccessfulList.forEach(phone => {
    notificationContent.insertAdjacentHTML('beforeend', `
      <li>
        Phone name: ${phone.name},<br> phone ID: ${phone.id}
      </li>
      `);
  });

  notification.append(header);
  notification.append(notificationContent);
  document.body.append(notification);
}
