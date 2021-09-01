'use strict';

const phonesUrl = `
  https://mate-academy.github.io/phone-catalogue-static/api/phones.json`;
const detailsUrl = `
  https://mate-academy.github.io/phone-catalogue-static/api/phones/`;

const getPhonesId = () => {
  return fetch(phonesUrl).then(response => response.json());
};

const getPhoneDetail = (id) => {
  return fetch(`${detailsUrl}` + `${id}.json`)
    .then(response => response.json());
};

const getFirstReceivedDetails = (arr) => {
  Promise.race([...arr])
    .then(res => {
      document.body.insertAdjacentHTML('afterbegin', `
      <div class="first-received">
      <h2>First Received</h2>
      <span>${res.name}</span>
      </div>`);
    });
};

const getAllSuccessfulDetails = (arr) => {
  Promise.allSettled([...arr])
    .then(res => {
      const fulfilled = res.map((item) => {
        if (item.status === 'fulfilled') {
          return item.value;
        }
      });

      document.body.insertAdjacentHTML('afterbegin', `
      <div class="all-successful">
      <h2>All Successful</h2>
      <ul></ul>
      </div>`);

      const ul = document.querySelector('ul');

      ul.innerHTML = fulfilled.map(item => `<li>${item.name}</li>`).join('');
    });
};

const getThreeFastestDetails = (arr) => {
  const phoneArr = [];

  Promise.all([...arr])
    .then(res => {
      for (let i = 0; i < 3; i++) {
        phoneArr.push(Promise.race(res).then(item => item));
      }
    });
};

getPhonesId().then(phoneList => {
  const phonesId = phoneList.map(phone => getPhoneDetail(phone.id));

  getFirstReceivedDetails(phonesId);
  getAllSuccessfulDetails(phonesId);
  getThreeFastestDetails(phonesId);
});
