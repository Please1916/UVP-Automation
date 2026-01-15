const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const cypressSpecFile = process.argv[2];
const fileName = path.basename(cypressSpecFile, ".cy.js");

const suitesPath = "allure-report/data/suites.json";

if (!fs.existsSync(suitesPath)) {
  console.error("ERROR: suites.json not found. Ensure Allure report is generated.");
  process.exit(1);
}

const suitesJson = JSON.parse(fs.readFileSync(suitesPath, "utf8"));

/* ============================================================
   FAILURE DETAILS FROM test-cases/<uid>.json
============================================================ */
function getFailureDetails(testUid) {
  const testCasePath = `allure-report/data/test-cases/${testUid}.json`;

  if (!fs.existsSync(testCasePath)) {
    return {
      errorMessage: "",
      errorTrace: "",
      attachments: []
    };
  }

  const testCaseJson = JSON.parse(fs.readFileSync(testCasePath, "utf8"));

  return {
    errorMessage: testCaseJson.statusMessage || "",
    errorTrace: testCaseJson.statusTrace || "",
    attachments:
      testCaseJson.testStage?.attachments?.map(a => ({
        name: a.name,
        source: `allure-report/data/attachments/${a.source}`,
        type: a.type
      })) || []
  };
}

/* ============================================================
   EXTRACT TESTS FROM suites.json
============================================================ */
function extractTests(suite) {
  let tests = [];

  if (suite.children) {
    suite.children.forEach(child => {
      if (child.status) {

        let failure = {
          errorMessage: "",
          errorTrace: "",
          attachments: []
        };

        // 🔴 Only failed tests have failure details
        if (child.status === "failed") {
          failure = getFailureDetails(child.uid);
        }

        tests.push({
          name: child.name,
          status: child.status,
          suiteName: suite.name,
          uid: child.uid,
          start: child.time?.start,
          stop: child.time?.stop,
          duration: child.time?.duration || 0,
          retries: child.retriesCount || 0,
          flaky: child.flaky || false,

          // failure mapping
          errorMessage: failure.errorMessage,
          errorTrace: failure.errorTrace,
          attachments: failure.attachments
        });
      }

      tests = tests.concat(extractTests(child));
    });
  }

  return tests;
}

const allTests = extractTests(suitesJson);

/* ============================================================
   STATISTICS (UNKNOWN REMOVED)
============================================================ */
const stat = {
  total: allTests.length,
  passed: allTests.filter(t => t.status === "passed").length,
  failed: allTests.filter(t => t.status === "failed").length,
  broken: allTests.filter(t => t.status === "broken").length,
  skipped: allTests.filter(t => t.status === "skipped").length
};

function percent(val) {
  return stat.total === 0
    ? "0%"
    : ((val / stat.total) * 100).toFixed(2) + "%";
}

/* ============================================================
   PREPARE DATA FOR HTML
============================================================ */
const preparedData = {
  stats: {
    total: stat.total,
    passed: `${stat.passed} (${percent(stat.passed)})`,
    failed: `${stat.failed} (${percent(stat.failed)})`,
    broken: `${stat.broken} (${percent(stat.broken)})`,
    skipped: `${stat.skipped} (${percent(stat.skipped)})`
  },
  tests: allTests
};

/* ============================================================
   GENERATE HTML + PDF
============================================================ */
let html = fs.readFileSync("./reports/emailable-report.html", "utf8");
html = html.replace("__ALLURE_DATA__", JSON.stringify(preparedData));

const outHtml = `./reports/${fileName}-report.html`;
fs.writeFileSync(outHtml, html);

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(`file://${path.resolve(outHtml)}`, {
    waitUntil: "networkidle0"
  });

  await page.pdf({
    path: `./reports/${fileName}-report.pdf`,
    format: "A4",
    printBackground: true
  });

  await browser.close();

  console.log("PDF Report Generated:");
  console.log(`→ reports/${fileName}-report.pdf`);
})();
