'use strict';

const BASE_URL = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones';

const request = (url) => {
  return fetch(url)
    .then((response) => {
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
  const idsInThreeChunks = [
    phoneIds.slice(0, phoneIds.length / 3),
    phoneIds.slice(phoneIds.length / 3, 2 * phoneIds.length / 3),
    phoneIds.slice(2 * phoneIds.length / 3),
  ];

  idsInThreeChunks.forEach(chunk => {
    promises.push(Promise.any(
      chunk.map(id => request(`${BASE_URL}/${id}.json`))
    ));
  });

  return promises;
};

window.addEventListener('load', () => {
  const containerFirst = document.getElementById('first');
  const containerAll = document.getElementById('all');
  const containerFirstThree = document.getElementById('first-three');

  getPhoneIds(Date.now())
    .then(ids => {
      getFirstReceivedDetails(ids)
        .then(phone => {
          containerFirst
            .insertAdjacentHTML(
              'beforeend',
              `<li>${phone.id.toUpperCase()}</li>`
            );
        })
        .catch(err => {
          containerFirst
            .insertAdjacentHTML('beforeend',
              `<li class="error">${err.message}</li>`);
        });

      getAllSuccessfulDetails(ids)
        .then(phones => {
          phones.forEach(phone => {
            if (phone.status === 'fulfilled') {
              containerAll
                .insertAdjacentHTML(
                  'beforeend',
                  `<li>${phone.value.id.toUpperCase()}</li>`
                );
            } else {
              containerAll
                .insertAdjacentHTML('beforeend',
                  `<li class="error">${phone.reason}</li>`);
            }
          });
        });

      getThreeFastestDetails(ids).forEach(promise => {
        promise
          .then(phone => {
            containerFirstThree
              .insertAdjacentHTML(
                'beforeend',
                `<li>${phone.id.toUpperCase()}</li>`
              );
          })
          .catch(err => {
            containerFirstThree
              .insertAdjacentHTML('beforeend',
                `<li class="error">${err.message}</li>`);
          });
      });
    })
    .catch(err => {
      [containerFirst, containerAll, containerFirstThree]
        .map(container => {
          container
            .insertAdjacentHTML('beforeend',
              `<li class="error">${err.message}</li>`);
        });
    });
});
