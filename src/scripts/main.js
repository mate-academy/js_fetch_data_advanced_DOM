'use strict';

const listUrl = `https://mate-academy.github.io/`
+ `phone-catalogue-static/api/phones.json`;

const body = document.querySelector('body');

const getPhones = () => {
  return fetch(listUrl)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(`${response.status}`));
      }

      return response.json();
    });
};

const getFirstReceivedDetails = () => {
  getPhones()
    .then(response => Promise.race(response))
    .then(phone => {
      body.insertAdjacentHTML('afterbegin', `
      <div class = "first-received">
        <h3>First Received</h3>
        <p>${phone.name}</p>
      </div>
      `);
    });
};

const getAllSuccessfulDetails = () => {
  getPhones()
    .then(response => Promise.all(response))
    .then(phones => {
      const ul = document.createElement('ul');
      const div = document.createElement('div');
      const title = document.createElement('h3');

      title.innerText = 'All Successful';

      div.className = 'all-successful';
      div.append(title);
      div.append(ul);

      for (const phone of phones) {
        const li = document.createElement('li');

        li.innerText = phone.name;
        ul.append(li);
      }
      body.append(div);
    });
};

const getThreeFastestDetails = () => {
  getPhones()
    .then(response => Promise.all(response))
    .then(phones => {
      const ul = document.createElement('ul');
      const div = document.createElement('div');
      const title = document.createElement('h3');

      title.innerText = 'Three Fastest';
      div.className = 'three-fastest';
      div.append(title);
      div.append(ul);

      for (let i = 0; i < 3; i++) {
        const li = document.createElement('li');

        li.innerText = phones[i].name;
        ul.append(li);
      }
      body.append(div);
    });
};

getPhones()
  .then(getFirstReceivedDetails)
  .then(getAllSuccessfulDetails)
  .then(getThreeFastestDetails);
