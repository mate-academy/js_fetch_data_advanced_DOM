'use strict';

const baseUrl
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';
const url
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';

const body = document.querySelector('body');

const getPhonesId = () => {
  return fetch(url)
    .then(response => response.json())
    .then(result => {
      const arrayOfId = [];

      result.map(phone => arrayOfId.push(phone.id));

      return arrayOfId;
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

  const threeFastestUl = body.querySelector('.three-fastest');

  threeFastestUl.style.position = 'absolute';
  threeFastestUl.style.top = '200px';
  threeFastestUl.style.left = '5px';

  const firstReceivedUl = body.querySelector('.first-received');

  firstReceivedUl.style.position = 'absolute';
  firstReceivedUl.style.top = '20px';
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

  const race = () => {
    count++;

    Promise.race(ids.map(el => fetch(`${baseUrl}${el}.json`)))
      .then(response => response.json())
      .then(result => {
        if (threeFastest.filter(el => el.id === result.id).length === 0) {
          threeFastest.push({
            id: result.id.toUpperCase(),
            name: result.name,
          });

          if (count === 3) {
            createDiv('three-fastest', 'Three Fastest', threeFastest);

            return;
          }
          race();
        }
      });
  };

  race();
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
  .then(result => getThreeFastestDetails(result));

getPhonesId()
  .then(result => getAllSuccessfulDetails(result));
