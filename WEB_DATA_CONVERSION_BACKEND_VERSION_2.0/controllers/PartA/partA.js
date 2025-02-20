const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const Files = require("../../models/TempleteModel/files"); // Import Files model
const convertToJSON = require("../../services/csvAndExcel_to_json");
const path = require("path");

const PartA = async (req, res) => {
  try {
    // Get uploaded files and extracted images from request
    const { csv1, csv2, zipFile } = req.uploadedFiles || {};
    const { templeteId } = req.body; // Extract templeteId from request body

    // const extractedImages = req.extractedImages || [];

    // Log uploaded files
    // console.log("CSV 1:", csv1);
    // console.log("CSV 2:", csv2);
    // console.log("ZIP File:", zipFile);
    // console.log("Extracted Images:", extractedImages);

    // Check if files were properly uploaded
    if (!csv1 || !csv2 || !zipFile || !templeteId) {
      return res.status(400).json({ error: "Missing required files" });
    }

    // Convert only csv2 to JSON
    let csv2Json = [];
    try {
      csv2Json = await convertToJSON(csv2.path);
      console.log("CSV 2 JSON:", csv2Json);
    } catch (err) {
      console.error("Error converting CSV2 to JSON:", err);
      return res.status(500).json({ error: "Failed to convert CSV2 to JSON" });
    }

    // Construct the extracted images folder path based on ZIP filename
    const zipFolderName = path.basename(
      zipFile.filename,
      path.extname(zipFile.filename)
    ); // Extract filename without extension
    const zipExtractedPath = `PartAFolders\\ExtractedImages\\${zipFolderName}\\Data`;

    // Store file tracking information in the database
    const newFileEntry = await Files.create({
      masterFile: csv1.filename, // Store csv1 filename
      csvFile: csv2.filename, // Store csv2 filename
      zipFile: zipExtractedPath, // Store extracted images folder path
      templeteId: templeteId, // Set templeteId
    });

    console.log("File data saved successfully:", newFileEntry);
    return res.status(200).json({
      message: "Files processed successfully",
      csvDataLength: csv2Json.length, // Send the length of the CSV data
      fileId: newFileEntry.dataValues.id, // Return saved file tracking data
    });
  } catch (error) {
    console.error("Error in PartA controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = PartA;
