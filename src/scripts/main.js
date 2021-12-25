'use strict';

// write code here
const BASE_URL
 = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const getRequest = (url = '') => {
  return fetch(`${BASE_URL}${url}.json`).then(response => {
    if (!response.ok) {
      throw new Error(`Error from server`, response.status);
    }

    return response.json();
  });
};

const getPhoneIdList = () => {
  return getRequest().then(result => result.map(phone => phone.id));
};

const getFirstReceivedDetails = arr => {
  return Promise.race(arr.map(phoneId => getRequest(`/${phoneId}`)))
    .then(res => [res]);
};

const getAllReceivedDetails = arr => {
  return Promise.all(arr.map(phoneId => getRequest(`/${phoneId}`)));
};

const getThreeFastestDetails = arr => {
  return Promise.all([
    Promise.race(arr.map(phoneId => getRequest(`/${phoneId}`))),
    Promise.race(arr.map(phoneId => getRequest(`/${phoneId}`))),
    Promise.race(arr.map(phoneId => getRequest(`/${phoneId}`))),
  ]);
};

const showDetails = (divClass, title, result) => {
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="${divClass}">
      <h3 class="li-header">${title}</h3>
      <ul>
        ${result.map(phone => `
          <li>${phone.name} - ${phone.id.toUpperCase()}</li>
        `).join('')}
      </ul>
    </div>
  `);
};

getPhoneIdList()
  .then(idList => getAllReceivedDetails(idList))
  .then(res => showDetails('all-successful', 'All Successful', res));

getPhoneIdList()
  .then(idList => getFirstReceivedDetails(idList))
  .then(res => showDetails('first-received', 'First Received', res));

getPhoneIdList()
  .then(idList => getThreeFastestDetails(idList))
  .then(res => showDetails('three-fastest', 'three fastest', res));
