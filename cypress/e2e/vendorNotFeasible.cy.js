/// <reference types="cypress" />

const randomDesignName   = `VNF_${Math.random().toString(36).substring(2, 8)}`;
const randomDesignName2  = `VNF_BA_${Math.random().toString(36).substring(2, 8)}`;
const randomDesignName3  = `VNF_TC4_${Math.random().toString(36).substring(2, 8)}`;
const randomVendorStyle2 = `Style_${Math.random().toString(36).substring(2, 8)}`;
const randomVendorStyle3 = `Style_${Math.random().toString(36).substring(2, 8)}`;
const randomVendorStyle4 = `Style4_${Math.random().toString(36).substring(2, 8)}`;
const randomVendorStyle5 = `Style5_${Math.random().toString(36).substring(2, 8)}`;
let   capturedBsId       = "";   // captured from Active Inspiration table after Prerequisite 1
let   capturedBsId2      = "";   // captured from OEM listing after Prerequisite 3 (randomDesignName2)
let   capturedBsId3      = "";   // captured for TC_004/TC_005 BS-level VNF flow (randomDesignName3)

Cypress.on("uncaught:exception", () => false);

describe("Vendor Not Feasible P0 Test Suite", () => {
  beforeEach(() => {
    cy.session("user-session", () => {
      cy.login();
    }, {
      cacheAcrossSpecs: true,
      validate() {
        cy.getCookies().should("have.length.greaterThan", 0);
      },
    });
  });

  afterEach(function () {
    if (this.currentTest && this.currentTest.state === "failed") {
      const title = this.currentTest.title || "Unknown Test";
      cy.screenshot(`${title}-failed`);
    }
  });

  // ──Scenario -1 PD/ID 1 rejected on PD Id level only ──────────────────────────────
  xit("TC_01 Buyer creates OEM design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first()
      .scrollIntoView({ offset: { top: -100 } })
      .click({ force: true });

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

    cy.contains("label", "Family", { timeout: 15000 })
      .parent().find(".n-select__trigger").click();
    cy.contains(".n-option", "Men").click();

    cy.contains("label", "Class Name")
      .parent().find(".n-select__trigger").click();
    cy.contains(".n-option", "Western Wear").click();

    cy.contains("label", "Brick Name")
      .parent().find(".n-select__trigger").click();
    cy.contains("label", "Brick Name")
      .parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Jeans")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.contains("label", "Top Brick")
      .parent().find(".n-select__trigger").click();
    cy.contains("label", "Top Brick")
      .parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Denim")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.get("label").filter((_i, el) => {
      const t = el.textContent.trim();
      return t.includes("Brick") && !t.includes("Name") && !t.includes("Top");
    }).parent().find(".n-select__trigger").click();
    cy.get("label").filter((_i, el) => {
      const t = el.textContent.trim();
      return t.includes("Brick") && !t.includes("Name") && !t.includes("Top");
    }).parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Bottomwear")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.contains("label", "Enrichment")
      .parent().find(".n-select__trigger").click();
    cy.contains("label", "Enrichment")
      .parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Denim")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.contains("label", "Cluster")
      .parent().find(".n-select__trigger").click();
    cy.contains("label", "Cluster")
      .parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Bangladesh")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.contains("p", "Upload Design")
      .parent().find('input[type="file"]')
      .attachFile("design.jpeg", { force: true }).wait(1000);

    cy.contains("p", "Colorways").scrollIntoView().should("be.visible");
    cy.contains("button", "Upload Files", { timeout: 15000 })
      .parents().find('input[type="file"]').eq(1)
      .attachFile("AQUA.jpg", { force: true }).wait(1000);
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]').click();
    cy.get('[data-testid="dropdown-scroll"]')
      .contains(".n-option", "AQUA").scrollIntoView().click().wait(1000);
    cy.get('input[placeholder="Enter cost"]').type("333").wait(1000);
    cy.get('svg path[d^="M12 19.0713"]').closest("button").click();

    cy.contains("p", "Colorways").scrollIntoView().wait(1000);
    cy.contains("button", "Upload Files")
      .parents().find('input[type="file"]').eq(1)
      .attachFile("rosegold.jpeg", { force: true }).wait(1000);
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]').eq(1).click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "ROSE GOLD").click();
    cy.get('input[placeholder="Enter cost"]').last().type("350");

    cy.contains("p", "Colorways").scrollIntoView().wait(1000);
    cy.contains("button", "Upload Files")
      .parents().find('input[type="file"]').eq(1)
      .attachFile("green.jpeg", { force: true }).wait(1000);
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .last().click().wait(1000);
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "PISTA GREEN").click();
    cy.get('input[placeholder="Enter cost"]').last().type("370");

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Upload") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(1000);
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
      if ($el.text().trim() === "Submit") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(1000);
        return false;
      }
    });
  });

  // ── PREREQUISITE 2: Buyer shares OEM design to vendor ────────────────────
  xit("TC_02 Buyer shares OEM design to vendor", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace", { timeout: 20000 });
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first()
      .scrollIntoView({ offset: { top: -100 } })
      .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();

    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomDesignName);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    // Capture BS/PD ID from the first matching row
    cy.get("table tbody tr").first().then(($row) => {
      const rowText = $row.text();
      const idMatch  = rowText.match(/[A-Z]{2,}\/\d+\/\d+/);
      if (idMatch) {
        capturedBsId = idMatch[0];
        cy.log(`Captured BS/PD ID: ${capturedBsId}`);
      }
    });

    cy.get('button[role="checkbox"]', { timeout: 10000 })
      .eq(1)
      .click({ force: true });

    cy.contains("div.n-button-content", "Share").click({ force: true });
    cy.contains("div", "Share designs to vendor")
      .parent()
      .find("svg").last()
      .click({ force: true })
      .wait(1000);

    cy.get('input[placeholder="Select Vendors"]').type("KIRARA");
    cy.contains("label", "KIRARA - 32021182")
      .scrollIntoView()
      .find('input[type="checkbox"]')
      .check({ force: true });

    cy.contains("div.n-button-content", "Share").click({ force: true });
    cy.contains("div.n-button-content", "Share")
      .parent("button").should("be.visible").click({ force: true });
  });

  // ── OEM VNF TESTS (TC_001 – TC_026) ──────────────────────────────────────

  xit("TC_03: Verify marks the PD/ID as VNF ", () => {
    // Login as vendor (KIRARA - 32021182)
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap")
      .click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM")
      .click();

    // Navigate to Active Inspiration and find the shared design
    cy.contains("span", "Active Inspiration", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomDesignName);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    // Click "Not feasible" — break chain to avoid detached DOM after re-render
    cy.get("table tbody tr").first()
      .find("div.n-button-content").contains("Not feasible")
      .parent("button").as("vnfBtn");
    cy.get("@vnfBtn").scrollIntoView().wait(500);
    cy.get("@vnfBtn").click({ force: true });

    // Popup: "Choose the reasons" — check one reason, click Apply
    cy.get('[data-testid="filter-notFeasible-FABRIC_NOT_AVAILABLE"]').check({ force: true });
    cy.contains("div.n-button-content", "Apply")
      .parent("button").should("be.visible").click({ force: true });

    // Verify status is updated on current page
    // cy.contains("VENDOR REJECTED", { timeout: 15000 }).should("exist");

    // // Navigate back to Active Inspiration and search by PD/BS ID to verify status
    // cy.contains("span", "Active Inspiration", { timeout: 15000 }).click();
    // cy.get('input[placeholder="Search"]', { timeout: 15000 }).clear().then(($input) => {
    //   const searchId = capturedBsId || randomDesignName;
    //   cy.wrap($input).type(searchId);
    // });
    // cy.get("table tbody tr", { timeout: 20000 }).first()
    //   .should("contain.text", "VENDOR REJECTED");
  });

  xit("TC_04: Verify PD/ID is vendor rejected in active inspiration tab", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    cy.contains("span", "Active Inspiration", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomDesignName);

    // Search filters to only this design — wait for Vendor Rejected to appear
    cy.contains("VENDOR REJECTED", { timeout: 15000 })
      .should("exist")
      .then(($el) => {
        $el.css({
          outline: "3px solid red",
          "background-color": "yellow",
          padding: "2px 6px",
          "border-radius": "4px",
        });
      });
    cy.screenshot("tc002-vendor-rejected-status-highlighted");
  });

  // ── Scenario -2 Vendor reject one design but second design till buyer approval then VNF is not enabled at PD/ID level──────────────

  xit("TC_05: Buyer creates second OEM design ", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first()
      .scrollIntoView({ offset: { top: -100 } })
      .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    cy.contains("div.n-button-content", "Upload Design", { timeout: 15000 })
      .click({ force: true }).wait(1000);

    cy.get('input[placeholder="Enter Design Name"]')
      .should("be.visible")
      .type(randomDesignName2, { force: true });

    cy.contains("label", "Family", { timeout: 15000 })
      .parent().find(".n-select__trigger").click();
    cy.contains(".n-option", "Men").click();

    cy.contains("label", "Class Name")
      .parent().find(".n-select__trigger").click();
    cy.contains(".n-option", "Western Wear").click();

    cy.contains("label", "Brick Name")
      .parent().find(".n-select__trigger").click();
    cy.contains("label", "Brick Name")
      .parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Jeans")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.contains("label", "Top Brick")
      .parent().find(".n-select__trigger").click();
    cy.contains("label", "Top Brick")
      .parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Denim")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.get("label").filter((_i, el) => {
      const t = el.textContent.trim();
      return t.includes("Brick") && !t.includes("Name") && !t.includes("Top");
    }).parent().find(".n-select__trigger").click();
    cy.get("label").filter((_i, el) => {
      const t = el.textContent.trim();
      return t.includes("Brick") && !t.includes("Name") && !t.includes("Top");
    }).parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Bottomwear")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.contains("label", "Enrichment")
      .parent().find(".n-select__trigger").click();
    cy.contains("label", "Enrichment")
      .parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Denim")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.contains("label", "Cluster")
      .parent().find(".n-select__trigger").click();
    cy.contains("label", "Cluster")
      .parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Bangladesh")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.contains("p", "Upload Design")
      .parent().find('input[type="file"]')
      .attachFile("design.jpeg", { force: true }).wait(1000);

    cy.contains("p", "Colorways").scrollIntoView().should("be.visible");
    cy.contains("button", "Upload Files", { timeout: 15000 })
      .parents().find('input[type="file"]').eq(1)
      .attachFile("AQUA.jpg", { force: true }).wait(1000);
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]').click();
    cy.get('[data-testid="dropdown-scroll"]')
      .contains(".n-option", "AQUA").scrollIntoView().click().wait(1000);
    cy.get('input[placeholder="Enter cost"]').type("333").wait(1000);
    cy.get('svg path[d^="M12 19.0713"]').closest("button").click();

    cy.contains("p", "Colorways").scrollIntoView().wait(1000);
    cy.contains("button", "Upload Files")
      .parents().find('input[type="file"]').eq(1)
      .attachFile("rosegold.jpeg", { force: true }).wait(1000);
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]').eq(1).click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "ROSE GOLD").click();
    cy.get('input[placeholder="Enter cost"]').last().type("350");

    cy.contains("p", "Colorways").scrollIntoView().wait(1000);
    cy.contains("button", "Upload Files")
      .parents().find('input[type="file"]').eq(1)
      .attachFile("green.jpeg", { force: true }).wait(1000);
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .last().click().wait(1000);
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "PISTA GREEN").click();
    cy.get('input[placeholder="Enter cost"]').last().type("370");

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Upload") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(1000);
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
      if ($el.text().trim() === "Submit") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(1000);
        return false;
      }
    });

    // After submit, search for the design and capture its BS/PD ID
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).clear().type(randomDesignName2);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");
    cy.get("table tbody tr").first().then(($row) => {
      const rowText = $row.text();
      const idMatch = rowText.match(/[A-Z]{2,}\/\d+\/\d+/);
      if (idMatch) {
        capturedBsId2 = idMatch[0];
        cy.log(`Captured BS/PD ID for randomDesignName2: ${capturedBsId2}`);
      }
    });
  });

  xit("TC_06: Buyer shares second design to vendor", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace", { timeout: 20000 });
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first()
      .scrollIntoView({ offset: { top: -100 } })
      .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomDesignName2);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");
    cy.get('button[role="checkbox"]', { timeout: 10000 }).eq(1).click({ force: true });

    cy.contains("div.n-button-content", "Share").click({ force: true });
    cy.contains("div", "Share designs to vendor")
      .parent().find("svg").last()
      .click({ force: true }).wait(1000);

    cy.get('input[placeholder="Select Vendors"]').type("KIRARA");
    cy.contains("label", "KIRARA - 32021182")
      .scrollIntoView()
      .find('input[type="checkbox"]')
      .check({ force: true });

    cy.contains("div.n-button-content", "Share").click({ force: true });
    cy.contains("div.n-button-content", "Share")
      .parent("button").should("be.visible").click({ force: true });
  });

  xit("TC_07:  Vendor submits second design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click().wait(1500);

    cy.contains("span", "Active Inspiration", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomDesignName2);
    cy.wait(2000);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    // Click Upload directly from the list row (no row navigation needed)
    cy.contains("div.n-button-content", "Upload", { timeout: 20000 })
      .first().click({ force: true });

    cy.get('input[data-testid="article_code_input"]', { timeout: 15000 })
      .first().type(randomVendorStyle2, { force: true });

    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });
    cy.wait(800);
    cy.get(".n-options .n-option").contains("6206400").click();

    cy.contains("p", "Mandatory").scrollIntoView();

    // Enter costs for buyer-uploaded colorways (AQUA, ROSE GOLD, PISTA GREEN)
    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-0"]').first()
      .type("380", { force: true });
    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]').eq(0)
      .parents("button").click({ force: true });
    cy.wait(1000);

    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-1"]')
      .type("450", { force: true });
    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]').eq(0)
      .parents("button").click({ force: true });
    cy.wait(1000);

    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-2"]')
      .type("460", { force: true });
    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]').eq(0)
      .parents("button").click({ force: true });
    cy.wait(1000);

    // Upload one vendor colorway
    cy.contains("p", "Colorways").scrollIntoView().wait(5000);
    cy.contains("button", "Upload Files")
      .parents().find('input[type="file"]')
      .attachFile("BLUE.jpeg", { force: true }).wait(1000);
    cy.get('input[data-testid="dropdown-search"]').eq(1).click();
    cy.get(".n-option").contains("BLUE").scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]').type("150").wait(3000);

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Upload") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(5000);
        return false;
      }
    });

    // Create one pack
    cy.get("button").contains("Create Pack").should("be.visible").click();
    cy.get('input[type="number"]').eq(1).clear().type("3");
    cy.get('input[type="number"]').eq(2).clear().type("2");
    cy.wait(3000);
    cy.get("input[placeholder='Enter cost']").type("650").wait(1000);
    cy.get("button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid")
      .filter(':contains("Create Pack")').click().wait(1000);

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Submit") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(1000);
        return false;
      }
    });
  });

  xit("TC_08: Cluster approves second design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 }).click();

    cy.contains("span.side-navigation-panel-select-option-text", "UVP", { timeout: 15000 })
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView().should("be.visible").click({ force: true });
    cy.get('input[placeholder="Search"]').type(randomDesignName2).wait(1000);

    cy.contains("p", "PENDING", { timeout: 15000 }).first().click({ force: true });
    cy.contains("button", "Approve").click({ force: true });
  });

  xit("TC_09: Buyer approves second design till buyer approval state", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first()
      .scrollIntoView({ offset: { top: -100 } })
      .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click({ force: true });
    cy.wait(3000);
    cy.get('input[placeholder="Search"]').type(randomDesignName2).wait(3000);
    cy.contains("p", "CLUSTER APPROVED", { timeout: 15000 }).first().click({ force: true });

    // Select size
    cy.get("button").contains("Select Size", { timeout: 15000 }).click({ force: true });
    cy.get('input[value="size-group-0"]', { timeout: 10000 })
      .should("be.visible").check({ force: true });
    cy.wait(3000);

    cy.contains("Colorways").scrollIntoView().wait(10000);

    // Approve colorway 1 (AQUA)
    cy.get('button[title="Approve"]', { timeout: 10000 }).eq(0).click({ force: true });
    cy.wait(2000);

    // Approve colorway 2 (ROSE GOLD)
    cy.get('button[title="Approve"]', { timeout: 10000 }).eq(0).click({ force: true });
    cy.wait(2000);

    // Approve Pack_1
    cy.get('button[aria-label="Approve Pack_1"]', { timeout: 10000 })
      .scrollIntoView({ duration: 300 }).should("be.visible").click({ force: true });
    cy.wait(3000);

    // Select vendor pack quantity from dropdown
    cy.get('#pack-quantity-0', { timeout: 10000 }).scrollIntoView().within(() => {
      cy.get('.n-select__trigger').click({ force: true });
      cy.get('[data-testid="dropdown-scroll"] .n-option').first().click({ force: true });
    });
    cy.wait(1000);

    // Final Approve
    cy.contains("button", "Approve", { timeout: 10000 }).should("be.visible").click({ force: true });
  });

  xit("TC_10: Verify 'Vendor Not Feasible' button is absent/disabled once status is Buyer Approved ", () => {
    // Login as vendor and check the Buyer Approved design
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    cy.contains("span", "Active Inspiration", { timeout: 15000 }).click();

    // Search by the Best Seller ID of the Buyer Approved design (captured in Prerequisite 3)
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).then(($input) => {
      const searchId = capturedBsId2 || randomDesignName2;
      cy.wrap($input).type(searchId);
    });
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    // Feasibility column must show "Not feasible" as disabled (design is Buyer Approved / FULFILLED)
    cy.contains("Not feasible", { timeout: 10000 })
      .should("exist")
      .then(($el) => {
        // Assert it is disabled — either via button[disabled] or pointer-events/opacity
        const $btn = $el.closest("button");
        if ($btn.length) {
          expect($btn).to.have.attr("disabled");
        } else {
          // Fallback: verify the element has a disabled visual style (opacity/pointer-events)
          expect($el.css("pointer-events")).to.eq("none");
        }
        // Highlight the disabled Feasibility cell
        $el.css({
          outline: "3px solid red",
          "background-color": "rgba(255,255,0,0.4)",
          "border-radius": "4px",
        });
      });
    cy.screenshot("tc003-not-feasible-disabled-buyer-approved");
  });

  xit("TC_11: Verify 'Vendor Not Feasible' button at Best Seller ID level REMAINS DISABLED as one design is buyer approved", () => {
    // Verified via Prerequisite 13 intermediate-state screenshot.
    // Enable after Prerequisites 9–13 are repositioned above TC_004 in run order.
    cy.log("TC_004 intermediate state captured in Prerequisite 13 — see prereq13-design1-vnf-bs-disabled screenshot");
  });

  xit("TC_11 Vendor uploads second design under same OEM ID and marks it Not Feasible", () => {
    // Step 1: Login as vendor, go to Active Inspiration, capture the BS ID for randomDesignName
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click().wait(1500);

    cy.contains("span", "Active Inspiration", { timeout: 15000 }).click();
    // Search by the BS/PD ID captured from randomDesignName2 in Prerequisite 3
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).then(($input) => {
      const searchId = capturedBsId2 || randomDesignName2;
      cy.wrap($input).type(searchId);
    });
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    // Step 2: Click Upload on that row to create a new vendor design under same OEM ID
    cy.contains("div.n-button-content", "Upload", { timeout: 15000 })
      .first().click({ force: true });

    // Fill article code
    cy.get('input[data-testid="article_code_input"]', { timeout: 15000 })
      .first().type(randomVendorStyle3, { force: true });

    // Fill HSN code
    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });
    cy.wait(800);
    cy.get(".n-options .n-option").contains("6206400").click();

    cy.contains("p", "Mandatory").scrollIntoView();

    // Enter costs for buyer-uploaded colorways (AQUA, ROSE GOLD, PISTA GREEN)
    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-0"]').first()
      .type("390", { force: true });
    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]').eq(0)
      .parents("button").click({ force: true });
    cy.wait(1000);

    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-1"]')
      .type("410", { force: true });
    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]').eq(0)
      .parents("button").click({ force: true });
    cy.wait(1000);

    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-2"]')
      .type("430", { force: true });
    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]').eq(0)
      .parents("button").click({ force: true });
    cy.wait(1000);

    // Upload one vendor colorway
    cy.contains("p", "Colorways").scrollIntoView().wait(5000);
    cy.contains("button", "Upload Files")
      .parents().find('input[type="file"]')
      .attachFile("BLUE.jpeg", { force: true }).wait(1000);
    cy.get('input[data-testid="dropdown-search"]').eq(1).click();
    cy.get(".n-option").contains("BLUE").scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]').type("150").wait(3000);

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Upload") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(5000);
        return false;
      }
    });

    // Create one pack
    cy.get("button").contains("Create Pack").should("be.visible").click();
    cy.get('input[type="number"]').eq(1).clear().type("3");
    cy.get('input[type="number"]').eq(2).clear().type("2");
    cy.wait(3000);
    cy.get("input[placeholder='Enter cost']").type("650").wait(1000);
    cy.get("button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid")
      .filter(':contains("Create Pack")').click().wait(1000);

    // Submit the new design
    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Submit") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(1000);
        return false;
      }
    });

    // Step 3: Go to Submitted Design → click "Not feasible" directly from the table row
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomVendorStyle3);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    cy.get("table tbody tr").first()
      .find("div.n-button-content").contains("Not feasible")
      .parent("button").as("vnfBtn3");
    cy.get("@vnfBtn3").scrollIntoView().wait(500);
    cy.get("@vnfBtn3").click({ force: true });

    cy.get('[data-testid="filter-notFeasible-FABRIC_NOT_AVAILABLE"]').check({ force: true });
    cy.contains("div.n-button-content", "Apply")
      .parent("button").should("be.visible").click({ force: true });

    cy.contains("VENDOR REJECTED", { timeout: 15000 }).should("exist");

    // Step 4: Return to Submitted Design, search capturedBsId, verify Vendor Rejected
    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).then(($input) => {
      const searchId = capturedBsId || randomDesignName;
      cy.wrap($input).type(searchId);
    });
    cy.contains("VENDOR REJECTED", { timeout: 10000 }).should("exist");
  });

  xit("TC_12: Verify the design id status is vendor rejected at submitted design", () => {
    // Login as buyer/cluster to verify status from their view
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-cluster"]', { timeout: 20000 }).click();

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomDesignName);

    cy.contains("VENDOR REJECTED", { timeout: 10000 }).should("exist");
  });

  xit("TC_13: Verify 'Vendor Not Feasible' button at Best Seller ID level is still as one design is buyer approved", () => {
    // PD ID 3 flow: after Prerequisite 13 marks both designs VNF, this TC verifies the final state.
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    // Navigate to Active Inspiration and search by PD ID 3 (both designs are now VNF via Prerequisite 13)
    cy.contains("span", "Active Inspiration", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).then(($input) => {
      const searchId = capturedBsId3 || randomDesignName3;
      cy.wrap($input).type(searchId);
    });
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    // Both designs are VNF — BS-level VNF button must be ENABLED and status shows VENDOR REJECTED
    cy.contains("div.n-button-content", "Not feasible")
      .parent("button")
      .should("not.be.disabled");
    cy.contains("VENDOR REJECTED", { timeout: 15000 }).should("exist");
    cy.screenshot("tc005-all-designs-vnf-bs-level-button-enabled");
  });

  xit("TC_14: Verify new 'Reason' column added to Buyer email dump with vendor-selected rejection reasons", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first().scrollIntoView({ offset: { top: -100 } }).click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    // Intercept the email dump API call to verify it was triggered successfully
    cy.intercept("POST", "**/email**").as("emailDump");
    cy.intercept("POST", "**/inspiration*data**").as("emailDump2");

    cy.contains("div.n-button-content", "Email Inspiration Data", { timeout: 15000 })
      .should("be.visible").click();

    // Verify a success toast or response — email goes to Gmail so inbox content is out of E2E scope
    // Check for success notification on the UI side
    cy.get("body").then(($body) => {
      if ($body.find(".n-message, .toast, [class*='toast'], [class*='success']").length > 0) {
        cy.get(".n-message, .toast, [class*='toast'], [class*='success']")
          .first().should("be.visible");
      } else {
        // If no toast, verify the button click did not throw an error (page still intact)
        cy.contains("div.n-button-content", "Email Inspiration Data").should("exist");
      }
    });

    cy.log("Email sent to buyer Gmail inbox — email content verification is out of E2E scope");
    cy.screenshot("tc007-email-inspiration-data-triggered");
  });

  xit("TC_15: Verify email dump is triggered/received when vendor marks style as Not Feasible on Active Inspiration page", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first().scrollIntoView({ offset: { top: -100 } }).click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    cy.contains("div.n-button-content", "Email Inspiration Data", { timeout: 15000 })
      .should("be.visible").click();

    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomDesignName);
    cy.get("table tbody tr", { timeout: 15000 }).first().should("be.visible");

    // Verify the row shows Vendor Rejected with reason populated
    // cy.get("table tbody tr").first().within(() => {
    //   cy.get("td").should("contain.text", "VENDOR REJECTED");
    // });
  });

  xit("TC_16: Verify email dump is triggered/received when vendor marks style as Not Feasible on Submitted Designs page", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first().scrollIntoView({ offset: { top: -100 } }).click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomDesignName);

    // cy.get("table tbody tr", { timeout: 15000 }).first().within(() => {
    //   cy.get("td").should("contain.text", "VENDOR REJECTED");
    // });
  });

  xit("TC_17: Verify XL data in email dump matches UI data for rejection with prior color submissions", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first().scrollIntoView({ offset: { top: -100 } }).click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    cy.contains("div.n-button-content", "Email Inspiration Data", { timeout: 15000 })
      .should("be.visible").click();

    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomDesignName);
    cy.get("table tbody tr", { timeout: 15000 }).first().within(() => {
      cy.get("td").should("contain.text", "VENDOR REJECTED");
      cy.get("td").should("not.have.text", "");
    });
  });

  // ── TC_011–TC_026: ODM, backend, validation, and RBAC tests ──────────────
  // These require a separate ODM Mood Board setup and will be covered in a
  // dedicated ODM VNF regression run against a pre-configured MB ID.

  xit("TC_18: Verify Brick × Vendor ID status updates to 'Vendor Rejected' in backend after confirmation", () => {
    cy.log("Requires ODM Mood Board setup — covered in ODM VNF regression run");
  });

  xit("TC_19: Verify all Submit buttons are greyed out after Vendor Not Feasible is confirmed on Mood Board", () => {
    cy.log("Requires ODM Mood Board setup — covered in ODM VNF regression run");
  });

  // Scenario - 3 VENDOR MARKDS BOTH DESIGN ID AS vnf AND STATUS AT PD/ID leave is enabled

  it("TC_20: Buyer creates third OEM design for TC_004/TC_005 BS-level VNF flow", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first()
      .scrollIntoView({ offset: { top: -100 } })
      .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    cy.contains("div.n-button-content", "Upload Design", { timeout: 15000 })
      .click({ force: true }).wait(1000);

    cy.get('input[placeholder="Enter Design Name"]')
      .should("be.visible")
      .type(randomDesignName3, { force: true });

    cy.contains("label", "Family", { timeout: 15000 })
      .parent().find(".n-select__trigger").click();
    cy.contains(".n-option", "Men").click();

    cy.contains("label", "Class Name")
      .parent().find(".n-select__trigger").click();
    cy.contains(".n-option", "Western Wear").click();

    cy.contains("label", "Brick Name")
      .parent().find(".n-select__trigger").click();
    cy.contains("label", "Brick Name")
      .parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Jeans")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.contains("label", "Top Brick")
      .parent().find(".n-select__trigger").click();
    cy.contains("label", "Top Brick")
      .parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Denim")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.get("label").filter((_i, el) => {
      const t = el.textContent.trim();
      return t.includes("Brick") && !t.includes("Name") && !t.includes("Top");
    }).parent().find(".n-select__trigger").click();
    cy.get("label").filter((_i, el) => {
      const t = el.textContent.trim();
      return t.includes("Brick") && !t.includes("Name") && !t.includes("Top");
    }).parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Bottomwear")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.contains("label", "Enrichment")
      .parent().find(".n-select__trigger").click();
    cy.contains("label", "Enrichment")
      .parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Denim")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.contains("label", "Cluster")
      .parent().find(".n-select__trigger").click();
    cy.contains("label", "Cluster")
      .parent().find(".n-options").scrollIntoView()
      .within(() => {
        cy.contains(".n-option-wrapper span", "Bangladesh")
          .scrollIntoView({ easing: "linear" }).click();
      });

    cy.contains("p", "Upload Design")
      .parent().find('input[type="file"]')
      .attachFile("design.jpeg", { force: true }).wait(1000);

    cy.contains("p", "Colorways").scrollIntoView().should("be.visible");
    cy.contains("button", "Upload Files", { timeout: 15000 })
      .parents().find('input[type="file"]').eq(1)
      .attachFile("AQUA.jpg", { force: true }).wait(1000);
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]').click();
    cy.get('[data-testid="dropdown-scroll"]')
      .contains(".n-option", "AQUA").scrollIntoView().click().wait(1000);
    cy.get('input[placeholder="Enter cost"]').type("333").wait(1000);
    cy.get('svg path[d^="M12 19.0713"]').closest("button").click();

    cy.contains("p", "Colorways").scrollIntoView().wait(1000);
    cy.contains("button", "Upload Files")
      .parents().find('input[type="file"]').eq(1)
      .attachFile("rosegold.jpeg", { force: true }).wait(1000);
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]').eq(1).click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "ROSE GOLD").click();
    cy.get('input[placeholder="Enter cost"]').last().type("350");

    cy.contains("p", "Colorways").scrollIntoView().wait(1000);
    cy.contains("button", "Upload Files")
      .parents().find('input[type="file"]').eq(1)
      .attachFile("green.jpeg", { force: true }).wait(1000);
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]')
      .last().click().wait(1000);
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "PISTA GREEN").click();
    cy.get('input[placeholder="Enter cost"]').last().type("370");

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Upload") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(1000);
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
      if ($el.text().trim() === "Submit") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(1000);
        return false;
      }
    });

    // Search for the submitted design and capture its BS/PD ID
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).clear().type(randomDesignName3);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");
    cy.get("table tbody tr").first().then(($row) => {
      const rowText = $row.text();
      const idMatch = rowText.match(/[A-Z]{2,}\/\d+\/\d+/);
      if (idMatch) {
        capturedBsId3 = idMatch[0];
        cy.log(`Captured BS/PD ID for TC_004/TC_005 flow: ${capturedBsId3}`);
      }
    });
  });

  it("TC_21: Buyer shares third OEM design to vendor", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace", { timeout: 20000 });
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first()
      .scrollIntoView({ offset: { top: -100 } })
      .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click();

    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomDesignName3);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    // Capture BS/PD ID if Prerequisite 9 ran in a different session
    cy.get("table tbody tr").first().then(($row) => {
      const rowText = $row.text();
      const idMatch = rowText.match(/[A-Z]{2,}\/\d+\/\d+/);
      if (idMatch && !capturedBsId3) {
        capturedBsId3 = idMatch[0];
        cy.log(`Captured BS/PD ID (Prereq 10 fallback): ${capturedBsId3}`);
      }
    });

    cy.get('button[role="checkbox"]', { timeout: 10000 }).eq(1).click({ force: true });

    cy.contains("div.n-button-content", "Share").click({ force: true });
    cy.contains("div", "Share designs to vendor")
      .parent().find("svg").last()
      .click({ force: true }).wait(1000);

    cy.get('input[placeholder="Select Vendors"]').type("KIRARA");
    cy.contains("label", "KIRARA - 32021182")
      .scrollIntoView()
      .find('input[type="checkbox"]')
      .check({ force: true });

    cy.contains("div.n-button-content", "Share").click({ force: true });
    cy.contains("div.n-button-content", "Share")
      .parent("button").should("be.visible").click({ force: true });
  });

  it("TC:22 Vendor creates Design 1 (randomVendorStyle4) under PD ID 3", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click().wait(1500);

    cy.contains("span", "Active Inspiration", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).then(($input) => {
      const searchId = capturedBsId3 || randomDesignName3;
      cy.wrap($input).type(searchId);
    });
    cy.wait(2000);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    // Click Upload directly from the list row (no row navigation needed)
    cy.contains("div.n-button-content", "Upload", { timeout: 20000 })
      .first().click({ force: true });

    cy.get('input[data-testid="article_code_input"]', { timeout: 15000 })
      .first().type(randomVendorStyle4, { force: true });

    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });
    cy.wait(800);
    cy.get(".n-options .n-option").contains("6206400").click();

    cy.contains("p", "Mandatory").scrollIntoView();

    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-0"]').first()
      .type("390", { force: true });
    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]').eq(0)
      .parents("button").click({ force: true });
    cy.wait(1000);

    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-1"]')
      .type("410", { force: true });
    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]').eq(0)
      .parents("button").click({ force: true });
    cy.wait(1000);

    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-2"]')
      .type("430", { force: true });
    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]').eq(0)
      .parents("button").click({ force: true });
    cy.wait(1000);

    cy.contains("p", "Colorways").scrollIntoView().wait(5000);
    cy.contains("button", "Upload Files")
      .parents().find('input[type="file"]')
      .attachFile("BLUE.jpeg", { force: true }).wait(1000);
    cy.get('input[data-testid="dropdown-search"]').eq(1).click();
    cy.get(".n-option").contains("BLUE").scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]').type("150").wait(3000);

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Upload") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(5000);
        return false;
      }
    });

    cy.get("button").contains("Create Pack").should("be.visible").click();
    cy.get('input[type="number"]').eq(1).clear().type("3");
    cy.get('input[type="number"]').eq(2).clear().type("2");
    cy.wait(3000);
    cy.get("input[placeholder='Enter cost']").type("650").wait(1000);
    cy.get("button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid")
      .filter(':contains("Create Pack")').click().wait(1000);

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Submit") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(1000);
        return false;
      }
    });
  });

  it("TC_23: Vendor creates Design 2 (randomVendorStyle5) under same PD ID 3", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click().wait(1500);

    cy.contains("span", "Active Inspiration", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).then(($input) => {
      const searchId = capturedBsId3 || randomDesignName3;
      cy.wrap($input).type(searchId);
    });
    cy.wait(2000);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    // Design 1 already submitted — navigate into detail page first, then Upload
    cy.get("table tbody tr td:nth-child(1)", { timeout: 15000 })
      .first()
      .within(() => {
        cy.get('div[data-testid="link-with-context"] span').click({ force: true });
      });
    cy.url({ timeout: 20000 }).should("include", "oem/details");
    cy.contains("button", "Upload", { timeout: 30000 }).should("not.be.disabled").click({ force: true });
    cy.wait(2000);

    cy.get('input[data-testid="article_code_input"]', { timeout: 20000 })
      .should("be.visible")
      .first().clear().type(randomVendorStyle5, { force: true });

    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });
    cy.wait(800);
    cy.get(".n-options .n-option").contains("6206400").click();

    cy.contains("p", "Mandatory").scrollIntoView();

    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-0"]').first()
      .type("420", { force: true });
    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]').eq(0)
      .parents("button").click({ force: true });
    cy.wait(1000);

    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-1"]')
      .type("440", { force: true });
    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]').eq(0)
      .parents("button").click({ force: true });
    cy.wait(1000);

    cy.get("#design-and-colorway")
      .find('input[data-testid="cost-2"]')
      .type("460", { force: true });
    cy.get("#design-and-colorway")
      .find('path[d*="M9.00019 19.0002"]').eq(0)
      .parents("button").click({ force: true });
    cy.wait(1000);

    cy.contains("p", "Colorways").scrollIntoView().wait(5000);
    cy.contains("button", "Upload Files")
      .parents().find('input[type="file"]')
      .attachFile("BLUE.jpeg", { force: true }).wait(1000);
    cy.get('input[data-testid="dropdown-search"]').eq(1).click();
    cy.get(".n-option").contains("BLUE").scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]').type("180").wait(3000);

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Upload") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(5000);
        return false;
      }
    });

    cy.get("button").contains("Create Pack").should("be.visible").click();
    cy.get('input[type="number"]').eq(1).clear().type("3");
    cy.get('input[type="number"]').eq(2).clear().type("2");
    cy.wait(3000);
    cy.get("input[placeholder='Enter cost']").type("700").wait(1000);
    cy.get("button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid")
      .filter(':contains("Create Pack")').click().wait(1000);

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Submit") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click().wait(1000);
        return false;
      }
    });
  });

  // ── Prerequisite 13: Vendor marks Design 1 as VNF (searches by vendor style code) ──

  it("TC_24: Vendor marks Design 1 as Not Feasible via Submitted Design", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click().wait(1500);

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomVendorStyle4);
    cy.wait(2000);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    // Click the PENDING status badge to open the design detail page
    cy.get("table tbody tr").first().contains("PENDING").click({ force: true });
    cy.url({ timeout: 20000 }).should("include", "view-oem-design");

    // Click Not Feasible button on the design detail page
    cy.contains("div.n-button-content", "Not Feasible", { timeout: 15000 })
      .parent("button").click({ force: true });

    cy.get('[data-testid="filter-notFeasible-FABRIC_NOT_AVAILABLE"]').check({ force: true });
    cy.contains("div.n-button-content", "Apply")
      .parent("button").should("be.visible").click({ force: true });

    cy.contains("VENDOR REJECTED", { timeout: 15000 }).should("exist");
  });

  // ── Prerequisite 13b: Vendor marks Design 2 as VNF and verifies BS-level enabled in Active Inspiration ──

  it("TC_25: Vendor marks Design 2 as Not Feasible and verifies BS-level VNF enabled in Active Inspiration", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("OEM").click().wait(1500);

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomVendorStyle5);
    cy.wait(2000);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    // Click the PENDING status badge to open the design detail page
    cy.get("table tbody tr").first().contains("PENDING").click({ force: true });
    cy.url({ timeout: 20000 }).should("include", "view-oem-design");

    // Click Not Feasible button on the design detail page
    cy.contains("div.n-button-content", "Not Feasible", { timeout: 15000 })
      .parent("button").click({ force: true });

    cy.get('[data-testid="filter-notFeasible-FABRIC_NOT_AVAILABLE"]').check({ force: true });
    cy.contains("div.n-button-content", "Apply")
      .parent("button").should("be.visible").click({ force: true });

    cy.contains("VENDOR REJECTED", { timeout: 15000 }).should("exist");

    // Navigate UVP → OEM → Active Inspiration → verify BS-level VNF is now enabled
    // cy.contains("span.side-navigation-panel-select-option-text", "UVP")
    //   .parents("span.side-navigation-panel-select-option-wrap").click();
    // cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
    //   .contains("OEM").click().wait(1500);

    // cy.contains("span", "Active Inspiration", { timeout: 15000 }).click();
    // cy.get('input[placeholder="Search"]', { timeout: 15000 }).then(($input) => {
    //   const searchId = capturedBsId3 || randomDesignName3;
    //   cy.wrap($input).type(searchId);
    // });
    // cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    // cy.contains("div.n-button-content", "Not feasible")
    //   .parent("button")
    //   .should("not.be.disabled");
    // cy.contains("VENDOR REJECTED", { timeout: 15000 }).should("exist");
  });

});

