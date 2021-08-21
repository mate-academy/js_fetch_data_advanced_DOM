'use strict';

// write code here\
const body = document.querySelector('body');
const url = '//mate-academy.github.io/phone-catalogue-static/api/phones';

const phonesArr = () => {
  return fetch(url + '.json')
    .then(response => response.json())
    .catch(error => error);
};

const phonesDetails = (id) => {
  return fetch(url + `/${id}.json`)
    .then(request => request.json());
};

const getFirstReceivedDetails = (arr) => {
  Promise.race(arr.map(id => phonesDetails(id)))
    .then(response => {
      body.insertAdjacentHTML('afterbegin', `
      <div class="first-received">
       <h2>First Received</h2>
       <p>${response.name}</p>
      </div>
      `);
    });
};

const getAllSuccessfulDetails = (arr) => {
  Promise.allSettled(arr.map(id => phonesDetails(id)))
    .then(response => {
      body.insertAdjacentHTML('afterbegin', `
      <div class="all-successful">
       <h2>All Successful</h2>
       <ul></ul>
      </div>
      `);

      const ul = document.querySelector('ul');

      ul.innerHTML = response.map(phone => `<li>${phone.value.name}</li>`)
        .join('');
    });
};

phonesArr()
  .then(list => {
    const idArr = list.map(item => item.id);

    getFirstReceivedDetails(idArr);
    getAllSuccessfulDetails(idArr);
  });
