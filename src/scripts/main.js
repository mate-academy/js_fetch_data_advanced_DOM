'use strict';

const API_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';

function getFirstReceivedDetails(phonesIds) {
  return Promise.race(phonesIds.map(phoneId =>
    fetch(API_URL + `/phones/${phoneId}.json`)
      .then(resp => resp.json())));
}

function getAllSuccessfulDetails(phonesIds) {
  return Promise.allSettled(
    phonesIds.map(phoneId => fetch(API_URL + `/phones/${phoneId}.json`)
      .then(resp => resp.json())))
    .then(results => results.slice(0, 3))
    .then(results => results.map(result => result.value));
}

function getPhones() {
  return fetch(API_URL + '/phones.json')
    .then(response => response.json());
}

getPhones()
  .then(phones => phones.map(phone => phone.id))
  .then(phoneId =>
    getFirstReceivedDetails(phoneId)
      .then(first => {
        const firstReceived = `
          <div class="first-received">
            <h3>First Received</h3>
            <ul>
                <li>${first.name}</li>
            </ul>
          </div>
        `;

        document.querySelector('body')
          .insertAdjacentHTML('beforeend', firstReceived);
      }),
  );

getPhones()
  .then(phones => phones.map(phone => phone.id))
  .then(phonesIds =>
    getAllSuccessfulDetails(phonesIds)
      .then(phones => {
        phones.forEach(phone => {
          const ulElement = document.querySelector('.all-successful ul');

          if (ulElement) {
            ulElement.insertAdjacentHTML(
              'beforeend',
              `<li>${phone.name}</li>`,
            );
          } else {
            const allSuccessful = `
              <div class="all-successful">
                <h3>All Successful</h3>
                <ul>
                    <li>${phone.name}</li>
                </ul>
              </div>
            `;

            document.querySelector('body')
              .insertAdjacentHTML('beforeend', allSuccessful);
          }
        });
      }),
  );
