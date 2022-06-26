'use strict';

const dataUrl = fetch('http://myjson.dit.upm.es/api/bins/ckb3');

dataUrl
  .then(response => response.json())
  .then((data) => {
    const arr = data.result.elements;

    arr.map((item) => createCard(item));
  });

const list = document.querySelector('.cards');
const page = document.querySelector('.page');

function createCard(data) {
  const li = document.createElement('li');

  li.insertAdjacentHTML('beforeend', `
      <div class="card">
        <div class="price-wrapper">
          <div class="price">
            <p class="amount">$${data.amount}</p>
            <span class="amount-index">/${genIndexAmount(data)}</span>
          </div>
          ${amountHTML(data)}
        </div>
        <div class="name-prod-wrapper">
          <span class="name-prod">${data.name_prod}</span>
          <span class="license-name">${data.license_name}</span>
          <button class="btn-download"
          >
            <a class="btn-download-link" 
              href=${data.link}
            >
          Download
          </a>
        </button>
        </div>
        ${getSale(data)}
        ${getMinAmount(data)}
      </div>
    `);
  list.appendChild(li);

  [...document.querySelectorAll('.btn-download')].forEach(btn => {
    btn.addEventListener('click', () => {
      download();
    });
  });
}

function genIndexAmount(data) {
  if (data.amount_html) {
    return 'mo';
  }

  return 'per year';
};

function amountHTML(data) {
  if (data.amount_html) {
    return `<span class="amount-sale">${data.amount_html.split(' ')[0]}</span>`;
  } else {
    return ``;
  }
};

function getSale(data) {
  if (data.amount_html) {
    return `<div class="sale"></div>`;
  } else {
    return ``;
  }
}

function getMinAmount(data) {
  if (data.is_best) {
    return `
        <div class="best-value">
          <span class="best-value-text">best value</span>
        </div>
      `;
  } else {
    return ``;
  }
}

function download() {
  const arrow = document.createElement('div');

  if (navigator.userAgent.indexOf('Firefox') !== -1) {
    arrow.insertAdjacentHTML('beforeend', `
          <div class="arrowFirefox">
          </div>
        `);
  } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
    arrow.insertAdjacentHTML('beforeend', `
        <div class="arrowChrome">
        </div>
      `);
  }

  if (navigator.userAgent.indexOf('Firefox') !== -1) {
    arrow.insertAdjacentHTML('beforeend', `
        <div class="arrowFirefox">
        </div>
      `);
  } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
    arrow.insertAdjacentHTML('beforeend', `
      <div class="arrowChrome">
      </div>
    `);
  }

  page.append(arrow);

  setTimeout(() => {
    arrow.style.visibility = 'hidden';
  }, 4000);
};
