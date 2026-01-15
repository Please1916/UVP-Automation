const  raApiToExcelFieldMapping = {
  "Segment": "segment",
  "Family": "family",
  "ClassName": "className",
  "BrickName": "brickName",
  "Enrichment": "enrichment",
  "TopBrick": "topBrick",
  "Brick": "brick",
  "FinalBrick": "finalBrick",
  "BrickCode": "brickCode",
  "MRPMin": "aspMin",
  "MRPMax": "aspMax",
  "OptionsCount": "optionsCount",
  "OTBNumber": "otbNumber",
  "ODM Quantity": "odmQty",
  "OEM Quantity": "oemQty",
  "Total Quantity": "totalQty",
  "Fill Percentage": "fillPercentage"
};

const  odmBrickApiToExcelFieldMapping  = {
  "Segment": "segment",
  "Family": "family",
  "ClassName": "className",
  "BrickName": "brickName",
  "Enrichment": "enrichment",
  "TopBrick": "topBrick",
  "Brick": "brick"
};

export default {
  raApiToExcelFieldMapping,
  odmBrickApiToExcelFieldMapping,
};