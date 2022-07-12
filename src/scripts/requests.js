'use strict';

const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';
const ENDPOINTS = {
  phones: '/phones.json',
  phoneById: (id) => `/phones/${id}.json`,
};

const request = (url) => {
  return fetch(`${BASE_URL}${url}`)
    .then(response => {
      if (!response.ok) {
        Promise.reject(
          new Error(`${response.status}: ${response.statusText}`)
        );
      }

      return response.json();
    });
};

module.exports = {
  ENDPOINTS, request,
};
