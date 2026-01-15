// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import '@shelex/cypress-allure-plugin';

Cypress.config('defaultCommandTimeout', 60000);

import '@shelex/cypress-allure-plugin';

Cypress.on('fail', (error, runnable) => {

  // Attach full error message
  cy.allure().attachment(
    'Assertion Error',
    error.message,
    'text/plain'
  );

  // Try extracting expected & actual if available
  if (error.expected !== undefined || error.actual !== undefined) {
    cy.allure().attachment(
      'Expected vs Actual',
      `
Expected:
${JSON.stringify(error.expected, null, 2)}

Actual:
${JSON.stringify(error.actual, null, 2)}
      `,
      'text/plain'
    );
  }

  throw error; // VERY IMPORTANT – let Cypress fail the test
});

