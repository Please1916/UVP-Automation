const axios = require("axios");
const { readExcelData } = require("../support/excelReader");
const { odmBrickApiToExcelFieldMapping } =
  require("../fixtures/UploadDataFieldMapping").default;

let odmApiData, bricksExcelData;

/**
 * Validate Excel column mapping vs API response fields (BRICKS)
 */
async function odmValidateExcelVsApi({
  excelPath,
  sheetName,
  cookieHeader,
  baseUrl,
  moodboardId,
}) {
  if (!excelPath || !sheetName) {
    throw new Error("excelPath or sheetName is missing");
  }

  if (!moodboardId) {
    throw new Error("moodboardId is missing");
  }

  const excelRows = readExcelData(excelPath, sheetName);

  if (!Array.isArray(excelRows) || excelRows.length === 0) {
    throw new Error("Excel sheet is empty or unreadable");
  }

  const excelKeys = Object.keys(excelRows[0]);
  const response = await axios.get(`${baseUrl}${moodboardId}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  if (response.data.status !== "SUCCESS") {
    throw new Error(`API failed with status ${response.data.status}`);
  }

  const boards = response.data.data;


  odmApiData = response.data.data;
  bricksExcelData = excelRows;
  
  if (!Array.isArray(boards) || boards.length === 0) {
    throw new Error("API data is not an array of boards");
  }

  const allBricks = boards.flatMap((board) =>
    Array.isArray(board.bricks) ? board.bricks : []
  );

  if (allBricks.length === 0) {
    throw new Error("No bricks found in API response");
  }

  // Collect ALL API brick keys
  const apiKeySet = new Set();
  allBricks.forEach((brick) =>
    Object.keys(brick).forEach((key) => apiKeySet.add(key.toLowerCase()))
  );

  const missingInApi = excelKeys.filter(
    (excelKey) => !apiKeySet.has(excelKey.toLowerCase())
  );

  if (missingInApi.length > 0) {
    throw new Error(
      `Excel columns missing in API brick object:\n` +
        `${missingInApi.join(", ")}`
    );
  }

  return "All Excel column names exist in API brick keys";
}

async function odmValidateExcelRowCountVsApi() {
  if (!odmApiData || !Array.isArray(odmApiData)) {
    throw new Error("API data is not an array");
  }

  // Flatten all bricks from all boards
  const allBricks = odmApiData.flatMap(board =>
    Array.isArray(board.bricks) ? board.bricks : []
  );

  if (!allBricks || allBricks.length === 0) {
    throw new Error("No bricks found in API response");
  }

  const apiRows = allBricks.length;
  const excelRowCount = bricksExcelData.length;

  if (excelRowCount !== apiRows) {
    throw new Error(
      `Row count mismatch:\nExcel rows: ${excelRowCount}\nAPI rows: ${apiRows}`
    );
  }

  return `Row count matched: ${excelRowCount}`;
}


/**
 * Validate Excel data vs API brick data
 */
async function odmValidateExcelDataVsApi() {
  if (!odmApiData || !Array.isArray(odmApiData)) {
    throw new Error("Invalid or missing raApiData.data");
  }

  if (!Array.isArray(bricksExcelData) || bricksExcelData.length === 0) {
    throw new Error("Invalid or empty raExcelData");
  }

  // 🔥 Flatten all bricks
  const allBricks = odmApiData.flatMap((board) =>
    Array.isArray(board.bricks) ? board.bricks : []
  );

  if (allBricks.length === 0) {
    throw new Error("No bricks found in API response");
  }

  const mismatches = [];

  bricksExcelData.forEach((excelRow, excelIndex) => {
    let rowMismatchDetails = [];

    const matchFound = allBricks.some((brick) => {
      rowMismatchDetails = [];

      return Object.entries(odmBrickApiToExcelFieldMapping).every(
        ([excelField, apiField]) => {
          const excelValue = excelRow[excelField];
          const apiValue = brick[apiField];

          const isMatch =
            String(excelValue ?? "").trim() === String(apiValue ?? "").trim();

          if (!isMatch) {
            rowMismatchDetails.push({
              excelProperty: excelField,
              apiProperty: apiField,
              expected: excelValue ?? null,
              actual: apiValue ?? null,
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

  return `All ${bricksExcelData.length} Excel rows have matching brick records`;
}

module.exports = {
  odmValidateExcelVsApi,
  odmValidateExcelRowCountVsApi,
  odmValidateExcelDataVsApi,
};
