const path = require('path');
const puppeteer = require('puppeteer');

const HTML_PATH = path.resolve(__dirname, '..', 'reports', 'Sanity_Automation_Test_Coverage_Report.html');
const PDF_PATH  = path.resolve(__dirname, '..', 'reports', 'Sanity_Automation_Test_Coverage_Report.pdf');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('file://' + HTML_PATH, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  await page.pdf({
    path: PDF_PATH,
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', right: '10mm', bottom: '12mm', left: '10mm' },
  });
  await browser.close();
  console.log('PDF written to', PDF_PATH);
})();
