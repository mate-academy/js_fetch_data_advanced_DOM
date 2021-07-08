'use strict';

const idURL = 'https://mate-academy.github.io/'
+ 'phone-catalogue-static/api/phones/';
const url = 'https://mate-academy.github.io/'
+ 'phone-catalogue-static/api/phones.json';

const ids = getAllIds();

ids
  .then(result => {
    const phonesIds = result.map(phone => phone.id);

    const firstReceivedDetails = getFirstReceivedDetails(phonesIds);

    const allSuccessfulReceivedDetails = getAllSuccessfulDetails(phonesIds);

    const threeFastestDetails = getThreeFastestDetails(phonesIds);

    firstReceivedDetails
      .then(details => {
        const firstReceivedPhone = document.createElement('div');
        const header = document.createElement('h1');
        const phonesList = document.createElement('ul');
        const li = document.createElement('li');

        firstReceivedPhone.className = 'first-received';
        header.innerText = 'First Received';
        firstReceivedPhone.append(header);
        firstReceivedPhone.append(phonesList);
        li.innerText = `Name: ${details.name},\n Id: ${details.id}`;
        phonesList.append(li);

        document.body.append(firstReceivedPhone);
      });

    allSuccessfulReceivedDetails
      .then(responses => {
        const successfulResponses = responses.filter(response => {
          return response.status === 'fulfilled';
        });

        const allSuccesfulReceivedPhones = document.createElement('div');
        const header = document.createElement('h1');
        const receviedPhones = document.createElement('ul');

        allSuccesfulReceivedPhones.className = 'all-successful';
        header.innerText = 'All Successful';
        allSuccesfulReceivedPhones.append(header);
        allSuccesfulReceivedPhones.append(receviedPhones);

        successfulResponses.forEach(successfulResponse => {
          const li = document.createElement('li');

          li.innerText = `Name: ${successfulResponse.value.name},`
          + `\n Id: ${successfulResponse.value.id.toUpperCase()}`;
          receviedPhones.append(li);
        });

        document.body.append(allSuccesfulReceivedPhones);
      });

    threeFastestDetails
      .then(phones => phones);
  });

function getFirstReceivedDetails(phonesIds) {
  const requests = phonesIds.map(phoneId => {
    return fetch(idURL + `${phoneId}.json`)
      .then(response => response.json());
  });

  return Promise.race(requests);
}

function getAllSuccessfulDetails(phonesIds) {
  const requests = phonesIds.map(phoneId => {
    return fetch(idURL + `${phoneId}.json`)
      .then(response => response.json());
  });

  return Promise.allSettled(requests);
}

function getThreeFastestDetails(phonesIds) {
  const phonesDetails = [];

  const requests = phonesIds.map(phoneId => {
    return fetch(idURL + `${phoneId}.json`)
      .then(response => response.json())
      .then(phoneDetails => {
        if (phonesDetails.length < 3) {
          phonesDetails.push(phoneDetails);
        }
      });
  });

  return Promise.all(requests);
}

function getAllIds() {
  return fetch(url)
    .then(response => response.json());
}
