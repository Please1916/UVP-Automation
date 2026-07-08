//  Global theme name for the entire spec
const randomString = Math.random().toString(36).substring(2, 10);
export const themeName = `Test_${randomString}`;
const randomStyleCode = `Style_${Math.random().toString(36).substring(2, 8)}`;
export const vendorStyleCode = randomStyleCode;

describe("Impetus Platform — Login Page Tests", () => {
  beforeEach(() => {
    cy.session("user-session", () => {
      cy.login();
    }, {
      cacheAcrossSpecs: true,
      validate() {
        cy.getCookies().should('have.length.greaterThan', 0);
      },
    });
  });

  afterEach(function () {
    if (this.currentTest && this.currentTest.state === "failed") {
      const testTitle = this.currentTest.title || "Unknown Test";
      const errMessage = this.currentTest.err?.message || "Unknown error";

      // Attach a screenshot automatically
      cy.screenshot(`${testTitle}-failed`);

      // // Only attach to allure if the reporter is actually initialised
      // if (Cypress.env("allure") === true) {
      //   cy.allure().step(
      //     `Test "${testTitle}" failed.
      //  Please verify business expectations.
      //  Error: ${errMessage}`,
      //     { status: "failed" },
      //   );
      //   cy.allure().attachment("Cypress Error", errMessage, "text/plain");
      // }
    }
  });
  after(() => {
    cy.logout({ force: true });
  });

  //Logs in with valid credentials
  
it("Test Case 1: logs in successfully with valid credentials and check the workspace", () => {
  cy.visit("https://platform.uat.impetusz0.de/workspace");

  // Wait for the page to be interactive — icon visible means app has loaded
  cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    //UAT
  cy.get('[data-testid="Shein-odm-buyer"]')
      .find('p').first()
      .scrollIntoView({ offset: { top: -100 } })
      .click({ force: true });
  // Wait for workspace cards to be visible before interacting
  // cy.get(".sc-ikkxIA", { timeout: 20000 }).should("be.visible");

  //SIT
  // cy.get(".sc-ikkxIA")
  //   .filter(':contains("Shein")')
  //   .filter(':contains("odm-buyer")')
  //   .find("div")
  //   .contains("Shein")
  //   .should("be.visible")
  //   .click({ force: true });
   
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
  });

  //Upload inspiration
  it("Test Case 2: logs in successfully to buyer and upload inspiration file", () => {
  cy.visit("https://platform.uat.impetusz0.de/workspace");

  // ─── Step 1: Select workspace card ───────────────────────────────────────

  //SIT
  cy.get(".sc-ikkxIA")
    .filter(':contains("Shein")')
    .filter(':contains("odm-buyer")')
    .find("div")
    .contains("Shein")
    .should("be.visible")
    .click({ force: true });

   //UAT 
  // cy.get('[data-testid="Shein-odm-buyer"]')
  //   .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh")
  //   .contains(/^S$/)
  //   .scrollIntoView({ offset: { top: -100 } })
  //   .click({ force: true });

  // ─── Step 2: Navigate to UVP > ODM ───────────────────────────────────────
  cy.contains("span.side-navigation-panel-select-option-text", "UVP")
    .parents("span.side-navigation-panel-select-option-wrap")
    .click();

  cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
    .contains("ODM")
    .click();

  // ─── Step 3: Open Upload Inspiration modal ────────────────────────────────
  cy.contains("div.n-button-content", "Upload Inspiration").click();

  // ─── Step 4: Upload PDF inspiration file ─────────────────────────────────
  cy.contains("p", /^Supported Format: pdf/, { timeout: 30000 })
    .should("be.visible")
    .parents("div")
    .find('input[type="file"][accept=".pdf"]')
    .first()
    .selectFile("cypress/fixtures/inspiration.pdf", { force: true });

  // ─── Step 5: Upload XLSX brick file ──────────────────────────────────────
  cy.contains("p", "Supported Format: xlsx", { timeout: 30000 })
    .should("be.visible")
    .parents("div")
    .find('input[type="file"][accept=".xlsx"]')
    .first()
    .selectFile("cypress/fixtures/BrickFile.xlsx", { force: true });

  // ─── Step 6: Enter theme name ─────────────────────────────────────────────
  cy.get("input#themeName", { timeout: 10000 })
    .should("be.visible")
    .type(themeName, { force: true });

  // ─── Step 7: Pick expiry date (today + 2 days) ───────────────────────────
  cy.get("input.custom-input").click({ force: true });

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 2);

  cy.get(".react-datepicker__day:not(.react-datepicker__day--disabled)")
    .not(".react-datepicker__day--outside-month")
    .contains(new RegExp(`^${targetDate.getDate()}$`))
    .click({ force: true });

  // ─── Step 8: Select cluster dropdown ─────────────────────────────────────

  // 8a: Open the dropdown by clicking the search input
  cy.get('[data-testid="dropdown-search"]')
    .should("be.visible")
    .click({ force: true });

  // 8b: Verify the options list is visible
  cy.get('[data-testid="dropdown-scroll"]')
    .should("be.visible");

  // 8c: Select "Bangladesh" using its data-value attribute
  cy.get('[data-value="Bangladesh"]')
    .should("be.visible")
    .click({ force: true });

  // 8d: Verify Bangladesh is reflected in the dropdown input
  cy.get('[data-testid="dropdown-search"]')
    .should("have.value", "Bangladesh");

  // ─── Step 9: Enter description ────────────────────────────────────────────
  cy.get("#desc").type("this is added for automation testing");


  // ─── Step 10: Intercept upload API & click Continue ───────────────────────
  cy.intercept(
    "POST",
    "https://api.impetusz0.de/service/application/odm/v1.0/uvp/moodboards/upload"
  ).as("uploadInspiration");

  cy.contains("button", "Continue", { timeout: 20000 })
    .should("be.visible")
    .and("not.be.disabled")
    .click({ force: true });

   // ─── Step 11: Wait for success toast ─────────────────────────────────────
  cy.contains("Inspiration uploaded successfully", { timeout: 30000 })
    .should("be.visible");
});

  //Go to buyer role
  it("Test Case 3: Buyer shares the Uploaded theme and share it with a vendor", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");

  // Wait for the page to be interactive — icon visible means app has loaded
  cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
  // ─── Step 1: Select workspace card ───────────────────────────────────────

  //SIT
  cy.get(".sc-ikkxIA")
    .filter(':contains("Shein")')
    .filter(':contains("odm-buyer")')
    .find("div")
    .contains("Shein")
    .should("be.visible")
    .click({ force: true });

   //UAT 
  // cy.get('[data-testid="Shein-odm-buyer"]')
  //   .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh")
  //   .contains(/^S$/)
  //   .scrollIntoView({ offset: { top: -100 } })
  //   .click({ force: true });
  
    //const res = cy.get("div.side-navigation-panel-select-inner-option", {timeout: 5000}).contains("ODM");
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap");

    cy.contains("span.side-navigation-panel-select-option-text", "UVP", {
      timeout: 15000,
    }).click({ force: true });
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.get('input[placeholder="Search"]').type(themeName);
    cy.get("tr")
      .first()
      .find("td")
      .eq(1)
      .find("span")
      .invoke("text")
      .then((id) => {
        const moodboardId = id.trim();

        cy.writeFile("cypress/fixtures/runtimeData.json", {
          odmMoodboardId: moodboardId,
        });

        cy.log(`Saved Moodboard ID: ${moodboardId}`);
      });


    // Wait for table rows to load
    cy.get('button[role="checkbox"]', { timeout: 10000 })
      .eq(1) // 0 = first, 1 = second
      .click({ force: true });

    // Click the "Share" button SVG icon
    //cy.get('button[role="checkbox"]').first().click({ force: true });
    cy.contains("div.n-button-content", "Share").click({ force: true });
    cy.contains("div", "Share moodboards to vendor")
      .parent() // moves to the parent container that holds both the text and arrow
      .find("svg") // locate the right arrow svg
      .last() // ensure we pick the arrow (not the user icon on the left)
      .click({ force: true });

    
    cy.get('input[placeholder="Select / Search item"]').type("KIRARA   ",);
    cy.contains("label", "KIRARA  - 32021182")
      .scrollIntoView()
      .find('input[type="checkbox"]')
      .check({ force: true });


    cy.contains("div.n-button-content", "Share")
      .click({ force: true });

  });

  //Vendor role
