'use strict';

// Endpoints
const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api/';

// Request
const request = (url) => {
  return fetch(BASE_URL + url)
    .then(result => {
      if (!result.ok) {
        throw new Error(`${result.status}`);
      }

      return result.json();
    });
};

// Show views
function showMessage(msg, isResolved) {
  const container = document.createElement('p');

  container.className = isResolved ? 'message-success' : 'message-error';
  container.innerHTML = msg;

  document.querySelector('.message').append(container);
};

// Variants of recieving info
function getFirstReceivedDetails(ids) {
  return Promise.race(
    ids.map(id => {
      return new Promise(resolve => {
        resolve(request(`/phones/${id}.json`));
      });
    })
  ).catch(err => showMessage('Error: ', err, false));
}

function getAllSuccessfulDetails(ids) {
  return Promise.allSettled(
    ids.map(id => {
      return new Promise(resolve => {
        resolve(request(`/phones/${id}.json`));
      });
    })
  ).then(data => data.filter(
    item => item.status === 'fulfilled')
  ).catch(err => showMessage('Error: ', err, false));
}

// Tests
document.addEventListener('DOMContentLoaded', () => {
  const msgBlock = document.createElement('div');

  msgBlock.className = 'message';

  document.querySelector('.logo').after(msgBlock);

  const showData = (data, className, title) => {
    const firstReceived = document.createElement('div');

    firstReceived.className = className;
    firstReceived.innerHTML = `<h2 class="li-header">${title}</h2><ul></ul>`;

    data.forEach(item => {
      firstReceived.querySelector('ul').insertAdjacentHTML('beforeend', `
        <li>${item.name}<br><span>ID "${item.id.toUpperCase()}</span></li>
      `);
    });

    document.body.append(firstReceived);
  };

  request('/phones.json')
    .then(list => list.map(item => item.id))
    .then(ids => {
      getFirstReceivedDetails(ids)
        .then(result => {
          const phoneData = [{
            id: result.id, name: result.name,
          }];

          showData(phoneData, 'first-received', 'First Received');
        });

      getAllSuccessfulDetails(ids)
        .then(result => {
          const phonesData = result.map(
            item => ({
              id: item.value.id, name: item.value.name,
            })
          );

          showData(phonesData, 'all-successful', 'All Successful');
        });
    })
    .catch(err => showMessage('Error: ', err, false));
});
