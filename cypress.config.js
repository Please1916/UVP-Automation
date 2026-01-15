const { defineConfig } = require("cypress");
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
      });
      return config;
    },
    baseUrl: "https://platform.impetusz0.de/auth/login",
    env: {
      allure: true,
    },
    viewportWidth: 1440, // ← Width of the test runner
    viewportHeight: 900,

    experimentalSessionSupport: true,
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
