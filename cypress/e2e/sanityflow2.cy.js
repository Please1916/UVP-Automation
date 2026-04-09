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

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 1: logs in successfully with valid credentials and check the workspace', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
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
     
    cy.visit('https://platform.impetusz0.de/workspace');
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
    cy.get('[data-value="Bangladesh"]').should('be.visible').click({ force: true });
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

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 3: Buyer shares the Uploaded theme and share it with a vendor', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
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

    cy.get('input[placeholder="Search"]').type(themeName);

    cy.get('tr').first().find('td').eq(1).find('span')
      .invoke('text')
      .then((id) => {
        const moodboardId = id.trim();
        cy.writeFile('cypress/fixtures/runtimeData.json', { odmMoodboardId: moodboardId });
        cy.log(`Saved Moodboard ID: ${moodboardId}`);
      });

    cy.get('button[role="checkbox"]', { timeout: 10000 }).eq(1).click({ force: true });

    cy.contains('div.n-button-content', 'Share').click({ force: true });

    cy.contains('div', 'Share moodboards to vendor')
      .parent()
      .find('svg')
      .last()
      .click({ force: true });

    cy.get('input[placeholder="Select / Search item"]').type('MAHESHWARI GARMENT  ');

    cy.contains('label', 'MAHESHWARI GARMENT - 32021321')
      .scrollIntoView()
      .find('input[type="checkbox"]')
      .check({ force: true });

    cy.contains('div.n-button-content', 'Share').click({ force: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 4: Vendor verifies that shared Inspiration is visible and submit design', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains('32021321').click();
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.get('input[placeholder="Search"]').type(themeName);
    cy.get('div.n-button-content').contains('View').first().click({ force: true });
    cy.contains('div.n-button-content', 'Submit').scrollIntoView().click({ force: true });

    cy.get('input[data-testid="article_code_input"]').first().type(vendorStyleCode);
    cy.get('input[data-testid="dropdown-search"]').type('620', { delay: 100 });
    cy.get('.n-options .n-option', { timeout: 5000 }).should('have.length.gt', 0);
    cy.get('.n-options .n-option').contains('6206400').click();

    cy.contains('label', 'Brick Name *').parent().find('.n-select__trigger').click();
    cy.get('.n-options .n-option').contains('Jeans').click();

    cy.contains('p', 'Upload Design').parent().find('input[type="file"]')
      .attachFile('design.jpeg', { force: true });

    // 1st Colorway — AQUA
    cy.contains('p', 'Colorways').scrollIntoView().parent().find('input[type="file"]')
      .attachFile('colorways.jpg', { force: true });
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', { timeout: 10000 })
      .eq(0).should('be.visible').scrollIntoView().click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', 'AQUA').scrollIntoView().click();
   // ✅ Wait for exactly 1 cost input to exist, then type
cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
  .should('have.length', 1)
  .eq(0).scrollIntoView().type('333');

    // 2nd Colorway — ROSE GOLD
    cy.contains('p', 'Colorways').scrollIntoView().parent().find('input[type="file"]')
      .attachFile('rosegold.jpeg', { force: true });
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', { timeout: 10000 })
      .eq(1).should('be.visible').scrollIntoView().click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', 'ROSE GOLD').scrollIntoView().click();
    // ✅ Wait for exactly 2 cost inputs, then type in 2nd
cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
  .should('have.length', 2)
  .eq(1).scrollIntoView().type('350');

    // 3rd Colorway — PISTA GREEN
    cy.contains('p', 'Colorways').scrollIntoView().parent().find('input[type="file"]')
      .attachFile('green.jpeg', { force: true });
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', { timeout: 10000 })
      .eq(2).should('be.visible').scrollIntoView().click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', 'PISTA GREEN').scrollIntoView().click();
   // ✅ Wait for exactly 3 cost inputs, then type in 3rd
cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
  .should('have.length', 3)
  .eq(2).scrollIntoView().type('370');

    // 4th Colorway — TEAL
    cy.contains('p', 'Colorways').scrollIntoView().parent().find('input[type="file"]')
      .attachFile('BLUE.jpeg', { force: true });
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', { timeout: 10000 })
      .eq(3).should('be.visible').scrollIntoView().click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', 'TEAL').scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
  .should('have.length', 4)
  .eq(3).scrollIntoView().type('380');

    // 5th Colorway — MUSTARD
    cy.contains('p', 'Colorways').scrollIntoView().parent().find('input[type="file"]')
      .attachFile('black.jpeg', { force: true });
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', { timeout: 10000 })
      .eq(4).should('be.visible').scrollIntoView().click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', 'MUSTARD').scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
  .should('have.length', 5)
  .eq(4).scrollIntoView().type('390');

    cy.get('div.n-button-content').each(($el) => {
      if ($el.text().trim() === 'Upload') {
        cy.wrap($el).scrollIntoView().parent('button').should('be.visible').click();
        return false;
      }
    });

    // Create Pack 1
    cy.get('button').contains('Create Pack').scrollIntoView().should('be.visible').click();
    cy.get('input[type="number"]').eq(1).clear().type('3');
    cy.get('input[type="number"]').eq(2).clear().type('2');
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 }).should('be.visible').type('650');
    cy.get('button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid')
      .filter(':contains("Create Pack")').click();

    // Duplicate pack check
    cy.get('button').contains('Create Pack').scrollIntoView().should('be.visible').click();
    cy.get('input[type="number"]').eq(1).clear().type('3');
    cy.get('input[type="number"]').eq(2).clear().type('2');
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 }).should('be.visible').type('650');
    cy.get('button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid')
      .filter(':contains("Create Pack")').click();
    cy.contains('button', 'Cancel').click();

    // Create Pack 2
    cy.get('button').contains('Create Pack').scrollIntoView().should('be.visible').click();
    cy.get('input[type="number"]').eq(0).clear().type('3');
    cy.get('input[type="number"]').eq(3).clear().type('3');
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 }).should('be.visible').type('650');
    cy.get('button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid')
      .filter(':contains("Create Pack")').click();

    // Comments
    cy.contains('Comments').click();
    cy.get('#comments').within(() => {
      cy.get('div[contenteditable="true"]').should('be.visible').click().type('Vendor submitted');
      cy.get('button[title="Attach file"]').click({ force: true });
      cy.get('input[type="file"]').selectFile('cypress/fixtures/attachment.jpg', { force: true });
      cy.contains('Save Comment').click();
    });

    cy.get('input[placeholder="Ex. cotton 90% Polyester 10%*"]')
      .first().scrollIntoView().clear().type('cotton90%', { delay: 100 }).blur();

    cy.get('input[placeholder="Ex. 240/160*"]')
      .first().scrollIntoView().clear().type(240 / 160, { delay: 100 }).blur();

    cy.get('div.n-button-content').each(($el) => {
      if ($el.text().trim() === 'Submit') {
        cy.wrap($el).scrollIntoView().parent('button').should('be.visible').click();
        return false;
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 5: Cluster logins and then sends design for rework', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 }).should('be.visible').click();
   
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains('span', 'Submitted Design').click();
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'PENDING').first().click({ force: true })
    cy.contains('button', 'Rework', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'Rework').scrollIntoView().should('be.visible').click({ force: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 6: Vendor dont make any changes and tries to submit design', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains('32021321').click();
   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains('span', 'Submitted Design').click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'REWORK').first().click({ force: true });
    cy.contains('div.n-button-content', 'Edit').click().wait(1000);
    cy.contains('div.n-button-content', 'Submit').parent('button').should('not.have.attr', 'disabled');
    cy.contains('button', 'Submit').scrollIntoView().should('be.visible').click({ force: true }).wait(1000);
  });

  it('Test Case 7: Vendor makes changes to HSN and submit design', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains('32021321').click();
   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains('span', 'Submitted Design').click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'REWORK').first().click({ force: true });
    cy.contains('div.n-button-content', 'Edit').click();

    cy.get('input[data-testid="dropdown-search"]', { timeout: 15000 }).click();
    cy.get('input[data-testid="dropdown-search"]').type('{selectall}{backspace}', { force: true });
    cy.get('input[data-testid="dropdown-search"]').type('620', { delay: 1000 });
    cy.get('.n-options .n-option', { timeout: 5000 }).should('have.length.gt', 0);
    cy.get('.n-options .n-option', { timeout: 10000 }).contains('62033200').click({ force: true });
    cy.contains('div.n-button-content', 'Submit').parent('button').should('not.have.attr', 'disabled');
    cy.contains('button', 'Submit').scrollIntoView().should('be.visible').click({ force: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 8: Cluster logins creates MULTI-3 and MULTI4', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 }).should('be.visible').click();
   
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains('span', 'Submitted Design').click();
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'PENDING').first().click({ force: true });

    // MULTI-3
    cy.get('button').contains('Create Pack').scrollIntoView().should('be.visible').click();
    cy.get('input[type="number"]').eq(1).clear().type('2');
    cy.get('input[type="number"]').eq(2).clear().type('1');
    cy.get('button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid')
      .filter(':contains("Create Pack")').scrollIntoView().should('be.visible').click();

    // MULTI-4
    cy.get('button').contains('Create Pack').scrollIntoView().should('be.visible').click();
    cy.get('input[type="number"]').eq(2).clear().type('7');
    cy.get('input[type="number"]').eq(0).clear().type('3');
    cy.get('button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid')
      .filter(':contains("Create Pack")').scrollIntoView().should('be.visible').click();

    cy.contains('button', 'Rework', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'Rework').scrollIntoView().should('be.visible').click({ force: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 9: Vendor reworks on the design after cluster sends for rework', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains('32021321').click();
   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains('span', 'Submitted Design').click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'REWORK').first().click({ force: true });
    cy.contains('div.n-button-content', 'Edit').click();

    cy.get('input[data-testid="dropdown-search"]', { timeout: 15000 }).click();
    cy.get('input[data-testid="dropdown-search"]').type('{selectall}{backspace}', { force: true });
    cy.get('input[data-testid="dropdown-search"]').type('620', { delay: 1000 });
    cy.get('.n-options .n-option', { timeout: 5000 }).should('have.length.gt', 0);
    cy.get('.n-options .n-option', { timeout: 10000 }).contains('62033200').click({ force: true });

    // MULTI3 — Pack_3 Edge Case: Enter 100 first to trigger toast
    cy.get('button[aria-label="Approve Pack_3"]')
      .closest('[style*="gap: 0.5rem"]').parent().parent()
      .find('input[placeholder="Enter"]')
      .scrollIntoView().click({ force: true })
      .then(($input) => {
        cy.wrap($input).clear({ force: true }).type('100', { force: true });
      });
    cy.get('button[aria-label="Approve Pack_3"]').should('be.visible').click({ force: true });
    cy.contains(/Vendor cost.*cannot be less than colorway cost/i, { timeout: 8000 }).should('be.visible');

    // MULTI3 — Pack_3: Enter correct cost 750 and approve
    cy.get('button[aria-label="Approve Pack_3"]')
      .closest('[style*="gap: 0.5rem"]').parent().parent()
      .find('input[placeholder="Enter"]')
      .scrollIntoView().click({ force: true })
      .then(($input) => {
        cy.wrap($input).clear({ force: true }).type('750', { force: true });
      });
    cy.get('button[aria-label="Approve Pack_3"]').should('be.visible').click({ force: true });

    // MULTI4 — Pack_4
    cy.get('button[aria-label="Approve Pack_4"]')
      .closest('[style*="gap: 0.5rem"]').parent().parent()
      .find('input[placeholder="Enter"]')
      .scrollIntoView().click({ force: true })
      .then(($input) => {
        cy.wrap($input).clear({ force: true }).type('770', { force: true });
      });
    cy.get('button[aria-label="Approve Pack_4"]').should('be.visible').click({ force: true });

    // Edge Case: Update ROSE GOLD colorway cost to 900
    cy.get('img[alt="rose gold"]', { timeout: 10000 })
      .scrollIntoView()
      .parents('div').eq(1)
      .within(() => {
        cy.get('svg').filter((i, el) => {
          return Cypress.$(el).find('title').text().trim() === 'Edit';
        }).click({ force: true });

        cy.get('input[type="number"], input[type="text"]', { timeout: 10000 })
          .not('[class*="dropdown"]')
          .not('[data-testid]')
          .should('be.visible')
          .clear().type('500').blur();

        cy.get('svg').filter((i, el) => {
          return Cypress.$(el).find('title').text().trim() === 'Confirm Edit';
        }).scrollIntoView().click({ force: true });
      });

    cy.contains('div.n-button-content', 'Submit').parent('button').should('not.have.attr', 'disabled');
    cy.contains('button', 'Submit').scrollIntoView().should('be.visible').click({ force: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 10: Cluster checks the rework by vendor and approve the design', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 }).click();
  cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains('span', 'Submitted Design').click();
    cy.get('button[data-testid="filter-button"]').scrollIntoView().should('be.visible').click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'PENDING').first().click({ force: true });
    cy.contains('button', 'Approve').click({ force: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 11: Buyer creates pack and send to vendor', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
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

    cy.contains('span', 'Submitted Design', { timeout: 15000 }).click({ force: true });
    cy.get('button[data-testid="filter-button"]').scrollIntoView().should('be.visible').click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'CLUSTER APPROVED').first().click({ force: true });

    // Pack 1 — rose gold + pista green
    cy.get('button').contains('Create Pack').scrollIntoView().should('be.visible').click();
    cy.contains('p', /rose gold/i).parent().parent().find('input[type="number"]').clear({ force: true }).type('4', { force: true });
    cy.contains('p', /pista green/i).parent().parent().find('input[type="number"]').clear({ force: true }).type('4', { force: true });
    cy.get('button.n-button-primary').contains('Create Pack').should('not.be.disabled').click();

    // Pack 2 — rose gold + teal
    cy.get('button').contains('Create Pack').scrollIntoView().should('be.visible').click();
    cy.contains('p', /rose gold/i).parent().parent().find('input[type="number"]').clear({ force: true }).type('4', { force: true });
    cy.contains('p', /teal/i).parent().parent().find('input[type="number"]').clear({ force: true }).type('4', { force: true });
    cy.get('button.n-button-primary').contains('Create Pack').should('not.be.disabled').click();

    cy.contains('button', 'Rework', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'Rework').click();
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 12: Vendor logs in back and rework the design sent by buyer for rework', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains('32021321').click();
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains('span', 'Submitted Design').click({ force: true });
    cy.get('button[data-testid="filter-button"]').scrollIntoView().should('be.visible').click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'REWORK').first().click({ force: true });
    cy.contains('div.n-button-content', 'Edit').click();

    // Edge Case: Try to delete ROSE GOLD colorway
    cy.get('button[title="Delete"]', { timeout: 10000 })
      .eq(1).scrollIntoView().click({ force: true });

    function enterCostAndApprove(sapColorId, cost, packName) {
      cy.contains(sapColorId).siblings().find('input[placeholder="Enter"]')
        .scrollIntoView().click({ force: true })
        .then(($input) => {
          const val = $input.val();
          if (val && val !== '') {
            cy.wrap($input).clear({ force: true }).type(cost, { force: true });
          } else {
            cy.wrap($input).type(cost, { force: true });
          }
        });
      cy.get(`button[aria-label="Approve ${packName}"]`).should('be.visible').click({ force: true });
    }

    enterCostAndApprove('MULTI5', '750', 'Pack_5');
    enterCostAndApprove('MULTI6', '550', 'Pack_6');

    cy.contains('button', 'Submit').scrollIntoView().should('be.visible').click();
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 13: Buyer Parks', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
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

    cy.contains('span', 'Submitted Design', { timeout: 15000 }).click({ force: true });
    cy.get('button[data-testid="filter-button"]').scrollIntoView().should('be.visible').click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'CLUSTER APPROVED').first().click({ force: true });

    cy.contains('button', 'Park').should('be.visible').click({ force: true });
    cy.contains('span', 'Parked Design').should('be.visible').click({ force: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 14: Buyer Unparks the design', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
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

    cy.contains('span', 'Parked Design', { timeout: 15000 }).click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('div.n-button-content', 'Move to Active')
      .scrollIntoView().should('be.visible').click({ force: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 15: Buyer Parks again', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
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

    cy.contains('span', 'Submitted Design', { timeout: 15000 }).click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'CLUSTER APPROVED').first().click({ force: true });

    cy.contains('button', 'Park').should('be.visible').click({ force: true });
    cy.contains('span', 'Parked Design').should('be.visible').click({ force: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 16: Buyer Rework the parked design', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
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

    cy.contains('span', 'Parked Design').click({ force: true });

    cy.get('table tbody tr td:nth-child(2)').first().within(() => {
      cy.get('div[data-testid="link-with-context"] span').click({ force: true });
    });

    cy.contains('button', 'Rework').click();
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 17: Vendor reworks the design second time after buyer sent for rework', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains('32021321').click();
   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains('span', 'Submitted Design').click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'REWORK').first().click({ force: true });
    cy.contains('div.n-button-content', 'Edit').click();

    cy.get('input[data-testid="dropdown-search"]', { timeout: 15000 }).click();
    cy.get('input[data-testid="dropdown-search"]').type('{selectall}{backspace}', { force: true });
    cy.get('input[data-testid="dropdown-search"]').type('620', { delay: 1000 });
    cy.get('.n-options .n-option', { timeout: 5000 }).should('have.length.gt', 0);
    cy.get('.n-options .n-option', { timeout: 10000 }).contains('62046990').click({ force: true });

    cy.contains('button', 'Submit').scrollIntoView().should('be.visible').click({ force: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 18: Buyer checks the design and approve the design', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
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

    cy.contains('span', 'Submitted Design', { timeout: 15000 }).click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'CLUSTER APPROVED').first().click({ force: true });

    cy.get('button').contains('Select Size').click({ force: true });
    cy.get('.n-options .n-option', { timeout: 10000 });
    cy.get('input[value="size-group-0"]', { timeout: 10000 }).should('be.visible').check({ force: true });

    cy.get('#design-and-colorway', { timeout: 10000 }).scrollIntoView({ duration: 500 });

    let approvedCount = 0;
    cy.get('#design-and-colorway [id]', { timeout: 10000 })
      .filter((i, el) => /^\d+$/.test(el.id))
      .each(($row) => {
        if (approvedCount >= 2) return false;
        const isPending = $row.find('p').toArray()
          .some((p) => Cypress.$(p).text().trim() === 'PENDING');
        if (isPending) {
          cy.wrap($row).scrollIntoView({ duration: 300 })
            .find('button[title="Approve"]').first().should('be.visible').click({ force: true });
          approvedCount++;
        }
      });
    cy.wait(10000);

    cy.get('button[aria-label="Approve Pack_1"]', { timeout: 10000 })
      .scrollIntoView({ duration: 300 }).should('be.visible').click({ force: true }).wait(1000);
    cy.get('button[aria-label="Approve Pack_2"]', { timeout: 10000 })
      .scrollIntoView({ duration: 300 }).should('be.visible').click({ force: true }).wait(1000);
    cy.get('button[aria-label="Approve Pack_4"]', { timeout: 10000 })
      .scrollIntoView({ duration: 300 }).should('be.visible').click({ force: true });

    cy.contains(/Please change SAP color ID.*MULTI4.*does not exist/i, { timeout: 8000 }).should('be.visible');
    cy.wait(10000);

    cy.get('#design-and-colorway #2', { timeout: 10000 }).scrollIntoView().within(() => {
      cy.get('input[data-testid="dropdown-search"]')
        .click({ force: true }).clear({ force: true }).type('MULTI1', { delay: 100 }).wait(1000);
      cy.get('[data-testid="dropdown-scroll"]:visible .n-option').contains('MULTI1').click({ force: true });
      cy.get('button[title="Approve"]').scrollIntoView().should('be.visible').click({ force: true }).wait(1000);
    });
    cy.wait(10000);

    cy.get('#design-and-colorway #2', { timeout: 10000 }).scrollIntoView().within(() => {
      cy.get('input[data-testid="dropdown-search"]')
        .click({ force: true }).clear({ force: true }).type('ROSE GOLD', { delay: 100 });
      cy.get('[data-testid="dropdown-scroll"]:visible .n-option').contains('ROSE GOLD').click({ force: true });
      cy.get('button[title="Approve"]').scrollIntoView().should('be.visible').click({ force: true });
    });
    cy.wait(10000);

    cy.get('#vendor-pack-quantity-dropdown-0', { timeout: 10000 }).scrollIntoView().within(() => {
      cy.get('.n-select__trigger').click({ force: true });
      cy.get('[data-testid="dropdown-scroll"] .n-option').contains('150').click({ force: true });
    });
    cy.wait(1000);

    cy.contains('button', 'Approve', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'Approve').click({ force: true }).wait(10000);

    cy.get('#design-and-colorway #2', { timeout: 10000 }).scrollIntoView().within(() => {
      cy.get('button[title="Approve"]').should('be.visible').click({ force: true });
    });
    cy.wait(1000);

    cy.contains('button', 'Approve', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'Approve').click({ force: true }).wait(10000);

    cy.get('button[aria-label="Approve Pack_1"]', { timeout: 10000 })
      .scrollIntoView({ duration: 300 }).should('be.visible').click({ force: true });
    cy.get('button[aria-label="Approve Pack_2"]', { timeout: 10000 })
      .scrollIntoView({ duration: 300 }).should('be.visible').click({ force: true });
    cy.wait(1000);

    cy.contains('button', 'Approve', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'Approve').click({ force: true }).wait(10000);
    //cy.contains(/successfully submitted design/i, { timeout: 15000 }).should('be.visible');
  });

  // ─────────────────────────────────────────────────────────────────────────
  it("FPT and GPT approve", () => {
      cy.visit("https://platform.impetusz0.de/workspace").wait(10000);
  
      // Click on the cluster card "Shein"
      cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
        .click()
        .wait(10000);
      cy.contains("span.side-navigation-panel-select-option-text", "QC")
        .parents("span.side-navigation-panel-select-option-wrap")
        .click();
      cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
        .contains("FPT & GPT")
        .click()
        .wait(15000);
  
      cy.get('input[placeholder="Search via Style IDs or other values"]')
        .type(vendorStyleCode)
        .wait(1000);
      cy.contains("BUYER APPROVED").click({ force: true });
      cy.get('label[for="required-no"]').click();
      cy.contains("label", "I acknowledge the test completed").click();
      cy.contains("div.n-button-content", "Submit").click().wait(1000);
      cy.wait(150000);
    });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 20: Pick plm style id and hit DP create api', () => {
    cy.visit('https://platform.impetusz0.de/workspace');

   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
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

    cy.contains('span', 'Submitted Design', { timeout: 15000 }).click({ force: true });
    cy.wait(10000);
    cy.get('input[placeholder="Search"]').type(themeName).wait(10000);

    cy.get('[data-testid="link-with-context"] span').eq(2).invoke('text').then((t) => t.trim())
      .then((styleCode) => {
        cy.getCookies().then((cookies) => {
          const cookieHeader = cookies.map((c) => `${c.name}=${c.value}`).join('; ');
          cy.request({
            method: 'POST',
            url: 'https://api.impetusz0.de/service/application/odm/v1.0/uvp/dp/create',
            headers: {
              'Content-Type': 'application/json',
              Cookie: cookieHeader,
              'x-user-data': JSON.stringify({
                user_id: '2127',
                email: 'chaitanya.dhoddi@ril.com',
                roles: ['odm-cluster'],
              }),
            },
            body: { styleCode },
          });
        });
      });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 21: PP sample: Vendor submits the sample design', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains('32021321').click();

    cy.contains('span.side-navigation-panel-select-option-text', 'QC')
      .parents('span.side-navigation-panel-select-option-wrap').click();
    cy.get('div.side-navigation-panel-select-inner-option', { timeout: 15000 })
      .contains('PP Sample').should('be.visible').and('not.be.disabled').click();
    //cy.url({ timeout: 15000 }).should('include', 'pp');

    cy.get('input[placeholder="Search"]').type(vendorStyleCode).wait(10000);
    cy.contains('PP PENDING').wait(1000).click({ force: true }).wait(1000);

    cy.contains('div.n-button-content', 'Upload Files')
      .parents('button').parent().find('input[type="file"]')
      .selectFile('cypress/fixtures/design.jpeg', { force: true });

    cy.contains('button', 'Submit Sample').click().wait(1000);
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 22: PP sample: Buyer sends the design for resubmission', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
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
   
    

    cy.contains('span.side-navigation-panel-select-option-text', 'QC')
      .parents('span.side-navigation-panel-select-option-wrap').click();
    cy.get('div.side-navigation-panel-select-inner-option', { timeout: 15000 })
      .contains('PP Sample').should('be.visible').and('not.be.disabled').click();
    //cy.url({ timeout: 15000 }).should('include', 'pp');

    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('PP BUYER PENDING').first().click({ force: true });

    cy.contains('I acknowledge that I have thoroughly checked the sample')
      .scrollIntoView().parent().find('input[type="checkbox"]').check({ force: true });

    cy.get('button').contains('Request Resubmission').click();
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 23: PP sample: Vendor submits the sample again on resubmitted design', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains('32021321').click();

    cy.contains('span.side-navigation-panel-select-option-text', 'QC')
      .parents('span.side-navigation-panel-select-option-wrap').click();
    cy.get('div.side-navigation-panel-select-inner-option', { timeout: 15000 })
      .contains('PP Sample').should('be.visible').and('not.be.disabled').click();
    //cy.url({ timeout: 15000 }).should('include', 'pp');

    cy.get('input[placeholder="Search"]').type(vendorStyleCode);
    cy.contains('PP RESUBMISSION').click({ force: true });

    cy.contains('div.n-button-content', 'Upload Files')
      .parents('button').parent().find('input[type="file"]')
      .selectFile('cypress/fixtures/pppic.jpg', { force: true });

    cy.contains('button', 'Submit Sample').click();
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 24: PP sample: Buyer approves the design', () => {
    cy.visit('https://platform.impetusz0.de/workspace')
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
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
   
    

    cy.contains('span.side-navigation-panel-select-option-text', 'QC')
      .parents('span.side-navigation-panel-select-option-wrap').click();
    cy.get('div.side-navigation-panel-select-inner-option', { timeout: 15000 })
      .contains('PP Sample').should('be.visible').and('not.be.disabled').click();
    cy.url({ timeout: 15000 }).should('include', 'pp');

    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('PP BUYER PENDING').first().click({ force: true });

    cy.contains('I acknowledge that I have thoroughly checked the sample')
      .scrollIntoView().parent().find('input[type="checkbox"]').check({ force: true });

    cy.get('button').contains('Approve').click();
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 25: PP approval for Cluster approval for submitted design', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 }).click();

    cy.contains('span.side-navigation-panel-select-option-text', 'UVP')
      .parents('span.side-navigation-panel-select-option-wrap').click();
    cy.get('div.side-navigation-panel-select-inner-option', { timeout: 15000 })
      .contains('ODM').should('be.visible').and('not.be.disabled').click();
    cy.url({ timeout: 15000 }).should('include', 'odm');

    cy.contains('span', 'Submitted Design').click();
    cy.get('button[data-testid="filter-button"]').scrollIntoView().should('be.visible').click({ force: true });
    cy.get('input[placeholder="Search"]').type(vendorStyleCode);
    cy.contains('PP CLUSTER PENDING').click({ force: true });

    cy.contains('I acknowledge that I have thoroughly checked the sample')
      .scrollIntoView().parent().find('input[type="checkbox"]').check({ force: true });

    cy.get('button').contains('Approve').click();
  });


  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 27: Submit the design for Buyer Reject Scenario', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains('32021321').click();
   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.get('input[placeholder="Search"]').type(themeName);
    cy.get('div.n-button-content').contains('View').first().click({ force: true });
    cy.contains('div.n-button-content', 'Submit').scrollIntoView().click({ force: true });

    cy.get('input[data-testid="article_code_input"]').first().type(vendorStyleCode);
    cy.get('input[data-testid="dropdown-search"]').type('620', { delay: 100 });
    cy.get('.n-options .n-option', { timeout: 5000 }).should('have.length.gt', 0);
    cy.get('.n-options .n-option').contains('6206400').click();

    cy.contains('label', 'Brick Name *').parent().find('.n-select__trigger').click();
    cy.get('.n-options .n-option').contains('Jeans').click();

    cy.contains('p', 'Upload Design').parent().find('input[type="file"]')
      .attachFile('design.jpeg', { force: true });
    cy.contains('p', 'Upload Design').parent().find('input[type="file"]')
      .attachFile('design2.jpg', { force: true });

    // Colorway 1 — AQUA
    cy.contains('p', 'Colorways').parent().find('input[type="file"]')
      .attachFile('colorways.jpg', { force: true });
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .eq(0).scrollIntoView().click();
    cy.get('[data-testid="dropdown-scroll"]:visible').contains('.n-option', 'AQUA').scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]').eq(0).type('333');

    cy.get('div.n-button-content').each(($el) => {
      if ($el.text().trim() === 'Upload') {
        cy.wrap($el).scrollIntoView().parent('button').should('be.visible').click();
        return false;
      }
    });

    // Colorway 2 — TEAL
    cy.contains('p', 'Colorways').parent().find('input[type="file"]')
      .attachFile('BLUE.jpeg', { force: true });
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .eq(1).scrollIntoView().click();
    cy.get('[data-testid="dropdown-scroll"]:visible').contains('.n-option', 'TEAL').scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]').eq(1).type('190');

    cy.get('div.n-button-content').each(($el) => {
      if ($el.text().trim() === 'Upload') {
        cy.wrap($el).scrollIntoView().parent('button').should('be.visible').click();
        return false;
      }
    });

    cy.get('input[placeholder="Ex. cotton 90% Polyester 10%*"]')
      .first().scrollIntoView().clear().type('cotton90%', { delay: 100 }).blur();

    cy.get('input[placeholder="Ex. 240/160*"]')
      .first().scrollIntoView().clear().type(240 / 160, { delay: 100 }).blur();

    cy.contains('div.n-button-content', 'Submit', { timeout: 15000 })
      .parent('button').should('not.have.attr', 'disabled');

    cy.get('div.n-button-content').each(($el) => {
      if ($el.text().trim() === 'Submit') {
        cy.wrap($el).scrollIntoView().parent('button').should('be.visible').click();
        return false;
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 28: Cluster approves the design and send it to buyer', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 }).click();
   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains('span', 'Submitted Design').click();
    cy.get('button[data-testid="filter-button"]').scrollIntoView().should('be.visible').click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'PENDING').first().click({ force: true });
    cy.contains('button', 'Approve').click({ force: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it('Test Case 29: Buyer approves colorways and reject the design', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
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

    cy.contains('span', 'Submitted Design', { timeout: 15000 }).click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'CLUSTER APPROVED').first().click({ force: true });

    cy.get('button').contains('Select Size').click({ force: true });
    cy.get('.n-options .n-option', { timeout: 10000 });
    cy.get('input[value="size-group-0"]').check({ force: true });

    cy.get('button[title="Approve"]', { timeout: 10000 }).should('be.visible');
    cy.get('button[title="Approve"]').eq(0).click({ force: true });
    cy.get('button[title="Approve"]').eq(1).click({ force: true });

    cy.contains('button', 'Reject', { timeout: 15000 }).should('be.visible');
    cy.contains('button', 'Reject').click({ force: true });
  });

  //------------Cluster Rejects the design

  // ─────────────────────────────────────────────────────────────────────────
  xit('Test Case 30: Submit the design for Buyer Reject Scenario', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains('32021321').click();
   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.get('input[placeholder="Search"]').type(themeName);
    cy.get('div.n-button-content').contains('View').first().click({ force: true });
    cy.contains('div.n-button-content', 'Submit').scrollIntoView().click({ force: true });

    cy.get('input[data-testid="article_code_input"]').first().type(vendorStyleCode);
    cy.get('input[data-testid="dropdown-search"]').type('620', { delay: 100 });
    cy.get('.n-options .n-option', { timeout: 5000 }).should('have.length.gt', 0);
    cy.get('.n-options .n-option').contains('6206400').click();

    cy.contains('label', 'Brick Name *').parent().find('.n-select__trigger').click();
    cy.get('.n-options .n-option').contains('Jeans').click();

    cy.contains('p', 'Upload Design').parent().find('input[type="file"]')
      .attachFile('design.jpeg', { force: true });
    cy.contains('p', 'Upload Design').parent().find('input[type="file"]')
      .attachFile('design2.jpg', { force: true });

    // Colorway 1 — AQUA
    cy.contains('p', 'Colorways').parent().find('input[type="file"]')
      .attachFile('colorways.jpg', { force: true });
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .eq(0).scrollIntoView().click();
    cy.get('[data-testid="dropdown-scroll"]:visible').contains('.n-option', 'AQUA').scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]').eq(0).type('333');

    cy.get('div.n-button-content').each(($el) => {
      if ($el.text().trim() === 'Upload') {
        cy.wrap($el).scrollIntoView().parent('button').should('be.visible').click();
        return false;
      }
    });

    // Colorway 2 — TEAL
    cy.contains('p', 'Colorways').parent().find('input[type="file"]')
      .attachFile('BLUE.jpeg', { force: true });
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .eq(1).scrollIntoView().click();
    cy.get('[data-testid="dropdown-scroll"]:visible').contains('.n-option', 'TEAL').scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]').eq(1).type('190');

    cy.get('div.n-button-content').each(($el) => {
      if ($el.text().trim() === 'Upload') {
        cy.wrap($el).scrollIntoView().parent('button').should('be.visible').click();
        return false;
      }
    });

    cy.get('input[placeholder="Ex. cotton 90% Polyester 10%*"]')
      .first().scrollIntoView().clear().type('cotton90%', { delay: 100 }).blur();

    cy.get('input[placeholder="Ex. 240/160*"]')
      .first().scrollIntoView().clear().type(240 / 160, { delay: 100 }).blur();

    cy.contains('div.n-button-content', 'Submit', { timeout: 15000 })
      .parent('button').should('not.have.attr', 'disabled');

    cy.get('div.n-button-content').each(($el) => {
      if ($el.text().trim() === 'Submit') {
        cy.wrap($el).scrollIntoView().parent('button').should('be.visible').click();
        return false;
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  xit('Test Case 31: Cluster approves the design and send it to buyer', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');

    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 }).click();
   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains('span', 'Submitted Design').click();
    cy.get('button[data-testid="filter-button"]').scrollIntoView().should('be.visible').click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains('p', 'PENDING').first().click({ force: true });
    cy.contains('button', 'Reject').click({ force: true }).wait(1000);
  });

  // ─────────────────────────────────────────────────────────────────────────
  Cypress.on('uncaught:exception', (err) => {
    return false;
  });

});