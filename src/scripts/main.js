'use strict';

function displayResult(ulClass, title, result) {
  const contents = `
    <ul class="${ulClass}">
      <li class="li-header">
        ${title}
      </li>
      ${result.map(phone => `<li>${phone.name}</li>`).join('')}
    </ul>
  `;

  document.body.insertAdjacentHTML('afterbegin', contents);
};

// #region utility request and Promises
function request(
  phoneId = '',
  baseUrl = 'https://mate-academy.github.io/phone-catalogue-static/api',
  endPoint = '/phones',
  format = '.json',
) {
  return fetch(baseUrl + endPoint + phoneId + format)
    .then(response => {
      if (!response.ok) {
        return new Error('Error');
      }

      return response.json();
    });
};

const listIds = () => {
  return request()
    .then(result => result.map(phone => phone.id));
};

const getFirstReceivedDetails = (arr) => {
  return Promise.race(arr.map(id => request('/' + id)));
};

const getAllSuccessfulDetails = (arr) => {
  return Promise.allSettled(arr.map(id => request('/' + id)))
    .then(result => result
      .filter(call => call.status === 'fulfilled')
      .map(el => el.value)
    );
};

const getThreeFastestDetails = (ids) => {
  return Promise.all(
    [
      Promise.race(ids.map(id => request('/' + id))),
      Promise.race(ids.map(id => request('/' + id))),
      Promise.race(ids.map(id => request('/' + id))),
    ]
  );
};
// #endregion utility request and Promises

listIds()
  .then(result => getFirstReceivedDetails(result))
  .then(result => [result])
  .then(result => displayResult('first-received', 'First fastest', result));

listIds()
  .then(result => getThreeFastestDetails(result))
  .then(result => displayResult('three-received', 'Three fastest', result));

listIds()
  .then(result => getAllSuccessfulDetails(result))
  .then(result => displayResult('all-successful', 'All Successful', result));
