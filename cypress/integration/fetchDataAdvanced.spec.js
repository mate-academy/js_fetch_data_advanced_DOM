'use strict';

describe('Fetch phones app', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('.all-successful').as('all');
  });

  it('should take an array of all successfully received details', () => {
    cy.get('@all').contains('All Successful');
    cy.get('ul').children().should('have.length', 300);
  });

  it('should contain phones in all successful', () => {
    cy.get('@all').contains('MOTOROLA-XOOM-WITH-WI-FI');
    cy.get('@all').contains('MOTOROLA-XOOM');
    cy.get('@all').contains('MOTOROLA-CHARM-WITH-MOTOBLUR');
  });
});
