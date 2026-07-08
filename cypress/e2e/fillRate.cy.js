Cypress.on("uncaught:exception", () => false);

const randomString = Math.random().toString(36).substring(2, 10);
const themeName = `Test_${randomString}`;

describe("Fill Rate - RA Page Tests", () => {
  beforeEach(() => {
    cy.session("user-session", () => {
      cy.login();
    });
  });

  after(() => {
    cy.logout();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Login TC from sanityflow2 TC1 — runs first to validate credentials and
  // confirm the buyer workspace is reachable.
  // ───────────────────────────────────────────────────────────────────────────
  it("TC1: logs in successfully with valid credentials and check the workspace", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
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
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();
  });

  it("TC2: Brick + MRP combination - capture target fill rate % for comparison and verification", () => {
    // Step 1 & 2: Login + Select buyer role workspace
    cy.visit("https://platform.uat.impetusz0.de/workspace");
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

    cy.wait(10000);

    // Step 3: Navigate to UVP > Range Architecture via left nav bar
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.wait(3000);

    cy.contains(
      ".side-navigation-panel-select-inner-option-text",
      "Range Architecture"
    )
      .should("be.visible")
      .click();
    cy.wait(10000);

    cy.url().should("include", "/uvp/range-architecture");

    // Step 4: Open filter panel
    cy.get('button[data-testid="filter-button-toggle"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.wait(3000);

    // Step 5: Open Brick Name filter section
    cy.contains("div", "Brick Name").click().wait(2000);

    // Step 6: Select Jeans from the dropdown list
    cy.contains("label", "Jeans").scrollIntoView().click({ force: true });
    cy.wait(2000);

    // Close filter panel
    cy.get('button[data-testid="filter-button-toggle"]').click({ force: true });
    cy.wait(5000);

    // Step 7: Detect column indices dynamically from table headers
    cy.get("table thead tr th").then(($headers) => {
      let optionCountIdx = -1;
      let fillRateIdx = -1;

      $headers.each((i, th) => {
        const text = Cypress.$(th).text().trim().toLowerCase();
        cy.log(`Header ${i}: ${text}`);
        if (text.includes("option")) optionCountIdx = i;
        if (text.includes("fill")) fillRateIdx = i;
      });

      cy.log(`Option Count col index: ${optionCountIdx}`);
      cy.log(`Fill Rate col index: ${fillRateIdx}`);

      // Step 8: Find the row with Brick = Jeans and MRP range 600-700
      cy.get("table tbody tr").each(($row) => {
        const rowText = $row.text();

        if (
          rowText.includes("Jeans") &&
          rowText.includes("600") &&
          rowText.includes("700")
        ) {
          cy.wrap($row)
            .find("td")
            .then(($cells) => {
              // Step 9a: Option Count > 0
              const optionCountText =
                optionCountIdx >= 0
                  ? Cypress.$($cells[optionCountIdx]).text().trim()
                  : "";
              const optionCount = parseInt(optionCountText, 10);
              cy.log(`Option Count raw: "${optionCountText}" → parsed: ${optionCount}`);
              expect(optionCount).to.be.greaterThan(0);

              // Step 9b: Fill Rate % < 110
              const fillRateRaw =
                fillRateIdx >= 0
                  ? Cypress.$($cells[fillRateIdx]).text().trim().replace("%", "")
                  : "";
              const fillRate = parseFloat(fillRateRaw);
              cy.log(`Fill Rate raw: "${fillRateRaw}" → parsed: ${fillRate}%`);

              // Step 10: If fill rate == 110, click edit icon of the same row
              if (fillRate === 110) {
                cy.log("Fill rate is exactly 110% — clicking edit icon");
                cy.wrap($row)
                  .find("svg.nitrozen-svg-icon")
                  .first()
                  .click({ force: true });
              } else {
                expect(fillRate).to.be.lessThan(110);
                cy.log(`Fill rate ${fillRate}% is less than 110% — assertion passed`);
              }

              // Step 11: Hover over the row to reveal the edit icon, then click it
              cy.wrap($row).scrollIntoView().trigger("mouseover").wait(1000);

              // Debug: log count and index of all SVGs in the row
              cy.wrap($row).find("svg.nitrozen-svg-icon").then(($svgs) => {
                cy.log(`SVG count in row: ${$svgs.length}`);
                $svgs.each((i, el) => {
                  cy.log(`SVG[${i}] style="${Cypress.$(el).attr("style")}"`);
                });
              });

              // Edit icon is the last nitrozen-svg-icon visible in the row before edit mode
              cy.wrap($row)
                .find("svg.nitrozen-svg-icon")
                .last()
                .click({ force: true });
              cy.wait(2000);

              // Step 12: Read current value, then use {selectall} + type to avoid
              // React DOM detach that happens when .clear() triggers a re-render
              cy.get('input[inputmode="numeric"]').then(($input) => {
                const currentVal = parseInt($input.val(), 10) || 0;
                const newVal = currentVal + 2;
                cy.log(`Option Count: ${currentVal} → updating to ${newVal}`);
              });
              cy.get('input[inputmode="numeric"]')
                .type("{selectall}" + (parseInt(
                  Cypress.$('input[inputmode="numeric"]').val(), 10
                ) + 2).toString());
              cy.wait(1000);

              // Step 13: Click Save (checkmark — first svg in the inline edit div)
              // Structure: <div><input/><svg checkmark/><svg cancel/></div>
              cy.get('input[inputmode="numeric"]')
                .parent()
                .find("svg.nitrozen-svg-icon")
                .first()
                .click({ force: true });
              cy.wait(3000);
              cy.log("Option count updated and saved successfully");

              // Step 14: Inline edit — table stays visible after save
              // Re-query the same row and capture the updated fill rate %
              cy.get("table tbody tr")
                .filter((_i, row) => {
                  const t = Cypress.$(row).text();
                  return t.includes("Jeans") && t.includes("600") && t.includes("700");
                })
                .first()
                .find("td")
                .then(($updatedCells) => {
                  const updatedFillRateRaw =
                    fillRateIdx >= 0
                      ? Cypress.$($updatedCells[fillRateIdx]).text().trim().replace("%", "")
                      : "";
                  const updatedFillRate = parseFloat(updatedFillRateRaw);
                  cy.log(`Fill Rate % captured after save: ${updatedFillRate}%`);
                  expect(updatedFillRate).to.be.lessThan(110);
                  // Save fill rate for TC3 comparison
                  cy.writeFile("cypress/fixtures/runtimeData.json", { capturedFillRate: updatedFillRate });
                });
            });
        }
      });
    });
  });

  it("TC3: Vendor submits design with 2 colorways → Cluster approves → Buyer verifies Cluster Approved status", () => {

    // ── PART 0: Buyer creates MoodBoard and shares with vendor ──────────────
    cy.visit("https://platform.uat.impetusz0.de/workspace");
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
    cy.wait(10000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();
    cy.wait(10000);

    // Upload Inspiration (MoodBoard creation)
    cy.contains("div.n-button-content", "Upload Inspiration").click();

    cy.contains("p", /^Supported Format: pdf/, { timeout: 30000 })
      .should("be.visible").parents("div")
      .find('input[type="file"][accept=".pdf"]').first()
      .selectFile("cypress/fixtures/inspiration.pdf", { force: true });

    cy.contains("p", "Supported Format: xlsx", { timeout: 30000 })
      .should("be.visible").parents("div")
      .find('input[type="file"][accept=".xlsx"]').first()
      .selectFile("cypress/fixtures/BrickFile.xlsx", { force: true });

    cy.wait(2000);

    cy.get("input#themeName", { timeout: 10000 })
      .should("be.visible").type(themeName, { force: true });

    // Pick a date 2 days from today
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    const day = targetDate.getDate();
    cy.get("input.custom-input").click({ force: true });
    cy.get(".react-datepicker", { timeout: 10000 }).should("be.visible");
    if (targetDate.getMonth() !== new Date().getMonth()) {
      cy.get(".react-datepicker__navigation--next").click();
    }
    cy.get(".react-datepicker__month")
      .find(".react-datepicker__day")
      .not(".react-datepicker__day--disabled")
      .not(".react-datepicker__day--outside-month")
      .filter((_i, el) => Cypress.$(el).text().trim() === String(day))
      .first().click({ force: true });

    cy.get('[data-testid="dropdown-search"]').should("be.visible").click({ force: true });
    cy.get('[data-testid="dropdown-scroll"]').should("be.visible");
    cy.get('[data-value="Bangladesh"]').should("be.visible").click({ force: true });

    cy.get("#desc").type("TC2 automation testing — 2 colorways flow");

    cy.contains("button", "Continue", { timeout: 20000 })
      .should("be.visible").and("not.be.disabled").click({ force: true });
    cy.contains("Inspiration uploaded successfully", { timeout: 30000 }).should("be.visible");
    cy.wait(3000);

    // Share MoodBoard with vendor 32021182
    cy.get('input[placeholder="Search"]').type(themeName).wait(2000);
    cy.get('button[role="checkbox"]', { timeout: 10000 }).eq(1).click({ force: true });
    cy.contains("div.n-button-content", "Share").click({ force: true });
    cy.contains("div", "Share moodboards to vendor")
      .parent().find("svg").last().click({ force: true });
    cy.get('input[placeholder="Select / Search item"]').type("KIRARA");
    cy.contains("label", "KIRARA - 32021182")
      .scrollIntoView().find('input[type="checkbox"]').check({ force: true });
    cy.contains("div.n-button-content", "Share").click({ force: true });
    cy.wait(8000);
    cy.log(`MoodBoard "${themeName}" created and shared with vendor 32021182`);

    // ── PART 1: Vendor submits design with 2 colorways ─────────────────────
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182").click();
    cy.wait(5000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();
    cy.wait(15000);

    // Click Active Inspiration tab
    cy.contains("span", "Active Inspiration").click({ force: true });
    cy.wait(5000);

    // Search by theme name — results appear in table
    cy.get('input[placeholder="Search"]', { timeout: 15000 })
      .should("be.visible").clear().type(themeName, { delay: 100 });
    cy.wait(5000);

    // Click View in the last column of the matching row
    cy.get("table tbody tr", { timeout: 15000 }).first().within(() => {
      cy.get("td").last().find("div.n-button-content").contains("View").click({ force: true });
    });
    cy.wait(3000);
    cy.contains("div.n-button-content", "Submit").scrollIntoView().click({ force: true }).wait(2000);

    // Fill design details
    cy.get('input[data-testid="article_code_input"]').first().type(`Style_${randomString}`);

    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });
    cy.get(".n-options .n-option", { timeout: 5000 }).should("have.length.gt", 0);
    cy.get(".n-options .n-option").contains("6206400").click();

    cy.contains("label", "Brick Name *").parent().find(".n-select__trigger").click();
    cy.get(".n-options .n-option").contains("Jeans").click();

    cy.contains("p", "Upload Design").parent().find('input[type="file"]')
      .attachFile("design.jpeg", { force: true });

    // Colorway 1 — AQUA
    cy.contains("p", "Colorways").scrollIntoView().parent().find('input[type="file"]')
      .attachFile("colorways.jpg", { force: true });
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', { timeout: 10000 })
      .eq(0).should("be.visible").scrollIntoView().click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "AQUA").scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
      .should("have.length", 1).eq(0).scrollIntoView().type("400");

    // Colorway 2 — ROSE GOLD
    cy.contains("p", "Colorways").scrollIntoView().parent().find('input[type="file"]')
      .attachFile("rosegold.jpeg", { force: true });
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', { timeout: 10000 })
      .eq(1).should("be.visible").scrollIntoView().click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "ROSE GOLD").scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
      .should("have.length", 2).eq(1).scrollIntoView().type("400");

    // Upload
    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Upload") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click();
        return false;
      }
    });

    // Create Pack 1 — AQUA (Multi 1)  (sanityflow2 TC4 pattern)
    cy.get("button").contains("Create Pack").scrollIntoView().should("be.visible").click();
    cy.get('input[type="number"]').eq(0).clear().type("3");
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 }).should("be.visible").type("400");
    cy.get("button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid")
      .filter(':contains("Create Pack")').click();
    cy.wait(2000);

    // Create Pack 2 — ROSE GOLD (Multi 2)
    cy.get("button").contains("Create Pack").scrollIntoView().should("be.visible").click();
    cy.get('input[type="number"]').eq(1).clear().type("3");
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 }).should("be.visible").type("400");
    cy.get("button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid")
      .filter(':contains("Create Pack")').click();
    cy.wait(2000);

    // Fabric details
    cy.get('input[placeholder="Ex. cotton 90% Polyester 10%*"]')
      .first().scrollIntoView().clear().type("cotton90%", { delay: 100 }).blur();
    cy.get('input[placeholder="Ex. 240/160*"]')
      .first().scrollIntoView().clear().type("1.5", { delay: 100 }).blur();

    cy.wait(5000);

    // Submit design
    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Submit") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click();
        return false;
      }
    });
    cy.wait(10000);
    cy.log("Vendor submitted design with 2 colorways");

    // ── PART 2: Cluster approves the submitted design ───────────────────────
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 })
      .should("be.visible").click();
    cy.wait(10000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM")
      .click();
    cy.wait(10000);

    cy.contains("span", "Submitted Design").click();
    cy.wait(5000);

    cy.get('input[placeholder="Search"]').type(themeName).wait(3000);

    cy.contains("p", "PENDING", { timeout: 15000 }).first().click({ force: true });
    cy.wait(5000);
    cy.contains("button", "Approve").should("be.visible").click({ force: true });
    cy.wait(5000);
    cy.log("Cluster approved the design");

    // ── PART 3: Buyer verifies design shows CLUSTER APPROVED status ─────────
    cy.visit("https://platform.uat.impetusz0.de/workspace");
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
    cy.wait(10000);

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({ force: true });
    cy.get('input[placeholder="Search"]').type(themeName).wait(2000);

    // Step 1: Verify design status is CLUSTER APPROVED
    cy.contains("p", "CLUSTER APPROVED", { timeout: 15000 })
      .should("be.visible")
      .then(($status) => {
        cy.log(`Design status confirmed: ${$status.text().trim()}`);
      });

  });

  it("TC4: Fill rate verification when colorway approved — fill rate % should increment", () => {

    // ── Step 1: Buyer opens the Cluster Approved design from TC2 ───────────
    cy.visit("https://platform.uat.impetusz0.de/workspace");
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
    cy.wait(10000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();
    cy.wait(10000);

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({ force: true });
    cy.wait(3000);

    // Step 2: Capture design ID from the CLUSTER APPROVED row, then open it
    cy.contains("p", "CLUSTER APPROVED", { timeout: 15000 })
      .closest("tr")
      .find("td").first()
      .invoke("text")
      .then((id) => {
        cy.wrap(id.trim()).as("designId");
        cy.log(`Captured design ID: ${id.trim()}`);
      });

    cy.contains("p", "CLUSTER APPROVED", { timeout: 15000 })
      .first().click({ force: true });
    cy.wait(10000);

    // Step 3: Approve first colorway using button[title="Approve"]
    cy.get('button[title="Approve"]', { timeout: 10000 })
      .first().scrollIntoView({ duration: 300 })
      .should("be.visible").click({ force: true });
    cy.wait(5000);
    cy.log("First colorway approved");

    // Step 5: Navigate to RA page and check fill rate for Jeans MRP 600-700
    cy.contains(".side-navigation-panel-select-inner-option-text", "Range Architecture")
      .click({ force: true });
    cy.wait(10000);

    cy.url().should("include", "/uvp/range-architecture");

    // Apply Jeans filter
    cy.get('button[data-testid="filter-button-toggle"]')
      .scrollIntoView().should("be.visible").click({ force: true });
    cy.wait(3000);
    cy.contains("div", "Brick Name").click({ force: true }).wait(2000);
    cy.contains("label", "Jeans").scrollIntoView().click({ force: true });
    cy.wait(2000);
    cy.get('button[data-testid="filter-button-toggle"]').click({ force: true });
    cy.wait(5000);

    // Step 6: Read updated fill rate and compare with captured value from TC1
    cy.readFile("cypress/fixtures/runtimeData.json").then((data) => {
      const capturedFillRate = data.capturedFillRate;
      cy.log(`Captured fill rate from TC1: ${capturedFillRate}%`);

      cy.get("table thead tr th").then(($headers) => {
        let fillRateIdx = -1;
        $headers.each((i, th) => {
          if (Cypress.$(th).text().trim().toLowerCase().includes("fill")) fillRateIdx = i;
        });

        cy.get("table tbody tr").each(($row) => {
          const rowText = $row.text();
          if (rowText.includes("Jeans") && rowText.includes("600") && rowText.includes("700")) {
            cy.wrap($row).find("td").then(($cells) => {
              const newFillRateRaw =
                fillRateIdx >= 0
                  ? Cypress.$($cells[fillRateIdx]).text().trim().replace("%", "")
                  : "";
              const newFillRate = parseFloat(newFillRateRaw);
              cy.log(`New fill rate after colorway approval: ${newFillRate}%`);
              cy.log(`Captured fill rate: ${capturedFillRate}% → New fill rate: ${newFillRate}%`);

              // Headed-run visibility: highlight the row's fill rate cell + banner
              Cypress.$($cells[fillRateIdx]).css({
                "background-color": "#fff59d", "border": "3px solid red", "font-weight": "bold",
              });
              Cypress.$("#fillrate-banner").remove();
              Cypress.$("body").prepend(
                '<div id="fillrate-banner" style="position:fixed;top:0;left:0;right:0;' +
                'background:#2e7d32;color:#fff;font-weight:bold;font-size:18px;' +
                'text-align:center;padding:12px;z-index:99999;border-bottom:4px solid #000;">' +
                `COLORWAY APPROVE — Baseline: ${capturedFillRate}% → Current: ${newFillRate}% ` +
                `(${newFillRate > capturedFillRate ? "✓ INCREASED" : "✗ NOT INCREASED"})` +
                "</div>"
              );
              cy.wait(2000);

              // Step 6: New fill rate should be greater than the captured value
              expect(newFillRate).to.be.greaterThan(capturedFillRate);
            });
          }
        });
      });
    });

    // Step 7: Navigate back to ODM (UVP already expanded since we're on RA page)
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 10000 })
      .contains("ODM").click({ force: true });
    cy.wait(10000);

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({ force: true });
    cy.get("@designId").then((designId) => {
      cy.get('input[placeholder="Search"]').clear().type(designId).wait(3000);
    });

    cy.contains("p", "CLUSTER APPROVED", { timeout: 15000 })
      .first().click({ force: true });
    cy.wait(10000);

    // Step 8: Reject the approved colorway
    cy.get('button[title="Reject"]', { timeout: 10000 })
      .eq(0).scrollIntoView().should("be.visible").click({ force: true });
    cy.wait(5000);
    cy.log("First colorway rejected");

    // Step 9: Navigate to RA page (UVP already expanded since we're on ODM page)
    cy.contains(".side-navigation-panel-select-inner-option-text", "Range Architecture")
      .click({ force: true });
    cy.wait(10000);
    cy.url().should("include", "/uvp/range-architecture");

    cy.get('button[data-testid="filter-button-toggle"]')
      .scrollIntoView().should("be.visible").click({ force: true });
    cy.wait(3000);
    cy.contains("div", "Brick Name").click({ force: true }).wait(2000);
    cy.contains("label", "Jeans").scrollIntoView().click({ force: true });
    cy.wait(2000);
    cy.get('button[data-testid="filter-button-toggle"]').click({ force: true });
    cy.wait(5000);

    cy.readFile("cypress/fixtures/runtimeData.json").then((data) => {
      const capturedFillRate = data.capturedFillRate;

      cy.get("table thead tr th").then(($headers) => {
        let fillRateIdx = -1;
        $headers.each((i, th) => {
          if (Cypress.$(th).text().trim().toLowerCase().includes("fill")) fillRateIdx = i;
        });

        cy.get("table tbody tr").each(($row) => {
          const rowText = $row.text();
          if (rowText.includes("Jeans") && rowText.includes("600") && rowText.includes("700")) {
            cy.wrap($row).find("td").then(($cells) => {
              const rejectedFillRateRaw =
                fillRateIdx >= 0
                  ? Cypress.$($cells[fillRateIdx]).text().trim().replace("%", "")
                  : "";
              const rejectedFillRate = parseFloat(rejectedFillRateRaw);
              cy.log(`Fill rate after colorway rejection: ${rejectedFillRate}%`);
              cy.log(`TC1 captured fill rate: ${capturedFillRate}% → Post-rejection: ${rejectedFillRate}%`);

              // Headed-run visibility: highlight the row's fill rate cell + banner
              Cypress.$($cells[fillRateIdx]).css({
                "background-color": "#fff59d", "border": "3px solid red", "font-weight": "bold",
              });
              Cypress.$("#fillrate-banner").remove();
              Cypress.$("body").prepend(
                '<div id="fillrate-banner" style="position:fixed;top:0;left:0;right:0;' +
                'background:#c62828;color:#fff;font-weight:bold;font-size:18px;' +
                'text-align:center;padding:12px;z-index:99999;border-bottom:4px solid #000;">' +
                `COLORWAY REJECT — Baseline: ${capturedFillRate}% → Current: ${rejectedFillRate}% ` +
                `(${rejectedFillRate <= capturedFillRate ? "✓ DECREASED" : "✗ NOT DECREASED"})` +
                "</div>"
              );
              cy.wait(2000);

              // Step 9: Fill rate should decrease back to TC1 captured value
              expect(rejectedFillRate).to.be.lessThanOrEqual(capturedFillRate);
            });
          }
        });
      });
    });
  });

  it("TC5: Fill rate verification when pack approved — fill rate % should increment", () => {

    // ── Step 1: Buyer opens the Cluster Approved design ────────────────────
    cy.visit("https://platform.uat.impetusz0.de/workspace");
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
    cy.wait(10000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();
    cy.wait(10000);

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({ force: true });
    cy.wait(3000);

    // Step 2: Capture design ID from the CLUSTER APPROVED row, then open it
    cy.contains("p", "CLUSTER APPROVED", { timeout: 15000 })
      .closest("tr")
      .find("td").first()
      .invoke("text")
      .then((id) => {
        cy.wrap(id.trim()).as("designId");
        cy.log(`Captured design ID: ${id.trim()}`);
      });

    cy.contains("p", "CLUSTER APPROVED", { timeout: 15000 })
      .first().click({ force: true });
    cy.wait(10000);

    // Step 3: Approve colorway + Pack_1 together (pack approval happens
    // alongside colorway approval, before the design is buyer approved)
    cy.get('button[title="Approve"]', { timeout: 10000 })
      .first().scrollIntoView({ duration: 300 })
      .should("be.visible").click({ force: true });
    cy.wait(3000);

    cy.get('button[aria-label="Approve Pack_1"]', { timeout: 10000 })
      .first().scrollIntoView({ duration: 300 })
      .should("be.visible").click({ force: true });
    cy.wait(5000);
    cy.log("Colorway + Pack_1 approved");

    // Step 5: Navigate to RA page and check fill rate for Jeans MRP 600-700
    cy.contains(".side-navigation-panel-select-inner-option-text", "Range Architecture")
      .click({ force: true });
    cy.wait(10000);

    cy.url().should("include", "/uvp/range-architecture");

    // Apply Jeans filter
    cy.get('button[data-testid="filter-button-toggle"]')
      .scrollIntoView().should("be.visible").click({ force: true });
    cy.wait(3000);
    cy.contains("div", "Brick Name").click({ force: true }).wait(2000);
    cy.contains("label", "Jeans").scrollIntoView().click({ force: true });
    cy.wait(2000);
    cy.get('button[data-testid="filter-button-toggle"]').click({ force: true });
    cy.wait(5000);

    // Step 6: Read updated fill rate and compare with captured value from TC1
    cy.readFile("cypress/fixtures/runtimeData.json").then((data) => {
      const capturedFillRate = data.capturedFillRate;
      cy.log(`Captured fill rate from TC1: ${capturedFillRate}%`);

      cy.get("table thead tr th").then(($headers) => {
        let fillRateIdx = -1;
        $headers.each((i, th) => {
          if (Cypress.$(th).text().trim().toLowerCase().includes("fill")) fillRateIdx = i;
        });

        cy.get("table tbody tr").each(($row) => {
          const rowText = $row.text();
          if (rowText.includes("Jeans") && rowText.includes("600") && rowText.includes("700")) {
            cy.wrap($row).find("td").then(($cells) => {
              const newFillRateRaw =
                fillRateIdx >= 0
                  ? Cypress.$($cells[fillRateIdx]).text().trim().replace("%", "")
                  : "";
              const newFillRate = parseFloat(newFillRateRaw);
              cy.log(`New fill rate after pack approval: ${newFillRate}%`);
              cy.log(`Captured fill rate: ${capturedFillRate}% → New fill rate: ${newFillRate}%`);

              // Headed-run visibility: highlight the row's fill rate cell + banner
              Cypress.$($cells[fillRateIdx]).css({
                "background-color": "#fff59d", "border": "3px solid red", "font-weight": "bold",
              });
              Cypress.$("#fillrate-banner").remove();
              Cypress.$("body").prepend(
                '<div id="fillrate-banner" style="position:fixed;top:0;left:0;right:0;' +
                'background:#2e7d32;color:#fff;font-weight:bold;font-size:18px;' +
                'text-align:center;padding:12px;z-index:99999;border-bottom:4px solid #000;">' +
                `PACK APPROVE — Baseline: ${capturedFillRate}% → Current: ${newFillRate}% ` +
                `(${newFillRate > capturedFillRate ? "✓ INCREASED" : "✗ NOT INCREASED"})` +
                "</div>"
              );
              cy.wait(2000);

              // Step 6: New fill rate should be greater than the captured value
              expect(newFillRate).to.be.greaterThan(capturedFillRate);
            });
          }
        });
      });
    });

    // Step 7: Navigate back to ODM (UVP already expanded since we're on RA page)
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 10000 })
      .contains("ODM").click({ force: true });
    cy.wait(10000);

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({ force: true });
    cy.get("@designId").then((designId) => {
      cy.get('input[placeholder="Search"]').clear().type(designId).wait(3000);
    });

    cy.contains("p", "CLUSTER APPROVED", { timeout: 15000 })
      .first().click({ force: true });
    cy.wait(10000);

    // Step 8: Reject Pack_2 (Multi 2 — ROSE GOLD pack)
    cy.get('button[aria-label="Reject Pack_2"]', { timeout: 10000 })
      .first().scrollIntoView({ duration: 300 })
      .should("be.visible").click({ force: true });
    cy.wait(5000);
    cy.log("Pack_2 rejected");

    // Step 9: Navigate to RA page (UVP already expanded since we're on ODM page)
    cy.contains(".side-navigation-panel-select-inner-option-text", "Range Architecture")
      .click({ force: true });
    cy.wait(10000);
    cy.url().should("include", "/uvp/range-architecture");

    cy.get('button[data-testid="filter-button-toggle"]')
      .scrollIntoView().should("be.visible").click({ force: true });
    cy.wait(3000);
    cy.contains("div", "Brick Name").click({ force: true }).wait(2000);
    cy.contains("label", "Jeans").scrollIntoView().click({ force: true });
    cy.wait(2000);
    cy.get('button[data-testid="filter-button-toggle"]').click({ force: true });
    cy.wait(5000);

    cy.readFile("cypress/fixtures/runtimeData.json").then((data) => {
      const capturedFillRate = data.capturedFillRate;

      cy.get("table thead tr th").then(($headers) => {
        let fillRateIdx = -1;
        $headers.each((i, th) => {
          if (Cypress.$(th).text().trim().toLowerCase().includes("fill")) fillRateIdx = i;
        });

        cy.get("table tbody tr").each(($row) => {
          const rowText = $row.text();
          if (rowText.includes("Jeans") && rowText.includes("600") && rowText.includes("700")) {
            cy.wrap($row).find("td").then(($cells) => {
              const rejectedFillRateRaw =
                fillRateIdx >= 0
                  ? Cypress.$($cells[fillRateIdx]).text().trim().replace("%", "")
                  : "";
              const rejectedFillRate = parseFloat(rejectedFillRateRaw);
              cy.log(`Fill rate after pack rejection: ${rejectedFillRate}%`);
              cy.log(`TC1 captured fill rate: ${capturedFillRate}% → Post-rejection: ${rejectedFillRate}%`);

              // Headed-run visibility: highlight the row's fill rate cell + banner
              Cypress.$($cells[fillRateIdx]).css({
                "background-color": "#fff59d", "border": "3px solid red", "font-weight": "bold",
              });
              Cypress.$("#fillrate-banner").remove();
              Cypress.$("body").prepend(
                '<div id="fillrate-banner" style="position:fixed;top:0;left:0;right:0;' +
                'background:#c62828;color:#fff;font-weight:bold;font-size:18px;' +
                'text-align:center;padding:12px;z-index:99999;border-bottom:4px solid #000;">' +
                `PACK REJECT — Baseline: ${capturedFillRate}% → Current: ${rejectedFillRate}% ` +
                `(${rejectedFillRate <= capturedFillRate ? "✓ DECREASED" : "✗ NOT DECREASED"})` +
                "</div>"
              );
              cy.wait(2000);

              // Step 9: Fill rate should decrease back to TC1 captured value
              expect(rejectedFillRate).to.be.lessThanOrEqual(capturedFillRate);
            });
          }
        });
      });
    });
  });
});
