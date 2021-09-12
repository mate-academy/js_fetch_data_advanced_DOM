'use strict';

const url = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

function getPhoneIds() {
  return fetch(url + '.json')
    .then(listOfPhones => listOfPhones.json())
    .then(phonesData => phonesData.map(phone => phone.id));
}

function getFirstReceivedDetails(idsList) {
  const arrayOfPromises = idsList.map(someId => {
    return fetch(url + `/${someId}.json`)
      .then(somePhone => somePhone.json())
      .catch(error => alert('Error:', error));
  });

  return Promise.race(arrayOfPromises)
    .then((firstPhone) => {
      const div = document.createElement('div');
      const list = document.createElement('ul');

      list.id = 'first-received-list';

      const h3 = document.createElement('H3');

      h3.innerText = 'First Received';
      div.className = 'first-received';
      document.body.append(div);
      div.append(h3);
      div.append(list);

      const li = document.createElement('li');

      li.innerText = firstPhone.name;
      list.append(li);
    });
}

function getAllSuccessfulDetails(idsList) {
  const arrayOfPromises = idsList.map(someId => {
    return fetch(url + `/${someId}.json`)
      .then(somePhone => somePhone.json());
  });

  return Promise.all(arrayOfPromises)
    .then((phonesArray) => {
      const div = document.createElement('div');
      const list = document.createElement('ul');
      const h3 = document.createElement('H3');

      h3.innerText = 'All Successful';
      div.className = 'all-successful';
      document.body.append(div);
      div.append(h3);
      div.append(list);

      phonesArray.forEach(phoneObj => {
        const li = document.createElement('li');

        li.innerText = 'Name:' + phoneObj.name + '\n'
        + 'ID:' + phoneObj.id.toUpperCase() + '\n' + '___';
        list.append(li);
      });
    });
}

getPhoneIds()
  .then(ids => getFirstReceivedDetails(ids));

getPhoneIds()
  .then(ids => getAllSuccessfulDetails(ids));

// optional task below

function getThreeFastestDetails(idsList, counter = 3, i = 1) {
  const div = document.createElement('div');
  const h3 = document.createElement('H3');
  const list = document.createElement('ul');

  div.style.display = 'block';

  h3.innerText = 'Race of Promises';
  document.body.prepend(div);
  div.append(h3);
  div.append(list);

  getFastestDetails(idsList, counter, i, list);
}

function getFastestDetails(idsList, counter = 3, i = 1, list) {
  if (counter === 0) {
    return;
  }

  const arrayOfPromises = idsList.map(someId => {
    return fetch(url + `/${someId}.json`)
      .then(somePhone => somePhone.json());
  });

  Promise.race(arrayOfPromises)
    .then((firstPhone) => {
      const li = document.createElement('li');

      li.innerText = `Number ${i} to resolve: ` + firstPhone.name;
      list.append(li);

      const idsListUp = idsList
        .filter(elem => elem !== firstPhone.id);

      getFastestDetails(idsListUp, counter - 1, i + 1, list);
    });
}

getPhoneIds()
  .then(ids => getThreeFastestDetails(ids));
