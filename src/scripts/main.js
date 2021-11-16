'use strict';

// write code here
const phones = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json'

const getFirstReceivedDetails = (url) => {
  return fetch(url)
    .then(response => response.json())
    .then(result => {
      return result
    })
    .then(result => {
      Promise.race(result).then((phone => insertDom(phone.name, 'first-received')))
    })
}

function insertDom(input, className) {
  const divFirst = document.createElement('div');
  divFirst.classList.add(className);
  const headerFirst = document.createElement('h3');
  headerFirst.textContent = 'First Received';
  divFirst.append(headerFirst);
  divFirst.textContent = input;
  document.body.append(divFirst);
}

getFirstReceivedDetails(phones)

const getAllSuccessfulDetails = (url) => {
  return fetch(url)
    .then(response => response.json())
    .then(result => {
      const div = document.createElement('div');
      div.classList.add('all-successful');
      const header = document.createElement('h3');
      header.textContent = 'All Successful';
      div.append(header);
      result.map(phone => {
        const li = document.createElement('li');
        li.textContent = phone.id.toUpperCase();
        div.append(li);
      })
      document.body.append(div);
    })
}

getAllSuccessfulDetails(phones)
