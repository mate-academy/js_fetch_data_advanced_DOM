'use strict';

const baseUrl
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';
const phonesUrl
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';

const body = document.querySelector('body');

const getPhonesId = () => {
  return fetch(phonesUrl)
    .then(response => response.json())
    .then(result => {
      return result.map(phone => phone.id);
    });
};

const createDiv = (className, heading, arrayOfPhones) => {
  body.insertAdjacentHTML('beforeend', `
      <ul class="${className}">
        <h2>${heading}</h2>
      </ul>
  `);

  arrayOfPhones.map(el => {
    const list = body.querySelector(`.${className}`);

    list.insertAdjacentHTML('beforeend', `
      <li>
        Phone ID: ${el.id}
        <br>
        Phone Name: ${el.name}
      </li>
    `);
  });
};

const getFirstReceivedDetails = (ids) => {
  const firstReceived = [];

  Promise.race(ids.map(el => fetch(`${baseUrl}${el}.json`)))
    .then(response => response.json())
    .then(result => {
      firstReceived.push({
        id: result.id.toUpperCase(),
        name: result.name,
      });
      createDiv('first-received', 'First Received', firstReceived);
    });
};

const getThreeFastestDetails = (ids) => {
  const threeFastest = [];
  let count = 0;

  Promise.all(ids.map(el => {
    return fetch(`${baseUrl}${el}.json`)
      .then(response => ({
        response,
        count: count++,
      }));
  }))
    .then(response => response
      .sort((a, b) => a.count - b.count)
      .slice(0, 3)
      .map(resp => resp.response.json()
        .then(result => {
          threeFastest.push({
            id: result.id.toUpperCase(),
            name: result.name,
          });

          if (threeFastest.length === 3) {
            createDiv('three-fastest', 'Three Fastest', threeFastest);
          }
        })
      ));
};

const getAllSuccessfulDetails = (ids) => {
  const allSuccess = [];

  Promise.all(ids.map(el => fetch(`${baseUrl}${el}.json`)))
    .then(responses => {
      responses.map(el => {
        el.json()
          .then(result => {
            allSuccess.push({
              id: result.id,
              name: result.name,
            });

            if (allSuccess.length === 20) {
              createDiv('all-successful', 'All Successful', allSuccess);
            }
          });
      });
    });
};

getPhonesId()
  .then(result => getFirstReceivedDetails(result));

getPhonesId()
  .then(result => getThreeFastestDetails(result))
  .catch(error => error);

getPhonesId()
  .then(result => getAllSuccessfulDetails(result));
