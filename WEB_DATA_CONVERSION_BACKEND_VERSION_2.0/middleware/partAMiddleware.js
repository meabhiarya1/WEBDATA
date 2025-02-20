const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Define the parent folder and subfolders
const baseFolder = "PartAFolders";
const folders = {
  csv1: "MasterData",
  csv2: "ScannedCsvData",
  zipFile: "ScannedZipImages",
};

// Ensure all required folders exist
Object.values(folders).forEach((folder) => {
  try {
    const fullPath = path.join(baseFolder, folder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  } catch (err) {
    console.error(`Error creating folder ${folder}:`, err);
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

// Function to generate a timestamp
const getTimestamp = () => {
  try {
    const now = new Date();
    return now
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14); // YYYYMMDDHHMMSS
  } catch (err) {
    console.error("Error generating timestamp:", err);
    return "00000000000000"; // Fallback timestamp
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      let folderName = folders[file.fieldname]; // Get the correct folder
      if (!folderName) {
        return cb(new Error("Invalid file field name"), false);
      }
      let destinationPath = path.join(baseFolder, folderName);
      cb(null, destinationPath);
    } catch (err) {
      console.error("Error in destination:", err);
      cb(new Error("Internal server error"), false);
    }
  },
  filename: function (req, file, cb) {
    try {
      const timestamp = getTimestamp(); // Generate timestamp
      const newFileName = `${timestamp}_${file.originalname}`; // Add timestamp prefix
      cb(null, newFileName);
    } catch (err) {
      console.error("Error in filename generation:", err);
      cb(new Error("Internal server error"), false);
    }
  },
});

// Multer setup to handle specific file fields
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log(file, "file");
    const allowedMimeTypes = [
      "text/csv", // CSV files
      "application/zip", // ZIP files
      "application/x-zip-compressed", // ZIP files
      "application/vnd.ms-excel", // XLS (Older Excel format)
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX (Newer Excel format)
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only CSV, Excel, and ZIP files are allowed"), false);
    }

    cb(null, true);
  }, // <-- Closing brace was missing here
}).fields([
  { name: "csv1", maxCount: 1 }, // MasterData folder
  { name: "csv2", maxCount: 1 }, // ScannedCsvData folder
  { name: "zipFile", maxCount: 1 }, // ScannedZipImages folder
]);

const uploadCsvPartA = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);

      if (err instanceof multer.MulterError) {
        // Handle multer-specific errors
        return res
          .status(400)
          .json({ error: "Multer error", details: err.message });
      } else if (err.message === "Invalid file field name") {
        return res.status(400).json({ error: "Invalid file field name" });
      } else if (
        err.message.includes("Only CSV, Excel, and ZIP files are allowed")
      ) {
        return res.status(400).json({
          error: "Invalid file type. Only CSV, Excel, and ZIP allowed",
        });
      }

      return res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }

    // console.log("Uploaded files:", req.files); // Debugging

    // Validate that all required files are uploaded
    if (
      !req.files ||
      !req.files.csv1 ||
      !req.files.csv2 ||
      !req.files.zipFile
    ) {
      return res
        .status(400)
        .json({ error: "Please upload two CSV files and one ZIP file" });
    }

    req.uploadedFiles = {
      csv1: req.files.csv1[0],
      csv2: req.files.csv2[0],
      zipFile: req.files.zipFile[0],
    };

    next();
  });
};

module.exports = uploadCsvPartA;
