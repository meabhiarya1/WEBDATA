const AssignData = require("../../models/TempleteModel/assigndata");
const Files = require("../../models/TempleteModel/files");
const convertToJSON = require("../../services/csvAndExcel_to_json"); // Function to convert CSV to JSON

const errorData = async (req, res) => {
  const assignId = req.params.id;

  try {
    // Fetch the assigned data
    const assigndata = await AssignData.findOne({ where: { id: assignId } });

    if (!assigndata) {
      return res.status(404).json({ error: "Data not found" });
    }

    // Fetch file data using fileId from assigndata
    const filedata = await Files.findOne({ where: { id: assigndata.fileId } });

    if (!filedata) {
      return res.status(404).json({ error: "File data not found" });
    }

    // Convert Master Data CSV to JSON
    const masterData = await convertToJSON(
      `PartAFolders/MasterData/${filedata.masterFile}`
    );
    // Convert Scanned CSV Data to JSON
    const scannedData = await convertToJSON(
      `PartAFolders/ScannedCsvData/${filedata.csvFile}`
    );

    // Extract Roll Numbers from master data
    const masterRollNos = masterData.map((row) => row.ROLLNO); // Assuming column name is 'RollNo

    const errorData = [];

    scannedData.map((scannedRow) => {
      if (!masterRollNos.includes(scannedRow.ROLL)) {
        errorData.push(scannedRow);
      }
    });

    return res.status(200).json({
      errorData, // Full rows of mismatched roll numbers
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = errorData;
