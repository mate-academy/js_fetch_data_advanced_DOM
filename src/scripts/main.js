'use strict';

const url = `
https://mate-academy.github.io/phone-catalogue-static/api/phones.json`;

const detailsUrl = `
https://mate-academy.github.io/phone-catalogue-static/api/phones/`;

function getPhones() {
  return fetch(url)
    .then(responce => {
      if (!responce.ok) {
        throw setTimeout(() => {
          return Promise.reject(new Error('No data found ' + responce.status));
        }, 5000);
      }

      if (!responce.headers.get('content-type').includes('application/json')) {
        throw setTimeout(() => {
          return Promise.reject(new Error('Content-type is not suported '
          + responce.status));
        }, 5000);
      }

      return responce.json();
    })
    .then(result => result);
}

function getFirstReceivedDetails(ids) {
  return fetch(`${detailsUrl}/${ids}.json`)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error('Something has gone really bad!'
        + response.status));
      }

      return response.json();
    });
}

function getAllSuccessfulDetails(ids) {
  return fetch(`${detailsUrl}/${ids}.json`)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error('Something has gone really bad!'
        + response.status));
      }

      return response.json();
    });
}

function getThreeFastestDetails(ids) {
  return fetch(`${detailsUrl}/${ids}.json`)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error('Something has gone really bad!'
        + response.status));
      }

      return response.json();
    });
}

// Reusable code to create Div
function createDiv(text, cssClass) {
  const div = document.createElement('div');
  const title = document.createElement('h3');
  const list = document.createElement('ul');

  document.body.append(div);
  div.append(title);
  div.append(list);

  title.textContent = text;
  div.classList.add(cssClass);
}

// getFirstReceivedDetails
getPhones()
  .then(phones => {
    const idArr = phones.map(phone => getFirstReceivedDetails(phone.id));

    Promise.race(idArr)
      .then(result => {
        createDiv('First Received', 'first-received');

        const li = document.createElement('li');

        li.textContent = result.name;
        document.querySelector('.first-received ul').append(li);
      });
  })
  .catch(error => error);

// getAllSuccessfulDetails
getPhones()
  .then(phones => {
    const idArr = phones.map(phone => getAllSuccessfulDetails(phone.id));

    Promise.all(idArr)
      .then(result => {
        createDiv('All Successful', 'all-successful');

        result.map(phone => {
          const li = document.createElement('li');

          li.textContent = phone.name;
          document.querySelector('.all-successful ul').append(li);
        });
      });
  })
  .catch(error => error);

// getThreeFastestDetails
getPhones()
  .then(phones => {
    const idArr = phones.map(phone => getThreeFastestDetails(phone.id));

    createDiv('Three Successful', 'three-successful');

    document.querySelector('.three-successful')
      .style.backgroundColor = 'red';

    document.querySelector('.three-successful')
      .style.position = 'absolute';
    document.querySelector('.three-successful').style.bottom = 0 + 'px';
    document.querySelector('.three-successful').style.left = 0 + 'px';

    for (let i = 0; i < idArr.length; i = i + 7) {
      Promise.allSettled(idArr)
        .then((res) => {
          const li = document.createElement('li');

          li.textContent = (res[i].value.name);
          document.querySelector('.three-successful ul').append(li);
        });
    }
  })
  .catch(error => error);
