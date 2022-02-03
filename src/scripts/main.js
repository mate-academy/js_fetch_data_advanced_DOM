'use strict';

const baseUrl = 'https://mate-academy.github.io/phone-catalogue-static/api';
const body = document.body;

function firstReceived(result) {
  body.insertAdjacentHTML('beforeend', `
    <div class="first-received">
      <h2>
        First Received
      </h2>
      <ul>
        <li>
          Phone ID: ${result[0]}
        </li>
        <li>
          Phone Name: ${result[1]}
        </li>
      </ul>
    </div>
  `);
}

function allDetails(result) {
  const arrayAllResponse = result;
  let list;

  for (const liElem of arrayAllResponse) {
    list += `
      <li>
        Phone ID: ${(liElem.id).toUpperCase()}
        <br>
        Phone Name: ${liElem.name}
      </li>
    `;
  }

  body.insertAdjacentHTML('beforeend', `
    <div class="all-successful">
      <h2>
        All Successful
      </h2>
      <ol>
        ${list}
      </ol>
    </div>
  `);
}

function onError(message) {
  body.insertAdjacentHTML('beforeend', `
    <div class="notification">
      ${message}
    </div>
  `);
}

const request = (url) => {
  return fetch(`${url}`)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(
          new Error(`${response.status} - ${response.statusText}`)
        );
      }

      return response.json();
    });
};

const getPhones = () => {
  return request(`${baseUrl}/phones.json`);
};

const getPhonesDetails = (detailUrl) => {
  return request(`${detailUrl}`);
};

const getFirstReceivedDetails = (ids) => {
  const allIds = ids;
  const fastest = [];
  let fastestId;
  let fastestName;
  const allRequests = allIds.map(el => `${baseUrl}/phones/${el}.json`);

  return new Promise((resolve, reject) => {
    Promise.race(allRequests.map(el => fetch(el)))
      .then(data => data.json())
      .then(result => {
        fastestId = result.id;
        fastestName = result.name;

        fastest.push(fastestId);
        fastest.push(fastestName);

        resolve(fastest);
      });
  });
};

const getAllSuccessfulDetails = (ids) => {
  const allIds = ids;
  const allReceived = [];
  let allDetailUrl = [];
  const allRequests = allIds.map(el => `${baseUrl}/phones/${el}.json`);

  return new Promise((resolve, reject) => {
    Promise.allSettled(allRequests.map(el => fetch(el)))
      .then(responses => {
        allDetailUrl = responses.map(response => response.value.url);

        return allDetailUrl;
      })
      .then(urls => {
        Promise.allSettled(urls.map(url => getPhonesDetails(url)))
          .then(results => {
            const list = results;

            list.forEach(el => {
              allReceived.push({
                id: el.value.id,
                name: el.value.name,
              });
            });

            resolve(allReceived);
          });
      });
  });
};

getPhones()
  .then(result => {
    const phonesIds = [];

    for (const phone of result) {
      phonesIds.push(phone.id);
    }

    return phonesIds;
  })
  .then(result => {
    return getFirstReceivedDetails(result);
  })
  .then(firstReceived)
  .catch(onError);

getPhones()
  .then(result => {
    const phonesIds = [];

    for (const phone of result) {
      phonesIds.push(phone.id);
    }

    return phonesIds;
  })
  .then(response => {
    return getAllSuccessfulDetails(response);
  })
  .then(allDetails)
  .catch(onError);
