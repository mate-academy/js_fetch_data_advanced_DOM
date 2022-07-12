'use strict';

const { ENDPOINTS, request } = require('./requests');
const body = document.body;

const elementMaker = (className, title, data) => {
  body.insertAdjacentHTML('beforeend', `
    <div class="${className}">
      <h3>${title}</h3>
      <ul>
        ${data.map(el => `<li>${el.name}</li>`).join('')}
      </ul>
    </div>
  `);
};

const getFirstReceivedDetails = (ids) => {
  Promise.race(ids.map(id => request(ENDPOINTS.phoneById(id))))
    .then(res => {
      elementMaker('first-received', 'First Fastest', [res]);
    });
};

const getAllSuccessfulDetails = (ids) => {
  Promise.allSettled(ids.map(id => request(ENDPOINTS.phoneById(id))))
    .then(res => {
      elementMaker('all-successful', 'All Successful',
        res.filter(item => item.status === 'fulfilled')
          .map(phone => phone.value));
    });
};

const getThreeFastestDetails = (ids) => {
  const promises = [];

  for (let i = 0; i < 3; i++) {
    promises.push(Promise.race(
      ids.map(id => request(ENDPOINTS.phoneById(id)))
    ));
  }

  Promise.all(promises).then(res => console.log(res)); // eslint-disable-line
};

request(ENDPOINTS.phones)
  .then(phones => {
    const phonesIds = [];

    phones.forEach(phone => phonesIds.push(phone.id));

    getFirstReceivedDetails(phonesIds);
    getAllSuccessfulDetails(phonesIds);
    getThreeFastestDetails(phonesIds);
  });
