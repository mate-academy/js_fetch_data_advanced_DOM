'use strict';

const BASE_URL = `https://mate-academy.github.io/phone-catalogue-static/api`;

const request = (url) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        Promise.reject(new Error(`
          ${response.status} - ${response.statusText}
          `));
      }

      return response.json();
    });
};

function showMessages(divClassName, header, arr) {
  const div = document.createElement(`div`);
  const h3 = document.createElement(`h3`);
  const ul = document.createElement(`ul`);

  div.className = divClassName;
  h3.textContent = header;
  div.append(h3);
  div.append(ul);

  arr.forEach(el => {
    ul.insertAdjacentHTML('beforeend', `
    <li>${el.name}</li>
    <li>${el.id.toUpperCase()}</li>
    `);
  });
  document.body.append(div);
}

const getFirstReceivedDetails = () => {
  return getPhones()
    .then(arr => Promise.race(
      arr.map(phone => getDetailsOfPhone(phone.id)
      )
    ));
};

const getAllSuccessfulDetails = () => {
  return getPhones()
    .then(arr => Promise.all(
      arr.map(phone => getDetailsOfPhone(phone.id)
      )
    ));
};

const getPhones = () => request(`/phones.json`);
const getDetailsOfPhone = (phoneId) => request(`/phones/${phoneId}.json`);

getFirstReceivedDetails()
  .then(result => {
    showMessages(`first-received`, `First Received`, [result]);
  })
  .catch(error => console.log(`Error:`, error));

getAllSuccessfulDetails()
  .then(result => {
    showMessages(`all-successful`, `All Successful`, result);
  })
  .catch(error => console.log(`Error:`, error));