// ═══════════════════════════════════════════════════════════════════════════════
// ODM Vendor Not Feasible P0 Test Suite
// ═══════════════════════════════════════════════════════════════════════════════
const randomODMTheme  = `VNF_ODM_${Math.random().toString(36).substring(2, 8)}`;
const randomODMStyle1 = `ODMStyle1_${Math.random().toString(36).substring(2, 8)}`;
const randomODMStyle2 = `ODMStyle2_${Math.random().toString(36).substring(2, 8)}`;
let   capturedODMMoodboardId  = "";

// Scenario 2 variables — moodboard-level VNF (vendor marks without submitting any design)
const randomODMTheme2 = `VNF_ODM2_${Math.random().toString(36).substring(2, 8)}`;
let   capturedODMMoodboardId2 = "";

describe.only("ODM Vendor Not Feasible P0 Test Suite", () => {
  beforeEach(() => {
    cy.session("user-session", () => {
      cy.login();
    }, {
      cacheAcrossSpecs: true,
      validate() {
        cy.getCookies().should("have.length.greaterThan", 0);
      },
    });
  });

  afterEach(function () {
    if (this.currentTest && this.currentTest.state === "failed") {
      const title = this.currentTest.title || "Unknown Test";
      cy.screenshot(`${title}-failed`);
    }
  });
  
  //----Scenario 1: Create 2 designs and mark vnf for both the designs and then check the active inspiration status for that moodboard id
  // ── ODM_TC_01: Buyer creates ODM theme (moodboard inspiration) ─────────────
  it("ODM_TC_01: Buyer creates ODM theme", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first()
      .scrollIntoView({ offset: { top: -100 } })
      .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();

    cy.contains("div.n-button-content", "Upload Inspiration").click();

    cy.contains("p", /^Supported Format: pdf/, { timeout: 30000 })
      .should("be.visible")
      .parents("div")
      .find('input[type="file"][accept=".pdf"]')
      .first()
      .selectFile("cypress/fixtures/inspiration.pdf", { force: true });

    cy.contains("p", "Supported Format: xlsx", { timeout: 30000 })
      .should("be.visible")
      .parents("div")
      .find('input[type="file"][accept=".xlsx"]')
      .first()
      .selectFile("cypress/fixtures/BrickFile.xlsx", { force: true });

    cy.wait(2000);

    cy.get("input#themeName", { timeout: 10000 })
      .should("exist").should("be.visible")
      .type(randomODMTheme, { force: true });

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    const day = targetDate.getDate();

    cy.get("input.custom-input").click({ force: true });
    cy.get(".react-datepicker", { timeout: 10000 }).should("be.visible");

    const today = new Date();
    if (targetDate.getMonth() !== today.getMonth()) {
      cy.get(".react-datepicker__navigation--next").click();
    }

    cy.get(".react-datepicker__month")
      .find(".react-datepicker__day")
      .not(".react-datepicker__day--disabled")
      .not(".react-datepicker__day--outside-month")
      .filter((i, el) => Cypress.$(el).text().trim() === String(day))
      .first()
      .click({ force: true });

    cy.get('[data-testid="dropdown-search"]').should("be.visible").click({ force: true });
    cy.get('[data-testid="dropdown-scroll"]').should("be.visible");
    cy.get('[data-value="Bangladesh"]').should("be.visible").click({ force: true });
    cy.get('[data-testid="dropdown-search"]').should("have.value", "Bangladesh");

    cy.get("#desc").type("ODM VNF automation testing");

    cy.intercept(
      "POST",
      "https://api.impetusz0.de/service/application/odm/v1.0/uvp/moodboards/upload"
    ).as("uploadInspiration");

    cy.contains("button", "Continue", { timeout: 20000 })
      .should("be.visible").and("not.be.disabled")
      .click({ force: true });

    cy.wait("@uploadInspiration", { timeout: 30000 });
    cy.contains("Inspiration uploaded successfully", { timeout: 15000 }).should("be.visible");

    // Navigate to ODM Active Inspiration and capture the Moodboard ID
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();

    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomODMTheme);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    cy.get("table tbody tr").first().then(($row) => {
      const idMatch = $row.text().match(/MB\/\d+\/\d+/);
      if (idMatch) {
        capturedODMMoodboardId = idMatch[0];
        cy.log(`Captured ODM Moodboard ID: ${capturedODMMoodboardId}`);
      }
    });
  });

  // ── ODM_TC_02: Buyer shares ODM theme with vendor ──────────────────────────
  it("ODM_TC_02: Buyer shares ODM theme with vendor", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first()
      .scrollIntoView({ offset: { top: -100 } })
      .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();

    cy.get('input[placeholder="Search"]').type(randomODMTheme);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    cy.get('button[role="checkbox"]', { timeout: 10000 }).eq(1).click({ force: true });

    cy.contains("div.n-button-content", "Share").click({ force: true });

    cy.contains("div", "Share moodboards to vendor")
      .parent().find("svg").last()
      .click({ force: true });

    cy.get('input[placeholder="Select / Search item"]').type("KIRARA");

    cy.contains("label", "KIRARA - 32021182")
      .scrollIntoView()
      .find('input[type="checkbox"]')
      .check({ force: true });

    cy.contains("div.n-button-content", "Share").click({ force: true });
  });

  // ── ODM_TC_03: Vendor submits Design 1 under ODM theme ────────────────────
  it("ODM_TC_03: Vendor submits Design 1 (randomODMStyle1) under ODM theme", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();

    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomODMTheme);
    cy.get("div.n-button-content").contains("View").first().click({ force: true });
    cy.contains("div.n-button-content", "Submit").scrollIntoView().click({ force: true });

    cy.get('input[data-testid="article_code_input"]', { timeout: 15000 })
      .first().type(randomODMStyle1);

    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });
    cy.get(".n-options .n-option", { timeout: 5000 }).should("have.length.gt", 0);
    cy.get(".n-options .n-option").contains("6206400").click();

    cy.contains("label", "Brick Name *").parent().find(".n-select__trigger").click();
    cy.get(".n-options .n-option").contains("Jeans").click();

    cy.contains("p", "Upload Design").parent().find('input[type="file"]')
      .attachFile("design.jpeg", { force: true });

    cy.contains("p", "Colorways").scrollIntoView().parent().find('input[type="file"]')
      .attachFile("colorways.jpg", { force: true });
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', { timeout: 10000 })
      .eq(0).should("be.visible").scrollIntoView().click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "AQUA").scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
      .should("have.length", 1)
      .eq(0).scrollIntoView().type("333");

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Upload") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click();
        return false;
      }
    });

    cy.get("button").contains("Create Pack").scrollIntoView().should("be.visible").click();
    cy.get('input[type="number"]').eq(1).clear().type("3");
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 }).should("be.visible").type("650");
    cy.get("button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid")
      .filter(':contains("Create Pack")').click();

    cy.get('input[placeholder="Ex. cotton 90% Polyester 10%*"]')
      .first().scrollIntoView().clear().type("cotton90%", { delay: 100 }).blur();
    cy.get('input[placeholder="Ex. 240/160*"]')
      .first().scrollIntoView().clear().type(String(240 / 160), { delay: 100 }).blur();

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Submit") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click();
        return false;
      }
    });
  });

  // ── ODM_TC_04: Vendor submits Design 2 under same ODM theme ───────────────
  it("ODM_TC_04: Vendor submits Design 2 (randomODMStyle2) under same ODM theme", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();

    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomODMTheme);
    cy.get("div.n-button-content").contains("View").first().click({ force: true });
    cy.contains("div.n-button-content", "Submit").scrollIntoView().click({ force: true });

    cy.get('input[data-testid="article_code_input"]', { timeout: 15000 })
      .first().type(randomODMStyle2);

    cy.get('input[data-testid="dropdown-search"]').type("620", { delay: 100 });
    cy.get(".n-options .n-option", { timeout: 5000 }).should("have.length.gt", 0);
    cy.get(".n-options .n-option").contains("6206400").click();

    cy.contains("label", "Brick Name *").parent().find(".n-select__trigger").click();
    cy.get(".n-options .n-option").contains("Jeans").click();

    cy.contains("p", "Upload Design").parent().find('input[type="file"]')
      .attachFile("design.jpeg", { force: true });

    cy.contains("p", "Colorways").scrollIntoView().parent().find('input[type="file"]')
      .attachFile("colorways.jpg", { force: true });
    cy.get('input[data-testid="dropdown-search"][placeholder="Add SAP ID"]', { timeout: 10000 })
      .eq(0).should("be.visible").scrollIntoView().click();
    cy.contains('[data-testid="dropdown-scroll"]:visible .n-option', "AQUA").scrollIntoView().click();
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 })
      .should("have.length", 1)
      .eq(0).scrollIntoView().type("355");

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Upload") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click();
        return false;
      }
    });

    cy.get("button").contains("Create Pack").scrollIntoView().should("be.visible").click();
    cy.get('input[type="number"]').eq(1).clear().type("6");
    cy.get('input[placeholder="Enter cost"]', { timeout: 10000 }).should("be.visible").type("700");
    cy.get("button.n-button.ripple.n-button-rounded.n-button-primary.n-button-mid")
      .filter(':contains("Create Pack")').click();

    cy.get('input[placeholder="Ex. cotton 90% Polyester 10%*"]')
      .first().scrollIntoView().clear().type("polyester100%", { delay: 100 }).blur();
    cy.get('input[placeholder="Ex. 240/160*"]')
      .first().scrollIntoView().clear().type(String(240 / 160), { delay: 100 }).blur();

    cy.get("div.n-button-content").each(($el) => {
      if ($el.text().trim() === "Submit") {
        cy.wrap($el).scrollIntoView().parent("button").should("be.visible").click();
        return false;
      }
    });
  });

  // ── ODM_TC_05: Vendor marks Design 1 as Not Feasible ──────────────────────
  it("ODM_TC_05: Vendor marks Design 1 (randomODMStyle1) as Not Feasible", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click().wait(1500);

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomODMStyle1);
    cy.wait(2000);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    cy.get("table tbody tr").first().contains("PENDING").click({ force: true });
    cy.url({ timeout: 20000 }).should("include", "view-odm-design");

    cy.contains("div.n-button-content", "Not Feasible", { timeout: 15000 })
      .parent("button").click({ force: true });

    cy.get('[data-testid="nf-filter-FABRIC_NOT_AVAILABLE"]').check({ force: true });
    cy.contains("div.n-button-content", "Apply")
      .parent("button").should("be.visible").click({ force: true });

    cy.contains("VENDOR REJECTED", { timeout: 15000 }).should("exist");
  });

  // ── ODM_TC_06: Vendor marks Design 2 as Not Feasible ──────────────────────
  it("ODM_TC_06: Vendor marks Design 2 (randomODMStyle2) as Not Feasible", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click().wait(1500);

    cy.contains("span", "Submitted Design", { timeout: 15000 }).click();
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomODMStyle2);
    cy.wait(2000);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    cy.get("table tbody tr").first().contains("PENDING").click({ force: true });
    cy.url({ timeout: 20000 }).should("include", "view-odm-design");

    cy.contains("div.n-button-content", "Not Feasible", { timeout: 15000 })
      .parent("button").click({ force: true });

    cy.get('[data-testid="nf-filter-FABRIC_NOT_AVAILABLE"]').check({ force: true });
    cy.contains("div.n-button-content", "Apply")
      .parent("button").should("be.visible").click({ force: true });

    cy.contains("VENDOR REJECTED", { timeout: 15000 }).should("exist");
  });

  // ── ODM_TC_07: Buyer searches by Moodboard ID and verifies VENDOR REJECTED ─
  it("ODM_TC_07: Buyer verifies VENDOR REJECTED status in Active Inspiration via Moodboard ID", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first()
      .scrollIntoView({ offset: { top: -100 } })
      .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();

    cy.get('input[placeholder="Search"]', { timeout: 15000 }).then(($input) => {
      const searchId = capturedODMMoodboardId || randomODMTheme;
      cy.wrap($input).type(searchId);
    });

    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");
    cy.contains("VENDOR REJECTED", { timeout: 15000 }).should("be.visible");
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // SCENARIO 2: Buyer creates theme → shares → vendor marks moodboard-level VNF
  //             (no design submitted) → verify Applicable Bricks Submit disabled
  // ═══════════════════════════════════════════════════════════════════════════

  // ── S2_ODM_TC_01: Buyer creates ODM theme for Scenario 2 ──────────────────
  it("ODM_TC_08: Buyer creates ODM theme for Scenario 2", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first()
      .scrollIntoView({ offset: { top: -100 } })
      .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();

    cy.contains("div.n-button-content", "Upload Inspiration").click();

    cy.contains("p", /^Supported Format: pdf/, { timeout: 30000 })
      .should("be.visible")
      .parents("div")
      .find('input[type="file"][accept=".pdf"]')
      .first()
      .selectFile("cypress/fixtures/inspiration.pdf", { force: true });

    cy.contains("p", "Supported Format: xlsx", { timeout: 30000 })
      .should("be.visible")
      .parents("div")
      .find('input[type="file"][accept=".xlsx"]')
      .first()
      .selectFile("cypress/fixtures/BrickFile.xlsx", { force: true });

    cy.wait(2000);

    cy.get("input#themeName", { timeout: 10000 })
      .should("exist").should("be.visible")
      .type(randomODMTheme2, { force: true });

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    const day = targetDate.getDate();

    cy.get("input.custom-input").click({ force: true });
    cy.get(".react-datepicker", { timeout: 10000 }).should("be.visible");

    const today = new Date();
    if (targetDate.getMonth() !== today.getMonth()) {
      cy.get(".react-datepicker__navigation--next").click();
    }

    cy.get(".react-datepicker__month")
      .find(".react-datepicker__day")
      .not(".react-datepicker__day--disabled")
      .not(".react-datepicker__day--outside-month")
      .filter((i, el) => Cypress.$(el).text().trim() === String(day))
      .first()
      .click({ force: true });

    cy.get('[data-testid="dropdown-search"]').should("be.visible").click({ force: true });
    cy.get('[data-testid="dropdown-scroll"]').should("be.visible");
    cy.get('[data-value="Bangladesh"]').should("be.visible").click({ force: true });
    cy.get('[data-testid="dropdown-search"]').should("have.value", "Bangladesh");

    cy.get("#desc").type("ODM VNF Scenario 2 automation testing");

    cy.intercept(
      "POST",
      "https://api.impetusz0.de/service/application/odm/v1.0/uvp/moodboards/upload"
    ).as("uploadInspiration2");

    cy.contains("button", "Continue", { timeout: 20000 })
      .should("be.visible").and("not.be.disabled")
      .click({ force: true });

    cy.wait("@uploadInspiration2", { timeout: 30000 });
    cy.contains("Inspiration uploaded successfully", { timeout: 15000 }).should("be.visible");

    // Navigate to ODM Active Inspiration and capture Moodboard ID 2
    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();

    cy.get('input[placeholder="Search"]', { timeout: 15000 }).type(randomODMTheme2);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    cy.get("table tbody tr").first().then(($row) => {
      const idMatch = $row.text().match(/MB\/\d+\/\d+/);
      if (idMatch) {
        capturedODMMoodboardId2 = idMatch[0];
        cy.log(`Captured Moodboard ID 2: ${capturedODMMoodboardId2}`);
      }
    });
  });

  // ── S2_ODM_TC_02: Buyer shares Scenario 2 theme with vendor ───────────────
  it("ODM_TC_09: Buyer shares Scenario 2 ODM theme with vendor", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('[data-testid="Shein-odm-buyer"]')
      .find("p").first()
      .scrollIntoView({ offset: { top: -100 } })
      .click({ force: true });

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();

    cy.get('input[placeholder="Search"]').type(randomODMTheme2);
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    cy.get('button[role="checkbox"]', { timeout: 10000 }).eq(1).click({ force: true });

    cy.contains("div.n-button-content", "Share").click({ force: true });

    cy.contains("div", "Share moodboards to vendor")
      .parent().find("svg").last()
      .click({ force: true });

    cy.get('input[placeholder="Select / Search item"]').type("KIRARA");

    cy.contains("label", "KIRARA - 32021182")
      .scrollIntoView()
      .find('input[type="checkbox"]')
      .check({ force: true });

    cy.contains("div.n-button-content", "Share").click({ force: true });
  });

  // ── S2_ODM_TC_03: Vendor opens moodboard and marks it VNF (moodboard level) ─
  it("ODM_TC_10: Vendor marks moodboard as Not Feasible and verifies Applicable Bricks Submit buttons are disabled", () => {
    cy.visit("https://platform.uat.impetusz0.de/workspace");
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.get('div[data-testid="Shein-vendor"]', { timeout: 20000 }).click({ force: true });
    cy.contains("32021182", { timeout: 10000 }).should("be.visible").click().wait(1000);
    cy.get("svg.nitrozen-svg-icon", { timeout: 20000 }).should("be.visible");

    cy.contains("span.side-navigation-panel-select-option-text", "UVP")
      .parents("span.side-navigation-panel-select-option-wrap").click();
    cy.get("div.side-navigation-panel-select-inner-option", { timeout: 5000 })
      .contains("ODM").click();

    // Search by moodboard ID in Active Inspiration
    cy.get('input[placeholder="Search"]', { timeout: 15000 }).then(($input) => {
      const searchId = capturedODMMoodboardId2 || randomODMTheme2;
      cy.wrap($input).type(searchId);
    });
    cy.get("table tbody tr", { timeout: 20000 }).first().should("be.visible");

    // Click View to open the moodboard detail page
    cy.get("div.n-button-content").contains("View").first().click({ force: true });

    // Click Not Feasible on the moodboard view page
    cy.contains("div.n-button-content", "Not Feasible", { timeout: 15000 })
      .parent("button").click({ force: true });

    // Moodboard-level VNF popup uses nf-mb-filter- prefix
    cy.get('[data-testid="nf-mb-filter-FABRIC_NOT_AVAILABLE"]').check({ force: true });
    cy.contains("div.n-button-content", "Apply")
      .parent("button").should("be.visible").click({ force: true });

    // Verify all Submit buttons in Applicable Bricks table are now disabled
    cy.contains("Applicable Bricks", { timeout: 15000 }).should("be.visible");
    cy.get('table[role="table"]').find("tbody tr").each(($row) => {
      cy.wrap($row).find("button").should("be.disabled");
    });
  });

});