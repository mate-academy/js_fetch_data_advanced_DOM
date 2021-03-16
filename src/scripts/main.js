'use strict';

function printNotification(type, text, items) {
  const message = document.createElement('div');

  message.classList.add(type);

  const messageText = document.createElement('h3');

  messageText.textContent = text;

  message.append(messageText);

  const list = document.createElement('ul');

  if (typeof items === 'object') {
    const listItem = document.createElement('li');

    listItem.textContent = items.id;
    list.appendChild(listItem);
  }

  for (let i = 0; i < items.length; i++) {
    const listItem = document.createElement('li');

    listItem.appendChild(document.createTextNode(items[i].toUpperCase()));

    list.appendChild(listItem);
  }

  message.append(list);

  document.body.append(message);
}

const listUrl
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';

const detailsUrl
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';

function getPhones(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(result => resolve(result));

    setTimeout(() => reject(new Error('end')), 5000);
  });
}

function getAllSuccessfulDetails(idsData) {
  const items = idsData.map(id => fetch(`${detailsUrl}${id}.json`));

  printNotification('all-successful', 'All Successful', idsData);

  return Promise.all(items);
}

function getFirstReceivedDetails(idsData) {
  const items = idsData.map(id => fetch(`${detailsUrl}${id}.json`));

  return Promise.race(items)
    .then(response => response.json())
    .then(result => (
      printNotification('first-received', 'First Received', result)
    ));
}

const phonesIdsData = [];

getPhones(listUrl)
  .then(result => {
    for (const item of result) {
      phonesIdsData.push(item.id);
    }

    return phonesIdsData;
  })
  .then(items => setParameters(items));

function setParameters(id) {
  getFirstReceivedDetails(id);
  getAllSuccessfulDetails(id);
}
