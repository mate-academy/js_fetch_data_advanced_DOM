'use strict';

const request = (
  endPoint = '/phones',
  idElem = '',
  format = '.json',
  baseUrl = 'https://mate-academy.github.io/phone-catalogue-static/api',
) => {
  return fetch(`${baseUrl}${endPoint}${idElem}${format}`)
    .then(response => {
      if (!response.ok) {
        return new Error('Error with request');
      }

      return response.json();
    });
};

const API = {
  getIds(endPoint) {
    return request(endPoint)
      .then(data => {
        return data.map(dataEl => dataEl.id);
      });
  },

  getFirstReceivedDetails: (ids) => {
    return Promise.race(ids.map(id => request('/phones', `/${id}`)));
  },

  getAllSuccessfulDetails: (ids) => {
    return Promise.allSettled(ids.map(id => request('/phones', `/${id}`)))
      .then(result => result.filter(p => p.status === 'fulfilled')
        .map(el => el.value));
  },

  getThreeFastestDetails: (ids) => {
    return Promise.all(
      [
        Promise.race(ids.map(id => request('/phones', `/${id}`))),
        Promise.race(ids.map(id => request('/phones', `/${id}`))),
        Promise.race(ids.map(id => request('/phones', `/${id}`))),
      ]
    );
  },
};

API.getIds('/phones')
  .then(data => API.getFirstReceivedDetails(data))
  .then(data => [data])
  .then(data => {
    pushResultOnTheScreen('body', 'first-received', 'First Received', data);
  });

API.getIds('/phones')
  .then(data => API.getAllSuccessfulDetails(data))
  .then(data => {
    pushResultOnTheScreen('body', 'all-successful', 'All Successful', data);
  });

API.getIds('/phones')
  .then(data => API.getThreeFastestDetails(data))
  .then(data => {
    pushResultOnTheScreen(
      'body', 'three-received', 'Three Fastest Details', data
    );
  });

function pushResultOnTheScreen(wrapper, elClass, elHeader, data) {
  const container = document.querySelector(`${wrapper}`);

  const block = `
    <ul class="${elClass}">
      <li style="font-weight: bold; font-size: 30px">${elHeader}</li>
      ${data.map(el => `<li style="padding: 5px 0;">${el.name} | id: ${el.id}</li>`).join()}
    </ul>
  `;

  container.insertAdjacentHTML('beforeend', block);
}
