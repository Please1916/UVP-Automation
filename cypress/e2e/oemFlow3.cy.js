const randomDesignName = `Test_${Math.random().toString(36).substring(2, 8)}`;
export const oemtestdesignname = randomDesignName;

Cypress.on("uncaught:exception", () => false);
describe("RA buyer", () => {
  const pageUrl = "https://platform.impetusz0.de/uvp/range-architecture";

  beforeEach(() => {
    cy.session("user-session", () => {
      cy.login();
    });
  });

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
      .contains("OEM")
      .click();
  });

  it("After login should be in the select workspace page and click on OEM buuyer", () => {
    cy.visit("https://platform.impetusz0.de/workspace");
    cy.wait(20000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 })
      .eq(1)
      .click()
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

    // Select "Men" from Family dropdown
    cy.contains("label", "Family")
      .parent() // go to the dropdown wrapper
      .find(".n-select__trigger")
      .click();

    cy.contains(".n-option", "Men").click();

    // Select "Western Wear" from Class Name dropdown
    cy.contains("label", "Class Name")
      .parent() // go to the dropdown wrapper
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
      .attachFile("colorways.jpg", { force: true })
      .wait(1000);
    cy.get(
      'input[data-testid="dropdown-search"][placeholder="Add SAP ID"]'
    ).click();
    cy.get('[data-testid="dropdown-scroll"]')
      .contains(".n-option", "ROSE GOLD")
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
    cy.visit("https://platform.impetusz0.de/workspace", { timeout: 20000 });
    cy.contains("div.nitrozen-badge-truncate", "odm-buyer", {
      timeout: 15000,
    }).click({ force: true });

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
    cy.get('input[placeholder="Search"]').type(oemtestdesignname);

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
      .contains("OEM")
      .click()
      .wait(15000);
    cy.get('input[placeholder="Search"]').type(oemtestdesignname).wait(1000);
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
    cy.get("div.sc-iEkSXm")
      .find("button.sc-hCrRFl")
      .first() // selects the APPROVE button
      .click({ force: true });
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

    cy.contains("p", "Colorways") // find the container by its text
      .parent() // go to the wrapper div
      .find('input[type="file"]') // find the hidden input
      .attachFile("colorways.jpg", { force: true });

    cy.wait(2000);

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
      .contains("OEM")
      .click()
      .wait(15000);
    cy.contains("span", "Submitted Design").click();
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.get('input[placeholder="Search"]').type(oemtestdesignname).wait(1000);

    // cy.contains("div", "Status").click().wait(10000);
    // cy.get('input[value="PENDING"]') // select the checkbox input with value PENDING
    //   .scrollIntoView({ duration: 200 }) // scroll smoothly into view
    //   //.should("be.visible") // ensure it is visible
    //   .click({ force: true })
    //   .wait(1000);
    cy.contains("p", "PENDING").first().click({ force: true });
    cy.contains("button", "Approve").click({ force: true });
  });

  // Buyer rejects the cluster approved inspiration
  it("Buyer Rejects", () => {
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
      .contains("OEM")
      .click();
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({
      force: true,
    });
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.contains("div", "Status").click().wait(10000);
    cy.get('input[value="CLUSTER APPROVED"]') // select the checkbox input with value PENDING
      .scrollIntoView({ duration: 200 }) // scroll smoothly into view
      .click({ force: true })
      .wait(1000);
    cy.contains("p", "CLUSTER APPROVED").first().click({ force: true });
    cy.contains("button", "Reject", { timeout: 15000 }).click({ force: true });
    cy.get('[data-testid="n-checkbox-filter-COST_NOT_VAIBLE"]', {
      timeout: 10000,
    })
      .should("be.visible")
      .click({ force: true });

    // Wait for Apply button to become enabled (remove disabled attribute if needed)
    cy.contains("div.n-button-content", "Apply")
      .should("be.visible")
      .parent("button") // move to the actual <button>
      .should("not.be.disabled") // ensure it's clickable
      .click({ force: true });
  });
});
