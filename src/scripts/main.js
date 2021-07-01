'use strict';

// write code here
const promise = getPhones(
  'https://mate-academy.github.io/'
+ 'phone-catalogue-static/api/phones.json');
const phoneList = [];
const firstThreeElemArray = [];

function getPhones(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(lists => resolve(lists));

    setTimeout(() => reject(new Error()), 5000);
  });
}

promise
  .then(list => {
    for (const elem of list) {
      phoneList.push(elem.id);
    };
    getFirstReceivedDetails(phoneList);
    getAllSuccessfulDetails(phoneList);
    getThreeFastestDetails(phoneList);
  })
  .catch(new Error('error!'));

function getArrayOfIds(array) {
  return array.map(id => {
    return fetch(
      `https://mate-academy.github.io/`
    + `phone-catalogue-static/api/phones/${id}.json`)
      .then(response => response.json());
  });
}

function getFirstReceivedDetails(arrayOfIds) {
  const requests = getArrayOfIds(arrayOfIds);

  Promise.race(requests)
    .then(firstPhoneDetail => {
      const div = document.createElement('div');

      div.className = 'first-received';

      div.innerHTML = `
        <h1>First Received</h1>
        <ul>
          <li>id: ${firstPhoneDetail.id}, name: ${firstPhoneDetail.name}</li>
        </ul>`;
      document.body.append(div);
    })
    .catch(new Error('error!'));
};

function getAllSuccessfulDetails(arrayOfIds) {
  const requests = getArrayOfIds(arrayOfIds);

  Promise.allSettled(requests)
    .then(results => {
      const fullfilElem = results.filter(elem => elem.status === 'fulfilled');

      const div = document.createElement('div');

      div.className = 'all-successful';

      div.innerHTML = '<h1>All Successful</h1>';

      const ul = document.createElement('ul');

      div.append(ul);

      document.body.append(div);

      for (const elem of fullfilElem) {
        const li = document.createElement('li');

        li.innerText = `id: ${elem.value.id}, name: ${elem.value.name}`;
        ul.append(li);
      };
    })
    .catch(new Error('error!'));
};

function getThreeFastestDetails(arrayOfIds) {
  arrayOfIds.forEach(element => {
    fetch(
      `https://mate-academy.github.io/`
    + `phone-catalogue-static/api/phones/${element}.json`)
      .then(response => response.json())
      .then(result => {
        if (firstThreeElemArray.length <= 2) {
          firstThreeElemArray.push(result);
        }
      });
  });
};
