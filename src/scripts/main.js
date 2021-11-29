'use strict';

// write code here
const body = document.querySelector('body');

const divForFirstReceivedDetail = document.createElement('div');
const divForAllSuccessfulDetails = document.createElement('div');
const divForThreeFastestDetails = document.createElement('div');

body.append(divForFirstReceivedDetail);
divForFirstReceivedDetail.className = `first-received`;
divForFirstReceivedDetail.innerHTML = `<h3>First Received</h3>`;

body.append(divForAllSuccessfulDetails);
divForAllSuccessfulDetails.className = `all-successful`;
divForAllSuccessfulDetails.innerHTML = `<h3>All Successful</h3>`;

body.append(divForThreeFastestDetails);
divForThreeFastestDetails.className = `three-fastest`;
divForThreeFastestDetails.innerHTML = `<h3>Three Fastest</h3>`;

const addResultToHtml = (div, names, ids) => {
  const text = `
  <li>${names} / ${ids}</li>
  `;

  div.insertAdjacentHTML('beforeend', text);
};

const BASE_URL
= 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const request = (url) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        // eslint-disable-next-line no-console
        return console.warn(`Error: ${response.status}`);
      }

      return response.json();
    });
};

const getPhonesDetails = () => {
  return request('.json')
    .then(details => details.map(phone => phone.id));
};
const getFirstReceivedDetails = (idsArray) =>
  Promise.race(idsArray.map(ids => request(`/${ids}.json`)));
const getAllSuccessfulDetails = (idsArray) =>
  Promise.allSettled(idsArray.map(ids => request(`/${ids}.json`)));
const getThreeFastestDetails = (idsArray) =>
  Promise.all([
    Promise.race(idsArray.map(ids => request(`/${ids}.json`))),
    Promise.race(idsArray.map(ids => request(`/${ids}.json`))),
    Promise.race(idsArray.map(ids => request(`/${ids}.json`))),
  ]);

getPhonesDetails()
  .then(details => getFirstReceivedDetails(details))
  .then(result =>
    addResultToHtml(divForFirstReceivedDetail, result.name, result.id));

getPhonesDetails()
  .then(details => getAllSuccessfulDetails(details))
  .then(result => result.map(item =>
    addResultToHtml(divForAllSuccessfulDetails,
      item.value.name, item.value.id)));

getPhonesDetails()
  .then(details => getThreeFastestDetails(details))
  .then(result => result.map(item =>
    addResultToHtml(divForThreeFastestDetails, item.name, item.id)));
