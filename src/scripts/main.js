'use strict';

const BASE_URL
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const firstReceivedUl = document.querySelector('.first-received-ul');
const firstThreeReceivedUl = document.querySelector('.first-three-received-ul');
const allSuccesfulUl = document.querySelector('.all-successful-ul');

getPhones(`${BASE_URL}.json`)
  .then(phones => {
    const idArr = phones.map(phone => phone.id);

    getFirstReceivedDetails(idArr);
    getAllSuccessfulDetails(idArr);
    getThreeFastestDetails(idArr);
  })
  .catch(error => new Error(error));

function getThreeFastestDetails(phoneIds) {
  const promises = phoneIds.map(phoneId => {
    return request(`${BASE_URL}/${phoneId}.json`);
  });

  Promise.any(promises.map((p, i) => p.then(v => [v, i])))
    .then(([phone, index]) => {
      renderPhone(phone, firstThreeReceivedUl);
      promises.splice(index, 1);

      Promise.any(promises.map((p, i) => p.then(v => [v, i])))
        .then(([phone2, index2]) => {
          renderPhone(phone2, firstThreeReceivedUl);
          promises.splice(index2, 1);

          Promise.any(promises.map((p, i) => p.then(v => [v, i])))
            .then(([phone3, index3]) => {
              renderPhone(phone3, firstThreeReceivedUl);
            });
        });
    });
}

function renderPhone(phone, ul) {
  const li = document.createElement('li');
  const h3 = document.createElement('h3');

  h3.innerText = phone.name;
  li.appendChild(h3);
  ul.appendChild(li);
}

function getFirstReceivedDetails(phoneIds) {
  const promises = phoneIds.map(phoneId => {
    return request(`${BASE_URL}/${phoneId}.json`);
  });

  Promise.any(promises)
    .then(phone => {
      renderPhone(phone, firstReceivedUl);
    });
}

function getAllSuccessfulDetails(phoneIds) {
  const promises = [];

  phoneIds.forEach(phoneId => {
    promises.push(request(`${BASE_URL}/${phoneId}.json`));
  });

  Promise.all(promises)
    .then(phones => {
      phones.forEach(phone => {
        renderPhone(phone, allSuccesfulUl);
      });
    });
}

function request(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(
          Error(`Error: ${response.status} - ${response.statusText}`)
        );
      }

      if (!response.headers.get('content-type').includes('application/json')) {
        return Promise.reject(
          Error('Error: Content type is not supported!')
        );
      }

      return response.json();
    });
}

function getPhones(url) {
  return request(url);
}
