const fs = require("fs");
const puppeteer = require("puppeteer");
const path = require("path");

const cypressSpecFile = process.argv[2]; // pass file path as argument
const fileName = path.basename(cypressSpecFile, ".cy.js"); // e.g., login.cy.js -> login

(async () => {
  const summary = JSON.parse(
    fs.readFileSync("allure-report/widgets/summary.json", "utf8")
  );

  const stats = summary.statistic;
  const total = stats.total || 0;

  function percent(value) {
    if (total === 0) return "0%";
    return ((value / total) * 100).toFixed(2) + "%";
  }

  const data = {
    total: stats.total,
    passed: `${stats.passed} (${percent(stats.passed)})`,
    failed: `${stats.failed} (${percent(stats.failed)})`,
    broken: `${stats.broken} (${percent(stats.broken)})`,
    skipped: `${stats.skipped} (${percent(stats.skipped)})`,
    unknown: `${stats.unknown} (${percent(stats.unknown)})`
  };

  // Load HTML template
  let html = fs.readFileSync("./reports/emailable-report.html", "utf8");
  html = html.replace("__ALLURE_DATA__", JSON.stringify(data));

  const outputHtmlPath = `./reports/emailable-report-${fileName}.html`;
  fs.writeFileSync(outputHtmlPath, html);

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(`file://${path.resolve(outputHtmlPath)}`, { waitUntil: "networkidle0" });

  await page.pdf({
    path: `./reports/emailable-report-${fileName}.pdf`,
    format: "A4",
    printBackground: true
  });

  await browser.close();

  console.log(`PDF generated: reports/emailable-report-${fileName}.pdf`);
})();

