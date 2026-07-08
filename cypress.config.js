const { defineConfig } = require("cypress");
const path = require("path");
const xlsx = require("xlsx");
const allureWriter = require("@shelex/cypress-allure-plugin/writer");
const {
  validateExcelVsApi,
  validateExcelRowCountVsApi,
  validateExcelDataVsApi,
} = require("./cypress/plugins/raDataValidationTask");
const {
  odmValidateExcelVsApi,
  odmValidateExcelRowCountVsApi,
  odmValidateExcelDataVsApi,
} = require("./cypress/plugins/odmDataValidationTask");
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      on("task", {
        validateExcelVsApi,
        validateExcelRowCountVsApi,
        validateExcelDataVsApi,
        odmValidateExcelVsApi,
        odmValidateExcelRowCountVsApi,
        odmValidateExcelDataVsApi,

        // Clones SAP_Design.xlsx template with unique SKUID / EAN ID / Option Code per run
        generateUniqueSapDesignExcel({ filename = "SAP_Design_generated.xlsx" } = {}) {
          const templatePath = path.join(__dirname, "cypress", "fixtures", "SAP_Design.xlsx");
          const wb = xlsx.readFile(templatePath);
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = xlsx.utils.sheet_to_json(ws, { header: 1 });

          const headers = data[0];
          const templateRows = data.slice(1);

          // 5-digit run ID derived from current timestamp → changes every run
          const runId = String(Date.now() % 100000).padStart(5, "0");

          const newRows = templateRows.map((row, idx) => {
            const newRow = [...row];
            const i = String(idx + 1).padStart(2, "0");
            // SKUID  (col 0)  → 12 digits: "44576" + runId(5) + i(2)
            newRow[0]  = `44576${runId}${i}`;
            // EAN ID (col 3)  → 13 digits: "806004" + runId(5) + i(2)
            newRow[3]  = `806004${runId}${i}`;
            // Option Code (col 22) → "OPT" + runId(5) + i(2)
            newRow[22] = `OPT${runId}${i}`;
            return newRow;
          });

          const newWs = xlsx.utils.aoa_to_sheet([headers, ...newRows]);
          const newWb = xlsx.utils.book_new();
          xlsx.utils.book_append_sheet(newWb, newWs, "Sheet1");
          const filePath = path.join(__dirname, "cypress", "fixtures", filename);
          xlsx.writeFile(newWb, filePath);
          return filePath;
        },

        // Creates a two-column (SKU ID, QTY) Excel fixture from dynamically extracted SAP data
        createReplenExcel({ rows, filename = "sap_replen_upload.xlsx" }) {
          const wsData = [["SKUID", "QTY"], ...rows];
          const ws = xlsx.utils.aoa_to_sheet(wsData);
          const wb = xlsx.utils.book_new();
          xlsx.utils.book_append_sheet(wb, ws, "Replen");
          const filePath = path.join(__dirname, "cypress", "fixtures", filename);
          xlsx.writeFile(wb, filePath);
          return filePath;
        },
      });
      return config;
    },
    baseUrl: "https://platform.uat.impetusz0.de/auth/login",
    env: {
      allure: true,
    },
    viewportWidth: 1440, // ← Width of the test runner
    viewportHeight: 900,

    experimentalSessionAndOrigin: true,
    reporterOptions: {
      resultsDir: "allure-results",
    },
    //video: true,
    screenshotOnRunFailure: true,
  },
  /* module.exports = {
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'spec, mochawesome, mocha-junit-reporter',
    mochawesomeReporterOptions: {
      reportDir: 'cypress/reports/mochawesome',
      overwrite: false,
      html: false,
      json: true,
    },
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/reports/junit/results-[hash].xml',
    },
  },
}; */
});
