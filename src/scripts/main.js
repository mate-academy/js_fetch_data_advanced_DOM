'use strict';

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';
const arrPromises = [];
const arrPromisesWith3Element = [];

const request = (url) => {
  // eslint-disable-next-line no-undef
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        // eslint-disable-next-line no-throw-literal
        throw `${response.status} - ${response.statusText}`;
      }

      return response.json();
    });
};

request('/phones.json')
  .then(listPhones => {
    const phonesIds = listPhones.map(phone => phone.id);

    getFirstReceivedDetails(phonesIds)
      .then((IdFirstPromise) => {
        request(`/phones/${IdFirstPromise}.json`)
          .then(details => {
            // eslint-disable-next-line no-console
            console.log(details);
          });
      });

    getAllSuccessfulDetails(phonesIds)
      // eslint-disable-next-line no-console
      .then(arrDetails => console.log(arrDetails));

    // getThreeFastestDetails(phonesIds)
    //   // eslint-disable-next-line no-console
    //   .then(results => console.log(results));
  });

function getFirstReceivedDetails(ids) {
  ids.forEach(id => {
    const newPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve(id);
      }, Math.round(Math.random() * 1000));
    });

    arrPromises.push(newPromise);
  });

  return Promise.race(arrPromises);
}

function getAllSuccessfulDetails(arrIds) {
  return Promise.all(
    arrIds.map(id => {
      return request(`/phones/${id}.json`)
        .then(response => response);
    })
  );
}

// function getThreeFastestDetails(arrayIds) {
//   arrayIds.forEach(id => {
//     const newPromise = new Promise(resolve => {
//       setTimeout(() => {
//         resolve(id);
//       }, Math.round(Math.random() * 1000));
//     });

//     arrPromisesWith3Element.push(newPromise);
//   });

//   return Promise.all(arrPromisesWith3Element);
// }
