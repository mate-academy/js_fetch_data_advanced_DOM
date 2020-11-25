'use strict';

// eslint-disable-next-line max-len
const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';
const request = (url) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        // eslint-disable-next-line prefer-promise-reject-errors
        Promise.reject(`${response.status}`)
          // eslint-disable-next-line no-console
          .catch(error => console.warn('Error:', error));
      }

      return response.json();
    });
};
const getFirstReceivedDetails = () => {
  return request('.json')
    .then(result => Promise.race(
      result.map(phone => request(`/${phone.id}.json`))
    ));
};
const getAllSuccessfulDetails = () => {
  return request('.json')
    .then(result => Promise.allSettled(
      result.map(phone => request(`/${phone.id}.json`))
    ))
    .then(result => result.filter(res => (res.status === 'fulfilled')))
    .then(result => result.map(res => res.value));
};
const getThreeFastesDetails = () => {
  return Promise.all([
    getFirstReceivedDetails(),
    getFirstReceivedDetails(),
    getFirstReceivedDetails(),
  ]);
};

// eslint-disable-next-line no-console
getFirstReceivedDetails().then(res => console.log(res));
// eslint-disable-next-line no-console
getAllSuccessfulDetails().then(res => console.log(res));
// eslint-disable-next-line no-console
getThreeFastesDetails().then(res => console.log(res));
