const randomDesignName = `Test_${Math.random().toString(36).substring(2, 8)}`;
export const designname = randomDesignName;
const randomVendorStyle = `Style_${Math.random().toString(36).substring(2, 8)}`;
export const vendorStyleCode = randomVendorStyle;
const newrandomVendorStyle = `Style_${Math.random().toString(36).substring(2, 8)}`;
export const newvendorStyleCode = newrandomVendorStyle;

Cypress.on("uncaught:exception", () => false);
describe("RA buyer", () => {
  const pageUrl =
    "https://platform.impetusz0.de/auth/loginuvp/range-architecture";

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
    if (this.currentTest && this.currentTest.state === 'failed') {
      const testTitle = this.currentTest.title || 'Unknown Test';
      const errMessage = this.currentTest.err?.message || 'Unknown error';
      cy.screenshot(`${testTitle}-failed`);
      if (Cypress.env('allure') === true && typeof cy.allure === 'function') {
        try {
          cy.allure().step(`Test "${testTitle}" failed. Error: ${errMessage}`, { status: 'failed' });
          cy.allure().attachment('Cypress Error', errMessage, 'text/plain');
        } catch (e) {
          cy.log('Allure attachment failed: ' + e.message);
        }
      }
    }
  });

  //   it("logs in successfully with valid credentials", () => {
  //   cy.visit("https://platform.impetusz0.de/workspace");
  //   cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

  //   // cy.get(".sc-ikkxIA")
  //   //   .filter(':contains("Shein")')
  //   //   .filter(':contains("odm-buyer")')
  //   //   .find("div")
  //   //   .contains("Shein")
  //   //   .should("be.visible")
  //   //   .click({ force: true });

  //   //UAT
  //   cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
  //       .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
  //       .contains(/^S$/) // exact match for 'S'
  //       .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
  //       .click({ force: true });

  //   cy.contains("span.side-navigation-panel-select-option-text", "UVP", { timeout: 10000 })
  //     .should("be.visible")
  //     .parents("span.side-navigation-panel-select-option-wrap")
  //     .click();

  //   cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
  //     .contains("OEM")
  //     .should("be.visible")
  //     .click();

  //   // Assert OEM page loaded successfully
  //   cy.url({ timeout: 10000 }).should("include", "oem");
  // });

  it("Test Case 1: Buyer uploads design and colorways", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    //SIT

    cy.get(".sc-ikkxIA")
      .filter(':contains("Shein")')
      .filter(':contains("odm-buyer")')
      .find("div")
      .contains("Shein")
      .should("be.visible")
      .click({ force: true });

    //UAT
    // cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
    //     .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
    //     .contains(/^S$/) // exact match for 'S'
    //     .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
    //     .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.contains("div.n-button-content", "Upload Design", { timeout: 15000 })
      .click({ force: true })
      .wait(1000);
    cy.get('input[placeholder="Enter Design Name"]')
      .should("be.visible")
      .type(randomDesignName, { force: true });
    //Click the Family dropdown input
    // Select "Men" from Family dropdown
    cy.contains("label", "Family", { timeout: 15000 })
      .parent()
      .find(".n-select__trigger")
      .click();

    cy.contains(".n-option", "Men").click();

    // Select "Western Wear" from Class Name dropdown
    cy.contains("label", "Class Name")
      .parent()
      .find(".n-select__trigger")
      .click();
    cy.contains(".n-option", "Western Wear").click();

    // Open the Brick Name dropdown
    cy.contains("label", "Brick Name")
      .parent() // go to the dropdown wrapper
      .find(".n-select__trigger")
      .click();

    // Wait a little if necessary, then select the option
    cy.contains("label", "Brick Name")
      .parent() // dropdown wrapper again
      .find(".n-options") // the scrollable options container
      .scrollIntoView() // optional: scroll the container into view
      .within(() => {
        cy.contains(".n-option-wrapper span", "Jeans")
          .scrollIntoView({ easing: "linear" }) // scroll till the element
          .click();
      });

    // Step 1: Click the "Top Brick" dropdown
    cy.contains("label", "Top Brick")
      .parent() // go to the dropdown wrapper
      .find(".n-select__trigger")
      .click();

    // Step 2: Scroll the options container and click "Denim"
    cy.contains("label", "Top Brick")
      .parent() // dropdown wrapper again
      .find(".n-options") // the scrollable options container
      .scrollIntoView() // optional: scroll the container into view
      .within(() => {
        cy.contains(".n-option-wrapper span", "Denim")
          .scrollIntoView({ easing: "linear" }) // scroll till the element
          .click();
      });

    // Step 1: Click the "Brick" dropdown
    // Step 1: Click the correct Brick dropdown
    cy.get('div[style="grid-column: 2;"]')
      .find("label.n-dropdown-label")
      .contains("Brick")
      .parent() // go to the dropdown wrapper
      .find(".n-select__trigger")
      .click();

    // Step 2: Scroll the options and click "Bottomwear"
    cy.get('div[style="grid-column: 2;"]')
      .find("label.n-dropdown-label")
      .contains("Brick")
      .parent()
      .find(".n-options")
      .scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Bottomwear")
          .scrollIntoView({ easing: "linear" })
          .click();
      });

    // Step 1: Click the dropdown trigger for "Enrichment"
    cy.contains("label", "Enrichment")
      .parent() // go to the dropdown wrapper
      .find(".n-select__trigger")
      .click();

    // Step 2: Scroll the options container and click "Denim"
    cy.contains("label", "Enrichment")
      .parent() // dropdown wrapper again
      .find(".n-options") // the scrollable options container
      .scrollIntoView() // optional: scroll the container into view
      .within(() => {
        cy.contains(".n-option-wrapper span", "Denim")
          .scrollIntoView({ easing: "linear" }) // scroll till the element
          .click();
      });

    // Step 1: Click the dropdown trigger for "Cluster"
    cy.contains("label", "Cluster")
      .parent() // go to the dropdown wrapper
      .find(".n-select__trigger")
      .click();

    // Step 2: Scroll the options container and click "Bangladesh"
    cy.contains("label", "Cluster")
      .parent() // dropdown wrapper again
      .find(".n-options") // the scrollable options container
      .scrollIntoView() // optional: scroll the container into view
      .within(() => {
        cy.contains(".n-option-wrapper span", "Bangladesh")
          .scrollIntoView({ easing: "linear" }) // scroll till the element
          .click();
      });

    cy.contains("p", "Upload Design") // find the container by its text
      .parent() // go to the wrapper div
      .find('input[type="file"]') // find the hidden input
      .attachFile("design.jpeg", { force: true })
      .wait(1000);

    cy.contains("p", "Colorways").scrollIntoView().should("be.visible"); // find the container by its text
    cy.contains("button", "Upload Files", { timeout: 15000 })
      .parents()
      .find('input[type="file"]')
      .eq(1)
      .attachFile("AQUA.jpg", { force: true })
      .wait(1000);
    cy.get(
      'input[data-testid="dropdown-search"][placeholder="Add SAP ID"]',
    ).click();
    cy.get('[data-testid="dropdown-scroll"]')
      .contains(".n-option", "AQUA")
      .scrollIntoView() // scroll within the container
      .click()
      .wait(1000);
    cy.get('input[placeholder="Enter cost"]').type("333").wait(1000);
    cy.get('svg path[d^="M12 19.0713"]').closest("button").click();

    cy.contains("p", "Colorways").scrollIntoView().wait(1000); // find the container by its text
    cy.contains("button", "Upload Files")
      .parents()
      .find('input[type="file"]')
      .eq(1)
      .attachFile("rosegold.jpeg", { force: true })
      .wait(1000);
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .eq(1)
      .click();
    cy.contains(
      '[data-testid="dropdown-scroll"]:visible .n-option',
      "ROSE GOLD",
    ).click();
    cy.get('input[placeholder="Enter cost"]').last().type("350");

    cy.contains("p", "Colorways").scrollIntoView().wait(1000); // find the container by its text
    cy.contains("button", "Upload Files")
      .parents()
      .find('input[type="file"]')
      .eq(1)
      .attachFile("green.jpeg", { force: true })
      .wait(1000);
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .last()
      .click()
      .wait(1000);
    cy.contains(
      '[data-testid="dropdown-scroll"]:visible .n-option',
      "PISTA GREEN",
    ).click();
    cy.get('input[placeholder="Enter cost"]').last().type("370");
    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      if (text === "Upload") {
        // Scroll into view, find the parent button, then click
        cy.wrap($el)
          .scrollIntoView()
          .parent("button")
          .should("be.visible")
          .click()
          .wait(1000);

        // Stop iterating once found
        return false;
      }
    });

    cy.get("#costing")
      .find('input[placeholder="Ex. cotton 90%, polyster 10%"]')
      .type("Cotton 80%, Polyester 20%", { force: true });
    cy.get("#costing")
      .find('input[placeholder="Ex. 240/160"]')
      .type("240/180", { force: true });

    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      if (text === "Submit") {
        // Scroll into view, find the parent button, then click
        cy.wrap($el)
          .scrollIntoView()
          .parent("button")
          .should("be.visible")
          .click()
          .wait(1000);

        // Stop iterating once found
        return false;
      }
    });
  });

  //Go to buyer role
  it("Test Case 2: Searches for design name and share with vendor", () => {
    cy.visit("https://platform.impetusz0.de/workspace", { timeout: 20000 });
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    //SIT

    cy.get(".sc-ikkxIA")
      .filter(':contains("Shein")')
      .filter(':contains("odm-buyer")')
      .find("div")
      .contains("Shein")
      .should("be.visible")
      .click({ force: true });

    //UAT
    // cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
    //     .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
    //     .contains(/^S$/) // exact match for 'S'
    //     .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
    //     .click({ force: true });

    //const res = cy.get("div.side-navigation-panel-select-inner-option", {timeout: 5000}).contains("ODM");
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(designname);

    // Wait for table rows to load
    cy.get('button[role="checkbox"]', { timeout: 10000 })
      .eq(1) // 0 = first, 1 = second
      .click({ force: true });

    // Click the "Share" button SVG icon
    //cy.get('button[role="checkbox"]').first().click({ force: true }).wait(800);
    cy.contains("div.n-button-content", "Share").click({ force: true });
    cy.contains("div", "Share designs to vendor")
      .parent() // moves to the parent container that holds both the text and arrow
      .find("svg") // locate the right arrow svg
      .last() // ensure we pick the arrow (not the user icon on the left)
      .click({ force: true })
      .wait(1000);
    cy.get('input[placeholder="Select Vendors"]').type("MAHESHWARI GARMENT");
    cy.contains("label", "MAHESHWARI GARMENT - 32021321")
      .scrollIntoView()
      .find('input[type="checkbox"]')
      .check({ force: true })
      .wait(1000);

    cy.contains("div.n-button-content", "Share")
      .parent("button")
      .should("be.visible")
      .click({ force: true });

    //UAT
    // cy.get('input[placeholder="Select Vendors"]').type("MAHESHWARI GARMENT  ")
    // //cy.contains("label", "MAHESHWARI GARMENT   - 32021321")
    //   .scrollIntoView()
    //   .find('input[type="checkbox"]')
    //   .check({ force: true })
    //   .wait(1000);
    // cy.contains("div.n-button-content", "Share")
    //   .click({ force: true })
    //   .wait(600);
    // cy.get('input[placeholder="Select / Search item"]')
  });

  //Vendor role
  it("Test Case 3: Vendor verifies shared design and submits", () => {
    cy.visit("https://platform.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.contains("32021321").click().wait(1000);
    //  cy.get("div.sc-dAbbOL.vIbA-D")
    //     .contains("32021321")
    //     .click({ force: true })
    //     .wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click()
      .wait(10000);
    cy.get('input[placeholder="Search"]').type(designname).wait(5000);
    cy.contains("div.n-button-content", "Upload", { timeout: 15000 })
      .first()
      .click({ force: true });

    cy.get('input[data-testid="article_code_input"]', { timeout: 15000 })
      .first()
      .type(newrandomVendorStyle, { force: true });
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
    cy.contains("p", "Mandatory").scrollIntoView();

    //cy.get('[data-testid="cost-0"]').first().type("372").wait(1000);

    // Reusable function using exact classes from your HTML
    // ── Enter all 3 costs first ──────────────────────────────

    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-0"]')
      .first()
      .type("380", { force: true })
      .should("have.value", "380");

    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]')
      .eq(0)
      .parents("button")
      .click({ force: true });

    cy.wait(1000);

    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-1"]')
      .type("450", { force: true });

    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]')
      .eq(0)
      .parents("button")
      .click({ force: true });

    cy.wait(1000);

    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-2"]')
      .type("460", { force: true });

    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]')
      .eq(0)
      .parents("button")
      .click({ force: true });

    cy.wait(1000);

    cy.wait(1000);
    //Upload the colorway by vendor - blue and black
    cy.contains("p", "Colorways").scrollIntoView().wait(10000); // find the container by its text
    cy.contains("button", "Upload Files")
      .parents()
      .find('input[type="file"]')
      .attachFile("BLUE.jpeg", { force: true })
      .wait(1000);
    cy.get('input[data-testid="dropdown-search"]').eq(1).click();
    // 2. Wait a bit if options are dynamically rendered (optional)
    cy.get(".n-option")
      .contains("BLUE") // find the option by text
      .scrollIntoView() // scroll to it if needed
      .click();
    cy.get('input[placeholder="Enter cost"]').type("150").wait(10000);

    // Uploading the black colorway by vendor
    cy.contains("p", "Colorways").scrollIntoView().wait(10000); // find the container by its text
    cy.contains("button", "Upload Files")
      .parents()
      .find('input[type="file"]')
      .attachFile("black.jpeg", { force: true })
      .wait(1000);
    // 2. Wait a bit if options are dynamically rendered (optional)
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .last()
      .click()
      .wait(1000);
    cy.contains(
      '[data-testid="dropdown-scroll"]:visible .n-option',
      "BLACK",
    ).click();
    cy.get('input[placeholder="Enter cost"]').last().type("210").wait(10000);

    cy.wait(1000);

    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      if (text === "Upload") {
        // Scroll into view, find the parent button, then click
        cy.wrap($el)
          .scrollIntoView()
          .parent("button")
          .should("be.visible")
          .click()
          .wait(10000);

        // Stop iterating once found
        return false;
      }
    });

    //Create one pack by vendor with any of the available colorways
    //Create pack1 with GREEN and AQUA
    cy.get("button").contains("Create Pack").should("be.visible").click();
    cy.get('input[type="number"]').eq(1).clear().type("3"); //
    cy.get('input[type="number"]').eq(2).clear().type("2"); //
    cy.wait(5000);
    cy.get("input[placeholder='Enter cost']").type("650").wait(1000);
    cy.get(
      "button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid",
    )
      .filter(':contains("Create Pack")')
      .click()
      .wait(1000);
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
        .selectFile("cypress/fixtures/attachment.jpg", { force: true })
        .wait(15000);

      // Save comment
      cy.contains("Save Comment").click();
    });

    // cy.wait(2000);

    // // Find the dropdown input with placeholder "Add SAP ID" and click it
    // cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
    //   .scrollIntoView() // ensure it's visible
    //   .click(); // open the dropdown

    // // Type the value to filter options (optional if searchable)

    // // Now select the option "LT Orange" from the dropdown
    // cy.get('[data-testid="dropdown-scroll"]')
    //   .contains(".n-option", "LT ORANGE")
    //   .scrollIntoView() // scroll within the container
    //   .click();

    // //cy.get('input[placeholder="Enter cost"]').type("333");
    // cy.get('[data-testid="cost-0"]').type("100");

    // cy.get("div.n-button-content").each(($el) => {
    //   const text = $el.text().trim();

    //   if (text === "Upload") {
    //     // Scroll into view, find the parent button, then click
    //     cy.wrap($el)
    //       .scrollIntoView()
    //       .parent("button")
    //       .should("be.visible")
    //       .click();

    //     // Stop iterating once found
    //     return false;
    //   }
    //});

    //https://assets.impetusz0.de/d2sz0-unified-vendor-portal/design-files/design_20251106_172801.jpeg

    // cy.get("#costing")
    //   .find('input[placeholder="Ex. cotton 90%, polyster 10%"]')
    //   .type("Cotton 80%, Polyester 20%", { force: true });
    // cy.get("#costing")
    //   .find('input[placeholder="Ex. 240/160"]')
    //   .type("240/180", { force: true });

    // cy.wait(10000);
    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      if (text === "Submit") {
        // Scroll into view, find the parent button, then click
        cy.wrap($el)
          .scrollIntoView()
          .parent("button")
          .should("be.visible")
          .click()
          .wait(1000);

        // Stop iterating once found
        return false;
      }
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it("Test Case 3.1: Verify cluster of the created design on UI", () => {
    const expectedCluster = "Bangladesh";

    // Login as cluster
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 }).should("be.visible").click();

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();

    // Go to Active Inspiration and search for the design
    cy.contains("span", "Active Inspiration", { timeout: 15000 }).click();
    cy.wait(5000);
    cy.get('input[placeholder="Search"]').type(designname).wait(5000);
    cy.contains("p", designname, { timeout: 10000 }).first().click({ force: true });

    // Verify cluster text on UI and highlight it
    cy.contains("p", "Cluster", { timeout: 10000 })
      .parent()
      .within(() => {
        cy.get("div").contains(expectedCluster, { matchCase: false })
          .should("be.visible")
          .then(($el) => {
            $el.css({
              border: "3px solid red",
              "background-color": "yellow",
              padding: "2px 6px",
              "border-radius": "4px",
            });
          });
      });

    cy.screenshot("oem-cluster-highlighted");
  });

  //Cluster role
  it("Test Case 4: Cluster approval for submitted design after vendor submits", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click();
    cy.contains("span.side-navigation-panel-select-option-text", "UVP", { timeout: 15000 })
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(designname).wait(1000);

    cy.contains("div", "Status").click();
    cy.get('input[value="PENDING"]', { timeout: 15000 }) // select the checkbox input with value PENDING
      .scrollIntoView({ duration: 200 }) // scroll smoothly into view
      //.should("be.visible") // ensure it is visible
      .click({ force: true })
      .wait(1000);
    cy.contains("p", "PENDING").first().click({ force: true }).wait(1000);
    cy.contains("Comments").click();

    // Work ONLY inside comments section
    cy.get("#comments").within(() => {
      // Type comment
      cy.get('div[contenteditable="true"]')
        .should("be.visible")
        .click()
        .type("Cluster Approved");

      // Click attach icon
      cy.get('button[title="Attach file"]').click({ force: true });

      // Upload file (correct input now)
      cy.get('input[type="file"]')
        .selectFile("cypress/fixtures/attachment.jpg", { force: true })
        .wait(5000);

      // Save comment
      cy.contains("Save Comment").click();
    });
    cy.contains("button", "Approve").click({ force: true });
  });

  // ─────────────────────────────────────────────────────────────────────────
  it("Test Case 4.1: Cluster verifies vendor cluster for the submitted design via API and UI", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 }).should("be.visible").click();

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();
    cy.wait(5000);
    cy.get('input[placeholder="Search"]').type(designname).wait(5000);
    cy.contains("p", "CLUSTER APPROVED", { timeout: 10000 }).first().click({ force: true });

    // Call the submitted design list API to verify vendor cluster
    cy.getCookies().then((cookies) => {
      const cookieString = cookies.map((c) => `${c.name}=${c.value}`).join("; ");

      cy.request({
        method: "GET",
        url: `https://api.impetusz0.de/service/application/odm/v1.0/uvp/oem-design/submitted-design?pageNo=1&limit=25&sortByField=createdAt&sortByOrder=desc&activeTab=1&searchTerm=${designname}`,
        headers: {
          cookie: cookieString,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        cy.log('Response body keys: ' + Object.keys(response.body));
        cy.log('Data type: ' + typeof response.body.data);
        cy.log('Data: ' + JSON.stringify(response.body.data).substring(0, 500));
      });
    });

    // Validate vendor cluster on UI and highlight it
    cy.contains("p", "Vendor Cluster", { timeout: 10000 })
      .parent()
      .should("contain.text", "AHMEDABAD")
      .then(($el) => {
        $el.css({
          border: "3px solid red",
          "background-color": "yellow",
          padding: "2px 6px",
          "border-radius": "4px",
        });
      });
  });

  //Vendor role to submit design again
  it("Test Case 5: Vendor submits the second design", () => {
    cy.visit("https://platform.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.contains("32021321").click().wait(1000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click()
      .wait(1500);
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(designname).wait(1000);
    cy.get("table tbody tr td:nth-child(1)", { timeout: 15000 })
      .first()
      .within(() => {
        cy.get('div[data-testid="link-with-context"] span').click({
          force: true,
        });
      });

    // Verify cluster on design detail page and highlight it
    cy.contains("Cluster", { timeout: 10000 }).should("exist").then(($el) => {
      $el[0].scrollIntoView({ inline: "center", block: "nearest" });
    });
    cy.contains("Bangladesh", { timeout: 10000 }).should("exist").then(($el) => {
      $el[0].scrollIntoView({ inline: "center", block: "nearest" });
    });
    cy.contains("Bangladesh").should("be.visible").then(($el) => {
      $el.css({
        border: "3px solid red",
        "background-color": "yellow",
        padding: "4px 8px",
        "border-radius": "4px",
        "box-shadow": "0 0 10px 3px red",
      });
    });
    cy.wait(1000);
    cy.screenshot("tc5-oem-cluster-highlighted");

    cy.contains("button", "Upload").should("be.visible").click({ force: true });

    cy.get('input[data-testid="article_code_input"]')
      .first()
      .type(vendorStyleCode);

    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });

    // Wait for the dropdown options to load
    cy.wait(800);
    cy.get("body").then(($body) => {
      console.log($body.html());
    });
    cy.get(".n-options .n-option")
      .contains("6206400")
      .click();
    cy.contains("p", "Mandatory").scrollIntoView();

    // 1st Colorway - Rose Gold
    cy.get('input[data-testid="cost-0"]').first().type("350");
    cy.wait(1000);
    cy.get('div[data-testid="cost-0"]')
      .first()
      .parent().parent()
      .next()
      .find('button')
      .first()
      .click({ force: true });
    cy.wait(1000);

    // 2nd Colorway - Aqua
    cy.get('input[data-testid="cost-1"]').first().type("450");
    cy.wait(1000);
    cy.get('div[data-testid="cost-1"]')
      .first()
      .parent().parent()
      .next()
      .find('button')
      .first()
      .click({ force: true });
    cy.wait(1000);

    // 3rd Colorway - Pista Green
    cy.get('input[data-testid="cost-2"]').first().type("460");
    cy.wait(1000);
    cy.get('div[data-testid="cost-2"]')
      .first()
      .parent().parent()
      .next()
      .find('button')
      .first()
      .click({ force: true });
    cy.wait(1000);

    

    cy.contains("p", "Colorways").scrollIntoView().wait(10000);
    cy.contains("button", "Upload Files")
      .parents()
      .find('input[type="file"]')
      .attachFile("colorways.jpg", { force: true })
      .wait(1000);
    cy.get('input[data-testid="dropdown-search"]').eq(1).click();
    cy.get(".n-option")
      .contains("MUSTARD")
      .scrollIntoView()
      .click();

    cy.get('input[placeholder="Enter cost"]').type("180");

    cy.contains("p", "Colorways").scrollIntoView().wait(10000);
    cy.contains("button", "Upload Files")
      .parents()
      .find('input[type="file"]')
      .attachFile("black.jpeg", { force: true })
      .wait(1000);
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .last()
      .click()
      .wait(1000);
    cy.contains(
      '[data-testid="dropdown-scroll"]:visible .n-option',
      "TEAL",
    ).click();
    cy.get('input[placeholder="Enter cost"]').last().type("220");

    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      if (text === "Upload") {
        cy.wrap($el)
          .scrollIntoView()
          .parent("button")
          .should("be.visible")
          .click()
          .wait(10000);

        return false;
      }
    });
    //Multi-1
    cy.get("button").contains("Create Pack").should("be.visible").click();
    cy.get('input[type="number"]').eq(1).clear().type("3");
    cy.get('input[type="number"]').eq(2).clear().type("2");
    cy.wait(5000);
    cy.get("input[placeholder='Enter cost']").type("470").wait(1000);
    cy.get(
      "button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid",
    )
      .filter(':contains("Create Pack")')
      .click()
      .wait(1000);

    //MULTI-2
    cy.get("button").contains("Create Pack").should("be.visible").click();
    cy.get('input[type="number"]').eq(1).clear().type("3");
    cy.get('input[type="number"]').eq(4).clear().type("2");
    cy.wait(5000);
    cy.get("input[placeholder='Enter cost']").type("550").wait(1000);
    cy.get(
      "button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid",
    )
      .filter(':contains("Create Pack")')
      .click()
      .wait(1000);

    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      if (text === "Submit") {
        cy.wrap($el)
          .scrollIntoView()
          .parent("button")
          .should("be.visible")
          .click()
          .wait(1000);

        return false;
      }
    });
  });

  //Cluster role
  it("Test Case 6: Cluster sends the design for rework", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click();
    cy.contains("span.side-navigation-panel-select-option-text", "UVP", { timeout: 15000 })
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(designname).wait(1000);

    cy.contains("p", "PENDING").first().click({ force: true });
    cy.contains("button", "Rework").click({ force: true }).wait(1000);
  });

  //Vendor reworks on buyer rework design
  it("Test Case 7: Vendor submits without making any changes to design", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 })
      .should("be.visible")
      .click({ force: true });

    cy.contains("32021321", { timeout: 10000 }).should("be.visible").click();

    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.contains("span.side-navigation-panel-select-option-text", "UVP", {
      timeout: 15000,
    })
      .should("be.visible")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();

    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 10000 })
      .contains("OEM")
      .should("be.visible")
      .click();

    cy.url({ timeout: 10000 }).should("include", "oem");

    // Wait for active listing to fully load before switching tabs
    cy.get('table', { timeout: 15000 }).should('exist');
    cy.wait(3000);

    cy.intercept('**/oem-design/vendorview/get-submitted-design*').as('submittedList7');
    cy.contains("span", "Submitted Design").click({ force: true });
    cy.wait('@submittedList7', { timeout: 15000 });
    cy.wait(2000);

    cy.get('input[placeholder="Search"]')
      .should("be.visible")
      .clear({ force: true })
      .type(designname, { force: true }).wait(5000);
    cy.contains("p", "REWORK", { timeout: 15000 }).first().click({ force: true });
    cy.contains('div.n-button-content', 'Edit', { timeout: 15000 }).click().wait(1000);
    cy.contains('div.n-button-content', 'Submit').parent('button').should('not.have.attr', 'disabled');
    cy.contains('button', 'Submit').scrollIntoView().should('be.visible').click({ force: true });
  });

  it("Test Case 8: Vendor edits the HSN code and submits the design", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 })
      .should("be.visible")
      .click({ force: true });

    cy.contains("32021321", { timeout: 10000 }).should("be.visible").click();

    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.contains("span.side-navigation-panel-select-option-text", "UVP", {
      timeout: 15000,
    })
      .should("be.visible")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();

    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 10000 })
      .contains("OEM")
      .should("be.visible")
      .click();

    cy.url({ timeout: 10000 }).should("include", "oem");

    // Wait for active listing to fully load before switching tabs
    cy.get('table', { timeout: 15000 }).should('exist');
    cy.wait(3000);

    cy.intercept('**/oem-design/vendorview/get-submitted-design*').as('submittedList8');
    cy.contains("span", "Submitted Design").click({ force: true });
    cy.wait('@submittedList8', { timeout: 15000 });
    cy.wait(2000);

    cy.get('input[placeholder="Search"]')
      .should("be.visible")
      .clear({ force: true })
      .type(designname, { force: true }).wait(5000);
    cy.contains("p", "REWORK", { timeout: 15000 }).first().click({ force: true });
    cy.contains("div.n-button-content", "Edit", { timeout: 15000 }).click().wait(1000);

    cy.get("div.n-button-content").each(($el) => {
      const text = $el.text().trim();

      cy.get('input[data-testid="dropdown-search"]')
        .clear({ force: true })
        .type("620", { delay: 1000 });

      cy.get('.n-options .n-option', { timeout: 5000 }).should('have.length.gt', 0);
      cy.get("body").then(($body) => {
        console.log($body.html());
      });

      cy.get(".n-options .n-option", { timeout: 10000 })
        .contains("62082200")
        .click({ force: true });

      cy.wait(5000);
      if (text === "Submit") {
        cy.wrap($el)
          .scrollIntoView()
          .parent("button")
          .should("be.visible")
          .click();
        return false;
      }
    });
  });

  it("Test Case 9: Cluster creates MULTI packs and reworks second submitted design", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click();
    cy.contains("span.side-navigation-panel-select-option-text", "UVP", { timeout: 15000 })
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();

    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();

    cy.get('input[placeholder="Search"]').type(designname).wait(1000);

    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });

    cy.contains("p", "PENDING").first().click({ force: true });

    //MULTI-3
    cy.get("button")
      .contains("Create Pack")
      .scrollIntoView() // ← scrolls button into view
      .should("be.visible")
      .click();

    cy.get('input[type="number"]').eq(1).clear().type("2");
    cy.get('input[type="number"]').eq(2).clear().type("1");
    cy.get(
      "button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid",
    )
      .filter(':contains("Create Pack")')
      .scrollIntoView() // ← scrolls button into view
      .should("be.visible")
      .click();
    cy.wait(5000);

    //Duplicate pack

    //MULTI-3 (duplicate)
    cy.get("button")
      .contains("Create Pack")
      .scrollIntoView() // ← scrolls button into view
      .should("be.visible")
      .click();

    cy.get('input[type="number"]').eq(1).clear().type("2");
    cy.get('input[type="number"]').eq(2).clear().type("1");
    cy.get(
      "button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid",
    )
      .filter(':contains("Create Pack")')
      .scrollIntoView() // ← scrolls button into view
      .should("be.visible")
      .click();
    cy.contains('button', 'Cancel').click();

    // ✅ Scroll to Create Pack-4 button before clicking
    cy.get("button")
      .contains("Create Pack")
      .scrollIntoView() // ← scrolls button into view
      .should("be.visible")
      .click();

    cy.get('input[type="number"]').eq(2).clear().type("7");
    cy.get('input[type="number"]').eq(4).clear().type("3");

    // ✅ Scroll to Create Pack confirm button before clicking
    cy.get(
      "button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid",
    )
      .filter(':contains("Create Pack")')
      .scrollIntoView() // ← scrolls button into view
      .should("be.visible")
      .click();

    cy.wait(1000);

    cy.contains("button", "Rework")
      .scrollIntoView() // ← scrolls rework button into view
      .should("be.visible")
      .click({ force: true });
  });

  //Vendor makes changes to rework design
  it("Test Case 10: Vendor reworks on design 2 after cluster rework", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    });
    cy.contains("32021321", { timeout: 15000 }).click().wait(1000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();

    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();

    // Wait for active listing to fully load before switching tabs
    cy.get('table', { timeout: 15000 }).should('exist');
    cy.wait(3000);

    cy.intercept('**/oem-design/vendorview/get-submitted-design*').as('submittedList10');
    cy.contains("span", "Submitted Design").click({ force: true });
    cy.wait('@submittedList10', { timeout: 15000 });
    cy.wait(2000);

    cy.get('input[placeholder="Search"]')
      .should("be.visible")
      .clear({ force: true })
      .type(designname).wait(5000);
    cy.contains("p", "REWORK", { timeout: 15000 }).first().click({ force: true });
    cy.contains("div.n-button-content", "Edit", { timeout: 15000 }).click();

    cy.get('input[data-testid="dropdown-search"]', { timeout: 15000 }).click();
    cy.get('input[data-testid="dropdown-search"]').type(
      "{selectall}{backspace}",
      { force: true },
    );
    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 1000 });
    cy.get('.n-options .n-option', { timeout: 5000 }).should('have.length.gt', 0);
    cy.get("body").then(($body) => {
      console.log($body.html());
    });

    cy.get(".n-options .n-option", { timeout: 10000 })
      .contains("62033200")
      .click({ force: true });

    // MULTI3 — Pack_3: Enter cost and approve
    cy.get('button[aria-label="Approve Pack_3"]')
      .closest('[style*="gap: 0.5rem"]')
      .parent()
      .parent()
      .find('input[placeholder="Enter"]')
      .scrollIntoView()
      .click({ force: true })
      .then(($input) => {
        const existingValue = $input.val();
        cy.log("Existing value for MULTI3: " + existingValue);
        if (existingValue && existingValue !== "") {
          cy.wrap($input).clear({ force: true }).type("750", { force: true });
        } else {
          cy.wrap($input).type("750", { force: true });
        }
      });
    cy.get('button[aria-label="Approve Pack_3"]')
      .should("be.visible")
      .click({ force: true });

    cy.wait(1000);

    // MULTI4 — Pack_4: Enter cost and approve
    cy.get('button[aria-label="Approve Pack_4"]')
      .closest('[style*="gap: 0.5rem"]')
      .parent()
      .parent()
      .find('input[placeholder="Enter"]')
      .scrollIntoView()
      .click({ force: true })
      .then(($input) => {
        const existingValue = $input.val();
        cy.log("Existing value for MULTI4: " + existingValue);
        if (existingValue && existingValue !== "") {
          cy.wrap($input).clear({ force: true }).type("770", { force: true });
        } else {
          cy.wrap($input).type("770", { force: true });
        }
      });
    cy.get('button[aria-label="Approve Pack_4"]')
      .should("be.visible")
      .click({ force: true });

    // Edge Case: Update ROSE GOLD colorway cost to 900 (exceeds minimum pack cost of 750)
    // Expected toast: "Cost should be less than minimum pack cost"
    cy.get('img[alt="rose gold"]', { timeout: 10000 })
      .scrollIntoView()
      .parents('div').eq(1)
      .within(() => {
        cy.get('button[title="Edit"]', { timeout: 10000 }).click({ force: true });
      });

    cy.get('img[alt="rose gold"]', { timeout: 10000 })
      .parents('div').eq(1)
      .find('input[type="number"], input[type="text"]', { timeout: 10000 })
      .not('[placeholder*="SAP"]')
      .not('[data-testid="dropdown-search"]')
      .first()
      .should('be.visible')
      .clear()
      .type('450')
      .blur();

    cy.get('img[alt="rose gold"]', { timeout: 10000 })
      .parents('div').eq(1)
      .within(() => {
        cy.get('button[title="Confirm"]', { timeout: 10000 })
          .scrollIntoView()
          .click({ force: true });
      });

    // cy.contains(/Cost.*should be less than/i, { timeout: 8000 }).should('be.visible');

    cy.contains("button", "Submit")
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
  });
  //Cluster role
  it("Test Case 11: Cluster approves design 2", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click();
    cy.contains("span.side-navigation-panel-select-option-text", "UVP", { timeout: 15000 })
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(designname).wait(1000);

    cy.contains("p", "PENDING").first().click({ force: true });
    cy.contains("button", "Approve").click({ force: true });
  });

  //Buyer reworks the cluster submitted design
  it("Test Case 12: Buyer adds two more packs and sends to vendor for rework", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    //SIT

    cy.get(".sc-ikkxIA")
      .filter(':contains("Shein")')
      .filter(':contains("odm-buyer")')
      .find("div")
      .contains("Shein")
      .should("be.visible")
      .click({ force: true });

    //UAT
    // cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
    //     .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
    //     .contains(/^S$/) // exact match for 'S'
    //     .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
    //     .click({ force: true });
    // ── Navigate to OEM ──────────────────────────────────────
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();

    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();

    // ── Go to Submitted Design ────────────────────────────────
    cy.contains("span", "Submitted Design", { timeout: 15000 })
      .should("be.visible")
      .click({ force: true });

    // ── Filter and Search ─────────────────────────────────────
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });

    cy.get('input[placeholder="Search"]').should("be.visible").type(designname);

    // ── Click Cluster Approved ────────────────────────────────
    cy.contains("p", "CLUSTER APPROVED", { timeout: 10000 })
      .first()
      .should("be.visible")
      .click({ force: true });

    // ── Click Create Pack ─────────────────────────────────────
    cy.get("button")
      .contains("Create Pack")
      .scrollIntoView()
      .should("be.visible")
      .click();

    // Enter 4 for Aqua
    cy.contains("p", /rose gold/i)
      .parent() // p → div (colorway name div)
      .parent() // → row div
      .find('input[type="number"]')
      .clear({ force: true })
      .type("4", { force: true });

    // Enter 1 for Kiwi Green
    cy.contains("p", /pista green/i)
      .parent()
      .parent()
      .find('input[type="number"]')
      .clear({ force: true })
      .type("4", { force: true });
    // Click Create Pack button
    cy.get("button.n-button-primary")
      .contains("Create Pack")
      .should("not.be.disabled")
      .click();

    //MULTI-6

    cy.get("button")
      .contains("Create Pack")
      .scrollIntoView()
      .should("be.visible")
      .click();

    // Enter 4 for Aqua
    cy.contains("p", /rose gold/i)
      .parent() // p → div (colorway name div)
      .parent() // → row div
      .find('input[type="number"]')
      .clear({ force: true })
      .type("4", { force: true });

    // Enter 1 for Kiwi Green
    cy.contains("p", /teal/i)
      .parent()
      .parent()
      .find('input[type="number"]')
      .clear({ force: true })
      .type("4", { force: true });
    // Click Create Pack button
    cy.get("button.n-button-primary")
      .contains("Create Pack")
      .should("not.be.disabled")
      .click();

    // // ── Wait for Pack to be Created ───────────────────────────
    // cy.contains("button", "Cancel", { timeout: 10000 })
    //   .should("be.visible")
    //   .click();

    // cy.contains("button", "Approve")
    // .should("be.disabled").wait(1000);

    // ── Click Rework ──────────────────────────────────────────
    cy.contains("button", "Rework", { timeout: 10000 })
      .scrollIntoView()
      .should("be.visible")
      .click();
  });

  //Vendor reworks on buyer rework design
  it("Test Case 13: Vendor enters cost for packs, edits HSN with edge cases", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 })
      .should("be.visible")
      .click({ force: true });

    cy.contains("32021321", { timeout: 10000 }).should("be.visible").click();

    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.contains("span.side-navigation-panel-select-option-text", "UVP", {
      timeout: 15000,
    })
      .should("be.visible")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();

    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 10000 })
      .contains("OEM")
      .should("be.visible")
      .click();

    cy.url({ timeout: 10000 }).should("include", "oem");

    // Wait for active listing to fully load before switching tabs
    cy.get('table', { timeout: 15000 }).should('exist');
    cy.wait(3000);

    // Wait for submitted design list to fully load before searching
    cy.intercept('**/oem-design/vendorview/get-submitted-design*').as('submittedList');
    cy.contains("span", "Submitted Design").click({ force: true });
    cy.wait('@submittedList', { timeout: 15000 });
    cy.wait(2000);

    cy.get('input[placeholder="Search"]')
      .should("be.visible")
      .clear({ force: true })
      .type(designname, { force: true }).wait(5000);
    cy.contains("p", "REWORK", { timeout: 15000 }).first().click({ force: true });
    cy.contains("div.n-button-content", "Edit", { timeout: 15000 }).click();

    // Edit HSN code
    cy.get('input[data-testid="dropdown-search"]', { timeout: 15000 }).click();
    cy.get('input[data-testid="dropdown-search"]').type('{selectall}{backspace}', { force: true });
    cy.get('input[data-testid="dropdown-search"]').type('620', { delay: 1000 });
    cy.get('.n-options .n-option', { timeout: 5000 }).should('have.length.gt', 0);
    cy.get('.n-options .n-option', { timeout: 10000 }).contains('62033200').click({ force: true });

    // Edge Case: MULTI5 — Pack_5: Enter 100 first to trigger cost validation toast
    cy.get('button[aria-label="Approve Pack_5"]')
      .closest('[style*="gap: 0.5rem"]').parent().parent()
      .find('input[placeholder="Enter"]')
      .scrollIntoView().click({ force: true })
      .then(($input) => {
        cy.wrap($input).clear({ force: true }).type('100', { force: true });
      });
    cy.get('button[aria-label="Approve Pack_5"]').should('be.visible').click({ force: true });
    cy.contains(/Vendor cost.*cannot be less than colorway cost/i, { timeout: 8000 }).should('be.visible');

    // MULTI5 — Pack_5: Enter correct cost 750 and approve
    cy.get('button[aria-label="Approve Pack_5"]')
      .closest('[style*="gap: 0.5rem"]').parent().parent()
      .find('input[placeholder="Enter"]')
      .scrollIntoView().click({ force: true })
      .then(($input) => {
        cy.wrap($input).clear({ force: true }).type('750', { force: true });
      });
    cy.get('button[aria-label="Approve Pack_5"]').should('be.visible').click({ force: true });

    // MULTI6 — Pack_6: Enter cost and approve
    cy.get('button[aria-label="Approve Pack_6"]')
      .closest('[style*="gap: 0.5rem"]').parent().parent()
      .find('input[placeholder="Enter"]')
      .scrollIntoView().click({ force: true })
      .then(($input) => {
        cy.wrap($input).clear({ force: true }).type('770', { force: true });
      });
    cy.get('button[aria-label="Approve Pack_6"]').should('be.visible').click({ force: true });

    // Edge Case: Update ROSE GOLD colorway cost to 500
    cy.get('img[alt="rose gold"]', { timeout: 10000 })
      .scrollIntoView()
      .parents('div').eq(1)
      .within(() => {
        cy.get('button[title="Edit"]', { timeout: 10000 }).click({ force: true });
      });

    // After Edit click, the input appears — find it near the rose gold image
    cy.get('img[alt="rose gold"]', { timeout: 10000 })
      .parents('div').eq(1)
      .find('input[type="number"], input[type="text"]', { timeout: 10000 })
      .not('[placeholder*="SAP"]')
      .not('[data-testid="dropdown-search"]')
      .first()
      .should('be.visible')
      .clear()
      .type('900')
      .blur();

    cy.get('img[alt="rose gold"]', { timeout: 10000 })
      .parents('div').eq(1)
      .within(() => {
        cy.get('button[title="Confirm"]', { timeout: 10000 })
          .scrollIntoView()
          .click({ force: true });
      });

    cy.contains('div.n-button-content', 'Submit').parent('button').should('not.have.attr', 'disabled');
    cy.contains('button', 'Submit').scrollIntoView().should('be.visible').click({ force: true });
  });

  //buyer parks the cluster approved design
  it("Test Case 14: Buyer Parks the design", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    //SIT

    cy.get(".sc-ikkxIA")
      .filter(':contains("Shein")')
      .filter(':contains("odm-buyer")')
      .find("div")
      .contains("Shein")
      .should("be.visible")
      .click({ force: true });

    //UAT
    // cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
    //     .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
    //     .contains(/^S$/) // exact match for 'S'
    //     .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
    //     .click({ force: true });
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(designname).wait(1000);

    cy.contains("p", "CLUSTER APPROVED")
      .first()
      .click({ force: true });
    cy.contains("button", "Park", { timeout: 15000 })
      .should("be.visible") // ensures Cypress waits until the button is visible
      .click({ force: true })
      .wait(1000);
    cy.contains("span", "Parked Design")
      .should("be.visible") // wait until the span is visible
      .click({ force: true });
  });

  //Unpark the inspiration
  it("Test Case 15: Buyer Unparks the design", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    //SIT

    cy.get(".sc-ikkxIA")
      .filter(':contains("Shein")')
      .filter(':contains("odm-buyer")')
      .find("div")
      .contains("Shein")
      .should("be.visible")
      .click({ force: true });

    //UAT
    // cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
    //     .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
    //     .contains(/^S$/) // exact match for 'S'
    //     .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
    //     .click({ force: true });
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.contains("span", "Parked Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('input[placeholder="Search"]').type(designname).wait(1000);

    cy.contains("div.n-button-content", "Move to Active") // find the element
      .scrollIntoView() // scroll it into view
      .should("be.visible") // ensure it's visible
      .click({ force: true }); // click it
  });

  //buyer parks the cluster approved design again
  it("Test Case 16: Buyer Parks again", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    //SIT

    cy.get(".sc-ikkxIA")
      .filter(':contains("Shein")')
      .filter(':contains("odm-buyer")')
      .find("div")
      .contains("Shein")
      .should("be.visible")
      .click({ force: true });

    //UAT
    // cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
    //     .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
    //     .contains(/^S$/) // exact match for 'S'
    //     .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
    //     .click({ force: true });
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('input[placeholder="Search"]').type(designname).wait(1000);

    cy.contains("p", "CLUSTER APPROVED")
      .first()
      .click({ force: true });
    cy.contains("button", "Park", { timeout: 15000 })
      .should("be.visible") // ensures Cypress waits until the button is visible
      .click({ force: true })
      .wait(1000);
    cy.contains("span", "Parked Design")
      .should("be.visible") // wait until the span is visible
      .click({ force: true });
  });

  //buyer reworks the parked design
  it("Test Case 17: Buyer Reworks the parked design", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    //SIT

    cy.get(".sc-ikkxIA")
      .filter(':contains("Shein")')
      .filter(':contains("odm-buyer")')
      .find("div")
      .contains("Shein")
      .should("be.visible")
      .click({ force: true });

    //UAT
    // cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
    //     .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
    //     .contains(/^S$/) // exact match for 'S'
    //     .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
    //     .click({ force: true });
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.contains("span", "Parked Design").click({ force: true });
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(designname).click();

    cy.get("table tbody tr")
      .first()
      .find('td:nth-child(2) div[data-testid="link-with-context"] span')
      .click({ force: true });
    cy.contains("button", "Rework", { timeout: 15000 }).should("be.visible").click();
  });

  //Vendor makes changes to rework design
  it("Test Case 18: Vendor creates one more pack and sends to buyer", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 })
      .should("be.visible")
      .click({ force: true });

    cy.contains("32021321", { timeout: 10000 }).should("be.visible").click();

    // Wait for page to fully load before touching sidebar
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.contains("span.side-navigation-panel-select-option-text", "UVP", {
      timeout: 15000,
    })
      .should("be.visible")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();

    // Wait for OEM submenu to expand before clicking
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 10000 })
      .contains("OEM")
      .should("be.visible")
      .click();

    // Confirm OEM page loaded
    cy.url({ timeout: 10000 }).should("include", "oem");

    // Wait for active listing to fully load before switching tabs
    cy.get('table', { timeout: 15000 }).should('exist');
    cy.wait(3000);

    cy.intercept('**/oem-design/vendorview/get-submitted-design*').as('submittedList18');
    cy.contains("span", "Submitted Design").click({ force: true });
    cy.wait('@submittedList18', { timeout: 15000 });
    cy.wait(2000);

    cy.get('input[placeholder="Search"]')
      .should("be.visible")
      .clear({ force: true })
      .type(designname).wait(5000);
    cy.contains("p", "REWORK", { timeout: 15000 }).first().click({ force: true });
    cy.contains("div.n-button-content", "Edit", { timeout: 15000 }).click();
    //cy.get("div.n-button-content").each(($el) => {
    //   const text = $el.text().trim();
    cy.get('input[data-testid="dropdown-search"]', { timeout: 15000 }).click();
    cy.get('input[data-testid="dropdown-search"]').type(
      "{selectall}{backspace}",
      { force: true },
    );
    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 1000 });
    // // Wait for the dropdown options to load
    cy.get('.n-options .n-option', { timeout: 5000 }).should('have.length.gt', 0);
    cy.get("body").then(($body) => {
      console.log($body.html()); // logs HTML to Cypress runner console
    });
    // Select the correct code (assuming dropdown options appear as list items)
    cy.get(".n-options .n-option", { timeout: 10000 })
      .contains("62046990")
      .click({ force: true });
    cy.contains("button", "Submit")
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
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
  it("Test Case 19: Buyer checks the design and approves with edge cases", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

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
      .contains("OEM")
      .click();

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({ force: true });
    cy.wait(5000);
    cy.get('input[placeholder="Search"]').type(designname).wait(5000);
    cy.contains("p", "CLUSTER APPROVED", { timeout: 15000 }).first().click({ force: true });

    cy.get("button").contains("Select Size", { timeout: 15000 }).click({ force: true });
    cy.get(".n-options .n-option", { timeout: 10000 });
    cy.get('input[value="size-group-0"]', { timeout: 10000 }).should("be.visible").check({ force: true });

    cy.wait(5000);
    cy.contains("Colorways").scrollIntoView().wait(15000);

    // Approve colorway 1
    cy.get('button[title="Approve"]', { timeout: 10000 })
      .eq(0).click({ force: true });
    cy.wait(2000);

    // Approve colorway 2
    cy.get('button[title="Approve"]', { timeout: 10000 })
      .eq(0).click({ force: true });
    cy.wait(2000);

    cy.contains("Comments").click();
    cy.wait(3000);

    // Approve Pack_1
    cy.get('button[aria-label="Approve Pack_1"]', { timeout: 10000 })
      .scrollIntoView({ duration: 300 }).should('be.visible').click({ force: true });
    cy.wait(3000);

    // Approve Pack_2
    cy.get('button[aria-label="Approve Pack_2"]', { timeout: 10000 })
      .scrollIntoView({ duration: 300 }).should('be.visible').click({ force: true });
    cy.wait(3000);

    // Approve Pack_4 — this will trigger error popup
    cy.get('button[aria-label="Approve Pack_4"]', { timeout: 10000 })
      .scrollIntoView({ duration: 300 }).should('be.visible').click({ force: true });

    // Edge case: MULTI4 SAP color ID does not exist
    cy.contains(/Please change SAP color ID.*MULTI4.*does not exist/i, { timeout: 15000 }).should('be.visible');

    // Change ROSE GOLD SAP to MULTI1 and approve
    cy.contains("Colorways").scrollIntoView().wait(5000);
    cy.get('img[alt="rose gold"]', { timeout: 10000 })
      .scrollIntoView()
      .parents('div').eq(1)
      .find('input[data-testid="dropdown-search"]')
      .click({ force: true }).clear({ force: true }).type('MULTI1', { delay: 100 });
    cy.wait(1000);
    cy.get('[data-testid="dropdown-scroll"]:visible .n-option').contains('MULTI1').click({ force: true });
    cy.wait(2000);
    cy.get('button[title="Approve"]', { timeout: 10000 }).eq(0).click({ force: true });
    cy.wait(10000);

    // Select vendor pack quantity
    cy.get('#pack-quantity-0', { timeout: 10000 }).scrollIntoView().within(() => {
      cy.get('.n-select__trigger').click({ force: true });
      cy.get('[data-testid="dropdown-scroll"] .n-option').contains('150').click({ force: true });
    });
    cy.wait(1000);

    // First Approve
    cy.contains('button', 'Approve', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'Approve').click({ force: true });

    // Approve remaining colorway
    cy.contains("Colorways").scrollIntoView().wait(5000);
    cy.get('button[title="Approve"]', { timeout: 10000 }).eq(0).click({ force: true });
    cy.wait(1000);

    // Second Approve
    cy.contains('button', 'Approve', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'Approve').click({ force: true });

    // Approve remaining packs
    cy.get('button[aria-label="Approve Pack_1"]', { timeout: 10000 })
      .scrollIntoView({ duration: 300 }).should('be.visible').click({ force: true });
    cy.get('button[aria-label="Approve Pack_2"]', { timeout: 10000 })
      .scrollIntoView({ duration: 300 }).should('be.visible').click({ force: true });
    cy.wait(1000);

    // Final Approve
    cy.contains('button', 'Approve', { timeout: 10000 }).should('be.visible');
    cy.contains('button', 'Approve').click({ force: true });
  });

  it("Test Case 20: Email and bell notification", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    //SIT

    cy.get(".sc-ikkxIA")
      .filter(':contains("Shein")')
      .filter(':contains("odm-buyer")')
      .find("div")
      .contains("Shein")
      .should("be.visible")
      .click({ force: true });

    //UAT
    // cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
    //     .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
    //     .contains(/^S$/) // exact match for 'S'
    //     .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
    //     .click({ force: true });
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.contains("div.n-button-content", "Email Inspiration Data")
      .should("be.visible")
      .click()
      .wait(1000);
  });

  it("Test Case 21: OEM Auto reject", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    //SIT

    cy.get(".sc-ikkxIA")
      .filter(':contains("Shein")')
      .filter(':contains("odm-buyer")')
      .find("div")
      .contains("Shein")
      .should("be.visible")
      .click({ force: true });

    //UAT
    // cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
    //     .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
    //     .contains(/^S$/) // exact match for 'S'
    //     .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
    //     .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('input[placeholder="Search"]').type(designname).wait(5000);

    //   .first()
    //   .click({ force: true })
    //   .wait(10000);
    // cy.get("button").contains("Select Size").click({ force: true });

    // //  Wait for the dropdown options to appear and pick a random one
    // cy.get(".n-options .n-option", {
    //   timeout: 10000,
    // });
    // cy.get('input[value="size-group-0"]').check({ force: true });
    // cy.wait(5000);
    // cy.contains("Colorways").scrollIntoView().wait(15000);

    // cy.get('button[title="Approve"]').eq(1).click({ force: true });

    // //cy.get('button[title="Approve"]').click({ force: true });
    // cy.wait(5000);
    // cy.contains("button", "Approve").click({ force: true }).wait(10000);
  });

  it("Test Case 22: Bulk upload OEM", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    //SIT

    cy.get(".sc-ikkxIA")
      .filter(':contains("Shein")')
      .filter(':contains("odm-buyer")')
      .find("div")
      .contains("Shein")
      .should("be.visible")
      .click({ force: true });

    //UAT
    // cy.get('[data-testid="Shein-odm-buyer"]') // get the exact card
    //     .find("p.sc-iHbSHJ.sc-klVQfs.eSxHEb.iTeuNh") // find the <p> inside
    //     .contains(/^S$/) // exact match for 'S'
    //     .scrollIntoView({ offset: { top: -100 } }) // scroll if not visible
    //     .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.contains("div.n-button-content", "Bulk Upload")
      .should("be.visible")
      .click();
    cy.get('input[type="file"]').selectFile(
      "cypress/fixtures/Bulk_Data_1000 2.xlsx",
      {
        force: true,
      },
    );
    cy.contains("button", /^Upload$/)
      .should("be.visible")
      .click()
      .wait(5000);
  });

  it("Test Case 23: FPT and GPT approve", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click();
    cy.contains("span.side-navigation-panel-select-option-text", "QC", { timeout: 15000 })
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("FPT & GPT")
      .click();
    cy.get('input[placeholder="Search via Style IDs or other values"]', { timeout: 15000 }).should("be.visible");

    cy.get('input[placeholder="Search via Style IDs or other values"]')
      .type(vendorStyleCode)
      .wait(1000);

    // Verify vendor cluster on listing page and highlight it
    cy.contains("AHMEDABAD", { timeout: 10000 }).should("exist").then(($el) => {
      $el[0].scrollIntoView({ inline: "center", block: "nearest" });
    });
    cy.contains("AHMEDABAD").should("be.visible").then(($el) => {
      $el.css({
        border: "3px solid red",
        "background-color": "yellow",
        padding: "4px 8px",
        "border-radius": "4px",
        "box-shadow": "0 0 10px 3px red",
      });
    });
    cy.wait(500);
    cy.screenshot("tc23-oem-vendor-cluster-highlighted");

    cy.contains("BUYER APPROVED").click({ force: true });
    cy.get('label[for="required-no"]').click();
    cy.contains("label", "I acknowledge the test completed").click();
    cy.contains("div.n-button-content", "Submit").click().wait(1000);
  });

  //**********One flow is completed till here */

  after(() => {
    cy.logout();
  });
});