it("Test Case 4: Vendor verifies that shared Inspiration is visible and submit design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.contains("32021182").click();
    // cy.get("div.sc-dAbbOL.vIbA-D")
    //   .contains("32021182")
    //   .click({ force: true })
    //   ;

    // Click UVP to expand the submenu
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();

    // Wait for the ODM submenu item to be visible AND stable before clicking
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 15000 })
      .contains("ODM")
      .should("be.visible")
      .and("not.be.disabled")
      .click();
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.get("div.n-button-content")
      .contains("View")
      .first()
      .click({ force: true });

    // Scroll to the "Submit" button and click it
    cy.contains("div.n-button-content", "Submit")
      .scrollIntoView()
      .click({ force: true });

    cy.get('input[data-testid="article_code_input"]')
      .first()
      .type(vendorStyleCode);
    // Type into the search input
    //cy.get('input[data-testid="dropdown-search"]').type("6206400{enter}");

    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });

    // Wait for the dropdown options to load
    cy.get(".n-options .n-option", { timeout: 5000 }).should("have.length.gt", 0);
    cy.get("body").then(($body) => {
      console.log($body.html()); // logs HTML to Cypress runner console
    });
    // Select the correct code (assuming dropdown options appear as list items)
    cy.get(".n-options .n-option") // adjust selector to match your dropdown option class
      .contains("6206400")
      .click();

    cy.contains("label", "Brick Name *")
      // Navigate to the closest wrapper containing the dropdown trigger
      .parent()
      .find(".n-select__trigger")
      .click(); // Open the dropdown

    // Step 2: Select the first option from the dropdown
    cy.get(".n-options .n-option").contains("Jeans").click();

    cy.contains("p", "Upload Design") // find the container by its text
      .parent() // go to the wrapper div
      .find('input[type="file"]') // find the hidden input
      .attachFile("design.jpeg", { force: true });

    // 1st Colorway - AQUA
    cy.contains("p", "Colorways")
      .scrollIntoView()
      .parent()
      .find('input[type="file"]')
      .attachFile("colorways.jpg", { force: true });

    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', {
      timeout: 10000,
    })
      .eq(0)
      .should("be.visible")
      .scrollIntoView()
      .click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "AQUA")
      .scrollIntoView()
      .click();
    cy.contains("p", "Colorways").scrollIntoView();
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
      .eq(0)
      .should("be.visible")
      .scrollIntoView()
      .type("333");

    // 2nd Colorway - ROSE GOLD
    cy.contains("p", "Colorways")
      .scrollIntoView()
      .parent()
      .find('input[type="file"]')
      .attachFile("rosegold.jpeg", { force: true });

    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', {
      timeout: 10000,
    })
      .eq(1)
      .should("be.visible")
      .scrollIntoView()
      .click();
    cy.contains(
      '[data-testid="dropdown-scroll"]:visible .n-option',
      "ROSE GOLD",
    )
      .scrollIntoView()
      .click();
    cy.contains("p", "Colorways").scrollIntoView();
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
      .eq(1)
      .should("be.visible")
      .scrollIntoView()
      .type("350");

    // 3rd Colorway - GREEN
    cy.contains("p", "Colorways")
      .scrollIntoView()
      .parent()
      .find('input[type="file"]')
      .attachFile("green.jpeg", { force: true });

    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', {
      timeout: 10000,
    })
      .eq(2)
      .should("be.visible")
      .scrollIntoView()
      .click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "PISTA GREEN")
      .scrollIntoView()
      .click();
    cy.contains("p", "Colorways").scrollIntoView();
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
      .eq(2)
      .should("be.visible")
      .scrollIntoView()
      .type("370");

    // 4th Colorway - TEAL
    cy.contains("p", "Colorways")
      .scrollIntoView()
      .parent()
      .find('input[type="file"]')
      .attachFile("BLUE.jpeg", { force: true });

    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', {
      timeout: 10000,
    })
      .eq(3)
      .should("be.visible")
      .scrollIntoView()
      .click(); 
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "TEAL")
      .scrollIntoView()
      .click();
    cy.contains("p", "Colorways").scrollIntoView();
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
      .eq(3)
      .should("be.visible")
      .scrollIntoView()
      .type("380"); // ✅ eq(3) not eq(2)

    // 5th Colorway - MUSTARD
    cy.contains("p", "Colorways")
      .scrollIntoView()
      .parent()
      .find('input[type="file"]')
      .attachFile("black.jpeg", { force: true });

    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', {
      timeout: 10000,
    })
      .eq(4)
      .should("be.visible")
      .scrollIntoView()
      .click(); // ✅ eq(4) not eq(2)
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "MUSTARD")
      .scrollIntoView()
      .click();
    cy.contains("p", "Colorways").scrollIntoView();
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
      .eq(4)
      .should("be.visible")
      .scrollIntoView()
      .type("390"); // ✅ eq(4) not eq(2)

    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      if (text === "Upload") {
        // Scroll into view, find the parent button, then click
        cy.wrap($el)
          .scrollIntoView()
          .parent("button")
          .should("be.visible")
          .click();

        // Stop iterating once found
        return false;
      }
    });

    //Create one pack by vendor with any of the available colorways
    
    cy.get("button").contains("Create Pack").scrollIntoView().should("be.visible").click();
    cy.get('input[type="number"]').eq(1).clear().type("3"); //
    cy.get('input[type="number"]').eq(2).clear().type("2"); //
    cy.get("input[placeholder='Enter cost']", { timeout: 10000 }).should("be.visible");
    cy.get("input[placeholder='Enter cost']").type("650");
    cy.get(
      "button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid",
    )
      .filter(':contains("Create Pack")')
      .click();


    //Check duplicate pack
    cy.get("button").contains("Create Pack").scrollIntoView().should("be.visible").click();
    cy.get('input[type="number"]').eq(1).clear().type("3"); //
    cy.get('input[type="number"]').eq(2).clear().type("2"); //
    cy.get("input[placeholder='Enter cost']", { timeout: 10000 }).should("be.visible");
    cy.get("input[placeholder='Enter cost']").type("650");
    cy.get(
      "button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid",
    )
      .filter(':contains("Create Pack")')
      .click();

     cy.contains('button', 'Cancel').click();  

    cy.get("button").contains("Create Pack").scrollIntoView().should("be.visible").click();
    cy.get('input[type="number"]').eq(0).clear().type("3"); //
    cy.get('input[type="number"]').eq(3).clear().type("3"); //
    cy.get("input[placeholder='Enter cost']", { timeout: 10000 }).should("be.visible");
    cy.get("input[placeholder='Enter cost']").type("650");
    cy.get(
      "button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid",
    )
      .filter(':contains("Create Pack")')
      .click();

    //cy.contains('button', 'Cancel').click();

    // Open comments if needed
    cy.contains("Comments").click();

    // Work ONLY inside comments section
    cy.get("#comments").within(() => {
      // Type comment
      cy.get('div[contenteditable="true"]')
        .should("be.visible")
        .click()
        .type("Vendor submitted");

      // Click attach icon
      cy.get('button[title="Attach file"]').click({ force: true });

      // Upload file (correct input now)
      cy.get('input[type="file"]')
        .selectFile("cypress/fixtures/attachment.jpg", { force: true });


      // Save comment
      cy.contains("Save Comment").click();
    });

    //https://assets.impetusz0.de/d2sz0-unified-vendor-portal/design-files/design_20251106_172801.jpeg

    cy.get('input[placeholder="Ex. cotton 90% Polyester 10%*"]')
      .first()
      .scrollIntoView()
      .clear()
      .type("cotton90%", { delay: 100 })
      .blur();

    cy.get('input[placeholder="Ex. 240/160*"]')
      .first()
      .scrollIntoView()
      .clear()
      .type(240 / 160, { delay: 100 })
      .blur();


  //   cy.contains("div.n-button-content", "Submit")
  // .parent("button")
  // .should("not.have.attr", "disabled");
  


    cy.get("div.n-button-content").each(($el) => {
  const text = $el.text().trim();

  if (text === "Submit") {
  cy.wrap($el)
    .scrollIntoView()
    .click();


  return false;
}
});

  });


  //Cluster role
  it("Test Case 5: Cluster logins creates MULTI-3 and MULTI4 ", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    // Click on the cluster card "Shein"
   
// Click the Shein ODM cluster and wait for navigation to settle
cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
  .should("be.visible")
  .click();

// Wait for UVP to appear in the sidebar — confirms workspace loaded
cy.contains("span.side-navigation-panel-select-option-text", "UVP", { timeout: 20000 })
  .should("be.visible")
  .parents("span.side-navigation-panel-select-option-wrap")
  .click();

// Wait for ODM submenu to expand and be interactive before clicking
cy.get("div.side-navigation-panel-select-inner-option", { timeout: 15000 })
  .contains("ODM")
  .should("be.visible")
  .and("not.be.disabled")
  .click();
    cy.contains("span", "Submitted Design").click();
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains("p", "PENDING").first().click({ force: true });
     //MULTI-3
   cy.get("button")
    .contains("Create Pack")
    .scrollIntoView()             // ← scrolls button into view
    .should("be.visible")
    .click();

  cy.get('input[type="number"]').eq(1).clear().type("2");
  cy.get('input[type="number"]').eq(2).clear().type("1");
  cy.get("button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid")
    .filter(':contains("Create Pack")')
    .scrollIntoView()             // ← scrolls button into view
    .should("be.visible")
    .click();

  // ✅ Scroll to Create Pack-4 button before clicking
  cy.get("button")
    .contains("Create Pack")
    .scrollIntoView()             // ← scrolls button into view
    .should("be.visible")
    .click();
   

  cy.get('input[type="number"]').eq(2).clear().type("7");
  cy.get('input[type="number"]').eq(0).clear().type("3");
 

  // ✅ Scroll to Create Pack confirm button before clicking
  cy.get("button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid")
    .filter(':contains("Create Pack")')
    .scrollIntoView()             // ← scrolls button into view
    .should("be.visible")
    .click();

  cy.contains("button", "Rework", { timeout: 10000 }).should("be.visible");

  cy.contains("button", "Rework")
    .scrollIntoView()             // ← scrolls rework button into view
    .should("be.visible")
    .click({ force: true });
    //cy.contains("button", "Rework").click({ force: true });
  });

  //Vendor makes changes to rework design---not working
  it("Test Case 6: Vendor reworks on the design after cluster sends for rework", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.contains("32021182").click();
    // cy.get("div.sc-dAbbOL.vIbA-D")
    //   .contains("32021182")
    //   .click({ force: true })
    //   ;
    
// Click UVP and wait for the submenu to expand
cy.contains("span.side-navigation-panel-select-option-text", "UVP", { timeout: 15000 })
  .should("be.visible")
  .parents("span.side-navigation-panel-select-option-wrap")
  .click();

// Wait for ODM option to be visible and interactive before clicking
cy.get("div.side-navigation-panel-select-inner-option", { timeout: 15000 })
  .contains("ODM")
  .should("be.visible")
  .and("not.be.disabled")
  .click();
    cy.contains("span", "Submitted Design").click({ force: true });
    
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains("p", "REWORK").first().click({ force: true });
    cy.contains("div.n-button-content", "Edit").click();
    //cy.get("div.n-button-content").each(($el) => {
    //   const text = $el.text().trim();
    cy.get('input[data-testid="dropdown-search"]', { timeout: 15000 }).click();
    cy.get('input[data-testid="dropdown-search"]').type(
      "{selectall}{backspace}",
      { force: true },
    );
    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 1000 });
    // // Wait for the dropdown options to load
    cy.get(".n-options .n-option", { timeout: 5000 }).should("have.length.gt", 0);
    cy.get("body").then(($body) => {
      console.log($body.html()); // logs HTML to Cypress runner console
    });
    // Select the correct code (assuming dropdown options appear as list items)
    cy.get(".n-options .n-option", { timeout: 10000 })
      .contains("62033200")
      .click({ force: true });
    // MULTI3 - Pack_3 - Enter cost and approve
