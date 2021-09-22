'use strict';

// write code here

const url = 'https://mate-academy.github.io/phone-catalogue-static/api/phones';

function phoneId() {
  return fetch(`${url}.json`)
    .then(response => response.json())
    .then(phone => phone.map(phones => phones.id));
};

function getFirstReceivedDetails(oneId) {
  const phonesId = oneId.map(firstId => {
    return fetch(`${url}/${firstId}.json`)
      .then(response => response.json())
      .catch(message => Error(message));
  });

  return Promise.race(phonesId)
    .then(phone => {
      const div = document.createElement('div');
      const h1 = document.createElement('h1');
      const paragraph = document.createElement('p');

      div.classList.add('first-received');
      h1.innerText = 'First Received';

      paragraph.innerHTML = `Name: ${phone.name}<br>
      ID: ${phone.id}`;

      div.append(h1);
      div.append(paragraph);

      document.body.append(div);
    });
}

function getAllSuccessfulDetails(allId) {
  const phonesId = allId.map(allIds => {
    return fetch(`${url}/${allIds}.json`)
      .then(response => response.json())
      .catch(message => Error(message));
  });

  return Promise.all(phonesId)
    .then((phones) => {
      const div = document.createElement('div');
      const h1 = document.createElement('h1');
      const ul = document.createElement('ul');

      div.classList.add('all-successful');
      h1.innerText = 'All Successful';

      div.append(h1);
      div.append(ul);

      for (const key of phones) {
        const li = document.createElement('li');

        li.style.marginBottom = '10px';

        li.innerHTML = `Name: ${key.name} <br>
        ID: ${key.id}`;

        ul.append(li);
      }

      document.body.append(div);
    });
}

phoneId()
  .then(oneId => getFirstReceivedDetails(oneId));

phoneId()
  .then(allId => getAllSuccessfulDetails(allId));
