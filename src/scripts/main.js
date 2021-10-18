'use strict';

// write code here

const url = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

function phoneId() {
  return fetch(`${url}.json`)
    .then(response => response.json())
    .then(phone => phone.map(phones => phones.id));
};

function getFirstReceivedDetails(idsArray) {
  const phonesIds = idsArray.map(id => {
    return fetch(`${url}/${id}.json`)
      .then(response => response.json())
      .catch(message => Error(message));
  });

  return Promise.race(phonesIds)
    .then(phone => {
      generateHtml(phone, 'first-received', 'First Received');
    });
};

function getAllSuccessfulDetails(allId) {
  const phonesId = allId.map(allIds => {
    return fetch(`${url}/${allIds}.json`)
      .then(response => response.json())
      .catch(message => Error(message));
  });

  return Promise.allSettled(phonesId)
    .then(phones => {
      generateHtml(phones, 'all-successful', 'All Successful');
    });
};

function generateHtml(phone, classPhone, titlePhone) {
  const div = document.createElement('div');
  const h1 = document.createElement('h1');
  const ul = document.createElement('ul');

  div.classList.add(classPhone);
  h1.innerText = titlePhone;

  if (phone.length > 1) {
    for (const key of phone) {
      const li = document.createElement('li');

      li.style.marginBottom = '10px';

      li.innerHTML = `Name: ${key.value.name} <br>
      ID: ${key.value.id}`;

      ul.append(li);
    }
  } else {
    const li = document.createElement('li');

    li.innerHTML = `Name: ${phone.name}<br>
    ID: ${phone.id}`;
    ul.append(li);
  }

  div.append(h1);
  div.append(ul);

  document.body.append(div);
};

phoneId()
  .then(oneId => getFirstReceivedDetails(oneId));

phoneId()
  .then(allId => getAllSuccessfulDetails(allId));
