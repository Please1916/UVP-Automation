const xlsx = require("xlsx");
const path = require("path");

function readExcelData(filePath, sheetName) {
  if (!filePath) {
    throw new Error("Excel file path is missing");
  }

  const absolutePath = path.resolve(filePath);
  const workbook = xlsx.readFile(absolutePath);
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in Excel file`);
  }

  return xlsx.utils.sheet_to_json(sheet);
}

module.exports = {
  readExcelData,
};
