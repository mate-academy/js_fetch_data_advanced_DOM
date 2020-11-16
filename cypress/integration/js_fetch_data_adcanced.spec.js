'use strict';
/// <reference types="Cypress" />

describe('Tests', () => {
  before(() => {
    cy.visit('/');
  });

  it('First Received tests.', () => {
    cy.get('.first-received > h3').should('have.text', 'First Received');
    cy.get('.first-received > p').contains('Motorola XOOM');
  });

  it('All Successful tests.', () => {
    cy.get('.all-successful > h3').should('have.text', 'All Successful');
    cy.get('ul').children().should('have.length', 300);
  });

  it('All Successful contains `MOTOROLA-XOOM-WITH-WI-FI`.', () => {
    cy.get('.all-successful').contains('MOTOROLA-XOOM-WITH-WI-FI');
  });

  it('All Successful contains `MOTOROLA-XOOM`.', () => {
    cy.get('.all-successful').contains('MOTOROLA-XOOM');
  });

  it('All Successful contains `MOTOROLA-CHARM-WITH-MOTOBLUR`.', () => {
    cy.get('.all-successful').contains('MOTOROLA-CHARM-WITH-MOTOBLUR');
  });
});
