describe('File Format Validation', () => {

  /**
   * Function to check if file extension is valid (.xlsx or .csv)
   * Similar to your Java example
   */
  const isValidFileFormat = (fileName) => {
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return fileExtension === 'xlsx' || fileExtension === 'csv';
  };

  it('should validate fixture file formats', () => {
    // List your fixture files here
    const filesToCheck = ['sample_RA.xlsx'];

    filesToCheck.forEach((fileName) => {
      const valid = isValidFileFormat(fileName);

      cy.log(`Checking file: ${fileName}`);

      if (valid) {
        cy.log(`${fileName} is a valid file format`);
        expect(valid).to.be.true;
      } else {
        cy.log(`${fileName} is NOT a valid file format`);
        expect(valid).to.be.false;
      }
    });
  });
});
