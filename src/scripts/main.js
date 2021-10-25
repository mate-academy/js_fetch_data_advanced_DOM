'use strict';

const url = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';
const body = document.querySelector('body');
const ids = [];
const names = [];

fetch(`${url}.json`).then(response => {
  if (response.ok) {
    return response.json();
  }
})

  .then(data => {
    data.forEach(element => {
      ids.push(element.id);
      names.push(element.name);
    });

    function getFirstReceivedDetails(idArray) {
      const div = document.createElement('div');

      div.classList.add('first-received');

      const all = [];

      idArray.forEach(phone => {
        all.push(fetch(`${url}/${phone}.json`));
      });

      Promise.race(all).then(response => response.json())
        .then(value => {
          div.innerHTML = `
            <th>First Received</th></br>
            ${value.id}</br>
            ${value.name}
          `;
        });

      body.appendChild(div);
    }

    getFirstReceivedDetails(ids);

    function getAllSuccessfulDetails(idArray) {
      const div = document.createElement('div');

      div.classList.add('all-successful');
      div.innerHTML = 'All Successful<br>';

      const all = [];

      idArray.forEach(phone => {
        all.push(fetch(`${url}/${phone}.json`));
      });

      Promise.all(all).then(result => {
        for (const response of result) {
          response.json().then(value => {
            div.innerHTML += `
              ${value.id.toUpperCase()}<br>
              ${value.name}<br><br>
            `;
          });
        }
      });

      body.appendChild(div);
    }

    getAllSuccessfulDetails(ids);
  });
