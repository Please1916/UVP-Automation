//  Global theme name for the entire spec
const randomString = Math.random().toString(36).substring(2, 10);
export const themeName = `Test_${randomString}`;
const randomStyleCode = `Style_${Math.random().toString(36).substring(2, 8)}`;
export const vendorStyleCode = randomStyleCode;

describe("Impetus Platform — Login Page Tests", () => {
  beforeEach(() => {
    cy.session("user-session", () => {
      cy.login();
    });
  });

  afterEach(function () {
    if (this.currentTest.state === "failed") {
      const testTitle = this.currentTest.title;
      const errMessage = this.currentTest.err.message;

      // Attach a screenshot automatically
      cy.screenshot(`${testTitle}-failed`);

      // Attach a developer-friendly message to Allure
      cy.allure().step(
        `Test "${testTitle}" failed. 
       Please verify business expectations. 
       Error: ${errMessage}`,
        { status: "failed" },
      );

      // Optionally attach the raw error for QA reference
      cy.allure().attachment("Cypress Error", errMessage, "text/plain");
    }
  });
  after(() => {
    cy.logout({ force: true });
  });

  //Logs in with valid credentials
  it("logs in successfully with valid credentials and check the workspace", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    // cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // cy.contains("div", "odm-buyer", { timeout: 20000 })
    //   .parent()
    //   .click({ force: true });

    cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
      .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
      .contains(/^S$/) // exact match for 'S'
      .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      .click({ force: true });

    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
  });

  //Upload inspiration
  it("logs in successfully to buyer and upload inspiration file", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    // cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // cy.contains("div", "odm-buyer", { timeout: 20000 })
    //   .parent()
    //   .click({ force: true });
    cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
      .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
      .contains(/^S$/) // exact match for 'S'
      .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      .click({ force: true });
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
    cy.contains("div.n-button-content", "Upload Inspiration").click();

    cy.contains("p", /^Supported Format: pdf/, { timeout: 30000 })
      .should("be.visible")
      .parents("div")
      .find('input[type="file"][accept=".pdf"]')
      .first()
      .selectFile("cypress/fixtures/ODMinspiration20mb.pdf", { force: true });

    cy.contains("p", "Supported Format: xlsx", { timeout: 30000 })
      .should("be.visible")
      .parents("div") // climb up the DOM
      .find('input[type="file"][accept=".xlsx"]')
      .first()
      .selectFile("cypress/fixtures/BrickFile.xlsx", {
        force: true,
      });

    // cy.get("div.sc-eFRcpv.ctTKYC", { timeout: 20000 })
    //   .filter(':contains("Supported Format: xlsx")')
    //   .first()
    //   .within(() => {
    //     cy.get('input[type="file"]', { timeout: 10000 }).attachFile(
    //       {
    //         filePath: "BrickFile.xlsx",
    //         encoding: "binary",
    //       },
    //       { force: true }
    //     );
    //   });

    // cy.get("div.sc-etVdmn.kLVQTT").within(() => {
    //   cy.get("p").should("contain.text", "BrickFile.xlsx");
    // });

    // cy.get("input#themeName", { timeout: 10000 })
    //   .should("be.visible")
    //   .type("automationTheem", { force: true });

    // Generate a random string
    // const randomString = Math.random().toString(36).substring(2, 10); // 8-character random string
    // const themeName = `Test_${randomString}`;

    cy.get("input#themeName", { timeout: 10000 })
      .should("be.visible")
      .type(themeName, { force: true });

    // Open the datepicker first
    cy.get("input.custom-input").click({ force: true });

    // Get all enabled dates in the visible month
    // cy.get(".react-datepicker__day:not(.react-datepicker__day--disabled)").then(
    //   ($dates) => {
    //     // Pick a random date from the available ones
    //     const randomIndex = Math.floor(Math.random() * $dates.length);
    //     cy.wrap($dates[randomIndex]).click({ force: true });
    //   },
    // );

    const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 2);

cy.get(".react-datepicker__day:not(.react-datepicker__day--disabled)")
  .not(".react-datepicker__day--outside-month")
  .contains(new RegExp(`^${targetDate.getDate()}$`))
  .click({ force: true });

    cy.get("#desc").type("this is added for automation testing");

    cy.wait(10000);

    cy.contains("button", "Continue", { timeout: 20000 }).click({
      force: true,
    }).wait(10000);

    cy.get('[role="alert"]', { timeout: 10000 }) // targeting the toast container
      .should("be.visible")
      .within(() => {
        cy.contains("Inspiration uploaded successfully").should("be.visible");
      });
  });

  //Go to buyer role
  it("Buyer shares the Uploaded theme and share it with a vendor", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace", { timeout: 20000 });
    // cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // cy.contains("div", "odm-buyer", { timeout: 20000 })
    //   .parent()
    //   .click({ force: true });
    cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
      .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
      .contains(/^S$/) // exact match for 'S'
      .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      .click({ force: true });
    //const res = cy.get("div.side-navigation-panel-select-inner-option", {timeout: 5000}).contains("ODM");
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP", {
      timeout: 15000,
    }).click({ force: true });
    cy.wait(10000);
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click()
      .wait(15000);
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

    // cy.get("td.align-middle", { timeout: 20000 })
    //   .find('p[title="automationTheem"]')
    //   .should("exist")
    //   .and("contain.text", "automationTheem")
    //   .wait(10000);
    // Wait until the search input is visible
    // Wait for the table to be visible
    // Wait for at least one row to appear

    // Wait for table rows to load
    cy.get('button[role="checkbox"]', { timeout: 10000 })
      .eq(1) // 0 = first, 1 = second
      .click({ force: true });

    // Click the "Share" button SVG icon
    //cy.get('button[role="checkbox"]').first().click({ force: true }).wait(800);
    cy.contains("div.n-button-content", "Share").click({ force: true });
    cy.contains("div", "Share moodboards to vendor")
      .parent() // moves to the parent container that holds both the text and arrow
      .find("svg") // locate the right arrow svg
      .last() // ensure we pick the arrow (not the user icon on the left)
      .click({ force: true })
      .wait(1000);
    // cy.get('input[placeholder="Select / Search item"]')
    //   .click({ force: true })
    //   .wait(1000);
    // cy.contains("label", "MARS FASHIONS - 30304916")
    //   .scrollIntoView()
    //   .find('input[type="checkbox"]')
    //   .check({ force: true })
    //   .wait(1000);
    // cy.get('input[placeholder="Select / Search item"]').type(
    //   "MAHESHWARI GARMENT",
    // );
    // cy.contains("label", "MAHESHWARI GARMENT - 32021182")
    cy.get('input[placeholder="Select / Search item"]').type("KIRARA",);
    cy.contains("label", "KIRARA - 32021182")
      .scrollIntoView()
      .find('input[type="checkbox"]')
      .check({ force: true })
      .wait(1000);

    cy.contains("div.n-button-content", "Share")
      .click({ force: true })
      .wait(600);
  });

  //Vendor role
  it("Vendor verifies that shared Inspiration is visible and submit design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("32021182")
      .click({ force: true })
      .wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click()
      .wait(1000);
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click()
      .wait(15000);
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);
    // Type 'automationTheem' into the search input
    // cy.get('input[placeholder="Search"][data-testid="input-component"]', {
    //   timeout: 10000,
    // })
    //   .should("be.visible")
    //   .clear()
    //   .type("automation", { delay: 100 })
    //   .wait(1000); // optional delay for UI sync
    // Click on the first "View" button
    cy.get("div.n-button-content")
      .contains("View")
      .first()
      .click({ force: true })
      .wait(1000);
    // Scroll to the "Submit" button and click it
    cy.contains("div.n-button-content", "Submit")
      .scrollIntoView()
      .click({ force: true })
      .wait(1000);
    // cy.get('input[data-testid="article_code_input"]')
    //   .first()
    //   .type("StyleTest123");
    cy.get('input[data-testid="article_code_input"]')
      .first()
      .type(vendorStyleCode);
    // Type into the search input
    //cy.get('input[data-testid="dropdown-search"]').type("6206400{enter}");

    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });

    // Wait for the dropdown options to load
    cy.wait(800); // adjust if your app loads slower
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

    cy.contains("p", "Colorways") // find the container by its text
      .parent() // go to the wrapper div
      .find('input[type="file"]') // find the hidden input
      .attachFile("colorways.jpg", { force: true });

    cy.wait(2000);

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

    cy.wait(10000);

    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      if (text === "Submit") {
        // Scroll into view, find the parent button, then click
        cy.wrap($el)
          .scrollIntoView()
          .parent("button")
          .should("be.visible")
          .click()
          .wait(15000);
        // Stop iterating once found
        return false;
      }
    });
  });

  //Cluster role
  it("Cluster logins and send submitted design for rework", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click()
      .wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click()
      .wait(1000);
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click();
    cy.get('input[placeholder="Search"]').type(themeName).wait(10000);
    // cy.get('button[data-testid="filter-button"]')
    //   .scrollIntoView()
    //   .should("be.visible")
    //   .click({ force: true });
    // 1️⃣ Apply all filters
    // cy.contains("div", "Status").click().wait(10000);
    // cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   //.should("be.visible") // ensure it is visible
    //   .click({ force: true });
    cy.contains("p", "PENDING").first().click({ force: true }).wait(1000);
    cy.contains("button", "Rework").click({ force: true }).wait(1000);
  });

  //Vendor makes changes to rework design---not working
  it("Vendor reworks on the design after cluster sends for rework", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("32021182")
      .click({ force: true })
      .wait(15000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click()
      .wait(10000);
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click({ force: true }).wait(1000);
    
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);
    cy.contains("p", "REWORK").first().click({ force: true }).wait(1000);
    cy.contains("div.n-button-content", "Edit").click();
    //cy.get("div.n-button-content").each(($el) => {
    //   const text = $el.text().trim();
    cy.get('input[data-testid="dropdown-search"]', { timeout: 15000 }).click();
    cy.get('input[data-testid="dropdown-search"]').type(
      "{selectall}{backspace}",
      { force: true },
    );
    cy.wait(10000);
    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 1000 });
    // // Wait for the dropdown options to load
    cy.wait(800); // adjust if your app loads slower
    cy.get("body").then(($body) => {
      console.log($body.html()); // logs HTML to Cypress runner console
    });
    // Select the correct code (assuming dropdown options appear as list items)
    cy.get(".n-options .n-option", { timeout: 10000 })
      .contains("62033200")
      .click({ force: true });

    cy.wait(2000);
    cy.contains("button", "Submit")
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
  });

  //Cluster role
  it("Cluster checks the rework by vendor and approve the design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click()
      .wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click();
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);

    // cy.contains("div", "Status").click().wait(10000);
    // cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   //.should("be.visible") // ensure it is visible
    //   .click({ force: true })
    //   .wait(1000);
    cy.contains("p", "PENDING").first().click({ force: true }).wait(10000);
    cy.contains("button", "Approve").click({ force: true }).wait(10000);
  });

  //Buyer reworks the cluster submitted design /888
  it("Buyer checks cluster approved design and send back to vendor for rework", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
     cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
      .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
      .contains(/^S$/) // exact match for 'S'
      .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      .click({ force: true });
    cy.wait(10000);
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
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);

    // cy.contains("div", "Status").click().wait(10000);
    // cy.get('input[value="CLUSTER APPROVED"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   .click({ force: true })
    //   .wait(1000);
    cy.contains("p", "CLUSTER APPROVED").first().click({ force: true });
    cy.contains("button", "Rework").click();
  });

  //Vendor reworks on buyer rework design
  it("Vendorlogs in back and rework the design sent by buyer for rework", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("32021182")
      .click({ force: true })
      .wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click()
      .wait(1000);
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click({ force: true });
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);

    // cy.contains("div", "Status").click().wait(10000);
    // cy.get('input[value="REWORK"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   .click({ force: true })
    //   .wait(1000);
    cy.contains("p", "REWORK").first().click({ force: true });
    cy.contains("div.n-button-content", "Edit").click().wait(10000);
    // cy.contains("label", "Brick Name *")
    //   // Navigate to the closest wrapper containing the dropdown trigger
    //   .parent()
    //   .find(".n-select__trigger")
    //   .click(); // Open the dropdown

    // Step 2: Select the first option from the dropdown
    //cy.get(".n-options .n-option").contains("Pyjamas").click();
    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      cy.get('input[data-testid="dropdown-search"]')
        .clear({ force: true })
        .type("620", { delay: 1000 });

      // Wait for the dropdown options to load
      cy.wait(800); // adjust if your app loads slower
      cy.get("body").then(($body) => {
        console.log($body.html()); // logs HTML to Cypress runner console
      });
      // Select the correct code (assuming dropdown options appear as list items)
      cy.get(".n-options .n-option", { timeout: 10000 })
        .contains("62064000")
        .click({ force: true });
      cy.contains("p", "Colorway")
        .scrollIntoView({ duration: 600 })
        .should("be.visible");
      cy.get("svg title")
        .contains("Edit")
        .parents("svg")
        .click({ force: true })
        .wait(10000);
      cy.get('input[placeholder="Enter Cost per Piece"]')
        .clear({ force: true })
        .type("300", { force: true });
      // Get the div
      cy.get("svg title")
        .contains("Confirm Edit")
        .parent()
        .click({ force: true });

      cy.wait(5000);
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

  //buyer parks the cluster approved design
  it("Buyer Parks", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
      .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
      .contains(/^S$/) // exact match for 'S'
      .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      .click({ force: true });
    cy.wait(10000);
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
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);
    cy.contains("p", "CLUSTER APPROVED")
      .first()
      .click({ force: true })
      .wait(10000);
    cy.contains("button", "Park")
      .should("be.visible") // ensures Cypress waits until the button is visible
      .click({ force: true })
      .wait(1000);
    cy.contains("span", "Parked Design")
      .should("be.visible") // wait until the span is visible
      .click({ force: true });
  });

  //Unpark the inspiration
  it("Buyer Unparks the design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
      .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
      .contains(/^S$/) // exact match for 'S'
      .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      .click({ force: true });
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
    cy.contains("span", "Parked Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);

    cy.contains("div.n-button-content", "Move to Active") // find the element
      .scrollIntoView() // scroll it into view
      .should("be.visible") // ensure it's visible
      .click({ force: true }); // click it
  });

  //buyer parks the cluster approved design again
  it("Buyer Parks again", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    //   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    //  cy.contains("div", "odm-buyer", { timeout: 20000 })
    //     .parent()
    //     .click({ force: true })
    //     .wait(2000);
    cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
      .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
      .contains(/^S$/) // exact match for 'S'
      .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      .click({ force: true });
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);

    // cy.get('button[data-testid="filter-button"]')
    //   .scrollIntoView()
    //   .should("be.visible")
    //   .click({ force: true });
    // cy.contains("div", "Status").click().wait(10000);
    // cy.get('input[value="CLUSTER APPROVED"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   .click({ force: true })
    //   .wait(1000);
    cy.contains("p", "CLUSTER APPROVED")
      .first()
      .click({ force: true })
      .wait(10000);
    cy.contains("button", "Park")
      .should("be.visible") // ensures Cypress waits until the button is visible
      .click({ force: true })
      .wait(1000);
    cy.contains("span", "Parked Design")
      .should("be.visible") // wait until the span is visible
      .click({ force: true });
  });

  //buyer reworks the parked design
  it("Buyer Rework the parked design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    // cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // cy.contains("div", "odm-buyer", { timeout: 20000 })
    //   .parent()
    //   .click({ force: true })
    //   .wait(2000);
    cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
      .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
      .contains(/^S$/) // exact match for 'S'
      .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      .click({ force: true });
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
    cy.contains("span", "Parked Design").click({ force: true }).wait(10000);
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
  it("Vendor reworks the design second time after buyer sent for rework", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("32021182")
      .click({ force: true })
      .wait(15000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click()
      .wait(10000);
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click({ force: true }).wait(1000);
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);
    cy.contains("p", "REWORK").first().click({ force: true }).wait(1000);
    cy.contains("div.n-button-content", "Edit").click();
    //cy.get("div.n-button-content").each(($el) => {
    //   const text = $el.text().trim();
    cy.get('input[data-testid="dropdown-search"]', { timeout: 15000 }).click();
    cy.get('input[data-testid="dropdown-search"]').type(
      "{selectall}{backspace}",
      { force: true },
    );
    cy.wait(10000);
    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 1000 });
    // // Wait for the dropdown options to load
    cy.wait(800); // adjust if your app loads slower
    cy.get("body").then(($body) => {
      console.log($body.html()); // logs HTML to Cypress runner console
    });
    // Select the correct code (assuming dropdown options appear as list items)
    cy.get(".n-options .n-option", { timeout: 10000 })
      .contains("62033200")
      .click({ force: true });

    cy.wait(2000);
    cy.contains("button", "Submit")
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
  });

  // it("Cluster approval for submitted design", () => {
  //   cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);

  //   // Click on the cluster card "Shein"
  //   cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
  //     .click()
  //     .wait(10000);
  //   cy.contains("span.side-navigation-panel-select-option-text", "UVP")
  //     .parents("span.side-navigation-panel-select-option-wrap")
  //     .click();
  //   cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
  //     .contains("ODM")
  //     .click()
  //     .wait(15000);
  //   cy.contains("span", "Submitted Design").click();
  //   cy.get('input[placeholder="Search"]').type(themeName).wait(1000);

  //   cy.contains("p", "REWORK").first().click({ force: true });
  //   cy.contains("button", "Approve").click({ force: true });
  // });
  //buyer approve for rework design from vendor
  it("Buyer checks the design and approve the design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    // cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // cy.contains("div", "odm-buyer", { timeout: 20000 })
    //   .parent()
    //   .click({ force: true })
    //.wait(2000);
    cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
      .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
      .contains(/^S$/) // exact match for 'S'
      .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      .click({ force: true });
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);

    cy.contains("p", "CLUSTER APPROVED")
      .first()
      .click({ force: true })
      .wait(10000);
    cy.get("button").contains("Select Size").click({ force: true });

    //  Wait for the dropdown options to appear and pick a random one
    cy.get(".n-options .n-option", {
      timeout: 10000,
    });
    cy.get('input[value="size-group-0"]').check({ force: true });
    cy.wait(5000);
    cy.get('button[title="Approve"]').click({ force: true });
    cy.wait(5000);

    cy.get('button[title="Approve"]').click({ force: true });
    cy.wait(5000);
    cy.contains("button", "Approve").click({ force: true }).wait(10000);
  });

  it("FPT and GPT approval", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);

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
    cy.get('label[for="required-yes"]').click();

    cy.get('input[type="file"][accept=".xlsx,.pdf"]')
      .selectFile("cypress/fixtures/testfpt 1 7.pdf", { force: true })
      .wait(15000);

    cy.contains("label", "I acknowledge the test completed").click().wait(1000);
    cy.contains("div.n-button-content", "Approve").click().wait(1000);
    //cy.contains("p", "PENDING").first().click({ force: true });
    //cy.contains("button", "Approve").click({ force: true });
  });

  it("Pick plm style id and hit DP create api", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    // cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // cy.contains("div", "odm-buyer", { timeout: 20000 })
    //   .parent()
    //   .click({ force: true })
    //.wait(2000);
    cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
      .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
      .contains(/^S$/) // exact match for 'S'
      .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      .click({ force: true });
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 })
      .click({ force: true })
      .wait(1000);
    cy.get('input[placeholder="Search"]').type(themeName).wait(10000);

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
            url: "https://api.uat.impetusz0.de/service/application/odm/v1.0/uvp/dp/create",
            
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

  it("PP sample: Vendor submits the sample design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("32021182")
      .click({ force: true })
      .wait(15000);

    cy.contains("span.side-navigation-panel-select-option-text", "QC")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("PP Sample")
      .click()
      .wait(15000);
    cy.get('input[placeholder="Search"]').type(vendorStyleCode).wait(1000);
    //cy.contains("p", "PP PENDING").first().click({ force: true }).wait(1000);
    cy.contains("PP PENDING").click({ force: true }).wait(1000);
    cy.contains("div.n-button-content", "Upload Files")
      .parents("button")
      .parent()
      .find('input[type="file"]')
      .selectFile("cypress/fixtures/pppic.jpg", { force: true })
      .wait(10000);
    cy.contains("button", "Submit Sample").click().wait(10000);
  });

  it("PP sample: Buyer sends the design for resubmission", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    // cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // cy.contains("div", "odm-buyer", { timeout: 20000 })
    //   .parent()
    //   .click({ force: true })
    //.wait(2000);
    cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
      .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
      .contains(/^S$/) // exact match for 'S'
      .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      .click({ force: true });
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "QC")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("PP Sample")
      .click();
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);

    cy.contains("PP BUYER PENDING").first().click({ force: true }).wait(10000);
    cy.contains("I acknowledge that I have thoroughly checked the sample")
      .scrollIntoView()
      .parent()
      .find('input[type="checkbox"]')
      .check({ force: true });
    cy.get("button").contains("Request Resubmission").click().wait(1000);
  });

  it("PP sample: Vendor submits the sample again on resubmitted design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("32021182")
      .click({ force: true })
      .wait(15000);

    cy.contains("span.side-navigation-panel-select-option-text", "QC")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("PP Sample")
      .click()
      .wait(15000);
    cy.get('input[placeholder="Search"]').type(vendorStyleCode).wait(1000);
    //cy.contains("p", "PP PENDING").first().click({ force: true }).wait(1000);
    cy.contains("PP RESUBMISSION").click({ force: true }).wait(1000);
    cy.contains("div.n-button-content", "Upload Files")
      .parents("button")
      .parent()
      .find('input[type="file"]')
      .selectFile("cypress/fixtures/pppic.jpg", { force: true })
      .wait(10000);
    cy.contains("button", "Submit Sample").click().wait(10000);
  });

  it("PP sample: Buyer approves the design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    // cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // cy.contains("div", "odm-buyer", { timeout: 20000 })
    //   .parent()
    //   .click({ force: true })
    //.wait(2000);
    cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
      .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
      .contains(/^S$/) // exact match for 'S'
      .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      .click({ force: true });
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "QC")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("PP Sample")
      .click();
    cy.get('input[placeholder="Search"]').type(themeName).wait(10000);

    cy.contains("PP BUYER PENDING").first().click({ force: true }).wait(10000);
    cy.contains("I acknowledge that I have thoroughly checked the sample")
      .scrollIntoView()
      .parent()
      .find('input[type="checkbox"]')
      .check({ force: true });
    cy.get("button").contains("Approve").click().wait(1000);
  });

  it("PP approval for Cluster approval for submitted design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click()
      .wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click();
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(vendorStyleCode).wait(15000);

    // cy.contains("div", "Status").click().wait(10000);
    // cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   //.should("be.visible") // ensure it is visible
    //   .click({ force: true })
    //   .wait(1000);
    cy.contains("PP CLUSTER PENDING").click({ force: true }).wait(1000);

    cy.contains("I acknowledge that I have thoroughly checked the sample")
      .scrollIntoView()
      .parent()
      .find('input[type="checkbox"]')
      .check({ force: true });
    cy.get("button").contains("Approve").click().wait(10000);
  });
  
  it.only("Submit the design for Buyer Reject Scenario", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); 
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("32021182")
      .click({ force: true })
      .wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click()
      .wait(1000);
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click()
      .wait(10000);
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);
    
    cy.get("div.n-button-content")
      .contains("View")
      .first()
      .click({ force: true })
      .wait(1000);
    // Scroll to the "Submit" button and click it
    cy.contains("div.n-button-content", "Submit")
      .scrollIntoView()
      .click({ force: true })
      .wait(1000);
   
    cy.get('input[data-testid="article_code_input"]')
      .first()
      .type(vendorStyleCode);

    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });

    // Wait for the dropdown options to load
    cy.wait(800); // adjust if your app loads slower
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

    cy.wait(2000);

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
          .click()
          .wait(15000);
        // Stop iterating once found
        return false;
      }
    });

    //https://assets.impetusz0.de/d2sz0-unified-vendor-portal/design-files/design_20251106_172801.jpeg


    cy.contains("p", "Colorways") // find the container by its text
      .parent() // go to the wrapper div
      .find('input[type="file"]') // find the hidden input
      .attachFile("BLUE.jpeg", { force: true });

    cy.wait(2000);

    // Find the dropdown input with placeholder "Add SAP ID" and click it
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .scrollIntoView() // ensure it's visible
      .click(); // open the dropdown

    // Type the value to filter options (optional if searchable)

    // Now select the option "LT Orange" from the dropdown
    cy.get('[data-testid="dropdown-scroll"]')
      .contains(".n-option", "BLUE")
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

    cy.wait(10000);


    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      if (text === "Submit") {
        // Scroll into view, find the parent button, then click
        cy.wrap($el)
          .scrollIntoView()
          .parent("button")
          .should("be.visible")
          .click()
          .wait(15000);
        // Stop iterating once found
        return false;
      }
    });
  });
  
  it("Cluster approves the design and send it to buyer", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click()
      .wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click();
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);

    // cy.contains("div", "Status").click().wait(10000);
    // cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   //.should("be.visible") // ensure it is visible
    //   .click({ force: true })
    //   .wait(1000);
    cy.contains("p", "PENDING").first().click({ force: true }).wait(1000);
    cy.contains("button", "Approve").click({ force: true }).wait(1000);
  });

  it("Buyer approves colorways and reject the design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    // cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // cy.contains("div", "odm-buyer", { timeout: 20000 })
    //   .parent()
    //   .click({ force: true })
    //.wait(2000);
    cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
      .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
      .contains(/^S$/) // exact match for 'S'
      .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
      .click({ force: true });
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('input[placeholder="Search"]').type(themeName).wait(1000);

    cy.contains("p", "CLUSTER APPROVED")
      .first()
      .click({ force: true })
      .wait(10000);
    cy.get("button").contains("Select Size").click({ force: true });

    //  Wait for the dropdown options to appear and pick a random one
    cy.get(".n-options .n-option", {
      timeout: 10000,
    });
    cy.get('input[value="size-group-0"]').check({ force: true });
    cy.wait(5000);
    cy.get('button[title="Approve"]').eq(0).click({ force: true }).wait(1000);
    cy.get('button[title="Approve"]').eq(1).click({ force: true }).wait(10000);
    cy.wait(5000);
    cy.contains("button", "Reject").click({ force: true }).wait(10000);
  });

  //**********One flow is completed till here */

  //Vnedor submits the third design now
  //Vendor role
  // xit("Verify that shared Inspiration is visible and submit design", () => {
  //   cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
  //   // Click on the vendor card "Shein"
  //   cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
  //     force: true,
  //   }); // click it even if overlayed
  //   cy.get("div.sc-dAbbOL.vIbA-D")
  //     .contains("30304916")
  //     .click({ force: true })
  //     .wait(1500);
  //   cy.contains("span.side-navigation-panel-select-option-text", "UVP")
  //     .parents("span.side-navigation-panel-select-option-wrap")
  //     .click()
  //     .wait(1000);
  //   cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
  //     .contains("ODM")
  //     .click()
  //     .wait(15000);
  //   cy.get('input[placeholder="Search"]').type(themeName).wait(1000);
  //   cy.get("div.n-button-content")
  //     .contains("View")
  //     .first()
  //     .click({ force: true })
  //     .wait(1000);
  //   // Scroll to the "Submit" button and click it
  //   cy.contains("div.n-button-content", "Submit")
  //     .scrollIntoView()
  //     .click({ force: true })
  //     .wait(1000);
  //   cy.get('input[data-testid="article_code_input"]')
  //     .first()
  //     .type("StyleTest123");
  //   // Type into the search input
  //   //cy.get('input[data-testid="dropdown-search"]').type("6206400{enter}");

  //   cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });

  //   // Wait for the dropdown options to load
  //   cy.wait(800); // adjust if your app loads slower
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

  //   cy.wait(2000);

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

  //   cy.wait(10000);

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
  //   cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);

  //   // Click on the cluster card "Shein"
  //   cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
  //     .click()
  //     .wait(10000);
  //   cy.contains("span.side-navigation-panel-select-option-text", "UVP")
  //     .parents("span.side-navigation-panel-select-option-wrap")
  //     .click();
  //   cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
  //     .contains("ODM")
  //     .click()
  //     .wait(15000);
  //   cy.contains("span", "Submitted Design").click();
  //   cy.get('button[data-testid="filter-button"]')
  //     .scrollIntoView()
  //     .should("be.visible")
  //     .click({ force: true });
  //   //cy.get('[data-testid="input-component"]').type("Automation").wait(1000);
  //   cy.contains("div", "Status").click().wait(10000);
  //   cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
  //     .scrollIntoView({ duration: 200 }) // scroll smoothly into view
  //     //.should("be.visible") // ensure it is visible
  //     .click({ force: true })
  //     .wait(1000);
  //   cy.contains("p", "PENDING").first().click({ force: true });
  //   cy.contains("button", "Reject").click({ force: true });
  // });

  //***Second flow is completed */

  //Vendor submits one more design
  //Vendor role
  // xit("Verify that shared Inspiration is visible and submit design", () => {
  //   cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
  //   // Click on the vendor card "Shein"
  //   cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
  //     force: true,
  //   }); // click it even if overlayed
  //   cy.get("div.sc-dAbbOL.vIbA-D")
  //     .contains("32021183")
  //     .click({ force: true })
  //     .wait(1500);
  //   cy.contains("span.side-navigation-panel-select-option-text", "UVP")
  //     .parents("span.side-navigation-panel-select-option-wrap")
  //     .click()
  //     .wait(1000);
  //   cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
  //     .contains("ODM")
  //     .click()
  //     .wait(15000);
  //   cy.get('input[placeholder="Search"]').type(themeName).wait(1000);
  //   cy.get("div.n-button-content")
  //     .contains("View")
  //     .first()
  //     .click({ force: true })
  //     .wait(1000);
  //   // Scroll to the "Submit" button and click it
  //   cy.contains("div.n-button-content", "Submit")
  //     .scrollIntoView()
  //     .click({ force: true })
  //     .wait(1000);
  //   cy.get('input[data-testid="article_code_input"]')
  //     .first()
  //     .type("StyleTest123");
  //   // Type into the search input
  //   //cy.get('input[data-testid="dropdown-search"]').type("6206400{enter}");

  //   cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });

  //   // Wait for the dropdown options to load
  //   cy.wait(800); // adjust if your app loads slower
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

  //   cy.wait(2000);

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

  //   cy.wait(10000);

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
  //   cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);

  //   // Click on the cluster card "Shein"
  //   cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
  //     .click()
  //     .wait(10000);
  //   cy.contains("span.side-navigation-panel-select-option-text", "UVP")
  //     .parents("span.side-navigation-panel-select-option-wrap")
  //     .click();
  //   cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
  //     .contains("ODM")
  //     .click()
  //     .wait(15000);
  //   cy.contains("span", "Submitted Design").click();
  //   cy.get('button[data-testid="filter-button"]')
  //     .scrollIntoView()
  //     .should("be.visible")
  //     .click({ force: true });
  //   //cy.get('[data-testid="input-component"]').type("Automation").wait(1000);
  //   cy.contains("div", "Status").click().wait(10000);
  //   cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
  //     .scrollIntoView({ duration: 200 }) // scroll smoothly into view
  //     //.should("be.visible") // ensure it is visible
  //     .click({ force: true })
  //     .wait(1000);
  //   cy.contains("p", "PENDING").first().click({ force: true });
  //   cy.contains("button", "Approve").click({ force: true });
  // });

  // // Buyer rejects the cluster approved inspiration
  // xit("Buyer Rejects", () => {
  //   cy.visit("https://platform.uat.impetusz0.de/workspace");
  //   cy.wait(10000);
  //   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
  //    cy.contains("div", "odm-buyer", { timeout: 20000 })
  //     .parent()
  //     .click({ force: true })
  //     .wait(2000);
  //   cy.wait(10000);
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
  //   cy.contains("div", "Status").click().wait(10000);
  //   cy.get('input[value="CLUSTER APPROVED"]') // select the checkbox input with value PENDING
  //     .scrollIntoView({ duration: 200 }) // scroll smoothly into view
  //     .click({ force: true })
  //     .wait(1000);
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
