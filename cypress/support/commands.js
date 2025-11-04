// In cypress/support/commands.js
import '@shelex/cypress-allure-plugin';
import 'cypress-file-upload';
Cypress.Commands.add('highlight', (el, color = 'yellow') => {
  cy.wrap(el).invoke('css', {
    backgroundColor: color,
    border: '2px solid red',
    padding: '2px',
    borderRadius: '3px'
  });
});

Cypress.Commands.add('login', () => {
  const email = Cypress.env('login_email');
  const password = Cypress.env('login_password');
  const loginUrl = Cypress.env('login_url');

  cy.visit(loginUrl);

  cy.wait(30000);

// ✅ Wait until email input is visible (which means page is ready)
cy.get('input[data-testid="email"]', { timeout: 20000 }).should('be.visible');

cy.get('input[data-testid="email"]').type(email);
cy.get('input[data-testid="password"]').type(password);

cy.get('button[data-testid="login-CTA"]').should('not.be.disabled').click();

// ✅ Confirm login success by checking URL or dashboard element
cy.url().should('not.include', '/auth/login')


});


Cypress.Commands.add('logout', () => {
  cy.contains('div', 'SS').click({ force: true });
  cy.contains('div', 'Logout').click({ force: true });
  cy.url().should('include', '/login');
});

