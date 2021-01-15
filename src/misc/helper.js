import Excel from "exceljs/dist/es5/exceljs.browser.js";
import Papa from "papaparse";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

function ColNameToPropName(colName, colIndex) {
  colName = colName ? colName : `${alphabet[colIndex]}`;
  colName = colName.replace(" ", "_");
  return colName;
}

async function ExcelToObject(excelBinary) {
  const workbook = new Excel.Workbook();
  await workbook.xlsx.load(excelBinary);

  const worksheet = workbook.worksheets[0];
  let colNames = [];
  const excelData = [];

  worksheet.eachRow({ includeEmpty: false }, (row, rowNum) => {
    if (row.values && 1 < row.values.length) {
      const rowValues = row.values;
      rowValues.shift(); // Delete null colunm
      // console.log({ rowValues });
      if (1 == rowNum) {
        colNames = rowValues;
        for (let i = 0; i < colNames.length; i++) {
          colNames[i] = ColNameToPropName(colNames[i], i);
        }
        // console.log({ colNames });
      } else {
        const obj = {};
        for (let i = 0; i < rowValues.length; i++) {
          let value = rowValues[i];
          if (value && value.result) value = value.result;
          else if (!value) value = null;
          obj[colNames[i]] = value;
        }
        excelData.push(obj);
      }
    }
  });

  return excelData;
}

async function CSVToObject(csvText) {
  const { data } = await Papa.parse(csvText);

  let colNames = [];
  const excelData = [];

  if (data && 0 < data.length) {
    for (let i = 0; i < data.length; i++) {
      const rowValues = data[i];

      if (0 === i) {
        colNames = rowValues;
        for (let j = 0; j < colNames.length; j++) {
          colNames[j] = ColNameToPropName(colNames[j], j);
        }
      } else {
        const obj = {};
        for (let j = 0; j < rowValues.length; j++) {
          let value = rowValues[j];
          obj[colNames[j]] = value;
        }
        excelData.push(obj);
      }
    }
  }

  return excelData;
}

const ArrayOfObjectsToObjectOfArrays = arr =>
  arr.reduce((prevVal, curVal) => {
    const propNames = Object.getOwnPropertyNames(curVal);
    for (const propName of propNames) {
      if (!prevVal[propName]) prevVal[propName] = [];
      prevVal[propName].push(curVal[propName]);
    }
    return prevVal;
  }, {});

export { alphabet, ExcelToObject, CSVToObject, ArrayOfObjectsToObjectOfArrays };
