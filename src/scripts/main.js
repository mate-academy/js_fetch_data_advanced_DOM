'use strict';

// write code here

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const request = (url = '') => {
  return fetch(`${BASE_URL}${url}.json`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    });
};

const getFirstReceivedDetails = () => {
  return request()
    .then(phones => Promise.race(phones.map(
      phone => new Promise(
        resolve => resolve(request(`/${phone.id}`))
      ))));
};

const getAllSuccessfulDetails = () => {
  return request()
    .then(phones =>
      Promise.allSettled(phones.map(
        phone => new Promise(
          resolve => resolve(request(`/${phone.id}`)
          )))))
    .then(phones => phones.filter(
      phone => phone.status === 'fulfilled'))
    .then(result => result.map(phone => phone.value));
};

getFirstReceivedDetails()
  .then(result => {
    const firstReceived = document.createElement('div');

    firstReceived.className = 'first-received';

    firstReceived.insertAdjacentHTML('afterbegin', `
      <h3>First Received</h3>
      <p>${JSON.stringify(result)}</p>
    `);
    document.body.append(firstReceived);
  });

getAllSuccessfulDetails()
  .then(result => {
    const allSuccessful = document.createElement('div');
    const ul = document.createElement('ul');

    allSuccessful.insertAdjacentHTML('afterbegin', `
      <h3>All Successful</h3>
    `);

    result.forEach(details => {
      const idHeader = document.createElement('li');

      idHeader.innerHTML = `<h4>${details.id.toUpperCase()}</h4>`;
      idHeader.className = 'li-header';
      ul.append(idHeader);

      for (const key in details) {
        const li = document.createElement('li');

        li.textContent = `${key} : ${JSON.stringify(details[key])}`;
        ul.append(li);
      }
    });

    allSuccessful.className = 'all-successful';
    allSuccessful.append(ul);

    document.body.append(allSuccessful);
  });
