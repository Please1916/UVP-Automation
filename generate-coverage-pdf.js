const path = require("path");
const puppeteer = require("puppeteer");

const inHtml = path.resolve("./reports/Sanity_Automation_Test_Coverage_Report.html");
const outPdf = path.resolve("./reports/Sanity_Automation_Test_Coverage_Report.pdf");

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(`file://${inHtml}`, { waitUntil: "networkidle0" });
  await page.emulateMediaType("print");

  await page.pdf({
    path: outPdf,
    format: "A4",
    printBackground: true,
    margin: { top: "12mm", bottom: "12mm", left: "10mm", right: "10mm" }
  });

  await browser.close();
  console.log(`PDF generated: ${outPdf}`);
})();
