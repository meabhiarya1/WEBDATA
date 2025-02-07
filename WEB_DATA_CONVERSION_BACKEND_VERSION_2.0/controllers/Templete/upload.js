const multer = require("multer");
const XLSX = require("xlsx");
const Files = require("../../models/TempleteModel/files");
const path = require("path");
const fs = require("fs-extra");
const unzipper = require("unzipper");
const { createExtractorFromFile } = require("node-unrar-js");
const getAllDirectories = require("../../services/directoryFinder");
const jsonToCsv = require("../../services/json_to_csv");

// Multer memory storage for chunk uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * Function to process the uploaded CSV file
 * - Reads the CSV file from the specified path
 * - Converts the CSV data to JSON and updates image paths
 * - Saves the updated CSV file back to the original path
 */
async function processCSV(filePath, res, req, createdFile, pathDir) {
  if (fs.existsSync(filePath)) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, {
      raw: true,
      defval: "",
    });

    // Get column names from the request and check for missing columns
    const colNames = req.query.imageNames.split(",");
    const updatedJson = data.map((obj) => obj);
    const missingCols = colNames.filter(
      (colName) => !updatedJson[0].hasOwnProperty(colName)
    );
    if (missingCols.length > 0) {
      return res.status(400).json({
        error: `Image column name(s) not found: ${missingCols.join(", ")}`,
      });
    }

    // Update image paths in the JSON data
    colNames.forEach((colName) => {
      const column = colName.replaceAll('"', "");
      updatedJson.forEach((obj) => {
        const imagePath = obj[column];
        const filename = path.basename(imagePath);
        obj[column] = `${pathDir}/${filename}`;
      });
    });

    // Delete the old CSV file and save the updated content
    fs.unlinkSync(filePath);
    const updatedCSVContent = jsonToCsv(updatedJson);
    fs.writeFileSync(filePath, updatedCSVContent, {
      encoding: "utf8",
    });

    res.status(200).json({ fileId: createdFile.id });
    console.log("File processed successfully");
  } else {
    res.status(404).json({ error: "CSV File not found" });
  }
}

/**
 * Function to save the uploaded chunk to a specified directory
 */
async function saveChunk(chunkDir, chunkIndex, buffer) {
  const chunkFileName = `${chunkIndex}.chunk`;
  const chunkFilePath = path.join(chunkDir, chunkFileName);

  console.log("Saving chunk file to:", chunkFilePath);
  await fs.writeFile(chunkFilePath, buffer);

  if (!fs.existsSync(chunkFilePath)) {
    console.error("Chunk file write failed:", chunkFilePath);
    throw new Error("Failed to save chunk file.");
  }
}

/**
 * Function to merge all uploaded chunks into a single file
 */
async function mergeChunks(chunkDir, uploadDir, zipFileName, totalChunks) {
  const timestamp = Math.floor(Date.now() / 1000);
  const finalFilePath = path.join(uploadDir, `${timestamp}_${zipFileName}`);
  const writeStream = fs.createWriteStream(finalFilePath);

  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(chunkDir, `${i}.chunk`);
    console.log("Reading chunk from:", chunkPath);
    const data = await fs.readFile(chunkPath);
    const canWrite = writeStream.write(data);

    if (!canWrite) {
      await new Promise((resolve) => writeStream.once("drain", resolve));
    }

    await fs.remove(chunkPath);
  }

  writeStream.end();
  return finalFilePath;
}

/**
 * Function to extract the contents of the ZIP file to a destination folder
 * - Added error handling for RAR files
 */
async function extractZipFile(finalFilePath, destinationFolderPath) {
  // Ensure destination folder exists
  await fs.ensureDir(destinationFolderPath);

  // Check if the uploaded file is a ZIP file
  const fileExtension = path.extname(finalFilePath).toLowerCase();
  if (fileExtension === ".rar") {
    try {
      const extractor = await createExtractorFromFile({
        filepath: finalFilePath,
        targetPath: destinationFolderPath,
      });
      const files = [...extractor.extract().files];
      return { success: true, files };
    } catch (err) {
      console.error("Extraction failed:", err);
      return { success: false, error: err };
    }
  }

  return new Promise((resolve, reject) => {
    fs.createReadStream(finalFilePath)
      .pipe(unzipper.Extract({ path: destinationFolderPath }))
      .on("close", resolve)
      .on("error", (err) => {
        console.error("Extraction error:", err);
        reject(
          new Error("Error during ZIP extraction. Make sure the file is valid.")
        );
      });
  });
}

