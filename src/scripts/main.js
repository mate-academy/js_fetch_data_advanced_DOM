'use strict';

const
  BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

function request(url = '') {
  return fetch(`${BASE_URL}${url}.json`)
    .then(response => {
      if (!response.ok) {
        throw Error(response.status);
      }

      return response.json();
    });
}

function getPhonesIds() {
  return request()
    .then(phones => phones.map(phone => phone.id));
}

function showResult(type, title, resultsArr) {
  const div = document.createElement('div');
  const header = document.createElement('h1');
  const list = document.createElement('ul');

  for (const phone of resultsArr) {
    const phoneId = document.createElement('li');
    const phoneName = document.createElement('li');

    phoneId.classList.add('li-header');
    phoneId.innerText = `Phone ID: ${phone.id.toUpperCase()}`;
    phoneName.innerText = `Phone Name: ${phone.name}`;
    list.append(phoneId, phoneName);
  }

  div.classList.add(type);
  header.innerText = title;

  div.append(header, list);
  document.body.append(div);
}

function showError(type, title, error) {
  const div = document.createElement('div');
  const header = document.createElement('h1');
  const message = document.createElement('p');

  div.classList.add(type);
  header.innerText = title;
  message.innerText = error;

  div.append(header, message);
  document.body.append(div);
}

function getFirstReceivedDetails(phonesList) {
  return Promise.any(phonesList.map(id => request(`/${id}`)))
    .then(result => [result])
    .catch(() => {
      throw Error('Error on load phones details');
    });
};

function getAllSuccessfulDetails(phonesList) {
  return Promise.allSettled(phonesList.map(id => request(`/${id}`)))
    .then(results => {
      const successful = [];

      results.forEach(result => {
        if (result.status === 'fulfilled') {
          successful.push(result.value);
        }
      });

      if (successful.length === 0) {
        throw Error('Error on load phones details');
      }

      return successful;
    });
}

function getThreeFastestDetails(phonesList) {
  const phonesListClone = [ ...phonesList ];
  const firstThree = [];

  return getFirstReceivedDetails(phonesListClone)
    .then(result => {
      firstThree.push(result[0]);
      phonesListClone.splice(phonesListClone.indexOf(result[0].id), 1);
    })
    .catch(() => {})
    .then(() => getFirstReceivedDetails(phonesListClone))
    .then(result => {
      firstThree.push(result[0]);
      phonesListClone.splice(phonesListClone.indexOf(result[0].id), 1);
    })
    .catch(() => {})
    .then(() => getFirstReceivedDetails(phonesListClone))
    .then(result => {
      firstThree.push(result[0]);
      phonesListClone.splice(phonesListClone.indexOf(result[0].id), 1);
    })
    .catch(() => {})
    .then(() => {
      if (firstThree.length === 0) {
        throw Error('Error on load phones details');
      }

      return firstThree;
    });
}

getPhonesIds()
  .then(list => {
    getFirstReceivedDetails(list)
      .then(result => showResult('first-received', 'First Received', result))
      .catch((error) => showError('first-received', 'First Received', error));

    return list;
  })
  .then(list => {
    getAllSuccessfulDetails(list)
      .then(result => showResult('all-successful', 'All Successful', result))
      .catch((error) => showError('all-successful', 'All Successful', error));

    return list;
  })
  .then(list => {
    getThreeFastestDetails(list)
      .then(result => showResult(
        'first-three-received',
        'First Three Received',
        result
      ))
      .catch((error) => showError(
        'first-three-received',
        'First Three Received',
        error
      ));
  })
  .catch(error => showError('error', 'Error on load phones IDs', error));
