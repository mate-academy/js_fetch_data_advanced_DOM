'use strict';

const list = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones.json';
const detailLink = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones/';

const request = (link) => {
  return fetch(link)
    .then(response => {
      if (!response.ok
        || !response.headers.get('content-type').includes('application/json')
      ) {
        return Promise.reject(new Error('Error'));
      }

      return response.json();
    })
    .then(response => {
      const arrayID = response.map(element => {
        return element.id;
      });

      return Promise.resolve(arrayID);
    });
};

function getFirstReceivedDetails(array) {
  return Promise.race(array.map(id => {
    return fetch(detailLink + `${id}.json`)
      .then(response => response.json())
      .then(response => `ID: ${response.id}`);
  }));
}

function getAllSuccessfulDetails(array) {
  return Promise.all(array.map(id => {
    return fetch(detailLink + `${id}.json`)
      .then(response => response.json())
      .then(response => `ID: ${response.id}`);
  }));
}

function getThreeFastestDetails(array) {
  const detail = array.map(id => {
    return fetch(detailLink + `${id}.json`)
      .then(response => response.json());
  });

  return Promise.all([Promise.race(detail),
    Promise.race(detail), Promise.race(detail)])
    .then(response => response.map(el => `ID: ${el.id}`));
}

function createList(className, heading) {
  document.body.insertAdjacentHTML('afterbegin',
    `<ul class="${className}">
        <h2>${heading}</h2>
    </ul>`);
}

function createLi(className, text) {
  document.body.querySelector(`.${className}`).insertAdjacentHTML(
    'beforeend',
    `<li>${text}</li>`
  );
}

function handler(func, response, className, message) {
  func(response)
    .then(phoneDetail => {
      createList(className, message);

      for (const i of phoneDetail) {
        createLi(className, i);
      }
    });
}

request(list)
  .then(response => {
    getFirstReceivedDetails(response)
      .then(phoneDetail => {
        createList('first-received', 'First successful');
        createLi('first-received', phoneDetail);
      });

    handler(getAllSuccessfulDetails, response, 'all-successful',
      'All successful');

    handler(getThreeFastestDetails, response, 'first-three-successful',
      'First three successful');
  })
  .catch(error => {
    return error;
  });
