'use strict';

// eslint-disable-next-line max-len
const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const getRequest = (url = '') => {
  return fetch(`${BASE_URL}${url}.json`)
    .then(response => {
      if (!response.ok) {
        // eslint-disable-next-line no-throw-literal
        throw `${response.status} - Error from server`;
      }

      return response.json();
    });
};

const getPhonesId = () => {
  return getRequest().then(result => result.map(phone => phone.id));
};

const getFirstReceivedDetails = (arr) => {
  return Promise.race(arr.map(phone => getRequest(`/${phone}`)))
    .then(data => [data]);
};

const getAllSuccessfulDetails = (arr) => {
  return Promise.all(arr.map(phone => getRequest(`/${phone}`)));
};

const getThreeFastestDetails = (arr) => {
  return Promise.all([
    Promise.race(arr.map(phone => getRequest(`/${phone}`))),
    Promise.race(arr.map(phone => getRequest(`/${phone}`))),
    Promise.race(arr.map(phone => getRequest(`/${phone}`))),
  ]);
};

const createList = (divClass, title, data) => {
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="${divClass}">
      <h3>${title}</h3>
      <ul>
      ${data.map(phone => `
        <li>${phone.name}</li>
      `).join('')}
      </ul>
    </div>
  `);
};

getPhonesId()
  .then(list => getAllSuccessfulDetails(list))
  .then(data => createList('all-successful', 'All successful', data));

getPhonesId()
  .then(list => getThreeFastestDetails(list))
  .then(data => createList('three-successful', 'Three Fastest', data));

getPhonesId()
  .then(list => getFirstReceivedDetails(list))
  .then(data => createList('first-received', 'First Fastest', data));