/**
 * Main handler function for uploading files
 * - Validates user role
 * - Handles file uploads in chunks and processes them
 * - Merges chunks and extracts ZIP files
 * - Processes CSV files after extraction
 */
const handleUpload = async (req, res) => {
  // Step 1: Check user role
  const userRole = req.role;
  if (userRole !== "Admin") {
    return res
      .status(403)
      .json({ message: "You don't have access for performing this action" });
  }

  // Step 2: Configure Multer for chunk and CSV file upload
  const uploadMiddleware = upload.fields([
    { name: "chunk", maxCount: 1 },
    { name: "csvFile", maxCount: 1 },
  ]);

  // Step 3: Handle the file upload process
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(400).json({ error: "Error uploading file." });
    }

    const { id } = req.params;
    const { chunkIndex, totalChunks, zipFileName } = req.body;

    if (!req.files.chunk) {
      return res.status(400).json({ error: "No chunk file uploaded." });
    }

    const uploadDir = path.join(__dirname, "..", "..", "zipFile");
    const chunkDir = path.join(uploadDir, "chunks");
    const csvFileDir = path.join(__dirname, "../../csvFile");

    try {
      // Ensure necessary directories exist
      await fs.ensureDir(chunkDir);
      await fs.ensureDir(uploadDir);
      await fs.ensureDir(csvFileDir);

      // Step 4: Save the uploaded chunk
      await saveChunk(chunkDir, chunkIndex, req.files.chunk[0].buffer);

      const timestamp = Math.floor(Date.now() / 1000);
      const originalCSVFileName = req.files.csvFile[0].originalname;
      const csvFileName = `${timestamp}_${originalCSVFileName}`;
      const csvFilePath = path.join(csvFileDir, csvFileName);

      // Step 5: If the last chunk, process merging and extraction
      if (parseInt(chunkIndex, 10) + 1 === parseInt(totalChunks, 10)) {
        // Save the CSV file only on the last chunk
        if (req.files.csvFile) {
          console.log("Saving CSV file to:", csvFilePath);
          await fs.writeFile(csvFilePath, req.files.csvFile[0].buffer);

          if (!fs.existsSync(csvFilePath)) {
            console.error("CSV file write failed:", csvFilePath);
            return res.status(500).json({ error: "Failed to save CSV file." });
          }
        }

        // Step 6: Merge all chunks into a final ZIP file
        const finalFilePath = await mergeChunks(
          chunkDir,
          uploadDir,
          zipFileName,
          totalChunks
        );

        // Step 7: Extract the final ZIP file
        const destinationFolderPath = path.join(
          __dirname,
          "../../extractedFiles",
          `${timestamp}_${zipFileName}`
        );

        await extractZipFile(finalFilePath, destinationFolderPath);

        // console.log(finalFilePath, "finalFilePath");
        // console.log(destinationFolderPath, "destinationFolderPath");

        // Step 8: Process the extracted files and CSV
        const allDirectories = getAllDirectories(destinationFolderPath);

        // console.log(allDirectories, "allDirectories");

        if (!allDirectories || allDirectories.length === 0) {
          console.error("No directories found after extraction.");
          return res.status(500).json({
            error: "Extraction failed. No directories found.",
          });
        }

        const pathDir = `${timestamp}_${zipFileName}/${allDirectories.join(
          "/"
        )}`;

        // console.log(pathDir, "pathDir");

        const createdFile = await Files.create({
          csvFile: csvFileName,
          zipFile: `${timestamp}_${zipFileName}`,
          templeteId: id,
        });

        if (fs.existsSync(csvFilePath)) {
          await processCSV(csvFilePath, res, req, createdFile, pathDir);
        } else {
          res
            .status(404)
            .json({ error: "CSV file not found after extraction." });
        }
      } 
      else {
        // Step 9: Respond with the status of the chunk upload
        res.status(200).json({ message: `Chunk ${chunkIndex} uploaded.` });
      }
    } catch (error) {
      console.error("Error during chunk upload:", error);
      res.status(500).json({ error: "Chunk upload failed." });
    }
  });
};

module.exports = handleUpload;
