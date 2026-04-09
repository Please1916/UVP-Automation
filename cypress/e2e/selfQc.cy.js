// Prevents uncaught JS errors from failing the test
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('is not a function')) {
    return false; // ✅ Suppress this specific error
  }
  return true;
});
const randomString   = Math.random().toString(36).substring(2, 10);
export const themeName       = `Test_${randomString}`;
const randomStyleCode = `Style_${Math.random().toString(36).substring(2, 8)}`;
export const vendorStyleCode = randomStyleCode;


describe('Impetus Platform — Login Page Tests', () => {

  beforeEach(() => {
    cy.session('user-session', () => {
      cy.login();
    });
  });

  afterEach(function () {
    if (this.currentTest && this.currentTest.state === 'failed') {
      const testTitle  = this.currentTest.title || 'Unknown Test';
      const errMessage = this.currentTest.err?.message || 'Unknown error';

      cy.screenshot(`${testTitle}-failed`);

      if (Cypress.env('allure') === true && typeof cy.allure === 'function') {
        try {
          cy.allure().step(
            `Test "${testTitle}" failed. Error: ${errMessage}`,
            { status: 'failed' }
          );
          cy.allure().attachment('Cypress Error', errMessage, 'text/plain');
        } catch (e) {
          cy.log('Allure attachment failed: ' + e.message);
        }
      }
    }
  });

  after(() => {
    cy.logout({ force: true });
  });
it('Test Case 1: Self QC', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains('32021321').click();

    cy.contains('span.side-navigation-panel-select-option-text', 'QC')
      .parents('span.side-navigation-panel-select-option-wrap').click();
    cy.get('div.side-navigation-panel-select-inner-option', { timeout: 15000 })
      .contains('Self QC').should('be.visible').and('not.be.disabled').click();
    cy.url({ timeout: 15000 }).should('include', 'SelfQC');

    cy.get('input[data-testid="input-component"][placeholder="Search via Style IDs or other values"]', { timeout: 10000 })
    .should('be.visible')
    .type(vendorStyleCode);
    cy.contains('QC PENDING', { timeout: 10000 }).click({ force: true }).wait(1000);

      // Directly trigger the checkbox via JS 
  cy.get('#verification-checkbox')
    .scrollIntoView()
    .then($el => {
      $el[0].click();
    })
    .should('be.checked');
  
  // Type comment in the contenteditable div
  cy.get('div[contenteditable="true"]')
    .scrollIntoView()
    .should('be.visible')
    .click()
    .type('QC testing');

  cy.get('input[type="file"]').selectFile('cypress/fixtures/attachment.jpg', { force: true });
  cy.contains('Save Comment').click().wait(1000);

  
  cy.contains('button', 'Submit').click();
  });
});  