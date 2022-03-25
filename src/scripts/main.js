'use strict';

const phonesUrl
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
const phonesDetailsUrl
  = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';

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

function getPhonesDetails(phonesDataArray) {
  const phoneDetailsArray = [];

  for (const phone of phonesDataArray) {
    fetch(`${phonesDetailsUrl}${phone}.json`)
      .then(response => response.json())
      .then(phoneDetails => {
        phoneDetailsArray.push(phoneDetails);

        makeDom(phoneDetails.id, phoneDetails.name,
          'All Successful', 'all-successful');
      })
      .catch(error => {
        alert('Error:', error);
      });
  }

  return phoneDetailsArray;
}

// the function below is suitable for one fastest response
// and some fastest responces as well (not exactly 3)

function getSomeFastestResponses(phonesDataArray, numberOfResponses) {
  const promisesArray = [];
  const someFastestArray = [];
  const phoneDetailsArray = [];

  let fastestResponse;

  for (const phone of phonesDataArray) {
    const response = fetch(`${phonesDetailsUrl}${phone}.json`);

    promisesArray.push(response);
  }

  for (let i = 0; i < numberOfResponses; i++) {
    fastestResponse = getTheFastestResponse(promisesArray);
    someFastestArray.push(fastestResponse);
  }

  for (const phone of someFastestArray) {
    phone.then(response => response.json())
      .then(phoneDetails => {
        phoneDetailsArray.push(phoneDetails);

        makeDom(phoneDetails.id, phoneDetails.name,
          'First received', 'first-received');
      })
      .catch(error => {
        alert('Error:', error);
      });
  }

  return phoneDetailsArray;
}

function getTheFastestResponse(promises) {
  const result = Promise.race(promises);

  for (let i = 0; i < promises.length; i++) {
    if (promises[i].id === result.id) {
      promises.splice(i, 1);
      break;
    }
  }

  return result;
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
  getSomeFastestResponses(phones.map(element => element.id), 3);
});

getPhones(phonesUrl).then(phones => {
  getPhonesDetails(phones.map(element => element.id));
});
