'use strict';

const requestFromTheServer = fetch('https://mate-academy.github.io/'
+ 'phone-catalogue-static/api/phones.json')
  .then(a => a.json());

const getFirstReceivedDetails = () => (
  new Promise(resolve => {
    requestFromTheServer.then(phone => {
      const block = document.createElement('div');

      block.classList.add('first-received');

      (block.innerHTML = (
        `
        <h3>First Received</h3>
          <div>
            name: ${phone[1].name}
          </div>
          <div>
            id: ${phone[1].id}
          </div>
        `
      ));
      resolve(document.body.append(block));
    }).catch(err => document.body.append(err));
  })
);
const getAllSuccessfulDetails = () => (
  requestFromTheServer.then(phone => {
    const block = document.createElement('div');
    const list = document.createElement('ul');

    block.innerHTML = `<h3>All Successful</h3>`;
    block.append(list);
    block.classList.add('all-successful');

    list.innerHTML = (phone.map(item => (
      `
        <li>id: ${item.id}</li>
        <li>name: ${item.name}</li>
      `
    )).join(''));
    document.body.append(block);
  }).catch(err => document.body.append(err))
);

getFirstReceivedDetails();
getAllSuccessfulDetails();
