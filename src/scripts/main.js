/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable operator-linebreak */
/* eslint-disable space-before-function-paren */

'use strict';

const BASE_URL =
  'https://mate-academy.github.io/phone-catalogue-static/api/phones';

const request = (url) => {
  return new Promise((resolve) => {
    fetch(url)
      .then((res) => {
        if (res.status < 400) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((res) => resolve(res))
      .catch((err) =>
        setTimeout(() => {
          console.warn(err);
        }, 5000)
      );
  });
};

const getPhonesIDs = async () => {
  const phones = await request(`${BASE_URL}.json`);

  return phones.map((phone) => phone.id);
};

const IDs = getPhonesIDs();

const getFirstReceivedDetails = async (arr) => {
  const res = await arr.map((id) => {
    const phoneDetail = request(`${BASE_URL}/${id}.json`);

    return phoneDetail;
  });

  return Promise.race(res);
};

IDs.then((arrOfIDs) => getFirstReceivedDetails(arrOfIDs)).then((res) =>
  console.log('First', res)
);

const getAllSuccessfulDetails = async (arr) => {
  const res = await arr.map((id) => {
    const phoneDetail = request(`${BASE_URL}/${id}.json`);

    return phoneDetail;
  });

  return Promise.allSettled(res);
};

IDs.then((arrOfIDs) =>
  getAllSuccessfulDetails(arrOfIDs).then((arrSuccessful) => {
    arrSuccessful.forEach((element) => {
      if (element.status === 'fulfilled') {
        console.log(element);
      }
    });
  })
);
