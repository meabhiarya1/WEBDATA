const bcrypt = require("bcryptjs");
const User = require("../../models/User");

const PartA = async (req, res) => {
  try {
    // Get uploaded files and extracted images from request
    const { csv1, csv2, zipFile } = req.uploadedFiles || {};
    const extractedImages = req.extractedImages || [];

    // Log uploaded files
    console.log("CSV 1:", csv1);
    console.log("CSV 2:", csv2);
    console.log("ZIP File:", zipFile);
    console.log("Extracted Images:", extractedImages);

    // Check if files were properly uploaded
    if (!csv1 || !csv2 || !zipFile) {
      return res.status(400).json({ error: "Missing required files" });
    }

    // Process extracted images if needed
    if (extractedImages.length === 0) {
      console.warn("No images extracted from ZIP file.");
    }

    return res.status(200).json({
      message: "Files processed successfully",
      uploadedFiles: { csv1, csv2, zipFile },
      extractedImages,
    });
  } catch (error) {
    console.error("Error in PartA controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = PartA;
