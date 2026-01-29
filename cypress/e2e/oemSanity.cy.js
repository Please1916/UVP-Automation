const randomDesignName = `Test_${Math.random().toString(36).substring(2, 8)}`;
export const designname = randomDesignName;

Cypress.on("uncaught:exception", () => false);
describe("RA buyer", () => {
  const pageUrl = "https://platform.uat.impetusz0.de/uvp/range-architecture";

  beforeEach(() => {
    cy.session("user-session", () => {
      cy.login();
    });
  });

  it("logs in successfully with valid credentials", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.contains("div", "odm-buyer", { timeout: 20000 })
      .parent()
      .click({ force: true });
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
  });

  it("After login should be in the select workspace page and click on OEM buuyer", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(20000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.contains("div", "odm-buyer", { timeout: 20000 })
      .parent()
      .click({ force: true })
      .wait(2000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click()
      .wait(10000);
    cy.contains("div.n-button-content", "Upload Design")
      .click({ force: true })
      .wait(1000);
    cy.get('input[placeholder="Enter Design Name"]')
      .should("be.visible")
      .type(randomDesignName, { force: true });
    //Click the Family dropdown input
    cy.wait(10000);
    // Select "Men" from Family dropdown
    cy.contains("label", "Family")
      .parent()
      .wait(1000) // go to the dropdown wrapper
      .find(".n-select__trigger")
      .click();

    cy.contains(".n-option", "Men").click();

    // Select "Western Wear" from Class Name dropdown
    cy.contains("label", "Class Name")
      .parent()
      .wait(1000) // go to the dropdown wrapper
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

    cy.contains("p", "Colorways").scrollIntoView().wait(10000); // find the container by its text
    cy.contains("button", "Upload Files")
      .parents()
      .find('input[type="file"]')
      .eq(1)
      .attachFile("AQUA.jpg", { force: true })
      .wait(1000);
    cy.get(
      'input[data-testid="dropdown-search"][placeholder="Add SAP ID"]'
    ).click();
    cy.get('[data-testid="dropdown-scroll"]')
      .contains(".n-option", "AQUA")
      .scrollIntoView() // scroll within the container
      .click()
      .wait(1000);
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
          .wait(1000);

        // Stop iterating once found
        return false;
      }
    });

    cy.wait(5000);
    cy.get("#costing")
      .find('input[placeholder="Ex. cotton 90%, polyster 10%"]')
      .type("Cotton 80%, Polyester 20%", { force: true });
    cy.get("#costing")
      .find('input[placeholder="Ex. 240/160"]')
      .type("240/180", { force: true });

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

  //Go to buyer role
  it("Searches for the Uploaded theme and share it with a vendor", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace", { timeout: 20000 });
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.contains("div", "odm-buyer", { timeout: 20000 })
      .parent()
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
      .contains("OEM")
      .click()
      .wait(15000);
    cy.get('input[placeholder="Search"]').type(designname);

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
    cy.get('input[placeholder="Select Vendors"]')
      .click({ force: true })
      .wait(1000);
    cy.contains("label", "GRATEFUL APPARELS PRIVATE LIMITED - 32021183")
      .find('input[type="checkbox"]')
      .check({ force: true })
      .wait(1000);
    cy.contains("div.n-button-content", "Share")
      .click({ force: true })
      .wait(600);
  });

  //Vendor role
  it("Verify that shared Inspiration is visible and submit design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("32021183")
      .click({ force: true })
      .wait(15000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click()
      .wait(10000);
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click()
      .wait(15000);
    cy.get('input[placeholder="Search"]').type(designname).wait(1000);
    cy.contains("div.n-button-content", "Upload")
      .first()
      .click({ force: true });

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
    cy.contains("p", "Mandatory").scrollIntoView();

    cy.get('[data-testid="cost-0"]').first().type("100").wait(1000);
    //cy.get('button.sc-jiDjCn.ywhsk').first().click({ force: true })
   cy.get('svg')
  .find('path[d*="M9.00019 19.0002"]')
  .parents('svg')
  .click({ force: true })

    // cy.get("div.sc-iEkSXm.jBwPqL") // container div
    //   .find("button.sc-hCrRFl.ichMOL") // get buttons inside
    //   .first() // the approve button is the first button
    //   .click({ force: true }); // click it

    // cy.contains("label", "Brick Name *")
    //   // Navigate to the closest wrapper containing the dropdown trigger
    //   .parent()
    //   .find(".n-select__trigger")
    //   .click(); // Open the dropdown

    // // Step 2: Select the first option from the dropdown
    // cy.get(".n-options .n-option").contains("Jeans").click();

    // cy.contains("p", "Upload Design") // find the container by its text
    //   .parent() // go to the wrapper div
    //   .find('input[type="file"]') // find the hidden input
    //   .attachFile("design.jpeg", { force: true });

    // cy.contains("p", "Colorways") // find the container by its text
    //   .parent() // go to the wrapper div
    //   .find('input[type="file"]') // find the hidden input
    //   .attachFile("colorways.jpg", { force: true });
    cy.contains("p", "Colorways").scrollIntoView().wait(10000); // find the container by its text
    cy.contains("button", "Upload Files")
      .parents()
      .find('input[type="file"]')
      .attachFile("colorways.jpg", { force: true })
      .wait(1000);

    // cy.get('input[data-testid="dropdown-search"]')
    //   .eq(1)
    //   .contains(".n-option", "PISTA GREEN")
    //   .scrollIntoView()
    //   .click();
    // 1. Click the input to open the dropdown
    cy.get('input[data-testid="dropdown-search"]').eq(1).click();

    // 2. Wait a bit if options are dynamically rendered (optional)
    cy.get(".n-option")
      .contains("PISTA GREEN") // find the option by text
      .scrollIntoView() // scroll to it if needed
      .click();

    //   .type("PISTA GREEN", { delay: 100 });
    // cy.get('[data-testid="dropdown-scroll"]')
    //   .contains(".n-option", "PISTA GREEN")
    //   .scrollIntoView() // scroll within the container
    //   .click()
    //   .wait(1000);

    // Step 2: Select the option from the dropdown list----working here
    cy.get('input[placeholder="Enter cost"]').type("150");
    //cy.contains("Upload").click({ force: true });
    // Target the specific parent div
    // Find the div containing the Upload button (by its child text)
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

  //Cluster role
  it("Cluster approval for submitted design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click()
      .wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click();
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(designname).wait(1000);

    // cy.contains("div", "Status").click().wait(10000);
    // cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   //.should("be.visible") // ensure it is visible
    //   .click({ force: true })
    //   .wait(1000);
    cy.contains("p", "PENDING").first().click({ force: true });
    cy.contains("button", "Approve").click({ force: true });
  });

  //Vendor role to submit design again
  it("Verify that shared Inspiration is visible and submit design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("32021183")
      .click({ force: true })
      .wait(15000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click()
      .wait(10000);
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click()
      .wait(15000);
    cy.get('input[placeholder="Search"]').type(designname).wait(1000);
    // cy.contains("div.n-button-content", "View / Edit")
    //   .first()
    //   .click({ force: true });
    cy.get("table tbody tr td:nth-child(1)") // select second column of each row
      .first()
      .within(() => {
        cy.get('div[data-testid="link-with-context"] span').click({
          force: true,
        });
      });
    cy.contains("button", "Upload").should("be.visible").click({ force: true });

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
    cy.contains("p", "Mandatory").scrollIntoView();

    cy.get('[data-testid="cost-0"]').first().type("100").wait(1000);
    cy.get('svg')
  .find('path[d*="M9.00019 19.0002"]')
  .parents('svg')
  .click({ force: true })


    // cy.get("div.sc-iEkSXm")
    //   .find("button.sc-hCrRFl")
    //   .first() // selects the APPROVE button
    //   .click({ force: true });
    // cy.get("div.sc-iEkSXm.jBwPqL") // container div
    //   .find("button.sc-hCrRFl.ichMOL") // get buttons inside
    //   .first() // the approve button is the first button
    //   .click({ force: true }); // click it

    // cy.contains("label", "Brick Name *")
    //   // Navigate to the closest wrapper containing the dropdown trigger
    //   .parent()
    //   .find(".n-select__trigger")
    //   .click(); // Open the dropdown

    // // Step 2: Select the first option from the dropdown
    // cy.get(".n-options .n-option").contains("Jeans").click();

    // cy.contains("p", "Upload Design") // find the container by its text
    //   .parent() // go to the wrapper div
    //   .find('input[type="file"]') // find the hidden input
    //   .attachFile("design.jpeg", { force: true });

    // cy.contains("p", "Colorways") // find the container by its text
    //   .parent() // go to the wrapper div
    //   .find('input[type="file"]') // find the hidden input
    //   .attachFile("colorways.jpg", { force: true });
   cy.contains("p", "Colorways").scrollIntoView().wait(10000); // find the container by its text
    cy.contains("button", "Upload Files")
      .parents()
      .find('input[type="file"]')
      .attachFile("colorways.jpg", { force: true })
      .wait(1000);
    // cy.get('input[data-testid="dropdown-search"]')
    //   .eq(1)
    //   .contains(".n-option", "PISTA GREEN")
    //   .scrollIntoView()
    //   .click();
    // 1. Click the input to open the dropdown
    cy.get('input[data-testid="dropdown-search"]').eq(1).click();

    // 2. Wait a bit if options are dynamically rendered (optional)
    cy.get(".n-option")
      .contains("PISTA GREEN") // find the option by text
      .scrollIntoView() // scroll to it if needed
      .click();

    //   .type("PISTA GREEN", { delay: 100 });
    // cy.get('[data-testid="dropdown-scroll"]')
    //   .contains(".n-option", "PISTA GREEN")
    //   .scrollIntoView() // scroll within the container
    //   .click()
    //   .wait(1000);

    // Step 2: Select the option from the dropdown list----working here
    cy.get('input[placeholder="Enter cost"]').type("150");
    //cy.contains("Upload").click({ force: true });
    // Target the specific parent div
    // Find the div containing the Upload button (by its child text)
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
  //Cluster role
  it("Cluster Reworks the  submitted design", () => {
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
      .contains("OEM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click();
    cy.get('input[placeholder="Search"]').type(designname).wait(1000);
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    // 1️⃣ Apply all filters
    // cy.contains("div", "Status").click().wait(10000);
    // cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   //.should("be.visible") // ensure it is visible
    //   .click({ force: true });
    cy.contains("p", "PENDING").first().click({ force: true });
    cy.contains("button", "Rework").click({ force: true });
  });

  //Vendor makes changes to rework design
  it("Vendor makes changes to rework design after cluster rework", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("32021183")
      .click({ force: true })
      .wait(15000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click()
      .wait(10000);
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click({ force: true });
    //cy.get('input[placeholder="Search"]').type(designname).wait(1000).click();
    cy.contains("p", "REWORK").first().click({ force: true }).wait(1000);
    cy.contains("div.n-button-content", "Edit").click();
    //cy.get("div.n-button-content").each(($el) => {
    //   const text = $el.text().trim();
    cy.get('input[data-testid="dropdown-search"]', { timeout: 15000 }).click();
    cy.get('input[data-testid="dropdown-search"]').type(
      "{selectall}{backspace}",
      { force: true }
    );
    cy.wait(10000);
    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 1000 });
    // // Wait for the dropdown options to load
    cy.wait(800); // adjust if your app loads slower
    cy.get("body").then(($body) => {
      console.log($body.html()); // logs HTML to Cypress runner console
    });
    //HSN rework
    // Select the correct code (assuming dropdown options appear as list items)
    cy.get(".n-options .n-option", { timeout: 10000 })
      .contains("62033200")
      .click({ force: true });
    // cy.contains('button', 'Upload Files').click({ force: true });
    // cy.get('input[data-testid="dropdown-search"]').eq(1).click();
    // cy.get(".n-option")
    //   .contains("BLACK") // find the option by text
    //   .scrollIntoView() // scroll to it if needed
    //   .click();

    cy.wait(2000);
    cy.contains("button", "Submit")
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
  });

  //Cluster role
  it("Cluster approval for submitted design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);

    // Click on the cluster card "Shein"
    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .click()
      .wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click();
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(designname).wait(1000);

    // cy.contains("div", "Status").click().wait(10000);
    // cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   //.should("be.visible") // ensure it is visible
    //   .click({ force: true })
    //   .wait(1000);
    cy.contains("p", "PENDING").first().click({ force: true });
    cy.contains("button", "Approve").click({ force: true });
  });

  //Buyer reworks the cluster submitted design
  it("Buyer Rework after cluster approval", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.contains("div", "odm-buyer", { timeout: 20000 })
      .parent()
      .click({ force: true })
      .wait(2000);
    cy.wait(10000);
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

    // cy.contains("div", "Status").click().wait(10000);
    // cy.get('input[value="CLUSTER APPROVED"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   .click({ force: true })
    //   .wait(1000);
    cy.contains("p", "CLUSTER APPROVED").first().click({ force: true });
    cy.contains("button", "Rework").click();
  });

  //Vendor reworks on buyer rework design
  it("Vendor makes changes to rework design after buyer rework", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("32021183")
      .click({ force: true })
      .wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click()
      .wait(1000);
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click({ force: true });
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    //cy.get('input[placeholder="Search"]').type(designname).wait(1000).click();

    cy.contains("div", "Status").click().wait(10000);
    cy.get('input[value="REWORK"]') // select the checkbox input with value PENDING
      .scrollIntoView({ duration: 200 }) // scroll smoothly into view
      .click({ force: true })
      .wait(1000);
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
      //cy.contains(".sc-czLspv", "150").click().wait(5000).clear().wait(5000).type('200');

      // NOW the input should appear
      //cy.get('input[type="number"]').clear().type("200");

      // cy.get('[data-testid="cost-0"]').eq(0).clear().type("200").wait(1000);
      // cy.get("div.sc-iEkSXm")
      //   .find("button.sc-hCrRFl")
      //   .first() // selects the APPROVE button
      //   .click({ force: true });
      // cy.contains("p", "Colorway")
      //   .scrollIntoView({ duration: 600 })
      //   .should("be.visible");
      // cy.get("svg title")
      //   .contains("Edit")
      //   .parents("svg")
      //   .click({ force: true })
      //   .wait(10000);
      // cy.get('input[placeholder="Enter Cost per Piece"]')
      //   .clear({ force: true })
      //   .type("300", { force: true });
      // // Get the div
      // cy.get("svg title")
      //   .contains("Confirm Edit")
      //   .parent()
      //   .click({ force: true });

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
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.contains("div", "odm-buyer", { timeout: 20000 })
      .parent()
      .click({ force: true })
      .wait(2000);
    cy.wait(10000);
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

  //Unpark the inspiration
  it("Buyer Unparks the design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.contains("div", "odm-buyer", { timeout: 20000 })
      .parent()
      .click({ force: true })
      .wait(2000);
    cy.wait(10000);
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

    // cy.contains("p", "CLUSTER APPROVED", { timeout: 15000 }).click({
    //   force: true,
    // });
    // cy.contains("button", "Park")
    //   .should("be.visible") // ensures Cypress waits until the button is visible
    //   .click({ force: true })
    //   .wait(1000);
    // cy.contains("span", "Parked Design")
    //   .should("be.visible") // wait until the span is visible
    //   .click({ force: true });
  });

  //buyer parks the cluster approved design again
  it("Buyer Parks again", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.contains("div", "odm-buyer", { timeout: 20000 })
      .parent()
      .click({ force: true })
      .wait(2000);
    cy.wait(10000);
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
  it("Buyer Rework the parked design after buyer parks the design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.contains("div", "odm-buyer", { timeout: 20000 })
      .parent()
      .click({ force: true })
      .wait(2000);
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.contains("span", "Parked Design").click({ force: true }).wait(10000);
    cy.get('input[placeholder="Search"]').type(designname).click();
    // Assuming the Style ID is always in the 2nd column
    // cy.get("table tbody tr td:nth-child(2)") // select second column of each row
    //   .first()
    //   .within(() => {
    //     cy.get('div[data-testid="link-with-context"] span').click({
    //       force: true,
    //     });
    //   });
    cy.get("table tbody tr")
      .first()
      .find('td:nth-child(2) div[data-testid="link-with-context"] span')
      .click({ force: true }).wait(15000);
    cy.contains("button", "Rework").click();
  });

  //Vendor makes changes to rework design---not working
  it("Vendor makes changes to rework design after buyer rework", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace").wait(10000);
    // Click on the vendor card "Shein"
    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({
      force: true,
    }); // click it even if overlayed
    cy.get("div.sc-dAbbOL.vIbA-D")
      .contains("32021183")
      .click({ force: true })
      .wait(15000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click()
      .wait(10000);
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click({ force: true });
    cy.get('input[placeholder="Search"]').type(designname).wait(1000);
    cy.contains("p", "REWORK").first().click({ force: true }).wait(1000);
    cy.contains("div.n-button-content", "Edit").click();
    //cy.get("div.n-button-content").each(($el) => {
    //   const text = $el.text().trim();
    cy.get('input[data-testid="dropdown-search"]', { timeout: 15000 }).click();
    cy.get('input[data-testid="dropdown-search"]').type(
      "{selectall}{backspace}",
      { force: true }
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
    //    cy.get('input[placeholder="Enter cost"]').type("150");
    // cy.wait(2000);
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

cy.get('input[placeholder="Enter Cost per Piece"]')
  .type('350', { force: true })

    cy.get('svg')
  .find('path[d*="M9.00019 19.0002"]')
  .parents('svg')
  .click({ force: true })
    // Get the div
    // cy.get("svg title")
    //   .contains("Confirm Edit")
    //   .parent()
    //   .click({ force: true });
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
  it("Buyer Approval after vendor changes", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.contains("div", "odm-buyer", { timeout: 20000 })
      .parent()
      .click({ force: true })
      .wait(2000);
    cy.wait(10000);
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
      .click({ force: true })
      .wait(10000);
    cy.get("button").contains("Select Size").click({ force: true });

    //  Wait for the dropdown options to appear and pick a random one
    cy.get(".n-options .n-option", {
      timeout: 10000,
    });
    cy.get('input[value="size-group-0"]').check({ force: true });
    cy.wait(5000);
    cy.contains("Colorways").scrollIntoView().wait(15000);

    cy.get('button[title="Approve"]').eq(1).click({ force: true });

    //cy.get('button[title="Approve"]').click({ force: true });
    cy.wait(5000);
    cy.contains("button", "Approve").click({ force: true }).wait(10000);
  });

  it("Validate Auto Reject Scenario", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.wait(10000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.contains("div", "odm-buyer", { timeout: 20000 })
      .parent()
      .click({ force: true })
      .wait(2000);
    cy.wait(10000);
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('input[placeholder="Search"]').type(designname).wait(10000);

    // cy.contains("p", "CLUSTER APPROVED")
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

  //**********One flow is completed till here */

  after(() => {
    cy.logout();
  });
});
