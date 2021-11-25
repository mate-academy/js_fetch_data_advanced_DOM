'use strict';

const url = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const showDetails = (divClass, title, result) => {
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="${divClass}">
      <h3 class="li-header">${title}</h3>
      <ul>
        ${result.map(phone => `
          <li>${phone.name}</li>
        `).join('')}
      </ul>
    </div>
  `);
};

const request = (id = '') => {
  return fetch(url + id + '.json')
    .then(response => {
      if (!response.ok) {
        return new Error('Error');
      }

      return response.json();
    });
};

const getDetails = () => {
  return request()
    .then(result => result.map(phone => phone.id));
};

const getFirstReceivedDetails = (arr) => {
  return Promise.race(arr.map(id => request(`/${id}`)));
};

const getAllSuccessfulDetails = (arr) => {
  return Promise.all(arr.map(id => request(`/${id}`)));
};

const getThreeFastestDetails = (ids) => {
  return Promise.all(
    [
      Promise.race(ids.map(id => request(`/${id}`))),
      Promise.race(ids.map(id => request(`/${id}`))),
      Promise.race(ids.map(id => request(`/${id}`))),
    ]
  );
};

getDetails()
  .then(result => getFirstReceivedDetails(result))
  .then(result => [result])
  .then(result => showDetails('first-received', 'First Received', result));

getDetails()
  .then(result => getAllSuccessfulDetails(result))
  .then(result => showDetails('all-successful', 'All Successful', result));

getDetails()
  .then(result => getThreeFastestDetails(result))
  .then(result => showDetails('three-received', 'Three fastest', result));
