//  Global theme name for the entire spec
const randomString = Math.random().toString(36).substring(2, 10);
export const themeName = `Test_${randomString}`;

describe("Impetus Platform — Login Page Tests", () => {
  beforeEach(() => {
    cy.session("user-session", () => {
      cy.login();
    });
  });
  after(() => {
    cy.logout({ force: true });
  });

  //Logs in with valid credentials
  it("logs in successfully with valid credentials", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 })
      .eq(1)
      .click()
      .wait(2000);
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
  });

  //Upload inspiration
  it("logs in successfully with valid credentials and upload inspiration file", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 })
      .eq(4)
      .click()
      .wait(2000);
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();

    cy.contains("div.n-button-content", "Upload Inspiration").click();
    cy.get("div.sc-dUOoGL.hiaAWe")
      .filter(':contains("Supported Format: pdf")') // select only the PDF div
      .first() // ensure single element
      .within(() => {
        cy.get('input[type="file"]', { timeout: 20000 }).attachFile(
          {
            filePath: "testfpt 1 7.pdf",
            encoding: "binary",
          },
          { force: true }
        );
      });
    // ===== Upload XLSX =====
    cy.get("div.sc-dUOoGL.hiaAWe")
      .filter(':contains("Supported Format: xlsx")') // select only the XLSX div
      .first()
      .within(() => {
        cy.get('input[type="file"]', { timeout: 20000 }).attachFile(
          {
            filePath: "BrickFile.xlsx",
            encoding: "binary",
          },
          { force: true }
        );
      });
    // ===== Upload XLSX =====
    //   cy.get("div.sc-dUOoGL.hiaAWe")
    // .filter(':contains("Supported Format: xlsx")') // select only the XLSX div
    // .first()
    // .within(() => {
    //   cy.get('input[type="file"]', { timeout: 20000 }).attachFile({
    //     filePath: "BrickFile.xlsx",
    //     encoding: "binary"
    //   }, { force: true });
    // });
    //   cy.get("div.sc-etVdmn.kLVQTT").within(() => {
    //     cy.get("p").should("contain.text", "BrickFile.xlsx");
    //   });

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
    cy.get(".react-datepicker__day:not(.react-datepicker__day--disabled)").then(
      ($dates) => {
        // Pick a random date from the available ones
        const randomIndex = Math.floor(Math.random() * $dates.length);
        cy.wrap($dates[randomIndex]).click({ force: true });
      }
    );

    cy.get("#desc").type("this is added for automation testing");

    cy.wait(10000);

    cy.contains("button", "Continue", { timeout: 20000 }).click({
      force: true,
    });

    cy.get('[role="alert"]', { timeout: 10000 }) // targeting the toast container
      .should("be.visible")
      .within(() => {
        cy.contains("Inspiration uploaded successfully").should("be.visible");
      });
  });

  //Go to buyer role
  it("Searches for the Uploaded theme and share it with a vendor", () => {
    cy.visit("https://platform.impetusz0.de/workspace", { timeout: 20000 });
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).eq(4).click();

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
    cy.get('input[placeholder="Select / Search item"]')
      .click({ force: true })
      .wait(1000);
    cy.contains("label", "MARS FASHIONS - 30304916")
      .find('input[type="checkbox"]')
      .check({ force: true })
      .wait(1000);
    cy.contains("div.n-button-content", "Share")
      .click({ force: true })
      .wait(600);
  });

  //Vendor role
  it("Verify that shared Inspiration is visible and submit design", () => {
    cy.visit("https://platform.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("30304916")
      .click({ force: true })
      .wait(1500);
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
    cy.get('input[data-testid="article_code_input"]')
      .first()
      .type("StyleTest123");
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
    cy.get(".n-options .n-option").contains("Tops").click();

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
      .contains(".n-option", "LT ORANGE")
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
          .click();

        // Stop iterating once found
        return false;
      }
    });
  });

  //Cluster role
  it("Cluster approval for submitted design", () => {
    cy.visit("https://platform.impetusz0.de/workspace").wait(10000);

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
    cy.contains("p", "PENDING").first().click({ force: true });
    cy.contains("button", "Approve").click({ force: true });
  });

  // it("Cluster approval for submitted design", () => {
  //   cy.visit("https://platform.impetusz0.de/workspace").wait(10000);

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
  it("Buyer Approval", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 })
      .eq(4)
      .click()
      .wait(2000);
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
    // cy.get("button").contains("Select Size").click({ force: true });

    // //  Wait for the dropdown options to appear and pick a random one
    // cy.get(".n-options .n-option", {
    //   timeout: 10000,
    // });
    // cy.get('input[value="size-group-0"]').check({ force: true });
    // cy.wait(5000);
    // cy.get('button[title="Approve"]').click({ force: true });
    // cy.wait(5000);

    cy.get('button[title="Approve"]').click({ force: true });
    cy.wait(5000);
    cy.contains("button", "Approve").click({ force: true }).wait(10000);
  });
  /******* First flow is completed */

  //Vendor role
  it("Verify that shared Inspiration is visible and submit design", () => {
    cy.visit("https://platform.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("30304916")
      .click({ force: true })
      .wait(1500);
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
    cy.get('input[data-testid="article_code_input"]')
      .first()
      .type("StyleTest123");
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
    cy.get(".n-options .n-option").contains("Bras").click();

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
      .contains(".n-option", "LT ORANGE")
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
          .click();

        // Stop iterating once found
        return false;
      }
    });
  });

  //Cluster role
  it("Cluster approval for submitted design", () => {
    cy.visit("https://platform.impetusz0.de/workspace").wait(10000);

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
    cy.contains("p", "PENDING").first().click({ force: true });
    cy.contains("button", "Approve").click({ force: true });
  });

  // it("Cluster approval for submitted design", () => {
  //   cy.visit("https://platform.impetusz0.de/workspace").wait(10000);

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
  it("Buyer Approval", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 })
      .eq(4)
      .click()
      .wait(2000);
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
    // cy.get("button").contains("Select Size").click({ force: true });

    // //  Wait for the dropdown options to appear and pick a random one
    // cy.get(".n-options .n-option", {
    //   timeout: 10000,
    // });
    // cy.get('input[value="size-group-0"]').check({ force: true });
    // cy.wait(5000);
    // cy.get('button[title="Approve"]').click({ force: true });
    // cy.wait(5000);

    cy.get('button[title="Approve"]').click({ force: true });
    cy.wait(5000);
    cy.contains("button", "Approve").click({ force: true }).wait(10000);
  });
  /*****************Second flow is completed */
  
