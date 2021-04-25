'use strict';

const API_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';

function getFirstReceivedDetails(phonesIds) {
  return new Promise(resolve => {
    phonesIds.forEach(phoneId => {
      fetch(API_URL + `/phones/${phoneId}.json`)
        .then(resp => resp.json())
        .then(detail => resolve(detail));
    });
  });
}

function getAllSuccessfulDetails(phonesIds) {
  let fastestResponsesCount = 0;

  return new Promise(resolve => {
    resolve(
      phonesIds.map(phoneId =>
        fetch(API_URL + `/phones/${phoneId}.json`)
          .then(resp => resp.json())
          .then(detail => {
            if (fastestResponsesCount < 3) {
              fastestResponsesCount++;

              return detail;
            }
          }),
      ),
    );
  });
}

function getPhones() {
  return fetch(API_URL + '/phones.json')
    .then(response => response.json());
}

getPhones()
  .then(phones => phones.map(phone => phone.id))
  .then(phonesIds =>
    getFirstReceivedDetails(phonesIds)
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
        for (let i = 0; i < 3; i++) {
          phones[i].then(phone => {
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
        }
      }),
  );
