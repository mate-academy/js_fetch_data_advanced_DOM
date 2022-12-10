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
        new Promise((resolve, reject) => {
          if (response.ok) {
            resolve(response.json());
          } else {
            reject(new Error('Can not connect to the server.'));
          }
        }),
      ]);
    });
};

const getPhoneIds = (startTime) => {
  const timeout = 15000;

  return request(`${BASE_URL}.json`)
    .then(phones => phones.map(phone => phone.id))
    .catch(err => {
      if (startTime + timeout < Date.now()) {
        return getPhoneIds();
      }

      return Promise.reject(err);
    });
};

const getFirstReceivedDetails = (phoneIds) => {
  return Promise.any(phoneIds.map(id => request(`${BASE_URL}/${id}.json`)));
};

const getAllSuccessfulDetails = (phoneIds) => {
  return Promise.allSettled(
    [...phoneIds].map(id => request(`${BASE_URL}/${id}.json`))
  );
};

const getThreeFastestDetails = (phoneIds) => {
  const promises = [];
  const idsSlice = [
    phoneIds.slice(0, phoneIds.length / 3),
    phoneIds.slice(phoneIds.length / 3, 2 * phoneIds.length / 3),
    phoneIds.slice(2 * phoneIds.length / 3),
  ];

  idsSlice.forEach(ids => {
    promises.push(Promise.any(
      ids.map(id => request(`${BASE_URL}/${id}.json`))
    ));
  });

  return promises;
};

const insertToContainer = (phone, container) => {
  document.getElementById(container)
    .insertAdjacentHTML('beforeend', `<li>${phone.id.toUpperCase()}</li>`);
};

const renderError = (error, container) => {
  document.getElementById(container)
    .insertAdjacentHTML('beforeend',
      `<li class="error">${error}</li>`);
};

window.addEventListener('load', () => {
  getPhoneIds(Date.now())
    .then(ids => {
      getFirstReceivedDetails(ids)
        .then(phone => {
          insertToContainer(phone, 'first');
        })
        .catch(err => {
          renderError(err.message, 'first');
        });

      getAllSuccessfulDetails(ids)
        .then(phones => {
          phones.forEach(phone => {
            if (phone.status === 'fulfilled') {
              insertToContainer(phone.value, 'all');
            } else {
              renderError(phone.reason, 'all');
            }
          });
        });

      getThreeFastestDetails(ids).forEach(promise => {
        promise
          .then(phone => {
            insertToContainer(phone, 'first-three');
          })
          .catch(err => {
            renderError(err.message, 'first-three');
          });
      });
    })
    .catch(err => {
      renderError(err.message, 'all');
      renderError(err.message, 'first');
      renderError(err.message, 'first-three');
    });
});
