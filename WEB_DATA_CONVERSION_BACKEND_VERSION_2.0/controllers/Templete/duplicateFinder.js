const Files = require("../../models/TempleteModel/files");
const fs = require("fs").promises;
const path = require("path");
const csvToJson = require("../../services/csv_to_json");

const MAX_CONCURRENT_FILE_OPS = 10;

const duplicateFinder = async (req, res, next) => {
  const { colName, fileID, imageColumnName } = req.body;

  try {
    if (!fileID) {
      return res.status(400).json({ error: "File ID not provided" });
    }

    const fileData = await Files.findByPk(fileID);
    if (!fileData || !fileData.csvFile) {
      return res.status(404).json({ error: "File not found" });
    }

    let filePath = "";

    if (fileData.masterFile) {
      filePath = path.resolve(
        __dirname,
        "../../PartAFolders/ScannedCsvData",
        fileData.csvFile
      );
    } else {
      const filename = fileData.csvFile;
      filePath = path.resolve(__dirname, "../../csvFile", filename);
    }

    try {
      await fs.access(filePath);
    } catch (err) {
      return res.status(404).json({ error: "CSV file not found" });
    }

    const data = await csvToJson(filePath);
    const imageCols = imageColumnName.split(",");
    const duplicates = {};
    const valueSet = new Set();

    const processRow = async (row, index) => {
      const value = row[colName];
      if (value) {
        if (valueSet.has(value)) {
          const imagePaths = imageCols.map((col) => row[col]).filter(Boolean);
          duplicates[value] = duplicates[value] || [];
          duplicates[value].push({ index, row, imagePaths });
        } else {
          valueSet.add(value);
        }
      }
    };

    const limitConcurrency = async (tasks, limit) => {
      const results = [];
      const executing = new Set();
      for (const task of tasks) {
        const p = Promise.resolve().then(() => task());
        results.push(p);
        executing.add(p);
        const clean = () => executing.delete(p);
        p.then(clean).catch(clean);
        if (executing.size >= limit) {
          await Promise.race(executing);
        }
      }
      return Promise.all(results);
    };

    const tasks = data.map((row, index) => () => processRow(row, index));
    await limitConcurrency(tasks, MAX_CONCURRENT_FILE_OPS);

    const duplicateValues = Object.keys(duplicates).filter(
      (value) => duplicates[value].length > 1
    );

    if (duplicateValues.length === 0) {
      return res.status(404).json({ message: "No duplicates found" });
    }

    const duplicateRows = duplicateValues.flatMap((value) => duplicates[value]);

    return res.status(200).json({ duplicates: duplicateRows });
  } catch (error) {
    console.error("Error finding duplicates:", error);
    if (error.message.startsWith("Error reading image file")) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = duplicateFinder;
