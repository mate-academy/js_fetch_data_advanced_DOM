import { getPhone } from './fetchData';

const body = document.querySelector('body');
let successful;

function getFirstReceivedDetails(ids) {
  return Promise.any(ids.map(id => getPhone(id)));
}

function getAllSuccessfulDetails(ids) {
  successful = [];

  return Promise.allSettled(ids.map(id => {
    return getPhone(id).then(response => successful.push(response));
  }));
}

getFirstReceivedDetails(['motorola-xoom-with-wi-fi',
  'dell-venue', 'lg-axis'])
  .then(response => {
    body.insertAdjacentHTML('afterbegin', `
      <ul class="first-received">
        <li class="li-header">First Received</li>
        <li>${response.id}: ${response.name}</li>
      </ul>
    `);
  });

getAllSuccessfulDetails(['motorola-xoom-with-wi-fi',
  'dell-venue', 'lg-axis'])
  .then(() => {
    const list = document.createElement('ul');

    list.classList.add('all-successful');

    list.insertAdjacentHTML('afterbegin',
      '<li class="li-header">All Successful</li>');

    successful.forEach(phone => list.insertAdjacentHTML('beforeend', `
      <li>${phone.id}: ${phone.name}</li>
    `));

    body.prepend(list);
  });
