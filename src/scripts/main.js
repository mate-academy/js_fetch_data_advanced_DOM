'use strict';

const link
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const request = (url) => {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        setTimeout(() => {
          return Promise.reject(
            new Error(`${response.status} - not found`)
          );
        }, 5000);
      }

      return response.json();
    });
};

const getPhones = (url) => request(`${url}.json`);

const getPhonesDetails = (url, id) => request(`${url}/${id}.json`);

const body = document.querySelector('body');

const getFirstReceivedDetails = () => {
  getPhones(link).then(data => {
    getPhonesDetails(link, data[0].id).then(phone => {
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
  getPhones(link).then(data => {
    body.insertAdjacentHTML('beforeend',
      `<div class="all-successful">
        <h3>All Successful</h3>
        <ul>
        </ul>
      </div>`
    );

    const list = body.querySelector('.all-successful>ul');

    data.map(phone => {
      getPhonesDetails(link, phone.id).then(phoneDetail => {
        list.insertAdjacentHTML('beforeend',
          `<li class="li-header">
            Id: ${phoneDetail.id.toUpperCase()}
            Name: ${phoneDetail.name}
          </li>`
        );
      });
    });
  });
};

getFirstReceivedDetails();
getAllSuccessfulDetails();
