describe('Impetus Platform — Login Page Tests', () => {
    beforeEach(() => {
        cy.session('user-session', () => {
            cy.login();
        });
    });
    after(() => {
        cy.logout();
    });

    it('logs in successfully with valid credentials and upload inspiration file', () => {
        cy.visit('https://platform.impetusz0.de/workspace');
        cy.wait(20000);
        cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');
        cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).eq(1).click().wait(2000);
        cy.wait(10000);
        cy.contains('span.side-navigation-panel-select-option-text', 'UVP')
            .parents('span.side-navigation-panel-select-option-wrap')
            .click();
        cy.wait(6000);
        cy.get('div.side-navigation-panel-select-inner-option').contains('ODM').click().wait(5000);
        cy.contains('div.n-button-content', 'Upload Inspiration').click();

        // Click "Upload Inspiration"


        // // Click Continue
        // cy.contains('button', 'Continue', { timeout: 20000 }).click({ force: true });

        cy.get('div.sc-crhfPb', { timeout: 60000 }).first().within(() => {
            cy.get('input[type="file"]', { timeout: 60000 }).then(($input) => {
                const fileName = 'testfpt 1 7.pdf'; // exact name in fixtures
                cy.wrap($input).attachFile({
                    filePath: fileName,
                    encoding: 'binary' // important for PDFs
                }, { force: true });
            });
        });
        cy.get('div.sc-etVdmn.kLVQTT', { timeout: 20000 })
            .should('be.visible')
            .within(() => {
                cy.get('p').should('contain.text', 'testfpt 1 7.pdf'); // file name
            });


        // ===== Upload XLSX =====
        cy.get('div.sc-crhfPb', { timeout: 60000 })
            .filter(':contains("Supported Format: xlsx")')  // filter only divs that have XLSX text
            .first() // now we have the correct div
            .within(() => {
                cy.get('input[type="file"]', { timeout: 60000 }).attachFile({
                    filePath: 'BrickFile.xlsx',
                    encoding: 'binary'
                }, { force: true });
            });

        // Validate XLSX filename appears
        cy.get('div.sc-etVdmn.kLVQTT').within(() => {
            cy.get('p').should('contain.text', 'BrickFile.xlsx');
        });

        cy.get('input#themeName', { timeout: 10000 })
            .should('be.visible')
            .type('automationTheem', { force: true });

        // Open the datepicker first
        cy.get('input.custom-input').click({ force: true });

        // Get all enabled dates in the visible month
        cy.get('.react-datepicker__day:not(.react-datepicker__day--disabled)')
            .then(($dates) => {
                // Pick a random date from the available ones
                const randomIndex = Math.floor(Math.random() * $dates.length);
                cy.wrap($dates[randomIndex]).click({ force: true });
            });

        cy.get('#desc').type('this is added for automation testing');

        cy.wait(10000);

        cy.contains('button', 'Continue', { timeout: 20000 }).click({ force: true });


    });


    Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from failing the test
        return false;
    });

});
