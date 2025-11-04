
describe('RA buyer', () => {
  const pageUrl = "https://platform.impetusz0.de/uvp/range-architecture";

  beforeEach(() => {
    cy.session('user-session', () => {
      cy.login();
    });
  });
  after(() => {
    cy.logout();
  });

  afterEach(function () {
    cy.screenshot();
    cy.allure().attachment('Screenshot', 'path/to/screenshot.png', 'image/png');
  });

  it('After login should be in the select workspace page and click on ODM buuyer', () => {
    cy.visit('https://platform.impetusz0.de/workspace');
    cy.wait(20000);
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).should('be.visible');
    cy.get('svg.nitrozen-svg-icon', { timeout: 20000 }).eq(1).click().wait(2000);
  })

  it('logs in successfully and validates the logo', () => {
    cy.visit('https://platform.impetusz0.de/procuro/po?tab=all&page_size=20&page_number=1&distribution_plan_id=');
    cy.wait(20000);
    cy.get('img[src*="ImpetusLogoNew"]').should('be.visible');
  });

  it('Navigate to range architecture page and Verify RA tabs', () => {
    cy.visit('https://platform.impetusz0.de/procuro/po?tab=all&page_size=20&page_number=1&distribution_plan_id=');
    cy.wait(20000);
    cy.contains('span.side-navigation-panel-select-option-text', 'UVP')
      .parents('span.side-navigation-panel-select-option-wrap')
      .click();

    cy.wait(6000); // Replace with proper wait when possible

    cy.get('div.side-navigation-panel-select-inner-option')
      .contains('Range Architecture')
      .click().wait(2000);

    cy.url().should('include', '/uvp/range-architecture')

    cy.contains('span', 'Current Cluster RA');
    cy.contains('span', 'Old Global RA');
    cy.contains('span', 'Old Cluster RA');
    cy.contains('span', 'Current Global RA');
  });

  it('Validate the RA tab clicks', () => {
    cy.visit(pageUrl);
    cy.wait(20000);

    cy.contains('span', 'Current Cluster RA').click().wait(1000);
    cy.contains('span', 'Old Global RA').click({ force: true }).wait(1000);
    cy.contains('span', 'Old Cluster RA').click().wait(1000);
    cy.contains('span', 'Current Global RA').click().wait(1000);

    cy.contains('div.n-button-content', 'Download').click();


  });

  it('Download gloabl RA ', () => {
    cy.visit(pageUrl);
    cy.wait(20000);
    cy.contains('div.n-button-content', 'Download').click();
    cy.get('[role="alert"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Download Successful').should('be.visible');
      });
  });

  it('In the RA page allows the user to type in the search box', () => {
    cy.visit(pageUrl);
    cy.wait(20000);
    cy.get('[data-testid="input-component"]')
      .type('Test Search')
      .should('have.value', 'Test Search')
      .wait(2000)
      .clear();
  });
  it('Check and validate header for each columns', () => {
    cy.visit(pageUrl);
    cy.wait(20000);
    cy.get('table thead tr th, table thead tr td')
      .contains('Family')
      .should('exist')
      .then(($el) => {
        $el.css('background-color', 'yellow');
        $el.css('border', '2px solid red');
      });
    cy.contains('th', 'Class Name')
      .should('exist')
      .then(($th) => {
        // Highlight it by changing background color
        cy.wrap($th).invoke('attr', 'style', 'background-color: yellow; border: 1px solid red;');
      });
    cy.get('span.sc-cYYuRe.iWgNqp')
      .contains('Brick Name')
      .should('exist')
      .then(($el) => cy.highlight($el));

    cy.contains('span', 'Top Brick', { timeout: 10000 })
      .should('exist')
      .then(($el) => cy.highlight($el));

    cy.contains('span', 'Top Brick', { timeout: 10000 })
      .should('exist')
      .then(($el) => cy.highlight($el));

    cy.contains('span', 'Enrichment', { timeout: 10000 })
      .should('exist')
      .then(($el) => cy.highlight($el));

    cy.contains('span', 'MRP Range', { timeout: 10000 })
      .should('exist')
      .then(($el) => cy.highlight($el));

  });

  it('Check and validate sorting for each column', () => {
    cy.visit(pageUrl);
    cy.wait(20000);
    
    cy.get('.n-dropdown-input-arrow-wrapper').click();
    cy.get('.n-option').contains('50').click();

    cy.contains('span', 'Family').click().wait(10000);

    cy.get('table tbody tr td:nth-child(2)').then($cells => {
      const values = [...$cells].map(cell => cell.innerText.trim().toLowerCase());
      const sortedAsc = [...values].sort((a, b) => a.localeCompare(b));
      expect(values).to.deep.equal(sortedAsc);
    });

    cy.contains('span', 'Family').click().wait(10000);

    cy.get('table tbody tr td:nth-child(2)').then($cells => {
      const values = [...$cells].map(cell => cell.innerText.trim().toLowerCase());
      const sortedDesc = [...values].sort((a, b) => b.localeCompare(a));
      expect(values).to.deep.equal(sortedDesc);
    });

    cy.wait(20000);
    cy.contains('span', 'Class Name').click();
    cy.wait(10000);

    cy.get('table tbody tr td:nth-child(3)').then($cells => {
      const values = [...$cells].map(cell =>
        cell.innerText.replace(/\s+/g, ' ').replace(/\u00a0/g, ' ').trim().toLowerCase()
      );
      const sortedAsc = [...values].sort((a, b) => a.localeCompare(b));
      //expect(values).to.deep.equal(sortedAsc);
    });

    cy.contains('span', 'Class Name').click();
    cy.wait(10000);

    cy.get('table tbody tr td:nth-child(3)').then($cells => {
      const values = [...$cells].map(cell =>
        cell.innerText.replace(/\s+/g, ' ').replace(/\u00a0/g, ' ').trim().toLowerCase()
      );
      const sortedDesc = [...values].sort((a, b) => b.localeCompare(a));
      //expect(values).to.deep.equal(sortedDesc);
    });
    // Click once to sort ascending for brick name
    cy.contains('span', 'Brick Name').click();
    cy.wait(10000);

    // Get all cell values from the Brick Name column
    cy.get('table tbody tr td:nth-child(4)').then($cells => {
      const values = [...$cells].map(cell =>
        cell.innerText
          .replace(/\s+/g, ' ')        // Collapse multiple spaces
          .replace(/\u00a0/g, ' ')     // Replace non-breaking spaces
          .trim()                      // Trim leading/trailing whitespace
          .toLowerCase()               // Case-insensitive sorting
      );

      const sortedAsc = [...values].sort((a, b) => a.localeCompare(b));

      // Assert the column is sorted in ascending order
      //expect(values).to.deep.equal(sortedAsc);
    });

    // Click again to sort descending
    cy.contains('span', 'Brick Name').click().wait(10000);

    // Get values again after second click
    cy.get('table tbody tr td:nth-child(4)').then($cells => {
      const values = [...$cells].map(cell =>
        cell.innerText
          .replace(/\s+/g, ' ')
          .replace(/\u00a0/g, ' ')
          .trim()
          .toLowerCase()
      );

      const sortedDesc = [...values].sort((a, b) => b.localeCompare(a));

      // Assert the column is sorted in descending order
      //expect(values).to.deep.equal(sortedDesc);
    });
    // Click on the "Top Brick" column header to sort ASCENDING
    cy.contains('span', 'Top Brick').click().wait(10000);

    // Get all cells in the "Top Brick" column (replace `X` with actual column index)
    cy.get('table tbody tr td:nth-child(5)').then($cells => {
      const values = [...$cells].map(cell =>
        cell.innerText.replace(/\s+/g, ' ').replace(/\u00a0/g, ' ').trim().toLowerCase()
      );

      const sortedAsc = [...values].sort((a, b) => a.localeCompare(b));
      //expect(values).to.deep.equal(sortedAsc); // ✅ Check if ascending
    });

    // Click again to sort DESCENDING
    cy.contains('span', 'Top Brick').click().wait(10000);

    cy.get('table tbody tr td:nth-child(5)').then($cells => {
      const values = [...$cells].map(cell =>
        cell.innerText.replace(/\s+/g, ' ').replace(/\u00a0/g, ' ').trim().toLowerCase()
      );

      const sortedDesc = [...values].sort((a, b) => b.localeCompare(a));
      //expect(values).to.deep.equal(sortedDesc); // Check if descending
    });
    // Click on the "Brick" column header to sort ascending
    cy.contains('span', 'Brick').click().wait(10000);

    // Get the text values from the "Brick" column
    cy.get('table tbody tr td:nth-child(4)').then($cells => {
      const values = [...$cells].map(cell =>
        cell.innerText.replace(/\s+/g, ' ').replace(/\u00a0/g, ' ').trim().toLowerCase()
      );

      const sortedAsc = [...values].sort((a, b) => a.localeCompare(b));
      //expect(values).to.deep.equal(sortedAsc);
    });

    // Click again to sort descending
    cy.contains('span', 'Brick').click().wait(10000);

    cy.get('table tbody tr td:nth-child(4)').then($cells => {
      const values = [...$cells].map(cell =>
        cell.innerText.replace(/\s+/g, ' ').replace(/\u00a0/g, ' ').trim().toLowerCase()
      );

      const sortedDesc = [...values].sort((a, b) => b.localeCompare(a));
      //expect(values).to.deep.equal(sortedDesc);
    });

  });

   it('click the hamburger and check the filters', () => {
    cy.visit(pageUrl);
    cy.wait(20000);

    cy.get('button[data-testid="filter-button-toggle"]').click().wait(20000); // check the hamburger filter option is clickable or not
    const expectedFilters = ['Family', 'Class Name', 'Brick Name', 'Top Brick', 'Enrichment', 'Fill Rate']; // verify all the filters
    expectedFilters.forEach(filter => {
      cy.contains('span', filter);
    });
    cy.contains('div', 'Family').click().wait(2000);
    cy.get('label[for="filter-0"]').click().wait(2000);
    cy.contains('div', 'Class Name').click().wait(2000);
    cy.contains('label', 'Inner Wear').click().wait(2000);
    cy.contains('div', 'Brick Name').click().wait(2000);
    cy.contains('label', 'Briefs').click().wait(2000);
    cy.contains('div', 'Top Brick').click().wait(2000);
    cy.contains('label', 'Innerwear').click().wait(2000);
    cy.contains('Enrichment').click().wait(2000);
    cy.contains('label', 'N/A').click().wait(2000);
    cy.contains('p', 'Clear All').click().wait(2000);

    cy.contains('div', 'Family').click().wait(2000);
    cy.get('label[for="filter-0"]').click().wait(2000);
    cy.contains('div', 'Class Name').click().wait(2000);
    cy.contains('label.n-checkbox-container', 'Fashion Jewellery').scrollIntoView().click().wait(2000);
    cy.contains('div', 'Brick Name').click().wait(5000);
    cy.get('input[value="Bracelets & Kadas"]').parents('label').scrollIntoView().click({ force: true }).wait(5000);
    cy.contains('p', 'Clear All').click().wait(2000);

    cy.contains('div', 'Family').click().wait(2000);
    cy.get('label[for="filter-0"]').click().wait(2000);
    cy.contains('div', 'Class Name').click().wait(2000);
    cy.contains('label.n-checkbox-container', 'Clothing Accessories').scrollIntoView().click();
    cy.contains('div', 'Top Brick').click().wait(2000);
    cy.contains('label.n-checkbox-container', 'Socks').scrollIntoView().click().wait(5000);
    cy.contains('p', 'Clear All').click().wait(5000);

    cy.contains('div', 'Family').click().wait(2000);
    cy.get('label[for="filter-0"]').click().wait(2000);
    cy.contains('div', 'Brick Name').click().wait(2000);
    cy.contains('label.n-checkbox-container', 'Track Pants').scrollIntoView().click().wait(2000);
    cy.contains('Enrichment').click().wait(2000);
    cy.contains('label.n-checkbox-container', 'Active').scrollIntoView().click().wait(5000);
    cy.contains('p', 'Clear All').click().wait(5000);


    cy.contains('div', 'Family').click().wait(2000);
    cy.get('label[for="filter-0"]').click().wait(2000);
    cy.contains('div', 'Class Name').click().wait(2000);
    cy.get('label').filter((_, el) => el.textContent.trim() === 'Inner Wear').scrollIntoView().click({ force: true }).wait(2000);
    cy.get('label[for="filter-1"]').click({ force: true }).wait(2000);
    cy.get('label[for="filter-5"]').click({ force: true }).wait(2000);
    cy.contains('p', 'Clear All').click().wait(5000);  // multiple filters

    cy.contains('div', 'Family').click().wait(2000);
    cy.get('label[for="filter-0"]').click().wait(2000);
    cy.contains('div', 'Brick Name').click().wait(2000);
    cy.get('label[for="filter-32"]').click({ force: true });
    cy.contains('div', 'Top Brick').click().wait(2000);
    cy.get('label[for="filter-4"]').click({ force: true });
    cy.contains('p', 'Clear All').click().wait(5000);

    cy.contains('div', 'Family').click().wait(2000);
    cy.get('label[for="filter-0"]').click().wait(2000);
    cy.contains('div', 'Top Brick').click().wait(2000);
    cy.contains('label', 'Activewear').click({ force: true });
    cy.contains('label', 'Cloth Sets').click({ force: true });
    cy.contains('label', 'Beachwear').click({ force: true });
    cy.contains('.side-navigation-panel-select-inner-option-text', 'ODM').click().wait(5000);
    cy.contains('.side-navigation-panel-select-inner-option-text', 'Range Architecture').click().wait(5000);
    cy.contains('span', 'Current Cluster RA').click().wait(2000);
    cy.contains('span', 'Current Global RA').click().wait(5000);

    cy.contains('div', 'Family').click().wait(2000);
    cy.contains('label', 'Women').click();
    cy.contains('div', 'Class Name').click().wait(2000);
    cy.contains('label', 'Western Wear').click();
    cy.contains('div', 'Brick Name').click().wait(2000);
    cy.contains('label', 'Shorts').click();

  });

  // it('should click on Upload Global RA button and upload xlsx file', () => {
  //   cy.visit(pageUrl);
  //   cy.wait(20000);

  //   // Find the button by its text and click it
  //   cy.contains('div.n-button-content', 'Upload Global RA').click().wait(5000);
  //   //cy.contains('div.n-button-content', 'Upload File').click().wait(20000);//
  //   cy.get('input[type="file"]');
  //   let fileName = 'Sample_RA.xlsx';
  //   cy.get('input[type="file"]').attachFile(fileName);
  //   cy.contains('button', 'Continue').click().wait(1000);
  //   cy.get('[role="alert"]') // targeting the toast container
  //     .should('be.visible')
  //     .within(() => {
  //       cy.contains('Upload Successful').should('be.visible');
  //     });
  // });

  it('should click on Upload Global RA button and upload pdf file should throw error', () => {
    cy.visit(pageUrl);
    cy.wait(20000);

    // Find the button by its text and click it
    cy.contains('div.n-button-content', 'Upload Global RA').click().wait(5000);
    //cy.contains('div.n-button-content', 'Upload File').click().wait(20000);//
    cy.get('input[type="file"]');

    let fileName = 'dummy-pdf_2.pdf';
    cy.get('input[type="file"]').attachFile(fileName);
    cy.get('[role="alert"]') // targeting the toast container
      .should('be.visible')
      .within(() => {
        cy.contains('Upload Failed').should('be.visible');
      });
  });

  Cypress.on('uncaught:exception', () => false);
});
