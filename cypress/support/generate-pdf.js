const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const reportPath = `file://${path.resolve("allure-report/index.html")}`;
  await page.goto(reportPath, { waitUntil: "networkidle0" });

  await page.pdf({
    path: "allure-report/allure-report.pdf",
    format: "A4"
  });

  await browser.close();
})();
