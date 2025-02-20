const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Files = require("../../models/TempleteModel/files"); // Import Files model
const convertToJSON = require("../../services/csvAndExcel_to_json");
const jsonToCSV = require("../../services/json_to_csv"); // A utility to convert JSON back to CSV
const path = require("path");
const fs = require("fs");

const PartA = async (req, res) => {
  try {
    // Get uploaded files and extracted images from request
    const { csv1, csv2, zipFile } = req.uploadedFiles || {};
    const { templeteId } = req.body; // Extract templeteId from request body

    // Check if required files are available
    if (!csv1 || !csv2 || !zipFile || !templeteId) {
      return res.status(400).json({ error: "Missing required files" });
    }

    // Convert csv2 to JSON
    let csv2Json = [];
    try {
      csv2Json = await convertToJSON(csv2.path);
    } catch (err) {
      console.error("Error converting CSV2 to JSON:", err);
      return res.status(500).json({ error: "Failed to convert CSV2 to JSON" });
    }

    // Extract ZIP folder name
    const zipFolderName = path.basename(
      zipFile.filename,
      path.extname(zipFile.filename)
    );
    const zipExtractedPath = `${zipFolderName}`;

    // Modify "Front side Image" column to include zipExtractedPath + "IMAGES/"
    csv2Json = csv2Json.map((row) => {
      if (row["Front side Image"]) {
        const imageName = path.basename(row["Front side Image"]); // Extract only the image filename
        row["Front side Image"] = `${zipExtractedPath}/IMAGES/${imageName}`;
      }
      return row;
    });

    // Overwrite the same CSV file with updated data
    try {
      await jsonToCSV(csv2Json, csv2.path); // Ensures overwriting the same file
    } catch (err) {
      console.error("Error saving updated CSV file:", err);
      return res
        .status(500)
        .json({ error: "Failed to save modified CSV file" });
    }

    // Store file tracking information in the database
    const newFileEntry = await Files.create({
      masterFile: csv1.filename,
      csvFile: csv2.filename, // File remains the same
      zipFile: zipExtractedPath,
      templeteId: templeteId,
    });

    return res.status(200).json({
      message: "Files processed successfully",
      csvDataLength: csv2Json.length,
      fileId: newFileEntry.dataValues.id,
    });
  } catch (error) {
    console.error("Error in PartA controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = PartA;
