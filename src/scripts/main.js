'use strict';

// write code here

const url = `${
  'https://mate-academy.github.io/phone-catalogue-static/api/phones.json'
}`;

const body = document.querySelector('body');

const createList = (phones, classN, headText) => {
  const divAll = document.createElement('div');

  divAll.className = classN;

  const headingAll = document.createElement('h3');

  headingAll.textContent = headText;

  const list = document.createElement('ul');

  for (const phone of phones) {
    const li = document.createElement('li');

    li.textContent = `${phone.id.toUpperCase()} ${phone.name}`;
    list.append(li);
  }
  divAll.append(headingAll);
  divAll.append(list);
  body.append(divAll);
};

const createElem = (phone, classN, headText) => {
  const divFirst = document.createElement('div');

  divFirst.className = classN;

  const headingFirst = document.createElement('h3');

  headingFirst.textContent = headText;

  const li = document.createElement('li');

  li.textContent = `${phone.id} ${phone.name}`;
  divFirst.append(headingFirst);
  divFirst.append(li);
  body.append(divFirst);
};

const getPhones = () => {
  return new Promise((resolve, reject) => {
    fetch(`${url}`)
      .then(response => {
        return response.json();
      })
      .then(response => {
        return resolve(response);
      });
  });
};

const details = `${
  'https://mate-academy.github.io/phone-catalogue-static/api/phones'
}`;

const getFirstReceivedDetails = (arrayIds) => {
  return Promise.race(arrayIds.map((id) => {
    return new Promise((resolve, reject) => {
      fetch(`${details}/${id}.json`)
        .then((response) => {
          return resolve(response.json());
        });
    });
  }));
};

const getAllSuccessfulDetails = (arrayIds) => {
  return Promise.all(arrayIds.map((id) => {
    return new Promise((resolve, reject) => {
      fetch(`${details}/${id}.json`)
        .then((response) => {
          return resolve(response.json());
        });
    });
  }));
};

getPhones()
  .then((result) => {
    const arrayPhonesId = result.map((phone) => {
      return phone.id;
    });

    getAllSuccessfulDetails(arrayPhonesId)
      .then((resolve) => {
        createList(result, `all-successful`, `All Successful`);

        return resolve;
      });

    getFirstReceivedDetails(arrayPhonesId)
      .then((resolve) => {
        createElem(resolve, `first-received`, `First Received`);

        return resolve;
      });
  });
