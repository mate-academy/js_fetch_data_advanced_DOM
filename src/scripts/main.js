'use strict';

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';

const request = (url) => {
  // eslint-disable-next-line no-undef
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        // eslint-disable-next-line no-throw-literal
        throw `${response.status} - ${response.statusText}`;
      }

      return response.json();
    });
};

const getFirstReceivedDetails = (ids) => {
  return Promise.race(ids.map(id => new Promise(resolve => {
    setTimeout(() => {
      resolve(id);
    }, Math.round(Math.random() * 1000));
  })));
};

function getAllSuccessfulDetails(arrIds) {
  return Promise.allSettled(
    arrIds.map(id => {
      return request(`/phones/${id}.json`)
        .then(response => response);
    })
  );
}

request('/phones.json')
  .then(listPhones => {
    const phonesIds = listPhones.map(phone => phone.id);

    getFirstReceivedDetails(phonesIds)
      .then((IdFirstPromise) => {
        request(`/phones/${IdFirstPromise}.json`)
          .then(details => {
            // eslint-disable-next-line no-console
            console.log(details);
          });
      });

    getAllSuccessfulDetails(phonesIds)
      // eslint-disable-next-line no-console
      .then(arrPromise => console.log(arrPromise.filter(item => {
        if (item.status === 'fulfilled') {
          return item.value;
        }
      })));

    // eslint-disable-next-line no-console
    console.log(getThreeFastestDetails(phonesIds));
  });

function getThreeFastestDetails(arrayIds) {
  const threeFastestDetails = [];

  threeFastestDetails.push(
    getFirstReceivedDetails(arrayIds),
    getFirstReceivedDetails(arrayIds),
    getFirstReceivedDetails(arrayIds)
  );

  return threeFastestDetails;
}
