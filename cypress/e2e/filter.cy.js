Cypress.on("uncaught:exception", () => false);
describe("RA buyer", () => {
  const pageUrl = "https://platform.impetusz0.de/uvp/range-architecture";

  beforeEach(() => {
    cy.session("user-session", () => {
      cy.login();
    });
  });
  after(() => {
    cy.logout();
  });
  it("After login should be in the select workspace page and click on ODM buuyer", () => {
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
      .contains("ODM")
      .click()
      .wait(10000);
    // Scroll into view and force click just in case
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    const expectedFilters = [
      "Family",
      "Class Name",
      "Brick Name",
      "Top Brick",
      "Enrichment",
      "Shared",
    ]; // verify all the filters
    expectedFilters.forEach((filter) => {
      cy.contains("span", filter);
    });
  });
  it("Apply multiple filters and verify Clear All resets them", () => {
    cy.visit("https://platform.impetusz0.de/uvp/odm");
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    // 1️⃣ Apply all filters
    cy.contains("div", "Family").click();
    cy.get('span[data-testid="n-checkbox-checkbox-0"]').click();

    cy.contains("div", "Class Name").click();
    cy.contains("label", "Inner Wear").click();

    cy.contains("div", "Brick Name").click();
    cy.contains("label", "Briefs").click();

    cy.contains("div", "Top Brick").click();
    cy.contains("label", "Innerwear").click();

    cy.contains("div", "Enrichment").click();
    cy.contains("label", "N/A").click();

    cy.wait(10000);

    // 3️⃣ Click Clear All
    cy.contains("p", "Clear All").click();
  });

  //Own search for each filter
  it("Apply multiple filters and verify Clear All resets them", () => {
    cy.visit("https://platform.impetusz0.de/uvp/odm");
    cy.get('button[data-testid="filter-button"]')
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    // 1️⃣ Apply all filters
    cy.contains("div", "Family").click();
  });
});
