'use strict';

const contentDiv = document.createElement('dv');
const firstReceivedH3 = document.createElement('h3');
const AllReceivedH3 = document.createElement('h3');
const ulFirstReceived = document.createElement('ul');
const ulAllReceived = document.createElement('ul');

contentDiv.classList.add('first-received', 'all-successful');
document.body.appendChild(contentDiv);

firstReceivedH3.innerText = 'First Received';
AllReceivedH3.innerText = 'All Successful';

contentDiv.appendChild(firstReceivedH3);
contentDiv.appendChild(ulFirstReceived);
contentDiv.appendChild(AllReceivedH3);
contentDiv.appendChild(ulAllReceived);

const baseURL = 'https://mate-academy.github.io/phone-catalogue-static/api';
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 500);

const getData = (url) => {
  const fetchResponse = fetch(url, { signal: controller.signal })
    .then((response) => {
      if (!response.ok) {
        Promise.reject(Error(`${response.status} - ${response.statusText}`));
      }

      if (!response.headers.get('content-type').includes('application/json')) {
        Promise.reject(Error('Content-type is not JSON'));
      }

      clearTimeout(timeoutId);

      return response.json();
    });

  return fetchResponse;
};

getData(`${baseURL}/phones.json`).then(result => {
  const phonesIDs = result.map(phone => phone.id);

  getFirstReceivedDetails(phonesIDs);
  getAllSuccessfulDetails(phonesIDs);
});

const getFirstReceivedDetails = (phonesIDs) => {
  const allPromisses = phonesIDs.map(phoneID => {
    const phoneData = getData(`${baseURL}/phones/${phoneID}.json`);

    return phoneData;
  });

  Promise.any(allPromisses).then(firstResolved => {
    const li = document.createElement('li');

    li.innerText = `${firstResolved.id} --- ${firstResolved.name}`;
    ulFirstReceived.appendChild(li);
  });
};

const getAllSuccessfulDetails = (phonesIDs) => {
  const allPromisses = phonesIDs.map(phoneID => {
    const phoneData = getData(`${baseURL}/phones/${phoneID}.json`);

    return phoneData;
  });

  Promise.all(allPromisses).then(resolvedPhones => {
    resolvedPhones.map(phone => {
      const li = document.createElement('li');

      li.innerText = `${phone.id} --- ${phone.name}`;
      ulAllReceived.appendChild(li);
    });
  });
};
