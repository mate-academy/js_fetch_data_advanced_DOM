'use strict';

const baseUrl = 'https://mate-academy.github.io/phone-catalogue-static/api';

const request = (url) => {
  return fetch(`${baseUrl}${url}`).then((response) => {
    if (!response.ok) {
      throw new Error(response.status);
    }

    return response.json();
  });
};

const getPhones = () => {
  return request(`/phones.json`);
};

const getDetails = (phoneId) => {
  return request(`/phones/${phoneId}.json`);
};

const getPhonesDetails = (option) => {
  return getPhones().then((phone) => {
    const phonesIdList = [];

    phone.forEach((data) => {
      phonesIdList.push(getDetails(data.id));
    });

    if (option === 'first') {
      return Promise.race(phonesIdList);
    }

    return Promise.allSettled(phonesIdList);
  });
};

const addPhonesList = (title, className, phonesList) => {
  const container = document.createElement('div');

  container.className = className;
  container.innerHTML = `<h2>${title}</h2>`;

  const list = document.createElement('ul');

  container.append(list);
  document.body.append(container);

  phonesList.forEach((phone) => {
    list.insertAdjacentHTML(
      'beforeend',
      `
      <li>${phone.name} <span hidden>${phone.id.toUpperCase()}</span></li>
    `
    );
  });
};

const getFirstReceivedDetails = () => {
  getPhonesDetails('first').then((data) => {
    addPhonesList('First Received', 'first-received', [data]);
  });
};

const getAllSuccessfulDetails = () => {
  getPhonesDetails().then((data) => {
    const dataMapped = data.map(({ value }) => value);

    addPhonesList('All Successful', 'all-successful', dataMapped);
  });
};

const getThreeFastestDetails = () => {
  getPhonesDetails().then((data) => {
    const dataSliced = data.slice(0, 3);
    const dataMapped = dataSliced.map(({ value }) => value);

    addPhonesList('First Three', 'first-three', dataMapped);
  });
};

getFirstReceivedDetails();
getAllSuccessfulDetails();
getThreeFastestDetails();
