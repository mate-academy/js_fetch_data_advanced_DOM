'use strict';

describe('Fetch phones app', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.all-successful').as('all');
    cy.get('.first-received').as('first');
  });

  it('should recieve the fastest response NOT the first in the list', () => {
    cy.get('@first').contains('First Received');
    cy.get('@first').contains('XOOM');
  });

  it('should take an array of all successfully received details', () => {
    cy.get('@all').contains('All Successful');
    cy.get('ul').children().should('have.length', 300);
  });

  it('should contain `MOTOROLA-XOOM-WITH-WI-FI` in all successful', () => {
    cy.get('@all').contains('MOTOROLA-XOOM-WITH-WI-FI');
  });

  it('should contain `MOTOROLA-XOOM` in all successful', () => {
    cy.get('@all').contains('MOTOROLA-XOOM');
  });

  it('All Successful contains `MOTOROLA-CHARM-WITH-MOTOBLUR`.', () => {
    cy.get('@all').contains('MOTOROLA-CHARM-WITH-MOTOBLUR');
  });
});
