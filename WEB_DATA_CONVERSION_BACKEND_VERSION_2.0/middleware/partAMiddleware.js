const multer = require("multer");
const fs = require("fs");
const path = require("path");
const unzipper = require("unzipper");

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

// Create ExtractedImages folder
const extractedFolder = path.join(baseFolder, "ExtractedImages");
if (!fs.existsSync(extractedFolder)) {
  fs.mkdirSync(extractedFolder, { recursive: true });
}

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

// Function to extract images from ZIP
const extractImagesFromZip = async (zipFilePath, zipFileName) => {
  return new Promise((resolve, reject) => {
    const extractedImages = [];

    // Extract ZIP filename without extension
    const zipNameWithoutExt = path.basename(
      zipFileName,
      path.extname(zipFileName)
    );

    // Create a unique folder for this extraction using the ZIP file's timestamped name
    const zipFolder = path.join(extractedFolder, zipNameWithoutExt);
    if (!fs.existsSync(zipFolder)) {
      fs.mkdirSync(zipFolder, { recursive: true });
    }

    fs.createReadStream(zipFilePath)
      .pipe(unzipper.Parse())
      .on("entry", async (entry) => {
        const fileName = entry.path;
        const fileExtension = path.extname(fileName).toLowerCase();
        const allowedImageTypes = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

        if (allowedImageTypes.includes(fileExtension)) {
          const outputPath = path.join(zipFolder, fileName);
          const outputDir = path.dirname(outputPath);

          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          extractedImages.push(outputPath);
          entry.pipe(fs.createWriteStream(outputPath));
        } else {
          entry.autodrain();
        }
      })
      .on("close", () => resolve(extractedImages))
      .on("error", (err) => reject(err));
  });
};

// Multer setup to handle specific file fields
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // console.log(file, "file");
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
  },
}).fields([
  { name: "csv1", maxCount: 1 }, // MasterData folder
  { name: "csv2", maxCount: 1 }, // ScannedCsvData folder
  { name: "zipFile", maxCount: 1 }, // ScannedZipImages folder
]);

const uploadCsvPartA = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }

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

    // Extract images from ZIP file
    try {
      const zipFilePath = req.files.zipFile[0].path;
      const zipFileName = req.files.zipFile[0].filename; // Get uploaded ZIP filename

      const extractedImages = await extractImagesFromZip(
        zipFilePath,
        zipFileName
      );
      req.extractedImages = extractedImages; // Store extracted images in request
      // console.log("Extracted Images:", extractedImages);
      next();
    } catch (error) {
      console.error("Error extracting images:", error);
      return res
        .status(500)
        .json({ error: "Failed to extract images", details: error.message });
    }
  });
};

module.exports = uploadCsvPartA;
