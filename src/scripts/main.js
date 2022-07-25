'use strict';

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';
const phonesEndpoint = '/phones.json';
const detailsEndpoint = id => `/phones/${id}.json`;

const request = url =>
  fetch(BASE_URL + url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      } else if (!response.headers.get('content-type')
        .includes('application/json')) {
        throw new Error('Content type is not supported');
      }

      return response.json();
    });

const getFirstReceivedDetails = phonesID =>
  Promise.race(phonesID.map(ID => request(detailsEndpoint(ID))));

const getAllSuccessfulDetails = phonesID =>
  Promise.allSettled(phonesID.map(ID => request(detailsEndpoint(ID))))
    .then(details => details.filter(result => result.status !== 'rejected')
      .map(result => result.value)
    );

const getThreeFastestDetails = phonesID => {
  const detailsQueue = [];

  return Promise.allSettled(phonesID.map(ID => request(detailsEndpoint(ID))
    .then(result => detailsQueue.push(result))))
    .then(_ => detailsQueue.slice(0, 3));
};

request(phonesEndpoint)
  .then(phones => {
    const phonesID = phones.map(phone => phone.id);

    getFirstReceivedDetails(phonesID)
      .then(details => {
        document.body.insertAdjacentHTML('beforeend', `
          <section class="first-received">
            <h2> First Received </h2>
            <ul>
              <li>${details.id}</li>
            </ul>
          </section>
        `);
      });

    getAllSuccessfulDetails(phonesID)
      .then(details => {
        document.body.insertAdjacentHTML('beforeend', `
          <section class="all-successful">
            <h2> All Successful </h2>
            <ul>
              ${details.map(detail => `<li>${detail.id}</li>`).join('')}
            </ul>
          </section>
        `);
      });

    getThreeFastestDetails(phonesID)
      // eslint-disable-next-line
      .then(ThreeFastestDetails => console.log(ThreeFastestDetails));
  });
