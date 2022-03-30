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

      return response.json();
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

function getAllSuccessfulDetails(phonesID) {
  const phoneDetailsArray = [];
  const promisesArray = [];

  for (const id of phonesID) {
    promisesArray.push(fetch(`${phonesDetailsUrl}${id}.json`));
  }

  Promise.allSettled(promisesArray).then((responses) => {
    const successfullResponses
    = responses.filter((response) => response.status === 'fulfilled');

    for (const result of successfullResponses) {
      result.value.json().then(phoneDetails => {
        phoneDetailsArray.push(phoneDetails);

        makeDom(phoneDetails.id, phoneDetails.name,
          'All Successful', 'all-successful');
      });
    }
  });

  return phoneDetailsArray;
}

function getThreeFastestDetails(phonesID) {
  const promisesArray = [];
  const threeFastestArray = [];
  const phonesIdCopy = [...phonesID];

  for (const id of phonesID) {
    promisesArray.push(fetch(`${phonesDetailsUrl}${id}.json`));
  }

  let fastestResponse;

  for (let i = 0; i < 3; i++) {
    fastestResponse = Promise.race(promisesArray);

    threeFastestArray.push(fastestResponse);

    fastestResponse.then(element => {
      for (let j = 0; j < phonesIdCopy.length; j++) {
        if (`${phonesDetailsUrl}${phonesIdCopy[j]}.json`
        === element.url) {
          promisesArray.splice(j, 1);
          phonesIdCopy.splice(j, 1);
          break;
        }
      }
    });
  }

  for (const phone of threeFastestArray) {
    phone.then(response => response.clone().json())
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

getPhones(phonesUrl).then(phones => {
  getFirstReceivedDetails(phones.map(element => element.id));
});

getPhones(phonesUrl).then(phones => {
  getAllSuccessfulDetails(phones.map(element => element.id));
});

getPhones(phonesUrl).then(phones => {
  getThreeFastestDetails(phones.map(element => element.id));
});
