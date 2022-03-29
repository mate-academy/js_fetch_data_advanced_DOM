'use strict';

const phonesUrl
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const phonesDetailsUrl
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';

// this function is necessary only for phones ids receiving

function getPhones(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        setTimeout(() => {
          // throw `${response.status} - ${response.statusText}`;
        }, 5000);
      }

      return response.json()
        .then(phones => phones.map(element => element.id));
    });
}

function getFirstReceivedDetails(phonesID) {
  const promisesArray = [];

  for (const id of phonesID) {
    promisesArray.push(fetch(`${phonesDetailsUrl}${id}.json`));
  }

  const firstReceived = Promise.race(promisesArray);

  firstReceived.then(response => response.json())
    .then(phoneDetails => {
      makeDom(phoneDetails.id, phoneDetails.name,
        'First received', 'first-received');
    })
    .catch(error => {
      makeDom('Error:', error);
    });

  return firstReceived;
}

function getAllSuccessfulDetails(phonesDataArray) {
  const phoneDetailsArray = [];

  // Promise.all isn't suitable here because
  // we should receive data even if one of the promises would be rejected

  for (const phone of phonesDataArray) {
    fetch(`${phonesDetailsUrl}${phone}.json`)
      .then(response => response.json())
      .then(phoneDetails => {
        phoneDetailsArray.push(phoneDetails);

        makeDom(phoneDetails.id, phoneDetails.name,
          'All Successful', 'all-successful');
      })
      .catch(error => {
        makeDom('rejected', 'rejected', 'Error', error);

        return error;
      });
  }

  return phoneDetailsArray;
}

function getThreeFastestDetails(phonesID) {
  const promisesArray = [];
  const threeFastestArray = [];

  for (const id of phonesID) {
    promisesArray.push(fetch(`${phonesDetailsUrl}${id}.json`));
  }

  for (let i = 0; i < 3; i++) {
    const fastestResponse = Promise.race(promisesArray);

    threeFastestArray.push(fastestResponse);

    for (let j = 0; j < promisesArray.length; j++) {
      if (promisesArray[j].url === fastestResponse.url) {
        promisesArray.splice(j, 1);
        break;
      }
    }
  }

  for (const phone of threeFastestArray) {
    phone.then(response => response.json())
      .then(phoneDetails => {
        makeDom(phoneDetails.id, phoneDetails.name,
          'First three received', 'first-three-received');
      })
      .catch(error => {
        makeDom('rejected', 'rejected', 'Error', error);
      });
  }

  return threeFastestArray;
}

function makeDom(elementId, elementName, header, nameOfClass) {
  const body = document.querySelector('body');

  if (!document.querySelector(`.${nameOfClass}`)) {
    const elemContainer = document.createElement('div');
    const currentHeader = document.createElement('h2');
    const currentList = document.createElement('ul');

    currentHeader.innerHTML = header;

    elemContainer.classList.add(nameOfClass);

    body.append(elemContainer);
    elemContainer.appendChild(currentHeader);
    elemContainer.appendChild(currentList);

    currentList.insertAdjacentHTML('beforeend',
      `<li>ID: ${elementId}<br>
      Name: ${elementName}</li>`);
  } else {
    const currentContainer = document.querySelector(`.${nameOfClass}`);
    const phonesList = currentContainer.querySelector('ul');

    phonesList.insertAdjacentHTML('beforeend',
      `<li>ID: ${elementId}<br>
      Name: ${elementName}</li>`);
  }
}

getPhones(phonesUrl).then(phonesId => {
  getFirstReceivedDetails(phonesId);
});

getPhones(phonesUrl).then(phonesId => {
  getAllSuccessfulDetails(phonesId);
});

getPhones(phonesUrl).then(phonesId => {
  getThreeFastestDetails(phonesId);
});
