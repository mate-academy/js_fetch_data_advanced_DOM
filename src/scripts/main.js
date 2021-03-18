'use strict';

const urls
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';

const getAllSuccessfulDetails = () => {
  return new Promise((resolve, reject) => {
    fetch(urls)
      .then(response => response.json())
      .then(response => Promise.all(response))
      .then(response => resolve(response.map(item => item.id)));
  });
};

const renderingDomForAllPhones = (dataFromServer) => {
  const div = document.createElement('div');

  div.classList.add('all-successful');

  div.insertAdjacentHTML('afterbegin', `
    <h3>All Successful</h3>
    <ul>
      ${dataFromServer.map(phone => (
    `<li>${phone.toUpperCase()}</li>`)
  ).join(' ')}
    </ul>
  `);

  document.body.append(div);
};

const getFirstReceivedDetails = () => {
  return new Promise((resolve, reject) => {
    fetch(urls)
      .then(response => response.json())
      .then(response => Promise.race(response))
      .then(response => resolve(response.id));
  });
};

const renderingDomForFirstPhone = (url) => {
  const div = document.createElement('div');

  div.classList.add('first-received');

  div.insertAdjacentHTML('afterbegin', `
    <h3>First Received</h3>
    <ul>
      <li>${url}</li>
    </ul>
  `);

  document.body.append(div);
};

getAllSuccessfulDetails()
  .then(renderingDomForAllPhones);

getFirstReceivedDetails()
  .then(renderingDomForFirstPhone);
