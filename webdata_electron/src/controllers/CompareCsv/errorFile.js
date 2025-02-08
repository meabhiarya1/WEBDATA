const Assigndata = require("../../models/TempleteModel/assigndata");
const fs = require("fs");
const csvParser = require("csv-parser");
function readFileAndParse(filePath) {
  return new Promise((resolve, reject) => {
    const dataArray = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => {
        dataArray.push(data);
      })
      .on("end", () => {
        resolve(dataArray);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

const errorFile = async (req, res) => {
  try {
    const { assignId } = req.params;
    const data = await Assigndata.findOne({ where: { id: assignId } });
    if (!data) {
      throw new Error("Data not found");
    }
    const { errorFilePath, correctedCsvFilePath } = data;
    // Check if files exist before reading
    if (!fs.existsSync(errorFilePath)) {
      return res.status(404).json({ error: "Error File CSV not found" });
    }
    if (!fs.existsSync(correctedCsvFilePath)) {
      return res.status(404).json({ error: "Corrected CSV not found" });
    }
    const errorDataArray = await readFileAndParse(errorFilePath);
    const correctedCsvDataArra = await readFileAndParse(correctedCsvFilePath);

    const correctedCsvDataArray = correctedCsvDataArra.map((item) => {
      return { ...item, "CORRECTED BY": "", "CORRECTED COLUMN": "" };
    });

    for (let i = 0; i < errorDataArray.length; i++) {
      if (errorDataArray[i]["CORRECTED"].length !== 0) {
        const parsedData = JSON.parse(errorDataArray[i]["CORRECTED"]);

        for (let j = 0; j < parsedData.length; j++) {
          // console.log(parsedData[j]);
          for (let k = 0; k < correctedCsvDataArray.length; k++) {
            if (
              errorDataArray[i]["PRIMARY"].trim() ===
              correctedCsvDataArray[k][errorDataArray[i]["PRIMARY KEY"]].trim()
            ) {
              const key = Object.keys(parsedData[j])[0]; // Assuming only one key
              const value = Object.values(parsedData[j])[0]; // Assuming only one value
              correctedCsvDataArray[k][key] = value;
              correctedCsvDataArray[k] = {
                ...correctedCsvDataArray[k],
                "CORRECTED BY": errorDataArray[i]["CORRECTED BY"],
              };
              correctedCsvDataArray[k] = {
                ...correctedCsvDataArray[k],
                "CORRECTED COLUMN": JSON.stringify(key),
              };
            }
          }
        }
      }
    }

    // Send the CSV data as the response
    res.status(200).send({
      csvFile: correctedCsvDataArray,
    });
  } catch (error) {
    console.error("Error in errorFile function:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
module.exports = errorFile;
