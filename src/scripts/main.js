'use strict';

const url = 'https://mate-academy.github.io/'
  + 'phone-catalogue-static/api/phones';

fetchData();

function fetchData() {
  fetch(`${url}.json`)
    .then(data => data.json())
    .then(obj => {
      const allID = [];

      obj.forEach(element => {
        allID.push(element.id);
      });

      getFirstReceivedDetails(allID);
      getAllSuccessfulDetails(allID);
    });
};

function getFirstReceivedDetails(list) {
  Promise.race(list)
    .then(firstID =>
      fetch(`${url}/${firstID}.json`)
        .then(getEl => getEl.json()))
    .then(elem =>
      document.body.insertAdjacentHTML('afterbegin', `
        <div class="first-received">
        <h2>First Received</h2>
        <p> 
          NAME: ${elem.name} <br>
          ID: ${elem.id},
        </p>
        </div>
        `));
};

function getAllSuccessfulDetails(list) {
  Promise.all(list)
    .then(allPromises => {
      const div = document.createElement('div');
      const h2 = document.createElement('h2');
      const ul = document.createElement('ul');

      h2.textContent = 'All Successful';
      div.classList = 'all-successful';
      div.append(h2);

      for (const id of allPromises) {
        const li = document.createElement('li');

        li.classList = 'li-header ';

        fetch(`${url}/${id}.json`)
          .then(getEl => getEl.json())
          .then(elem =>
            li.append(`NAME: ${elem.name}, ID: ${elem.id}`),
          ul.append(li)
          );
      };

      div.append(ul);
      document.body.append(div);
    });
};
