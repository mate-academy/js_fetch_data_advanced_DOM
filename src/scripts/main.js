'use strict';

const body = document.querySelector('body');

const BASE_URL
= 'https://mate-academy.github.io/phone-catalogue-static/api';
const ENDPOINT_PHONES = '/phones';

function getRequest(endpoint) {
  return fetch(`${BASE_URL}${endpoint}.json`)
    .then(response => {
      if (!response.ok) {
        throw Error(`${endpoint} - not found`);
      }

      return response.json();
    });
}

function createMessage(heading, className, phonesList) {
  const message = document.createElement('div');
  const phoneList = document.createElement('ol');

  if (Array.isArray(phonesList)) {
    for (const phoneObj of phonesList) {
      const phoneDescriptionForList = document.createElement('li');
      const phoneId = phoneObj.id;
      const phoneName = phoneObj.name;

      phoneDescriptionForList.innerHTML = `
      Phone ID: ${phoneId},
      Phone name: ${phoneName}
    `;
      phoneList.append(phoneDescriptionForList);
    }
  } else {
    const phoneDescription = document.createElement('li');
    const phoneId = phonesList.id;
    const phoneName = phonesList.name;

    phoneDescription.innerHTML = `
    Phone ID: ${phoneId},
    Phone name: ${phoneName}
  `;
    phoneList.append(phoneDescription);
  }

  message.append(phoneList);
  message.classList.add(className);
  message.insertAdjacentHTML('afterbegin', `<h1>${heading}</h1>`);

  body.append(message);
};

/* getFirstReceivedDetails */

function getFirstReceivedDetails(dataForRequest) {
  const arrRequests
    = dataForRequest.map(el => `${BASE_URL}${ENDPOINT_PHONES}/${el}.json`);

  const arrLink = arrRequests.map(el => {
    return fetch(el);
  });

  return Promise.race(arrLink)
    .then(response => {
      if (!response.ok) {
        throw Error(`phone is not found`);
      }

      return response.json();
    });
}

getRequest(ENDPOINT_PHONES)
  .then(phonesData => {
    const arrPhonesId = phonesData.map(el => el.id);

    return getFirstReceivedDetails(arrPhonesId);
  })
  .then(phoneDetails => {
    createMessage('First Received', 'first-received', phoneDetails);
  })
  .catch(error => {
    // eslint-disable-next-line
    console.error(error);
  });

/* getAllSuccessfulDetails */

function getAllSuccessfulDetails(dataForRequest) {
  const arrRequests
    = dataForRequest.map(el => `${BASE_URL}${ENDPOINT_PHONES}/${el}.json`);

  const arrLink = arrRequests.map(el => {
    return fetch(el);
  });

  return Promise.all(arrLink)
    .then(response => {
      return response;
    });
}

getRequest(ENDPOINT_PHONES)
  .then(phonesData => {
    const arrPhonesId = phonesData.map(el => el.id);

    return getAllSuccessfulDetails(arrPhonesId);
  })
  .then(response => {
    const message = document.createElement('div');
    const phoneList = document.createElement('ol');

    response.forEach(el => el.json().then(phone => {
      const phoneDescriptionForList = document.createElement('li');

      phoneDescriptionForList.innerHTML = `
      Phone ID: ${phone.id},
      Phone name: ${phone.name}
    `;
      phoneList.append(phoneDescriptionForList);
    }));

    message.classList.add('all-successful');
    message.insertAdjacentHTML('afterbegin', `<h1>All Successful</h1>`);
    message.append(phoneList);

    body.append(message);
  })
  .catch(error => {
    // eslint-disable-next-line
    console.error(error);
  });

/* getThreeFastestDetails */

function getThreeFastestDetails(dataForRequest, count) {
  let idForRequest = dataForRequest;
  let insideCounter = count;
  const arrResponses = [];

  let arrRequests
      = idForRequest.map(el => `${BASE_URL}${ENDPOINT_PHONES}/${el}.json`);

  return new Promise((resolve, reject) => {
    function promisFatch() {
      if (insideCounter > 0) {
        insideCounter--;

        Promise.race(arrRequests.map(el => fetch(el)))
          .then(data => data.json())
          .then(phoneObj => {
            arrResponses.push(phoneObj);
            idForRequest = idForRequest.filter(id => id !== phoneObj.id);

            arrRequests
              = idForRequest.map(el => {
                return `${BASE_URL}${ENDPOINT_PHONES}/${el}.json`;
              });

            if (insideCounter === 0) {
              resolve(arrResponses);
            }
            promisFatch();
          });
      }
    }
    promisFatch();
  });
};

getRequest(ENDPOINT_PHONES)
  .then(phonesData => {
    const arrPhonesId = phonesData.map(el => el.id);

    return getThreeFastestDetails(arrPhonesId, 3);
  })
  .then(phoneDetails => {
    createMessage('First 3 Received', 'lll', phoneDetails);
  })
  .catch(error => {
    // eslint-disable-next-line
    console.error(error);
  });
