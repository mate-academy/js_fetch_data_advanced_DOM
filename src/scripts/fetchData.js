const BASE_URL = 'https://mate-academy.github.io/phone-catalogue-static/api';
const ENDPOINTS = {
  phoneById: id => `/phones/${id}.json`,
};

function request(url) {
  return fetch(url).then(response => response.json());
}

export function getPhone(id) {
  return request(`${BASE_URL}${ENDPOINTS.phoneById(id)}`);
}
