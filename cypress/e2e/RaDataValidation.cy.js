describe("RA Data Validation - Excel vs API", () => {
  const raEnv = Cypress.env("data_validation").ra;
  const cookieHeader = Cypress.env("cookie")

  it("should validate API response fields against Excel columns", () => {
    cy.task("validateExcelVsApi", {
      excelPath: raEnv.excel_path,
      sheetName: raEnv.sheet_name,
      cookieHeader,
      baseUrl: raEnv.data_url
    }).then((result) => {
      expect(result).to.eq("All Excel mapped fields exist in API response");
    });
  });

  it("Uploaded RA data count should be same as API response", () => {
    cy.task("validateExcelRowCountVsApi").then((result) => {
      expect(result).to.match(/Row count matched/);
    });
  });

  it("Excel data should exactly match API data", () => {
    cy.task("validateExcelDataVsApi").then((result) => {
      expect(result).to.match(/Excel rows have matching API records/);
    });
  });
});
