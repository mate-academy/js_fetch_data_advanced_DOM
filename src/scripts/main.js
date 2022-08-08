'use strict';

const base
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const body = document.querySelector('body');

const request = (url) => {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        return `${response.status} - ${response.statusText}`;
      }

      return response.json();
    });
};

const getId = (url, id) => request(`${url}/${id}.json`);

const getFirstReceivedDetails = () => {
  request(`${base}.json`).then(data => {
    getId(base, data[0].id).then(phone => {
      body.insertAdjacentHTML('beforeend',
        `<div class="first-received">
            <h3>First Received</h3>
            <ul>
              <li class="li-header">Id: ${phone.id} Name: ${phone.name}</li>
            </ul>
          </div>`
      );
    });
  });
};

const getAllSuccessfulDetails = () => {
  request(`${base}.json`).then(data => {
    body.insertAdjacentHTML('beforeend',
      `<div class="all-successful">
          <h3>All Successful</h3>
          <ul>
          </ul>
        </div>`
    );

    const li = body.querySelector('.all-successful');

    data.map(phone => {
      getId(base, phone.id).then(phonefulDetails => {
        li.insertAdjacentHTML('beforeend',
          `<li class="li-header">
            Id: ${phonefulDetails.id.toUpperCase()}
            Name: ${phonefulDetails.name}
          </li>`
        );
      });
    });
  });
};

getFirstReceivedDetails();
getAllSuccessfulDetails();
