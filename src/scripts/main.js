'use strict';

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';

getPhoneIds()
  .then(getFirstReceivedDetails)
  .then(detail => showNotification('first-received', detail))
  .catch(error => showError('First received failed', error));

getPhoneIds()
  .then(getAllSuccessfulDetails)
  .then(details => showNotification('all-successful', details))
  .catch(error => showError('All successful failed', error));

getPhoneIds()
  .then(ids => getNFastestDetails(ids, 3))
  .then(details => showNotification('fastest', details))
  .catch(error => showError('N fastest failed', error));

function request(url) {
  return fetch(`${BASE_URL}${url}`)
    .catch(error => alert(error));
}

function getFirstReceivedDetails(ids) {
  return Promise.race(ids.map(id => request(`/phones/${id}.json`)))
    .then(detail => detail.json());
}

function getAllSuccessfulDetails(ids) {
  return Promise.allSettled(ids.map(id => request(`/phones/${id}.json`)))
    .then(responses => {
      return Promise.all(
        responses.filter(response => response.status === 'fulfilled')
          .map(response => response.value.json())
      );
    });
}

async function getNFastestDetails(ids, count) {
  const unusedIds = [...ids];
  const result = [];

  for (let i = 0; i < count; i++) {
    const phone = await getFirstReceivedDetails(unusedIds);
    const idx = unusedIds.findIndex(id => id === phone.id);

    unusedIds.splice(idx, 1);
    result.push(phone);
  }

  return Promise.all(result);
}

const getPhonesListItems = (phones) => {
  if (Array.isArray(phones)) {
    return phones.map(
      phone => `<li>${phone.id.toUpperCase()} - ${phone.name}</li>`
    ).join('');
  }

  return `<li>${phones.id.toUpperCase()} - ${phones.name}</li>`;
};

function showNotification(type, phones) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class=${type}>
      <h3>
      ${type.split('-').map(
    e => e.slice(0, 1).toUpperCase() + e.slice(1)
  ).join(' ')}
      </h3>
      <ul>
        ${getPhonesListItems(phones)}
      </ul>
      </div>
  `);
}

function showError(type, error) {
  document.body.insertAdjacentHTML('beforeend', `
    <div class="error">
      <h3>${type}</h3>
      <p>${error}</p>
    </div>
  `);
}

function getPhoneIds() {
  return request('/phones.json')
    .then(phones => phones.json())
    .then(phones => phones.map(phone => phone.id));
}
