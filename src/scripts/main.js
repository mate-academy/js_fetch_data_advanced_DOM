'use strict';

// // write code here
const body = document.querySelector('body');
const url = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones/:phoneId.json';
const url1 = url.substring(0, url.indexOf(':phoneId'));

function getFirstReceivedDetails(id) {
  const div = document.createElement('div');
  const h3 = document.createElement('h3');

  Promise.race([...id])
    .then(el => {
      fetch(`${url1}${el}.json`)
        .then(response => response.json())
        .then(phone => {
          div.setAttribute('class', 'first-received');
          h3.innerHTML = 'First Received';
          div.append(h3);
          div.append(phone.name);
          body.append(div);
        });
    });
}

function getAllSuccessfulDetails(allDetails) {
  const div = document.createElement('div');
  const h3 = document.createElement('h3');
  const ul = document.createElement('ul');
  const li = document.createElement('li');

  const promises = allDetails.map(el => {
    return fetch(`${url1}${el}.json`)
      .then(response => response.json());
  });

  Promise.allSettled([...promises])
    .then(result => {
      const full = result.map(el => {
        if (el.status === 'fulfilled') {
          return el.value;
        }
      });

      div.setAttribute('class', 'all-successful');
      h3.innerHTML = 'All Successful';

      ul.innerHTML
        = full.map(item => `<li>${item.name}</li>`).join(' ');
      ul.append(li);
      div.append(h3);
      div.append(ul);
      body.append(div);
    });
}

function getThreeFastestDetails(idArray) {
  const promises = idArray.map(el => {
    return fetch(`${url1}${el}.json`)
      .then(response => response.json());
  });

  for (let i = 0; i < 3; i++) {
    Promise.any([promises[i]])
      .then(value => value.name);
  }
}

function getPhones() {
  return fetch('https://mate-academy.github.io/'
    + 'phone-catalogue-static/api/phones.json')
    .then(response => response.json())
    .then(result => {
      getFirstReceivedDetails(result.map(el => el.id));
      getAllSuccessfulDetails(result.map(el => el.id));
      getThreeFastestDetails(result.map(el => el.id));
    });
}

getPhones();
