describe("ODM Data Validation - Excel vs API", () => {
  const odmEnv = Cypress.env("data_validation").odm;
  const cookieHeader = Cypress.env("cookie");

  let moodboardId;

  before(() => {
    cy.fixture("runtimeData.json").then((data) => {
      moodboardId = data.odmMoodboardId.replace(/\//g, "%2F");
    });
  });

  it("should validate API brick keys against Excel columns", () => {
    cy.task("odmValidateExcelVsApi", {
      excelPath: odmEnv.excel_path,
      sheetName: odmEnv.sheet_name,
      cookieHeader,
      baseUrl: odmEnv.data_url,
      moodboardId
    }).then((result) => {
      expect(result).to.eq(
        "All Excel column names exist in API brick keys"
      );
    });
  });

  it("Uploaded ODM data count should be same as API response", () => {
    cy.task("odmValidateExcelRowCountVsApi", {
      excelPath: odmEnv.excel_path,
      sheetName: odmEnv.sheet_name,
      cookieHeader,
      baseUrl: odmEnv.data_url
    }).then((result) => {
      expect(result).to.match(/Row count matched/);
    });
  });

  it("Excel data should exactly match API data", () => {
    cy.task("odmValidateExcelDataVsApi", {
      excelPath: odmEnv.excel_path,
      sheetName: odmEnv.sheet_name,
      cookieHeader,
      baseUrl: odmEnv.data_url
    }).then((result) => {
      expect(result).to.match(/Excel rows have matching brick records/);
    });
  });
});