//Vendor role
  it("Verify that shared Inspiration is visible and submit design", () => {
    cy.visit("https://platform.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("30304916")
      .click({ force: true })
      .wait(1500);
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
    cy.get('input[data-testid="article_code_input"]')
      .first()
      .type("StyleTest123");
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
    cy.get(".n-options .n-option")
      .filter(':contains("Bras")') // get all options with text 'Bras'
      //.eq(3) // pick the one at index 3
      .click();

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
      .contains(".n-option", "LT ORANGE")
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
          .click();

        // Stop iterating once found
        return false;
      }
    });
  });

  //Cluster role
  it("Cluster approval for submitted design", () => {
    cy.visit("https://platform.impetusz0.de/workspace").wait(10000);

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
    cy.contains("p", "PENDING").first().click({ force: true });
    cy.contains("button", "Approve").click({ force: true });
  });

  // it("Cluster approval for submitted design", () => {
  //   cy.visit("https://platform.impetusz0.de/workspace").wait(10000);

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
  it("Buyer Approval", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 })
      .eq(4)
      .click()
      .wait(2000);
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
    // cy.get("button").contains("Select Size").click({ force: true });

    // //  Wait for the dropdown options to appear and pick a random one
    // cy.get(".n-options .n-option", {
    //   timeout: 10000,
    // });
    // cy.get('input[value="size-group-0"]').check({ force: true });
    // cy.wait(5000);
    // cy.get('button[title="Approve"]').click({ force: true });
    // cy.wait(5000);

    cy.get('button[title="Approve"]').click({ force: true });
    cy.wait(5000);
    cy.contains("button", "Approve").click({ force: true }).wait(10000);
  });
  /***************Third flow is completed */

  //Vendor role
  it("Verify that shared Inspiration is visible and submit design", () => {
    cy.visit("https://platform.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("30304916")
      .click({ force: true })
      .wait(1500);
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
    cy.get('input[data-testid="article_code_input"]')
      .first()
      .type("StyleTest123");
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
      .contains(".n-option", "LT ORANGE")
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
          .click();

        // Stop iterating once found
        return false;
      }
    });
  });

  //Cluster role
  it("Cluster approval for submitted design", () => {
    cy.visit("https://platform.impetusz0.de/workspace").wait(10000);

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
    cy.contains("p", "PENDING").first().click({ force: true });
    cy.contains("button", "Approve").click({ force: true });
  });

  // it("Cluster approval for submitted design", () => {
  //   cy.visit("https://platform.impetusz0.de/workspace").wait(10000);

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
  it("Buyer Approval", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 })
      .eq(4)
      .click()
      .wait(2000);
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
    // cy.get("button").contains("Select Size").click({ force: true });

    // //  Wait for the dropdown options to appear and pick a random one
    // cy.get(".n-options .n-option", {
    //   timeout: 10000,
    // });
    // cy.get('input[value="size-group-0"]').check({ force: true });
    // cy.wait(5000);
    // cy.get('button[title="Approve"]').click({ force: true });
    // cy.wait(5000);

    cy.get('button[title="Approve"]').click({ force: true });
    cy.wait(5000);
    cy.contains("button", "Approve").click({ force: true }).wait(10000);
  });
  Cypress.on("uncaught:exception", (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false;
  });
  /********************Fourth flow is completed here */
});
