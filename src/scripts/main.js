'use strict';

/* eslint-disable-next-line */
const BASEurl = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

function request(phoneId) {
  return fetch(BASEurl + '/' + phoneId + '.json')
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error('promise rejected'));
      }

      return response.json();
    })
    .catch('Function "request" done with error');
}

function createPhonesList(listClass, header) {
  const div = document.createElement('div');

  div.classList.add(listClass);

  div.insertAdjacentHTML('beforeend', `
    <h1>${header}</h1>
  `);

  document.body.append(div);
}

function getFirstReceivedDetails(IdList) {
  const phones = IdList.map(phoneId => request(phoneId));

  return Promise.race(phones)
    .then(result => {
      createPhonesList('first-received', 'First Received');

      const div = document.getElementsByClassName('first-received')[0];

      div.insertAdjacentHTML('beforeend', `
        <p><strong>ID:</strong> ${result.id.toUpperCase()}</p>
        <p><strong>Name:</strong> ${result.name}</p>
      `);
    })
    .catch(() => {
      document.body.insertAdjacentHTML('beforeend', `
        <div>getFirstReceivedDetails rejected!</div>
      `);
    });
}

function getAllSuccessfulDetails(IdList) {
  const phones = IdList.map(phoneId => request(phoneId));

  return Promise.allSettled(phones)
    .then(phonesArray => phonesArray
      .filter(phone => phone.status !== 'rejected'))
    .then(result => {
      createPhonesList('all-successful', 'All Successful');

      const div = document.getElementsByClassName('all-successful')[0];

      for (const phone of result) {
        div.insertAdjacentHTML('beforeend', `
          <p><strong>ID:</strong> ${phone.value.id.toUpperCase()}</p>
          <p><strong>Name:</strong> ${phone.value.name}</p>
          <p>____________</p>
        `);
      }
    })
    .catch(() => {
      document.body.insertAdjacentHTML('beforeend', `
        <div>getAllSuccessfulDetails rejected!</div>
      `);
    });
}

function getThreeFastestDetails(IdList) {
  const phones = IdList.map(phoneId => request(phoneId));

  createPhonesList('fastest', 'Fastest Responses');

  const fastestResponse = (data) => {
    return Promise.race(data)
      .then(result => {
        const div = document.getElementsByClassName('fastest')[0];

        div.style.color = 'green';
        div.style.position = 'absolute';
        div.style.bottom = '10px';
        div.style.left = '55px';
        div.style.fontSize = '13px';

        div.insertAdjacentHTML('beforeend', `
          <p><strong>ID:</strong> ${result.id.toUpperCase()}</p>
          <p><strong>Name:</strong> ${result.name}</p>
          <p>____________</p>
        `);
      })
      .catch(() => {
        document.body.insertAdjacentHTML('beforeend', `
          <div>getFirstReceivedDetails rejected!</div>
        `);
      });
  };

  for (let i = 0; i < 3; i++) {
    fastestResponse(phones);
  }
}

function getInfoAboutPhones(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error('promise rejected'));
      }

      return response.json();
    })
    .then(result => {
      return result.map(phone => phone.id);
    })
    .then(phonesId => {
      getFirstReceivedDetails(phonesId);
      getAllSuccessfulDetails(phonesId);
      getThreeFastestDetails(phonesId);
    })
    .catch('Function "getPhonesId" done with error');
}

getInfoAboutPhones(BASEurl + '.json');
