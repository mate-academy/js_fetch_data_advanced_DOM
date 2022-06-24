'use strict';

const baseUrl = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const body = document.querySelector('body');

const pushToDom = (elements, className, headingText) => {
  const div = document.createElement('div');
  const h3 = document.createElement('h3');

  div.classList.add(className);

  if (className === 'first-three') {
    div.style.position = 'fixed';
    div.style.textAlign = 'center';
    div.style.width = 35 + '%';
    div.style.height = 35 + '%';
    div.style.left = 50 + 'px';
    div.style.top = 50 + 'px';
    div.style.padding = 15 + 'px';
    div.style.borderRadius = 15 + 'px';
    div.style.backgroundColor = 'lightyellow';
  }

  if (className === 'first-received') {
    div.style.bottom = 100 + 'px';
    div.style.height = 150 + 'px';
  }

  h3.innerText = headingText;

  body.appendChild(div);
  div.appendChild(h3);

  if (headingText === 'All Successful') {
    for (const el of elements) {
      const li = document.createElement('li');

      li.append(el.value.name, ' ', el.value.id);
      div.append(li);
    }
  } else {
    for (const el of elements) {
      const li = document.createElement('li');

      li.append(el.name, ' ', el.id);
      div.append(li);
    }
  }
};

const request = (url = '') => {
  return fetch(`${baseUrl}${url}.json`)
    .then(response => response.json());
};

const getPhones = () => {
  request()
    .then(phones => {
      getFirstReceivedDetails(phones);
      getAllSuccessfulDetails(phones);
      getThreeFastestDetails(phones);
    })
    .catch(error => new Error(error));
};

const getFirstReceivedDetails = (arr) => {
  Promise.race(arr.map(({ id }) =>
    request(`/${id}`)))
    .then(phones => pushToDom([phones], 'first-received', 'First Received'));
};

const getAllSuccessfulDetails = (arr) => {
  Promise.allSettled(arr.map(({ id }) =>
    request(`/${id}`)))
    .then(phones => pushToDom(phones, 'all-successful', 'All Successful'));
};

const getThreeFastestDetails = (arr) => {
  const el1 = Promise.race(arr.map(({ id }) => request(`/${id}`)));
  const el2 = Promise.race(arr.map(({ id }) => request(`/${id}`)));
  const el3 = Promise.race(arr.map(({ id }) => request(`/${id}`)));

  Promise.all([el1, el2, el3]).then(phones =>
    pushToDom(phones, 'first-three', 'First Three Received'));
};

getPhones();
