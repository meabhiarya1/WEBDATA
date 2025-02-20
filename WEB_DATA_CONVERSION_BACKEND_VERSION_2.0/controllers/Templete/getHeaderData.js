const Files = require("../../models/TempleteModel/files");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const convertToJSON = require("../../services/csvAndExcel_to_json");

const getHeaderData = async (req, res, next) => {
  try {
    const userRole = req.role;

    if (userRole !== "Admin") {
      return res
        .status(403)
        .json({ message: "You don't have access to perform this action" });
    }

    const fileData = await Files.findOne({ where: { id: req.params.id } });

    if (!fileData) {
      return res.status(404).json({ error: "File not found" });
    }

    if (fileData.masterFile) {
      // Convert Scanned CSV Data to JSON
      const scannedData = await convertToJSON(
        `PartAFolders/ScannedCsvData/${fileData.csvFile}`
      );

      const headers = Object.keys(scannedData[0]);
      const rowCount = scannedData.length;

      console.log("rowData", rowCount);

      return res.status(200).json({ headers, rowCount });
    } else {
      const fileName = fileData.csvFile;
      const filePath = path.join(__dirname, "../../csvFile", fileName);

      if (!fs.existsSync(filePath)) {
        return res
          .status(404)
          .json({ error: "File not found at given filepath" });
      }

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
        defval: "",
      });

      if (data.length === 0) {
        return res
          .status(404)
          .json({ error: "No content found in Excel sheet" });
      }

      const headers = Object.keys(data[0]);
      const rowCount = data.length;

      console.log("rowData", rowCount);

      return res.status(200).json({ headers, rowCount });
    }
  } catch (error) {
    console.error("Error in getHeaderData:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getHeaderData;
