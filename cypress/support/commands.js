// In cypress/support/commands.js
import "@shelex/cypress-allure-plugin";
import "cypress-file-upload";
Cypress.Commands.add("highlight", (el, color = "yellow") => {
  cy.wrap(el).invoke("css", {
    backgroundColor: color,
    border: "2px solid red",
    padding: "2px",
    borderRadius: "3px",
  });
});

Cypress.Commands.add("login", () => {
  const email = Cypress.env("login_email");
  const password = Cypress.env("login_password");
  const loginUrl = Cypress.env("login_url");

  cy.visit(loginUrl);

  cy.wait(30000);

  // ✅ Wait until email input is visible (which means page is ready)
  cy.get('input[data-testid="email"]', { timeout: 20000 }).should("be.visible");

  cy.get('input[data-testid="email"]').type(email);
  cy.get('input[data-testid="password"]').type(password);

  cy.get('button[data-testid="login-CTA"]').should("not.be.disabled").click();

  // ✅ Confirm login success by checking URL or dashboard element
  cy.url().should("not.include", "/auth/login");
});

Cypress.Commands.add("logout", () => {
  cy.visit("https://platform.impetusz0.de/uvp/range-architecture");
  cy.wait(20000);
  cy.contains("div", "SS").click({ force: true });
  cy.contains("div", "Logout").click({ force: true });
  cy.url().should("include", "/login");
});
Cypress.Commands.add("getIframe", (selector) => {
  return cy
    .get(selector)
    .its("0.contentDocument.body")
    .should("not.be.empty")
    .then(cy.wrap);
});

Cypress.Commands.add("verifyText", (selector, expectedText) => {
  cy.get(selector).then(($el) => {
    const actualText = $el.text().trim();
    if (actualText !== expectedText) {
      cy.screenshot("verifyText-failed");
      cy.allure().step(
        `Expected text: "${expectedText}", but found: "${actualText}"`,
        { status: "failed" }
      );
      throw new Error(
        `Mismatch: Expected "${expectedText}", found "${actualText}"`
      );
    }
  });
});

// Cypress.Commands.add("apiLoginAndGetCookie", () => {
//   const username = Cypress.env("login_email");
//   const password = Cypress.env("login_password");

//   if (!username || !password) {
//     throw new Error("login_email or login_password is missing in env");
//   }

//   cy.request({
//     method: "POST",
//     url: "https://api.impetusz0.de/service/panel/users/v1.0/authentication/login/password",
//     headers: {
//       "content-type": "application/json",
//     },
//     body: {
//       username,
//       password,
//     },
//   }).then((response) => {
//     if (response.status !== 200) {
//       throw new Error(`Login API failed with status ${response.status}`);
//     }

//     const setCookie = response.headers["set-cookie"];

//     if (!Array.isArray(setCookie)) {
//       throw new Error("set-cookie header not found");
//     }

//     // ✅ ONLY map, no parsing
//     const cookieHeader = setCookie.map(c => c).join("; ");

//     // ✅ wrap so Cypress can yield it
//     cy.wrap(cookieHeader, { log: false });
//   });
// });

