/* eslint-disable max-len */
'use strict';

const body = document.querySelector('body');
const listURL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const detailsURL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';

const getPhones = () => {
  return fetch(listURL)
    .then(response => response.json())
    .catch(error => {
      setTimeout(() => error, 5000);
    });
};

const getPhonesDetails = (id) => {
  return fetch(`${detailsURL}${id}.json`)
    .then(response => response.json())
    .catch(error => error);
};

const getFirstReceivedDetails = arr => {
  Promise.race(arr.map(id => getPhonesDetails(id)))
    .then(response => {
      body.insertAdjacentHTML('beforeend', `
        <div class="first-received">
          <h3>First Received</h3>
          <li>${response.name}</li>
        </div>
      `);
    })
    .catch(error => error);
};

const getAllSuccessfulDetails = arr => {
  Promise.all(arr.map(id => getPhonesDetails(id)))
    .then(responses => {
      const allSuccessful = document.createElement('div');
      const heading = document.createElement('h3');

      heading.textContent = 'All Successful';
      allSuccessful.className = 'all-successful';
      allSuccessful.append(heading);

      for (const response of responses) {
        const li = document.createElement('li');

        li.innerHTML = `${response.name.toUpperCase()}`;
        allSuccessful.append(li);
      }

      body.append(allSuccessful);
    })
    .catch(error => error);
};

getPhones().then(list => {
  const listID = list.map(item => item.id);

  getFirstReceivedDetails(listID);
  getAllSuccessfulDetails(listID);
});
