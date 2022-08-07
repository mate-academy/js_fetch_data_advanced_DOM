'use strict';

// eslint-disable-next-line
const listURL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones.json';
// eslint-disable-next-line
const detailsURL = 'https://mate-academy.github.io/phone-catalogue-static/api/phones/';

const request = (url) => {
  return fetch(url)
    .then(response => {
      return Promise.race([
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error(response.status));
          }, 5000);
        }),

        new Promise(resolve => {
          if (response.ok) {
            resolve(response.json());
          }
        }),
      ]);
    });
};

const getPhoneIds = () => {
  return request(listURL).then(phones => phones.map(phone => phone.id));
};

const getFirstReceivedDetails = (ids) => {
  return Promise.race(ids.map(id => {
    return request(detailsURL + id + '.json');
  })).then(res => [res]);
};

const getAllSuccessfulDetails = (ids) => {
  return Promise.allSettled(ids.map(id => {
    return request(detailsURL + id + '.json');
  })).then(results => {
    return results.filter(res => res.status === 'fulfilled')
      .map(el => el.value);
  });
};

const getThreeFastestDetails = (ids) => {
  const maxResults = 3;
  let results = 0;

  return Promise.allSettled(ids.map(id => {
    return request(detailsURL + id + '.json').then(result => {
      if (results < maxResults) {
        results++;

        return result;
      }

      return 'late';
    });
  })).then(res => res.filter(el => el.value !== 'late')
    .map(el => el.value));
};

const createList = (array, className, header) => {
  const list = document.createElement('div');

  list.classList.add(className);

  list.innerHTML = `
    <h2>${header}</h2>
    <ul>
      ${array.map(el => `<li>${el.id.toUpperCase()}</li>`).join('')}
    </ul>
  `;

  document.body.append(list);
};

getPhoneIds().then(ids => {
  getFirstReceivedDetails(ids).then(arr => {
    createList(arr, 'first-received', 'First Received');
  });

  getAllSuccessfulDetails(ids).then(arr => {
    createList(arr, 'all-successful', 'All Successful');
  });

  getThreeFastestDetails(ids).then(arr => {
    createList(arr, 'three-fastest', 'Three Fastest');
  });
});
