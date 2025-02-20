const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

async function convertToJSON(filePath) {
  return new Promise((resolve, reject) => {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".csv") {
      // Convert CSV to JSON
      const jsonArray = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => jsonArray.push(row))
        .on("end", () => {
          console.log("CSV file successfully processed");
          resolve(jsonArray);
        })
        .on("error", (error) => reject(error));
    } else if (ext === ".xls" || ext === ".xlsx") {
      // Convert Excel to JSON
      try {
        const workbook = xlsx.readFile(filePath);
        const sheetNames = workbook.SheetNames;
        const jsonArray = [];

        sheetNames.forEach((sheetName) => {
          const sheetData = xlsx.utils.sheet_to_json(
            workbook.Sheets[sheetName]
          );
          jsonArray.push(...sheetData);
        });

        console.log("Excel file successfully processed");
        resolve(jsonArray);
      } catch (error) {
        reject(error);
      }
    } else {
      reject(
        new Error(
          "Unsupported file format. Only CSV, XLS, and XLSX are allowed."
        )
      );
    }
  });
}

module.exports = convertToJSON;