cy.get('button[aria-label="Approve Pack_3"]')
  .closest('[style*="gap: 0.5rem"]')
  .parent()
  .parent()
  .find('input[placeholder="Enter"]')
  .scrollIntoView()
  .click({ force: true })
  .then($input => {
    const existingValue = $input.val();
    cy.log("Existing value for MULTI3: " + existingValue);
    if (existingValue && existingValue !== '') {
      cy.wrap($input).clear({ force: true }).type("750", { force: true });
    } else {
      cy.wrap($input).type("750", { force: true });
    }
  });

cy.get('button[aria-label="Approve Pack_3"]')
  .should("be.visible")
  .click({ force: true });


// MULTI4 - Pack_4 - Enter cost and approve
cy.get('button[aria-label="Approve Pack_4"]')
  .closest('[style*="gap: 0.5rem"]')
  .parent()
  .parent()
  .find('input[placeholder="Enter"]')
  .scrollIntoView()
  .click({ force: true })
  .then($input => {
    const existingValue = $input.val();
    cy.log("Existing value for MULTI4: " + existingValue);
    if (existingValue && existingValue !== '') {
      cy.wrap($input).clear({ force: true }).type("770", { force: true });
    } else {
      cy.wrap($input).type("770", { force: true });
    }
  });
cy.get('button[aria-label="Approve Pack_4"]')
  .should("be.visible")
  .click({ force: true });
  
    cy.contains("div.n-button-content", "Submit")
  .parent("button")
  .should("not.have.attr", "disabled");
    cy.contains("button", "Submit")
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });

  });

  //Cluster role
  it("Test Case 7: Cluster checks the rework by vendor and approve the design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click();

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains("span", "Submitted Design").click();
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains("p", "PENDING").first().click({ force: true });
    cy.contains("button", "Approve").click({ force: true });
  });

  //Buyer reworks the cluster submitted design /888
  it("Test Case 8: Buyer creates pack and send to vendor", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // ─── Step 1: Select workspace card ───────────────────────────────────────

  //SIT
  cy.get(".sc-ikkxIA")
    .filter(':contains("Shein")')
    .filter(':contains("odm-buyer")')
    .find("div")
    .contains("Shein")
    .should("be.visible")
    .click({ force: true });

   //UAT 
  // cy.get('[data-testid="Shein-odm-buyer"]')
  //   .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh")
  //   .contains(/^S$/)
  //   .scrollIntoView({ offset: { top: -100 } })
  //   .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains("p", "CLUSTER APPROVED").first().click({ force: true });
 // ── Click Create Pack ─────────────────────────────────────
  cy.get("button")
    .contains("Create Pack")
    .scrollIntoView()
    .should("be.visible")
    .click();

  // Enter 4 for Aqua
cy.contains('p', /rose gold/i)
  .parent()          // p → div (colorway name div)
  .parent()          // → row div
  .find('input[type="number"]')
  .clear({ force: true })
  .type("4", { force: true });

// Enter 1 for Kiwi Green  
cy.contains('p', /pista green/i)
  .parent()
  .parent()
  .find('input[type="number"]')
  .clear({ force: true })
  .type("4", { force: true });
// Click Create Pack button
cy.get('button.n-button-primary')
  .contains('Create Pack')
  .should('not.be.disabled')
  .click();

 //MULTI-6

  cy.get("button")
    .contains("Create Pack")
    .scrollIntoView()
    .should("be.visible")
    .click();

  // Enter 4 for Aqua
cy.contains('p', /rose gold/i)
  .parent()          // p → div (colorway name div)
  .parent()          // → row div
  .find('input[type="number"]')
  .clear({ force: true })
  .type("4", { force: true });

// Enter 1 for Kiwi Green  
cy.contains('p', /teal/i)
  .parent()
  .parent()
  .find('input[type="number"]')
  .clear({ force: true })
  .type("4", { force: true });
// Click Create Pack button
cy.get('button.n-button-primary')
  .contains('Create Pack')
  .should('not.be.disabled')
  .click();
    cy.contains("button", "Rework", { timeout: 10000 }).should("be.visible");
    cy.contains("button", "Rework").click();
  });

  //Vendor reworks on buyer rework design
  it("Test Case 9: Vendorlogs in back and rework the design sent by buyer for rework", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.contains("32021182").click();
    // cy.get("div.sc-dAbbOL.vIbA-D")
    //   .contains("32021182")
    //   .click({ force: true })
    //   ;
    
// Click UVP and wait for the submenu to expand
cy.contains("span.side-navigation-panel-select-option-text", "UVP", { timeout: 15000 })
  .should("be.visible")
  .parents("span.side-navigation-panel-select-option-wrap")
  .click();

// Wait for ODM option to be visible and interactive before clicking
cy.get("div.side-navigation-panel-select-inner-option", { timeout: 15000 })
  .contains("ODM")
  .should("be.visible")
  .and("not.be.disabled")
  .click();
    cy.contains("span", "Submitted Design").click({ force: true });
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains("p", "REWORK").first().click({ force: true });
    cy.contains("div.n-button-content", "Edit").click();

    // ── Set SAP code in dropdown ─────────────────────────────────────────────
    cy.get('input[data-testid="dropdown-search"]')
      .clear({ force: true })
      .type("620", { delay: 1000 });
    cy.get(".n-options .n-option", { timeout: 5000 }).should("have.length.gt", 0);
    cy.get(".n-options .n-option", { timeout: 10000 })
      .contains("62064000")
      .click({ force: true });

    // ── Helper: enter cost and approve a pack ────────────────────────────────
    function enterCostAndApprove(sapColorId, cost, packName) {
      cy.contains(sapColorId)
        .siblings()
        .find('input[placeholder="Enter"]')
        .scrollIntoView()
        .click({ force: true })
        .then(($input) => {
          const existingValue = $input.val();
          cy.log(`Existing value for ${sapColorId}: ` + existingValue);
          if (existingValue && existingValue !== "") {
            cy.wrap($input).clear({ force: true }).type(cost, { force: true });
          } else {
            cy.wrap($input).type(cost, { force: true });
          }
        });
      cy.get(`button[aria-label="Approve ${packName}"]`)
        .should("be.visible")
        .click({ force: true });
    }

    // MULTI5 - Pack_5
    enterCostAndApprove("MULTI5", "750", "Pack_5");

    // MULTI6 - Pack_6
    enterCostAndApprove("MULTI6", "550", "Pack_6");

    // ── Edit TEAL colorway cost ──────────────────────────────────────────────
    cy.contains("p", "TEAL")
      .scrollIntoView()
      .should("be.visible")
      .closest("tr, [class*='row'], [class*='colorway'], div")
      .find("svg title")
      .contains("Edit")
      .parents("svg")
      .click({ force: true });

    // Step 1: Enter invalid price (400) → expect error popup
    cy.get('input[placeholder="Enter Cost per Piece"]')
      .should("be.visible")
      .clear({ force: true })
      .type("400", { force: true });
    cy.get("svg title")
      .contains("Confirm Edit")
      .parent()
      .click({ force: true });

    // Assert error popup with partial text match
    cy.contains(/cost cannot be more than pack price/i, { timeout: 8000 })
      .should("be.visible");

    // Step 2: Enter valid price (350) and confirm
    cy.get('input[placeholder="Enter Cost per Piece"]')
      .clear({ force: true })
      .type("350", { force: true });
    cy.get("svg title")
      .contains("Confirm Edit")
      .parent()
      .click({ force: true });

    // Click Approve for the TEAL colorway
    cy.contains("p", "TEAL")
      .closest("tr, [class*='row'], [class*='colorway'], div")
      .find("button")
      .contains(/approve/i)
      .should("be.visible")
      .click({ force: true });

    // ── Click Submit ─────────────────────────────────────────────────────────
    cy.contains("button", "Submit")
      .scrollIntoView()
      .should("be.visible")
      .click();
  });

  //buyer parks the cluster approved design
  it("Test Case 10: Buyer Parks", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // ─── Step 1: Select workspace card ───────────────────────────────────────

  //SIT
  cy.get(".sc-ikkxIA")
    .filter(':contains("Shein")')
    .filter(':contains("odm-buyer")')
    .find("div")
    .contains("Shein")
    .should("be.visible")
    .click({ force: true });

   //UAT 
  // cy.get('[data-testid="Shein-odm-buyer"]')
  //   .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh")
  //   .contains(/^S$/)
  //   .scrollIntoView({ offset: { top: -100 } })
  //   .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 10000 })
      .contains("ODM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains("p", "CLUSTER APPROVED")
      .first()
      .click({ force: true });

    cy.contains("button", "Park")
      .should("be.visible") // ensures Cypress waits until the button is visible
      .click({ force: true });

    cy.contains("span", "Parked Design")
      .should("be.visible") // wait until the span is visible
      .click({ force: true });
  });

  //Unpark the inspiration
  it("Test Case 11: Buyer Unparks the design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // ─── Step 1: Select workspace card ───────────────────────────────────────

  //SIT
  cy.get(".sc-ikkxIA")
    .filter(':contains("Shein")')
    .filter(':contains("odm-buyer")')
    .find("div")
    .contains("Shein")
    .should("be.visible")
    .click({ force: true });

   //UAT 
  // cy.get('[data-testid="Shein-odm-buyer"]')
  //   .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh")
  //   .contains(/^S$/)
  //   .scrollIntoView({ offset: { top: -100 } })
  //   .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
    cy.contains("span", "Parked Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('input[placeholder="Search"]').type(themeName);

    cy.contains("div.n-button-content", "Move to Active") // find the element
      .scrollIntoView() // scroll it into view
      .should("be.visible") // ensure it's visible
      .click({ force: true }); // click it
  });

  //buyer parks the cluster approved design again
  it("Test Case 12: Buyer Parks again", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // ─── Step 1: Select workspace card ───────────────────────────────────────

  //SIT
  cy.get(".sc-ikkxIA")
    .filter(':contains("Shein")')
    .filter(':contains("odm-buyer")')
    .find("div")
    .contains("Shein")
    .should("be.visible")
    .click({ force: true });

   //UAT 
  // cy.get('[data-testid="Shein-odm-buyer"]')
  //   .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh")
  //   .contains(/^S$/)
  //   .scrollIntoView({ offset: { top: -100 } })
  //   .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains("p", "CLUSTER APPROVED")
      .first()
      .click({ force: true });

    cy.contains("button", "Park")
      .should("be.visible") // ensures Cypress waits until the button is visible
      .click({ force: true });

    cy.contains("span", "Parked Design")
      .should("be.visible") // wait until the span is visible
      .click({ force: true });
  });

  //buyer reworks the parked design
  it("Test Case 13: Buyer Rework the parked design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // ─── Step 1: Select workspace card ───────────────────────────────────────

  //SIT
  cy.get(".sc-ikkxIA")
    .filter(':contains("Shein")')
    .filter(':contains("odm-buyer")')
    .find("div")
    .contains("Shein")
    .should("be.visible")
    .click({ force: true });

   //UAT 
  // cy.get('[data-testid="Shein-odm-buyer"]')
  //   .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh")
  //   .contains(/^S$/)
  //   .scrollIntoView({ offset: { top: -100 } })
  //   .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
    cy.contains("span", "Parked Design").click({ force: true });
    //cy.get('input[placeholder="Search"]').type(themeName);
    // Assuming the Style ID is always in the 2nd column
    cy.get("table tbody tr td:nth-child(2)") // select second column of each row
      .first()
      .within(() => {
        cy.get('div[data-testid="link-with-context"] span').click({
          force: true,
        });
      });

    cy.contains("button", "Rework").click();
  });

  //Vendor makes changes to rework design---not working
  it("Test Case 14: Vendor reworks the design second time after buyer sent for rework", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.contains("32021182").click();
    // cy.get("div.sc-dAbbOL.vIbA-D")
    //   .contains("32021182")
    //   .click({ force: true })
    //   ;
    
// Click UVP and wait for the submenu to expand
cy.contains("span.side-navigation-panel-select-option-text", "UVP", { timeout: 15000 })
  .should("be.visible")
  .parents("span.side-navigation-panel-select-option-wrap")
  .click();

// Wait for ODM option to be visible and interactive before clicking
cy.get("div.side-navigation-panel-select-inner-option", { timeout: 15000 })
  .contains("ODM")
  .should("be.visible")
  .and("not.be.disabled")
  .click();
    cy.contains("span", "Submitted Design").click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);
    cy.contains("p", "REWORK").first().click({ force: true });
    cy.contains("div.n-button-content", "Edit").click();
    //cy.get("div.n-button-content").each(($el) => {
    //   const text = $el.text().trim();
    cy.get('input[data-testid="dropdown-search"]', { timeout: 15000 }).click();
    cy.get('input[data-testid="dropdown-search"]').type(
      "{selectall}{backspace}",
      { force: true },
    );
    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 1000 });
    // // Wait for the dropdown options to load
    cy.get(".n-options .n-option", { timeout: 5000 }).should("have.length.gt", 0);
    cy.get("body").then(($body) => {
      console.log($body.html()); // logs HTML to Cypress runner console
    });
    //Select the correct code (assuming dropdown options appear as list items)
    cy.get(".n-options .n-option", { timeout: 10000 })
      .contains("62033200")
      .click({ force: true });

    cy.contains("button", "Submit")
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
  });

  
  it("Test Case 15: Buyer checks the design and approve the design", () => {
  cy.visit("https://platform.uat.impetusz0.de/workspace");
  cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
  // ─── Step 1: Select workspace card ───────────────────────────────────────

  //SIT
  cy.get(".sc-ikkxIA")
    .filter(':contains("Shein")')
    .filter(':contains("odm-buyer")')
    .find("div")
    .contains("Shein")
    .should("be.visible")
    .click({ force: true });

   //UAT 
  // cy.get('[data-testid="Shein-odm-buyer"]')
  //   .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh")
  //   .contains(/^S$/)
  //   .scrollIntoView({ offset: { top: -100 } })
  //   .click({ force: true });

  // Navigate to UVP > ODM
  cy.contains("span.side-navigation-panel-select-option-text", "UVP")
    .parents("span.side-navigation-panel-select-option-wrap")
    .click();
  cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
    .contains("ODM")
    .click();

  // Go to Submitted Design and search for the theme
  cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
    force: true,
  });
  cy.get('input[placeholder="Search"]').type(themeName);

  // Open the first CLUSTER APPROVED design
  cy.contains("p", "CLUSTER APPROVED")
    .first()
    .click({ force: true });


  // Select size
  cy.get("button").contains("Select Size").click({ force: true });
  cy.get(".n-options .n-option", { timeout: 10000 });
  cy.get('input[value="size-group-0"]', { timeout: 10000 })
    .should("be.visible")
    .check({ force: true });

  // ─── STEP 1: Approve all PENDING colorway rows dynamically ───────────────

  cy.get("#design-and-colorway", { timeout: 10000 })
    .scrollIntoView({ duration: 500 });


  // Find every colorway row dynamically — rows have numeric ids (1, 2, 3...)
  // scoped inside #design-and-colorway and above the pack section
  cy.get("#design-and-colorway [id]", { timeout: 10000 })
    .filter((i, el) => /^\d+$/.test(el.id)) // only elements with purely numeric ids
    .each(($row, i) => {
      const statusEl = $row.find("p:contains('PENDING')");
      if (statusEl.length > 0) {
        cy.wrap($row)
          .scrollIntoView({ duration: 300 })
          .find('button[title="Approve"]')
          .first()
          .should("be.visible")
          .click({ force: true });
        cy.log(`Approved colorway row ${i + 1}`);
      }
    });

  // ─── STEP 2: Change SAP Color for MULTI1 pack → AQUA ────────────────────

 cy.get("#design-and-colorway", { timeout: 10000 })
    .scrollIntoView({ duration: 500 });


  // Rows have numeric ids (1, 2, 3...) — status is inside a <p> sibling
  cy.get("#design-and-colorway [id]", { timeout: 10000 })
    .filter((i, el) => /^\d+$/.test(el.id))
    .each(($row, i) => {
      // Status <p> is a direct child of a sibling cell — check exact text
      const isPending = $row
        .find("p")
        .toArray()
        .some((p) => Cypress.$(p).text().trim() === "PENDING");

      if (isPending) {
        cy.wrap($row)
          .scrollIntoView({ duration: 300 })
          .find('button[title="Approve"]')
          .first()
          .should("be.visible")
          .click({ force: true });
        cy.log(`Approved colorway row ${i + 1} (was PENDING)`);
      } else {
        cy.log(`Skipped colorway row ${i + 1} (not PENDING)`);
      }
    });

