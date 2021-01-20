'use strict';

const BASE_URL = `https://mate-academy.github.io/phone-catalogue-static/api`;

const request = (url) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => response.json());
};

function getPhones(url) {
  return new Promise((resolve, reject) => {
    request(url)
      .then(result => resolve(result));
  });
};

function generateID(array) {
  const arrayPhoneID = [];

  for (const item of array) {
    arrayPhoneID.push(request(`/phones/${item.id}.json`));
  }

  return arrayPhoneID;
}

function createMessage(className, text, list) {
  const div = document.createElement('div');
  const ul = document.createElement('ul');

  div.className = `${className}`;
  div.innerHTML = `<h3>${text}</h3>`;

  if (!Array.isArray(list)) {
    ul.innerHTML = `<li>${list.name}</li><li>${(list.id).toUpperCase()}</li>`;
    div.append(ul);
    document.body.append(div);
  } else {
    for (const item of list.map(el => el.value)) {
      const liName = document.createElement('li');
      const liID = document.createElement('li');

      liName.innerText = `Name: ${(item.name).toUpperCase()}`;
      liID.innerText = `ID: ${(item.id).toUpperCase()}`;

      ul.append(liName, liID);
    }
    document.body.append(div);
    div.append(ul);
  }
}

function getFirstReceivedDetails() {
  return Promise.resolve(
    getPhones('/phones.json')
      .then(result => generateID(result))
      .then(array => Promise.race(array))
  );
}

function getAllSuccessfulDetails() {
  return Promise.resolve(
    getPhones('/phones.json')
      .then(array => Promise.allSettled(array))
  );
}

function getThreeFastestDetails() {
  const finalArray = [];

  finalArray.push(getFirstReceivedDetails());
  finalArray.push(getFirstReceivedDetails());
  finalArray.push(getFirstReceivedDetails());

  return Promise.resolve(
    Promise.all(finalArray)
  )

    // eslint-disable-next-line no-console
    .then(result => console.log(result));
}

getFirstReceivedDetails().then(message =>
  createMessage('first-received', 'First Received', message));

getAllSuccessfulDetails()
  .then(message => createMessage('all-successful', 'All Successful', message));

getThreeFastestDetails();
