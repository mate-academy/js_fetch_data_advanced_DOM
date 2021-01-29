'use strict';

const BASE_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const request = (url) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        Promise.reject(
          new Error(`${response.status} - ${response.statusText}`)
        );
      }

      return response.json();
    });
};

const getFirstReceivedDetails = () => {
  return request('.json')
    .then(result => Promise.race(
      result.map(phoneId => request(`/${phoneId.id}.json`)
      )
    ));
};

const getAllSuccessfulDetails = () => {
  return request('.json')
    .then(result => Promise.allSettled(
      result.map(phoneId => request(`/${phoneId.id}.json`))))
    .then(phones => phones.filter(phone => phone.status === 'fulfilled'));
};

const getThreeFastestDetails = () => {
  return Promise.all([
    getFirstReceivedDetails(),
    getFirstReceivedDetails(),
    getFirstReceivedDetails(),
  ]);
};

getFirstReceivedDetails()
  // eslint-disable-next-line no-console
  .then(result => console.log('First received details:', result))
  // eslint-disable-next-line no-console
  .catch(error => console.warn('Error:', error));

getAllSuccessfulDetails()
  // eslint-disable-next-line no-console
  .then(result => console.log('All successful details:', result))
  // eslint-disable-next-line no-console
  .catch(error => console.warn('Error:', error));

getThreeFastestDetails()
  // eslint-disable-next-line no-console
  .then(result => console.log('3 successful details:', result))
  // eslint-disable-next-line no-console
  .catch(error => console.warn('Error:', error));
