const { parse } = require("json2csv");
const fs = require("fs");

const jsonToCSV = async (jsonData, filePath) => {
  try {
    const csv = parse(jsonData);
    await fs.promises.writeFile(filePath, csv, "utf-8"); // Overwrite the original file
  } catch (error) {
    throw new Error("Error writing CSV file: " + error.message);
  }
};

module.exports = jsonToCSV;
