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
    }, {
      cacheAcrossSpecs: true,
      validate() {
        cy.getCookies().should('have.length.greaterThan', 0);
      },
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

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 1: logs in successfully with valid credentials and check the workspace', () => {
    cy.visit('https://platform.uat.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

  //UAT
  // cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
  //     .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
  //     .contains(/^S$/) // exact match for 'S'
  //     .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
  //     .click({ force: true });
  // Wait for workspace cards to be visible before interacting
  // cy.get(".sc-ikkxIA", { timeout: 20000 }).should("be.visible");

  //SIT
  cy.get(".sc-ikkxIA")
    .filter(':contains("Shein")')
    .filter(':contains("odm-buyer")')
    .find("div")
    .contains("Shein")
    .should("be.visible")
    .click({ force: true });
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 2: logs in successfully to buyer and upload inspiration file', () => {
     
    cy.visit('https://platform.uat.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

  //UAT
  // cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
  //     .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
  //     .contains(/^S$/) // exact match for 'S'
  //     .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
  //     .click({ force: true });
  // Wait for workspace cards to be visible before interacting
  // cy.get(".sc-ikkxIA", { timeout: 20000 }).should("be.visible");

  //SIT
  cy.get(".sc-ikkxIA")
    .filter(':contains("Shein")')
    .filter(':contains("odm-buyer")')
    .find("div")
    .contains("Shein")
    .should("be.visible")
    .click({ force: true });
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains('div.n-button-content', 'Upload Inspiration').click();

    cy.contains('p', /^Supported Format: pdf/, { timeout: 30000 })
      .should('be.visible')
      .parents('div')
      .find('input[type="file"][accept=".pdf"]')
      .first()
      .selectFile('cypress/fixtures/inspiration.pdf', { force: true });

    cy.contains('p', 'Supported Format: xlsx', { timeout: 30000 })
      .should('be.visible')
      .parents('div')
      .find('input[type="file"][accept=".xlsx"]')
      .first()
      .selectFile('cypress/fixtures/BrickFile.xlsx', { force: true });

      cy.wait(2000);

    cy.get('input#themeName', { timeout: 10000 })
       .should('exist')
      .should('be.visible')
      .type(themeName, { force: true });

   const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 2); // 2 days from today
const day = targetDate.getDate(); // this gives the actual future day number

cy.get('input.custom-input').click({ force: true });

cy.get('.react-datepicker', { timeout: 10000 }).should('be.visible');

// If the future date is in the next month, click the next arrow
const today = new Date();
if (targetDate.getMonth() !== today.getMonth()) {
  cy.get('.react-datepicker__navigation--next').click(); // go to next month
}

cy.get('.react-datepicker__month')
  .find('.react-datepicker__day')
  .not('.react-datepicker__day--disabled')
  .not('.react-datepicker__day--outside-month')
  .filter((i, el) => Cypress.$(el).text().trim() === String(day))
  .first()
  .click({ force: true });

    cy.get('[data-testid="dropdown-search"]').should('be.visible').click({ force: true });
    cy.get('[data-testid="dropdown-scroll"]').should('be.visible');
    //cy.get('[data-value="Bangladesh"]').should('be.visible').click({ force: true });
    cy.get('[data-testid="dropdown-search"]').should('have.value', 'Bangladesh');

    cy.get('#desc').type('this is added for automation testing');

    cy.intercept(
      'POST',
      'https://api.impetusz0.de/service/application/odm/v1.0/uvp/moodboards/upload'
    ).as('uploadInspiration');

    cy.contains('button', 'Continue', { timeout: 20000 })
      .should('be.visible')
      .and('not.be.disabled')
      .click({ force: true });

    cy.contains('Inspiration uploaded successfully', { timeout: 30000 }).should('be.visible');
  });

  
   });