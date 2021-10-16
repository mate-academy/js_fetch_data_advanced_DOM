'use strict';

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';

const PHONES_EP = '/phones.json';
const PHONE_EP = '/phones/';

const request = (endpoint) => {
  return fetch(BASE_URL + endpoint)
    .then(response => {
      if (!response.ok) {
        throw new Error('Request failed');
      }

      return response.json();
    });
};

const allPhonesIds = [];

const getAllPhonesIds = () => {
  return request(PHONES_EP)
    .then(phones => {
      phones.map(({ id }) => allPhonesIds.push(id));

      return allPhonesIds;
    });
};

const getPhoneDetails = (id) => {
  return request(`${PHONE_EP}${id}.json`);
};

const getAllSuccessfulDetails = (ids) => {
  return Promise.allSettled(ids.map(id => getPhoneDetails(id)))
    .then(data => data.map(({ value }) => value));
};

const getThreeFastestDetails = (ids) => {
  return Promise.all([
    Promise.race(ids.map(id => getPhoneDetails(id))),
    Promise.race(ids.map(id => getPhoneDetails(id))),
    Promise.race(ids.map(id => getPhoneDetails(id))),
  ]);
};

getAllPhonesIds()
  .then(getAllSuccessfulDetails)
  .then(phones => {
    renderPhones('All Successful', phones);

    return allPhonesIds;
  })
  .then(getThreeFastestDetails)
  .then(phones => {
    renderPhones('First Received', phones.slice(1, -1));
    renderPhones('Three Fastest', phones);
  });

const renderPhones = (heading, phones) => {
  let headingClass;

  switch (heading.toLowerCase()) {
    case 'first received':
      headingClass = 'first-received';
      break;

    case 'all successful':
      headingClass = 'all-successful';
      break;

    case 'three fastest':
      headingClass = `first-three`;
      break;

    default:
      break;
  }

  const list = `
    <ul class=${headingClass}>
    <h3 class="li-header">${heading}</h3>
      ${phones.map(phone => `
          <li>
              <p>
                ID: ${phone.id}
              </p>
              <p>
                Name: ${phone.name}
              </p>
          </li>
      `).join('')}
    </ul>
  `;

  document.body.insertAdjacentHTML('beforeend', list);
};
