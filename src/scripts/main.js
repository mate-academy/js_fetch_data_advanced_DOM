'use strict';

// const arrIds = [
//   'motorola-xoom-with-wi-fi',
//   'dell-streak-7',
//   'samsung-gem',
// ];

/* eslint-disable-next-line */
const BASEurl = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';

function request(phoneId) {
  return fetch(BASEurl + phoneId + '.json')
    .then(response => {
      if (!response.ok) {
        return null;
      }

      return response.json();
    })
    .catch(new Error('Function "request" done with error'));
}

/* eslint-disable-next-line */
function getFirstReceivedDetails(IdList) {
  const phones = IdList.map(phoneId => {
    return request(phoneId);
  });

  return Promise.race(phones)
    .then(result => {
      const div = document.createElement('div');

      div.classList.add('first-received');

      div.insertAdjacentHTML('beforeend', `
        <h1>First Received</h1>
        <p>ID: ${result.id}</p>
        <p>Name: ${result.name}</p>
      `);

      document.body.append(div);
    })
    .catch(() => {
      document.body.insertAdjacentHTML('beforeend', `
        <div>getFirstReceivedDetails rejected!</div>
      `);
    });
}

/* eslint-disable-next-line */
function getAllSuccessfulDetails(IdList) {
  const phones = IdList.map(phoneId => {
    return request(phoneId);
  });

  return Promise.all(phones)
    .then(phonesArray => phonesArray.filter(phone => phone !== null))
    .then(result => {
      const div = document.createElement('div');

      div.classList.add('all-successful');

      div.insertAdjacentHTML('beforeend', `
        <h1>All Successful</h1>
      `);

      for (const phone of result) {
        div.insertAdjacentHTML('beforeend', `
          <p>ID: ${phone.id}</p>
          <p>Name: ${phone.name}</p>
        `);
      }

      document.body.append(div);
    })
    .catch(() => {
      document.body.insertAdjacentHTML('beforeend', `
        <div>getAllSuccessfulDetails rejected!</div>
      `);
    });
}
