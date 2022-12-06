'use strict';

/**
 * API Url:
- Details URL:
  https://mate-academy.github.io/phone-catalogue-static/api/phones/:phoneId.json

Functions:
- `getFirstReceivedDetails`
  takes array of phone's ID and `resolves` with the first received detail
  (the fastest response NOT the first in the list). Ignore the other responses;
- `getAllSuccessfulDetails`
  which takes array of phones' IDs and `resolves` with an array of all
  successfully received details (errors should be ignored).

- `getThreeFastestDetails`
  which takes array of phones IDs and `resolves` with an array of the details
  for the first 3 responses (the fastest).

*/

const BASE_URL = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones';

const request = (url) => {
  return fetch(url)
    .then((response) => {
      // Create a promise that rejects in 5 milliseconds
      return Promise.race([
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error(`Error: ${response.status}`));
          }, 5000);
        }),
        new Promise(resolve => {
          if (response.ok) {
            resolve(response.json());
          }
        }),
      ]);
    });
};

const getPhoneIds = (startTime) => {
  return request(`${BASE_URL}.json`)
    .then(result => result.map(el => el.id))
    .catch(err => {
      if (startTime + 15000 < Date.now()) {
        getPhoneIds();
      }

      return Promise.reject(err);
    });
};

const getFirstReceivedDetails = (phoneIds) => {
  return Promise.race(phoneIds.map(id => request(`${BASE_URL}/${id}.json`)))
    .then(result => {
      return result;
    })
    .then(result => [result]);
};

const getAllSuccessfulDetails = (phoneIds) => {
  return Promise.all(phoneIds.map(id => request(`${BASE_URL}/${id}.json`)))
    .then(result => {
      return result;
    })
    .then(result => result);
};

const getThreeFastestDetails = (phoneIds) => {
  let results = 0;

  return Promise.all(phoneIds.map(id => {
    if (results < 3) {
      results++;

      return request(`${BASE_URL}/${id}.json`);
    }

    return false;
  }))
    .then(res => res.filter(el => el));
};

const insertToContainer = (array, container) => {
  document.getElementById(container)
    .insertAdjacentHTML('afterend', `
      <ul>
        ${array.map(el => `<li>${el.id.toUpperCase()}</li>`).join('')}
      </ul>
    `);
};

getPhoneIds(Date.now()).then(ids => {
  getFirstReceivedDetails(ids).then(arr => {
    insertToContainer(arr, 'first');
  });

  getAllSuccessfulDetails(ids).then(arr => {
    insertToContainer(arr, 'all');
  });

  getThreeFastestDetails(ids).then(arr => {
    insertToContainer(arr, 'first-three');
  });
});
