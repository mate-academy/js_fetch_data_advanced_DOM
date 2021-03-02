'use strict';

// eslint-disable-next-line max-len
const basicURL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const request = (url) => {
  return fetch(`${url}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }

      return response.json();
    });
};

const getIDsArray = (array) => {
  const arrayOfIds = [];

  array.forEach(element => {
    arrayOfIds.push(element.id);
  });

  return arrayOfIds;
};

const getFirstReceivedDetails = (iDs, baseUrl) => {
  Promise.race(iDs.map(id => fetch(`${baseUrl}/${id}.json`)))
    .then(result => {
      return result.json();
    })
    .then(result => console.log(result));
};

const getAllSuccessfulDetails = (iDs, baseUrl) => {
  Promise.allSettled(iDs.map(id => fetch(`${baseUrl}/${id}.json`)
    .then(result => {
      return result.json();
    })))
    .then(results => {
      results.forEach((result, num) => {
        console.log(`${iDs[num]} with details:`, result.value);
      });
    });
};

const getPhones = () => request(basicURL);

getPhones()
  .then(result => {
    const arrayOfIds = getIDsArray(result);

    getFirstReceivedDetails(arrayOfIds, basicURL);
    getAllSuccessfulDetails(arrayOfIds, basicURL);
  })
  .catch(error => console.log(error, 'Error has occured!'));
