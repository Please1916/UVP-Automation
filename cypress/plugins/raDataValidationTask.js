const axios = require("axios");
const { readExcelData } = require("../support/excelReader");
const { raApiToExcelFieldMapping } =
  require("../fixtures/UploadDataFieldMapping").default;
let raApiData, raExcelData;
/**
 * Validate Excel column mapping vs API response fields
 */
async function validateExcelVsApi({
  excelPath,
  sheetName,
  cookieHeader,
  baseUrl,
}) {
  if (!excelPath || !sheetName) {
    throw new Error("excelPath or sheetName is missing");
  }

  const excelRows = readExcelData(excelPath, sheetName);

  if (!Array.isArray(excelRows) || excelRows.length === 0) {
    throw new Error("Excel sheet is empty or unreadable");
  }

  // Excel column names
  const excelColumns = Object.keys(excelRows[0]);

  const response = await axios.get(`${baseUrl}?limit=2000&pageNo=1`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (response.data.status !== "SUCCESS") {
    throw new Error(`API failed with status ${response.data.status}`);
  }

  const apiData = response.data.data;

  if (!Array.isArray(apiData) || apiData.length === 0) {
    throw new Error("API data is empty or not an array");
  }

  // Take keys from first API object
  const apiKeysLower = Object.keys(apiData[0]).map((k) => k.toLowerCase());

  const mismatches = [];

  excelColumns.forEach((excelColumn) => {
    const mappedApiField = raApiToExcelFieldMapping[excelColumn];

    // Excel column exists but mapping is missing
    if (!mappedApiField) {
      mismatches.push({
        excelColumn,
        error: "No mapping found for Excel column",
      });
      return;
    }

    // Mapping exists but API key missing (case-insensitive)
    if (!apiKeysLower.includes(mappedApiField.toLowerCase())) {
      mismatches.push({
        excelColumn,
        expectedApiField: mappedApiField,
        apiAvailableKeys: Object.keys(apiData[0]),
      });
    }
  });

  if (mismatches.length > 0) {
    throw new Error(
      `Excel → API column mapping mismatches detected:\n${JSON.stringify(
        mismatches,
        null,
        2
      )}`
    );
  }

  raApiData = response.data;
  raExcelData = excelRows;

  return "All Excel mapped fields exist in API response";
}

/**
 * Validate Excel row count vs API total records
 */
async function validateExcelRowCountVsApi() {
  if (!Array.isArray(raApiData.data)) {
    throw new Error("API data is not an array");
  }
  console.log({});

  const apiRows = raApiData.page?.total_records;

  if (apiRows === undefined) {
    throw new Error("API total_records is missing");
  }

  const excelRowCount = raExcelData.length;

  if (excelRowCount !== apiRows) {
    throw new Error(
      `Row count mismatch:
       Excel rows: ${excelRowCount}
       API rows: ${apiRows}`
    );
  }

  return `Row count matched: ${excelRowCount}`;
}

async function validateExcelDataVsApi() {
  if (!raApiData || !Array.isArray(raApiData.data)) {
    throw new Error("Invalid or missing raApiData.data");
  }

  if (!Array.isArray(raExcelData) || raExcelData.length === 0) {
    throw new Error("Invalid or empty raExcelData");
  }

  const apiData = raApiData.data;
  const mismatches = [];

  raExcelData.forEach((excelRow, excelIndex) => {
    let rowMismatchDetails = [];

    const matchFound = apiData.some((apiRow) => {
      rowMismatchDetails = [];

      return Object.entries(raApiToExcelFieldMapping).every(
        ([excelField, apiField]) => {
          const excelValue = excelRow[excelField];
          const apiValue = apiRow[apiField];

          const isMatch =
            String(excelValue ?? "").trim() === String(apiValue ?? "").trim();

          if (!isMatch) {
            rowMismatchDetails.push({
              excelProperty: excelField,
              apiProperty: apiField,
              excelValue: excelValue ?? null,
              apiValue: apiValue ?? null,
            });
          }

          return isMatch;
        }
      );
    });

    if (!matchFound) {
      mismatches.push({
        excelRowIndex: excelIndex + 2, // header + 1-based index
        mismatchedFields: rowMismatchDetails,
      });
    }
  });

  if (mismatches.length > 0) {
    throw new Error(
      `Excel vs API data mismatches detected:\n${JSON.stringify(
        mismatches,
        null,
        2
      )}`
    );
  }

  return `All ${raExcelData.length} Excel rows have matching API records`;
}

module.exports = {
  validateExcelVsApi,
  validateExcelRowCountVsApi,
  validateExcelDataVsApi,
};