//   // Scroll to Colorways Pack by Vendor and change MULTI1 → AQUA
//  cy.get("#pack_sap_pack_1", { timeout: 10000 })
//     .scrollIntoView({ duration: 500 })
//     
//     .click({ force: true });

//   cy.get("#pack_sap_pack_1 input.n-dropdown-search", { timeout: 5000 })
//     .clear()
//     .type("AQUA");

//   cy.get("#pack_sap_pack_1 .n-options span[data-value='C5684400']", {
//     timeout: 5000,
//   })
//     .should("be.visible")
//     .click({ force: true });

//   cy.get("#pack_sap_pack_1 input.n-dropdown-search")
//     .should("have.value", "AQUA");
//   cy  

  cy.contains("button", "Approve", { timeout: 10000 }).should("be.visible");
  cy.contains("button", "Approve").click({ force: true });

 

  // ─── STEP 3: Approve ALL unapproved buttons on the page one by one ───────

  // Keep clicking the first unapproved Approve button until none remain
  

  // ─────────────────────────────────────────────────────────────────────────

  // Click Approve button 11 times (re-queries DOM each iteration)
 
});
  it("Test Case 16: FPT and GPT approval", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click();

    cy.contains("span.side-navigation-panel-select-option-text", "QC")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("FPT & GPT")
      .click();


    cy.get('input[placeholder="Search via Style IDs or other values"]')
      .type(vendorStyleCode);

    cy.contains("BUYER APPROVED").click({ force: true });
    cy.get('label[for="required-yes"]').click();

    cy.get('input[type="file"][accept=".xlsx,.pdf"]')
      .selectFile("cypress/fixtures/testfpt 1 7.pdf", { force: true });


    cy.contains("label", "I acknowledge the test completed").click();
    cy.contains("div.n-button-content", "Approve").click();
    cy.wait(600000);
    //cy.contains("p", "PENDING").first().click({ force: true });
    //cy.contains("button", "Approve").click({ force: true });
  });


  it("Test Case 17: Pick plm style id and hit DP create api", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    //UAT
    // cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
    //   .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
    //   .contains(/^S$/) // exact match for 'S'
    //   .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      // .click({ force: true });
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
    cy.contains("span", "Submitted Design", { timeout: 15000 })
      .click({ force: true });

    cy.get('input[placeholder="Search"]').type(themeName);

    cy.get('[data-testid="link-with-context"] span')
      .invoke("text")
      .then((styleCode) => {
        cy.log("Style Code:", styleCode);
      });
    cy.get('[data-testid="link-with-context"] span')
      .eq(2)
      .invoke("text")
      .then((t) => t.trim())
      .then((styleCode) => {
        cy.getCookies().then((cookies) => {
          const cookieHeader = cookies
            .map((c) => `${c.name}=${c.value}`)
            .join("; ");

          console.log("cookie header", cookieHeader);

          cy.request({
            method: "POST",
            //url: "https://api.uat.impetusz0.de/service/application/odm/v1.0/uvp/dp/create",
            url: "https://api.impetusz0.de/service/application/odm/v1.0/uvp/dp/create",

            
            headers: {
              "Content-Type": "application/json",
              Cookie: cookieHeader,
              "x-user-data": JSON.stringify({
                user_id: "2127",
                email: "chaitanya.dhoddi@ril.com",
                roles: ["odm-cluster"],
              }),
            },
            body: { styleCode },
          });
        });
      });
  });

  it("Test Case 18: PP sample: Vendor submits the sample design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.contains("32021182").click();
    // cy.get("div.sc-dAbbOL.vIbA-D")
    //   .contains("32021182")
    //   .click({ force: true })
    //   ;

   
// Click UVP and wait for the submenu to expand
cy.contains("span.side-navigation-panel-select-option-text", "UVP", { timeout: 15000 })
  .should("be.visible")
  .parents("span.side-navigation-panel-select-option-wrap")
  .click();

// Wait for ODM option to be visible and interactive before clicking
cy.get("div.side-navigation-panel-select-inner-option", { timeout: 15000 })
  .contains("ODM")
  .should("be.visible")
  .and("not.be.disabled")
  .click();
    cy.get('input[placeholder="Search"]').type(vendorStyleCode);
    //cy.contains("p", "PP PENDING").first().click({ force: true });
    cy.contains("PP PENDING").click({ force: true });
    cy.contains("div.n-button-content", "Upload Files")
      .parents("button")
      .parent()
      .find('input[type="file"]')
      .selectFile("cypress/fixtures/pppic.jpg", { force: true });

    cy.contains("button", "Submit Sample").click();
  });

  it("Test Case 19: PP sample: Buyer sends the design for resubmission", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // ─── Step 1: Select workspace card ───────────────────────────────────────

  //SIT
  cy.get(".sc-ikkxIA")
    .filter(':contains("Shein")')
    .filter(':contains("odm-buyer")')
    .find("div")
    .contains("Shein")
    .should("be.visible")
    .click({ force: true });

   //UAT 
  // cy.get('[data-testid="Shein-odm-buyer"]')
  //   .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh")
  //   .contains(/^S$/)
  //   .scrollIntoView({ offset: { top: -100 } })
  //   .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "QC")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("PP Sample")
      .click();
    cy.get('input[placeholder="Search"]').type(themeName);

    cy.contains("PP BUYER PENDING").first().click({ force: true });
    cy.contains("I acknowledge that I have thoroughly checked the sample")
      .scrollIntoView()
      .parent()
      .find('input[type="checkbox"]')
      .check({ force: true });
    cy.get("button").contains("Request Resubmission").click();
  });

  it("Test Case 20: PP sample: Vendor submits the sample again on resubmitted design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.contains("32021182").click();
    // cy.get("div.sc-dAbbOL.vIbA-D")
    //   .contains("32021182")
    //   .click({ force: true })
    //   ;

    cy.contains("span.side-navigation-panel-select-option-text", "QC")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("PP Sample")
      .click();

    cy.get('input[placeholder="Search"]').type(vendorStyleCode);
    cy.contains("PP RESUBMISSION").click({ force: true });
    cy.contains("div.n-button-content", "Upload Files")
      .parents("button")
      .parent()
      .find('input[type="file"]')
      .selectFile("cypress/fixtures/pppic.jpg", { force: true });

    cy.contains("button", "Submit Sample").click();
  });

  it("Test Case 21: PP sample: Buyer approves the design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
  // ─── Step 1: Select workspace card ───────────────────────────────────────

  //SIT
  cy.get(".sc-ikkxIA")
    .filter(':contains("Shein")')
    .filter(':contains("odm-buyer")')
    .find("div")
    .contains("Shein")
    .should("be.visible")
    .click({ force: true });

   //UAT 
  // cy.get('[data-testid="Shein-odm-buyer"]')
  //   .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh")
  //   .contains(/^S$/)
  //   .scrollIntoView({ offset: { top: -100 } })
  //   .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "QC")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("PP Sample")
      .click();
    cy.get('input[placeholder="Search"]').type(themeName);

    cy.contains("PP BUYER PENDING").first().click({ force: true });
    cy.contains("I acknowledge that I have thoroughly checked the sample")
      .scrollIntoView()
      .parent()
      .find('input[type="checkbox"]')
      .check({ force: true });
    cy.get("button").contains("Approve").click();
  });

  it("Test Case 22: PP approval for Cluster approval for submitted design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click();

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains("span", "Submitted Design").click();
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(vendorStyleCode);

    // cy.contains("div", "Status").click();
    // cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   //.should("be.visible") // ensure it is visible
    //   .click({ force: true })
    //   ;
    cy.contains("PP CLUSTER PENDING").click({ force: true });

    cy.contains("I acknowledge that I have thoroughly checked the sample")
      .scrollIntoView()
      .parent()
      .find('input[type="checkbox"]')
      .check({ force: true });
    cy.get("button").contains("Approve").click();
  });
  
  it("Test Case 23: Submit the design for Buyer Reject Scenario", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); 
   cy.contains("32021182").click();
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();

    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.get('input[placeholder="Search"]').type(themeName);
    
    cy.get("div.n-button-content")
      .contains("View")
      .first()
      .click({ force: true });

    // Scroll to the "Submit" button and click it
    cy.contains("div.n-button-content", "Submit")
      .scrollIntoView()
      .click({ force: true });

   
    cy.get('input[data-testid="article_code_input"]')
      .first()
      .type(vendorStyleCode);

    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });

    // Wait for the dropdown options to load
    cy.get(".n-options .n-option", { timeout: 5000 }).should("have.length.gt", 0);
    cy.get("body").then(($body) => {
      console.log($body.html()); // logs HTML to Cypress runner console
    });
    // Select the correct code (assuming dropdown options appear as list items)
    cy.get(".n-options .n-option") // adjust selector to match your dropdown option class
      .contains("6206400")
      .click();

    cy.contains("label", "Brick Name *")
      // Navigate to the closest wrapper containing the dropdown trigger
      .parent()
      .find(".n-select__trigger")
      .click(); // Open the dropdown

    // Step 2: Select the first option from the dropdown
    cy.get(".n-options .n-option").contains("Jeans").click();

    cy.contains("p", "Upload Design") // find the container by its text
      .parent() // go to the wrapper div
      .find('input[type="file"]') // find the hidden input
      .attachFile("design.jpeg", { force: true });

    cy.contains("p", "Upload Design") // find the container by its text
      .parent() // go to the wrapper div
      .find('input[type="file"]') // find the hidden input
      .attachFile("design2.jpg", { force: true });  

    cy.contains("p", "Colorways") // find the container by its text
      .parent() // go to the wrapper div
      .find('input[type="file"]') // find the hidden input
      .attachFile("colorways.jpg", { force: true });

    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', { timeout: 10000 }).should("be.visible");

    // Find the dropdown input with placeholder "Add SAP ID" and click it
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .scrollIntoView() // ensure it's visible
      .click(); // open the dropdown

    // Type the value to filter options (optional if searchable)

    // Now select the option "LT Orange" from the dropdown
    cy.get('[data-testid="dropdown-scroll"]')
      .contains(".n-option", "AQUA")
      .scrollIntoView() // scroll within the container
      .click();

    cy.get('input[placeholder="Enter cost"]').type("333");

    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      if (text === "Upload") {
        // Scroll into view, find the parent button, then click
        cy.wrap($el)
          .scrollIntoView()
          .parent("button")
          .should("be.visible")
          .click();

        // Stop iterating once found
        return false;
      }
    });

    //https://assets.impetusz0.de/d2sz0-unified-vendor-portal/design-files/design_20251106_172801.jpeg


    cy.contains("p", "Colorways") // find the container by its text
      .parent() // go to the wrapper div
      .find('input[type="file"]') // find the hidden input
      .attachFile("BLUE.jpeg", { force: true });

    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', { timeout: 10000 }).should("be.visible");

    // Find the dropdown input with placeholder "Add SAP ID" and click it
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .scrollIntoView() // ensure it's visible
      .click(); // open the dropdown

    // Type the value to filter options (optional if searchable)

    // Now select the option "LT Orange" from the dropdown
    cy.get('[data-testid="dropdown-scroll"]')
      .contains(".n-option", "TEAL")
      .scrollIntoView() // scroll within the container
      .click();

    cy.get('input[placeholder="Enter cost"]').type("190");

    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      if (text === "Upload") {
        // Scroll into view, find the parent button, then click
        cy.wrap($el)
          .scrollIntoView()
          .parent("button")
          .should("be.visible")
          .click();

        // Stop iterating once found
        return false;
      }
    });

    cy.get('input[placeholder="Ex. cotton 90% Polyester 10%*"]')
      .first()
      .scrollIntoView()
      .clear()
      .type("cotton90%", { delay: 100 })
      .blur();

    cy.get('input[placeholder="Ex. 240/160*"]')
      .first()
      .scrollIntoView()
      .clear()
      .type(240 / 160, { delay: 100 })
      .blur();

    cy.contains("div.n-button-content", "Submit", { timeout: 15000 }).parent("button").should("not.have.attr", "disabled");


    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      if (text === "Submit") {
        // Scroll into view, find the parent button, then click
        cy.wrap($el)
          .scrollIntoView()
          .parent("button")
          .should("be.visible")
          .click();

        // Stop iterating once found
        return false;
      }
    });
  });
  
  it("Test Case 24: Cluster approves the design and send it to buyer", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click();

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains("span", "Submitted Design").click();
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName);

    // cy.contains("div", "Status").click();
    // cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   //.should("be.visible") // ensure it is visible
    //   .click({ force: true })
    //   ;
    cy.contains("p", "PENDING").first().click({ force: true });
    cy.contains("button", "Approve").click({ force: true });
  });

  it("Test Case 25: Buyer approves colorways and reject the design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // ─── Step 1: Select workspace card ───────────────────────────────────────

  //SIT
  cy.get(".sc-ikkxIA")
    .filter(':contains("Shein")')
    .filter(':contains("odm-buyer")')
    .find("div")
    .contains("Shein")
    .should("be.visible")
    .click({ force: true });

   //UAT 
  // cy.get('[data-testid="Shein-odm-buyer"]')
  //   .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh")
  //   .contains(/^S$/)
  //   .scrollIntoView({ offset: { top: -100 } })
  //   .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('input[placeholder="Search"]').type(themeName);

    cy.contains("p", "CLUSTER APPROVED")
      .first()
      .click({ force: true });

    cy.get("button").contains("Select Size").click({ force: true });

    //  Wait for the dropdown options to appear and pick a random one
    cy.get(".n-options .n-option", {
      timeout: 10000,
    });
    cy.get('input[value="size-group-0"]').check({ force: true });
    cy.get('button[title="Approve"]', { timeout: 10000 }).should("be.visible");
    cy.get('button[title="Approve"]').eq(0).click({ force: true });
    cy.get('button[title="Approve"]').eq(1).click({ force: true });
    cy.contains("button", "Reject", { timeout: 15000 }).should("be.visible");
    cy.contains("button", "Reject").click({ force: true });
  });

  //**********One flow is completed till here */

  //Vnedor submits the third design now
  //Vendor role
  // xit("Verify that shared Inspiration is visible and submit design", () => {
  //   cy.visit("https://platform.uat.impetusz0.de/workspace");
  cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
  //   // Click on the vendor card "Shein"
  //   cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
  //     force: true,
  //   }); // click it even if overlayed
  //   cy.get("div.sc-dAbbOL.vIbA-D")
  //     .contains("30304916")
  //     .click({ force: true })
  //     ;
  //   cy.contains("span.side-navigation-panel-select-option-text", "UVP")
  //     .parents("span.side-navigation-panel-select-option-wrap")
  //     .click()
  //     ;
  //   cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
  //     .contains("ODM")
  //     .click()
  //     ;
  //   cy.get('input[placeholder="Search"]').type(themeName);
  //   cy.get("div.n-button-content")
  //     .contains("View")
  //     .first()
  //     .click({ force: true })
  //     ;
  //   // Scroll to the "Submit" button and click it
  //   cy.contains("div.n-button-content", "Submit")
  //     .scrollIntoView()
  //     .click({ force: true })
  //     ;
  //   cy.get('input[data-testid="article_code_input"]')
  //     .first()
  //     .type("StyleTest123");
  //   // Type into the search input
  //   //cy.get('input[data-testid="dropdown-search"]').type("6206400{enter}");

  //   cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });

  //   // Wait for the dropdown options to load
  //   cy; // adjust if your app loads slower
  //   cy.get("body").then(($body) => {
  //     console.log($body.html()); // logs HTML to Cypress runner console
  //   });
  //   // Select the correct code (assuming dropdown options appear as list items)
  //   cy.get(".n-options .n-option") // adjust selector to match your dropdown option class
  //     .contains("6206400")
  //     .click();

  //   cy.contains("label", "Brick Name *")
  //     // Navigate to the closest wrapper containing the dropdown trigger
  //     .parent()
  //     .find(".n-select__trigger")
  //     .click(); // Open the dropdown

  //   // Step 2: Select the first option from the dropdown
  //   cy.get(".n-options .n-option").contains("Jeans").click();

  //   cy.contains("p", "Upload Design") // find the container by its text
  //     .parent() // go to the wrapper div
  //     .find('input[type="file"]') // find the hidden input
  //     .attachFile("design.jpeg", { force: true });

  //   cy.contains("p", "Colorways") // find the container by its text
  //     .parent() // go to the wrapper div
  //     .find('input[type="file"]') // find the hidden input
  //     .attachFile("colorways.jpg", { force: true });

  //   cy;

  //   // Find the dropdown input with placeholder "Add SAP ID" and click it
  //   cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
  //     .scrollIntoView() // ensure it's visible
  //     .click(); // open the dropdown

  //   // Type the value to filter options (optional if searchable)

  //   // Now select the option "LT Orange" from the dropdown
  //   cy.get('[data-testid="dropdown-scroll"]')
  //     .contains(".n-option", "LT ORANGE")
  //     .scrollIntoView() // scroll within the container
  //     .click();

  //   cy.get('input[placeholder="Enter cost"]').type("333");

  //   cy.get("div.n-button-content").each(($el) => {
  //     const text = $el.text().trim();

  //     if (text === "Upload") {
  //       // Scroll into view, find the parent button, then click
  //       cy.wrap($el)
  //         .scrollIntoView()
  //         .parent("button")
  //         .should("be.visible")
  //         .click();

  //       // Stop iterating once found
  //       return false;
  //     }
  //   });

  //   //https://assets.impetusz0.de/d2sz0-unified-vendor-portal/design-files/design_20251106_172801.jpeg

  //   cy.get('input[placeholder="Ex. cotton 90% Polyester 10%*"]')
  //     .first()
  //     .scrollIntoView()
  //     .clear()
  //     .type("cotton90%", { delay: 100 })
  //     .blur();

  //   cy.get('input[placeholder="Ex. 240/160*"]')
  //     .first()
  //     .scrollIntoView()
  //     .clear()
  //     .type(240 / 160, { delay: 100 })
  //     .blur();

  //   cy;

  //   cy.get("div.n-button-content").each(($el) => {
  //     const text = $el.text().trim();

  //     if (text === "Submit") {
  //       // Scroll into view, find the parent button, then click
  //       cy.wrap($el)
  //         .scrollIntoView()
  //         .parent("button")
  //         .should("be.visible")
  //         .click();

  //       // Stop iterating once found
  //       return false;
  //     }
  //   });
  // });

  // //Cluster rejects the submitted design
  // xit("Cluster rejects submitted design", () => {
  //   cy.visit("https://platform.uat.impetusz0.de/workspace");
  cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

  //   // Click on the cluster card "Shein"
  //   cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
  //     .click()
  //     ;
  //   cy.contains("span.side-navigation-panel-select-option-text", "UVP")
  //     .parents("span.side-navigation-panel-select-option-wrap")
  //     .click();
  //   cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
  //     .contains("ODM")
  //     .click()
  //     ;
  //   cy.contains("span", "Submitted Design").click();
  //   cy.get('button[data-testid="filter-button"]')
  //     .scrollIntoView()
  //     .should("be.visible")
  //     .click({ force: true });
  //   //cy.get('[data-testid="input-component"]').type("Automation");
  //   cy.contains("div", "Status").click();
  //   cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
  //     .scrollIntoView({ duration: 200 }) // scroll smoothly into view
  //     //.should("be.visible") // ensure it is visible
  //     .click({ force: true })
  //     ;
  //   cy.contains("p", "PENDING").first().click({ force: true });
  //   cy.contains("button", "Reject").click({ force: true });
  // });

  //***Second flow is completed */

  //Vendor submits one more design
  //Vendor role
  // xit("Verify that shared Inspiration is visible and submit design", () => {
  //   cy.visit("https://platform.uat.impetusz0.de/workspace");
  cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
  //   // Click on the vendor card "Shein"
  //   cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
  //     force: true,
  //   }); // click it even if overlayed
  //   cy.get("div.sc-dAbbOL.vIbA-D")
  //     .contains("32021183")
  //     .click({ force: true })
  //     ;
  //   cy.contains("span.side-navigation-panel-select-option-text", "UVP")
  //     .parents("span.side-navigation-panel-select-option-wrap")
  //     .click()
  //     ;
  //   cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
  //     .contains("ODM")
  //     .click()
  //     ;
  //   cy.get('input[placeholder="Search"]').type(themeName);
  //   cy.get("div.n-button-content")
  //     .contains("View")
  //     .first()
  //     .click({ force: true })
  //     ;
  //   // Scroll to the "Submit" button and click it
  //   cy.contains("div.n-button-content", "Submit")
  //     .scrollIntoView()
  //     .click({ force: true })
  //     ;
  //   cy.get('input[data-testid="article_code_input"]')
  //     .first()
  //     .type("StyleTest123");
  //   // Type into the search input
  //   //cy.get('input[data-testid="dropdown-search"]').type("6206400{enter}");

  //   cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });

  //   // Wait for the dropdown options to load
  //   cy; // adjust if your app loads slower
  //   cy.get("body").then(($body) => {
  //     console.log($body.html()); // logs HTML to Cypress runner console
  //   });
  //   // Select the correct code (assuming dropdown options appear as list items)
  //   cy.get(".n-options .n-option") // adjust selector to match your dropdown option class
  //     .contains("6206400")
  //     .click();

  //   cy.contains("label", "Brick Name *")
  //     // Navigate to the closest wrapper containing the dropdown trigger
  //     .parent()
  //     .find(".n-select__trigger")
  //     .click(); // Open the dropdown

  //   // Step 2: Select the first option from the dropdown
  //   cy.get(".n-options .n-option").contains("Jeans").click();

  //   cy.contains("p", "Upload Design") // find the container by its text
  //     .parent() // go to the wrapper div
  //     .find('input[type="file"]') // find the hidden input
  //     .attachFile("design.jpeg", { force: true });

  //   cy.contains("p", "Colorways") // find the container by its text
  //     .parent() // go to the wrapper div
  //     .find('input[type="file"]') // find the hidden input
  //     .attachFile("colorways.jpg", { force: true });

  //   cy;

  //   // Find the dropdown input with placeholder "Add SAP ID" and click it
  //   cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
  //     .scrollIntoView() // ensure it's visible
  //     .click(); // open the dropdown

  //   // Type the value to filter options (optional if searchable)

  //   // Now select the option "LT Orange" from the dropdown
  //   cy.get('[data-testid="dropdown-scroll"]')
  //     .contains(".n-option", "LT ORANGE")
  //     .scrollIntoView() // scroll within the container
  //     .click();

  //   cy.get('input[placeholder="Enter cost"]').type("333");

  //   cy.get("div.n-button-content").each(($el) => {
  //     const text = $el.text().trim();

  //     if (text === "Upload") {
  //       // Scroll into view, find the parent button, then click
  //       cy.wrap($el)
  //         .scrollIntoView()
  //         .parent("button")
  //         .should("be.visible")
  //         .click();

  //       // Stop iterating once found
  //       return false;
  //     }
  //   });

  //   //https://assets.impetusz0.de/d2sz0-unified-vendor-portal/design-files/design_20251106_172801.jpeg

  //   cy.get('input[placeholder="Ex. cotton 90% Polyester 10%*"]')
  //     .first()
  //     .scrollIntoView()
  //     .clear()
  //     .type("cotton90%", { delay: 100 })
  //     .blur();

  //   cy.get('input[placeholder="Ex. 240/160*"]')
  //     .first()
  //     .scrollIntoView()
  //     .clear()
  //     .type(240 / 160, { delay: 100 })
  //     .blur();

  //   cy;

  //   cy.get("div.n-button-content").each(($el) => {
  //     const text = $el.text().trim();

  //     if (text === "Submit") {
  //       // Scroll into view, find the parent button, then click
  //       cy.wrap($el)
  //         .scrollIntoView()
  //         .parent("button")
  //         .should("be.visible")
  //         .click();

  //       // Stop iterating once found
  //       return false;
  //     }
  //   });
  // });

  // //Cluster approval for one more submitted design
  // xit("Cluster approval for submitted design", () => {
  //   cy.visit("https://platform.uat.impetusz0.de/workspace");
  cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

  //   // Click on the cluster card "Shein"
  //   cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
  //     .click()
  //     ;
  //   cy.contains("span.side-navigation-panel-select-option-text", "UVP")
  //     .parents("span.side-navigation-panel-select-option-wrap")
  //     .click();
  //   cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
  //     .contains("ODM")
  //     .click()
  //     ;
  //   cy.contains("span", "Submitted Design").click();
  //   cy.get('button[data-testid="filter-button"]')
  //     .scrollIntoView()
  //     .should("be.visible")
  //     .click({ force: true });
  //   //cy.get('[data-testid="input-component"]').type("Automation");
  //   cy.contains("div", "Status").click();
  //   cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
  //     .scrollIntoView({ duration: 200 }) // scroll smoothly into view
  //     //.should("be.visible") // ensure it is visible
  //     .click({ force: true })
  //     ;
  //   cy.contains("p", "PENDING").first().click({ force: true });
  //   cy.contains("button", "Approve").click({ force: true });
  // });

  // // Buyer rejects the cluster approved inspiration
  // xit("Buyer Rejects", () => {
  //   cy.visit("https://platform.uat.impetusz0.de/workspace");
  //   cy;
  //   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
  //    cy.contains("div", "odm-buyer", { timeout: 20000 })
  //     .parent()
  //     .click({ force: true })
  //     ;
  //   cy;
  //   cy.contains("span.side-navigation-panel-select-option-text", "UVP")
  //     .parents("span.side-navigation-panel-select-option-wrap")
  //     .click();
  //   cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
  //     .contains("ODM")
  //     .click();
  //   cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
  //     force: true,
  //   });
  //   cy.get('button[data-testid="filter-button"]')
  //     .scrollIntoView()
  //     .should("be.visible")
  //     .click({ force: true });
  //   cy.contains("div", "Status").click();
  //   cy.get('input[value="CLUSTER APPROVED"]') // select the checkbox input with value PENDING
  //     .scrollIntoView({ duration: 200 }) // scroll smoothly into view
  //     .click({ force: true })
  //     ;
  //   cy.contains("p", "CLUSTER APPROVED").first().click({ force: true });
  //   cy.contains("button", "Reject", { timeout: 15000 }).click({ force: true });
  //   cy.get('[data-testid="n-checkbox-filter-COST_NOT_VAIBLE"]', {
  //     timeout: 10000,
  //   })
  //     .should("be.visible")
  //     .click({ force: true });

  //   // Wait for Apply button to become enabled (remove disabled attribute if needed)
  //   cy.contains("div.n-button-content", "Apply")
  //     .should("be.visible")
  //     .parent("button") // move to the actual <button>
  //     .should("not.be.disabled") // ensure it's clickable
  //     .click({ force: true });
  // });

  //***Third flow is completed */

  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false;
  });
});
