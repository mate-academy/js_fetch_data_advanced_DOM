'use strict';

const detailsUrl = `https://mate-academy.github.io/
phone-catalogue-static/api/phones`;

const request = (url, id = '.json') => {
  return fetch(`${url}${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};

const getPhones = () => request(detailsUrl);

getPhones()
  .then(result => getPhonesId(result))
  .then(result => {
    getFirstReceivedDetails(result);
    getAllSuccessfulDetails(result);
    getThreeFastestDetails(result, 3);
  })
  .catch(err => alert(err));

function getPhonesId(data) {
  const phonesId = data.map(phone => phone.id);

  return phonesId;
};

function getFirstReceivedDetails(phonesId) {
  return Promise.race(phonesId.map(id => request(detailsUrl, `/${id}.json`)))
    .then(result => {
      const firstReceivedDetails = [result];

      addResultPromise('first-received',
        'First Received',
        firstReceivedDetails);

      return firstReceivedDetails;
    });
};

function getAllSuccessfulDetails(phonesId) {
  return Promise.allSettled(phonesId.map(id => {
    return request(detailsUrl, `/${id}.json`);
  }))
    .then(results => {
      const allSuccessfulDetails = [];

      for (const result of results) {
        if (result.value) {
          allSuccessfulDetails.push(result.value);
        }
      };

      addResultPromise('all-successful',
        'All Successful',
        allSuccessfulDetails);

      return allSuccessfulDetails;
    });
};

function getThreeFastestDetails(phonesId, numberOfId) {
  const clonePhonesId = [...phonesId];
  const threeFastestDetails = [];

  function getDetails(data) {
    Promise.race(data.map(id => request(detailsUrl, `/${id}.json`)))
      .then(function(result) {
        const indexFirstId = clonePhonesId.indexOf(result.id);

        if (indexFirstId === -1) {
          getDetails(data);
        } else {
          clonePhonesId.splice(indexFirstId, 1);
          threeFastestDetails.push(result);
        }
      });
  };

  for (let i = 0; i < numberOfId; i++) {
    getDetails(clonePhonesId);
  }

  return threeFastestDetails;
};

function addResultPromise(className, title, resultOfThePromise) {
  const div = document.createElement('div');

  div.className = className;

  div.insertAdjacentHTML('afterbegin', `
    <h1>
      ${title}
    </h1>
  `);

  const ul = document.createElement('ul');

  div.append(ul);

  resultOfThePromise.map(phone => ul.insertAdjacentHTML('beforeend', `
    <li id=${phone.id}>
      ${phone.name}
    </li>
  `));

  document.body.append(div);
};
