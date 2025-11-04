describe('Impetus Platform — Login Page Tests', () => {
    const loginUrl = Cypress.env('login_url');
    console.log('login', loginUrl)
    const email = Cypress.env('login_email');
    const password = Cypress.env('login_password');

    after(() => {
        cy.logout();
    });
    afterEach(function () {
    cy.screenshot();
    cy.allure().attachment('Screenshot', 'path/to/screenshot.png', 'image/png');
  });
    it('should display login form correctly', () => {
        cy.visit(loginUrl);
        cy.wait(30000);
        cy.contains('label.n-input-label', 'Email ID');
        cy.get('label.n-input-label').contains('Password').should('be.visible');
        cy.contains('button', 'Login').should('be.enabled');     // or .should('be.disabled')
    });

    it('should show error on invalid credentials', () => {
        cy.visit(loginUrl);
        cy.wait(10000);
        cy.get('input[data-testid="email"]').type('Wrongemail');
        cy.get('input[data-testid="password"]').type('Wrong password');
        cy.get('button[data-testid="login-CTA"]').should('not.be.disabled').click();

        // Adjust selector / error text as per actual UI
        cy.contains('div', 'user not found !')
            .should('be.visible')
    });

    it('logs in successfully with valid credentials', () => {
        cy.login();
        cy.wait(10000);
        cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');
        cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).eq(1).click().wait(2000);
        cy.wait(10000);
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from failing the test
        return false;
    });

});
