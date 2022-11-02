'use strict';

const url = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const getPhones = () => {
  return fetch(`${url}.json`)
    .then(response => {
      if (!response.ok) {
        return new Error(`${response.status} = ${response.statusText}`);
      }

      return response.json();
    });
};

const getPhonesWithId = (id) => {
  return fetch(`${url}/${id}.json`)
    .then(response => {
      if (!response.ok) {
        return new Error(`${response.status} = ${response.statusText}`);
      }

      return response.json();
    });
};

const getFirstReceivedDetails = (arr) => {
  return Promise.race(arr)
    .then(details => {
      const div = document.createElement('div');

      div.className = 'first-received';

      div.insertAdjacentHTML('beforeend', `
        <h3>First Received</h3>
        <li>Phone-id: ${details.id}</li>
        <li>Phone-name: ${details.name}</li>
      `);

      document.body.append(div);
    });
};

const getAllSuccessfulDetails = (arr) => {
  return Promise.all(arr)
    .then(details => {
      const div = document.createElement('div');
      const h3 = document.createElement('h3');

      h3.innerText = 'All Successful';
      div.append(h3);

      div.className = 'all-successful';

      details.map(item => {
        div.insertAdjacentHTML('beforeend', `
          <li>Phone-id: ${item.id}</li>
          <li>Phone-name: ${item.name}</li>
      `);
      });

      document.body.append(div);
    });
};

const getThreeFastestDetails = (arr) => {
  const div = document.createElement('div');

  div.className = 'first-received';
  div.style.bottom = '20px';
  div.style.backgroundColor = 'pink';

  div.insertAdjacentHTML('beforeend', `
    <h3>Three Fastest Received</h3>
  `);

  document.body.append(div);

  const fisrtElemets = [];

  arr.forEach(xPromise => {
    xPromise.then(PholeDetail => {
      if (fisrtElemets.length < 3) {
        fisrtElemets.push(PholeDetail);
      }
    });
  });

  return Promise.all(arr)
    .then(() => {
      fisrtElemets.forEach(el => {
        div.insertAdjacentHTML('beforeend', `
        <li>Phone-id: ${el.id}</li>
        <li>Phone-name: ${el.name}</li>
        `);
      });
    });
};

getPhones()
  .then(phones => {
    const promisesArr = phones.map(phone => getPhonesWithId(phone.id));

    getFirstReceivedDetails(promisesArr);
    getAllSuccessfulDetails(promisesArr);
    getThreeFastestDetails(promisesArr);
  });
