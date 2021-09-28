'use strict';

// write code here
const link = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const request = (url = '') => {
  return fetch(`${link}${url}.json`)
    .then(response => {
      if (!response.ok) {
        throw setTimeout(() => {
          alert(`${response.status}`);
        }, 2000);
      };

      return response.json();
    });
};

const getFirstReceivedDetails = () => {
  return request()
    .then(phones => Promise.race(phones.map(phone => new Promise(
      resolve => resolve(request(`/${phone.id}`))
    ))));
};

const getAllSuccessfulDetails = () => {
  return request()
    .then(phones =>
      Promise.allSettled(phones.map(phone =>
        new Promise(resolve => resolve(request(`/${phone.id}`)))))
    )
    .then(phones => phones.filter(phone => phone.status === 'fulfilled'))
    .then(phones => phones.map(phone => phone.value)
    );
};

function createForm(className, title, result) {
  const div = document.createElement('div');

  div.className = className;

  const titleH = document.createElement('h3');

  titleH.innerText = title;
  div.append(titleH);

  if (result.length > 1) {
    result.map(res => {
      const block = document.createElement('div');

      block.innerHTML = `
        <p>ID: ${res.id.toUpperCase()}</p>
        <p>Name: ${res.name.toUpperCase()}</p>`;
      div.append(block);
    });
  } else {
    div.insertAdjacentHTML(`beforeend`, `
      <p>ID: ${result.id.toUpperCase()}</p>
      <p>Name: ${result.name.toUpperCase()}</p>
      `);
  }

  document.body.append(div);
}

getFirstReceivedDetails()
  .then(result => {
    createForm('first-received', 'First received', result);
  });

getAllSuccessfulDetails()
  .then(result => {
    createForm('all-successful', 'All Successful', result);
  });
