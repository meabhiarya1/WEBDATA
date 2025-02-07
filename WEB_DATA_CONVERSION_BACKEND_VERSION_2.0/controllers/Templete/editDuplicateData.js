const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const Files = require("../../models/TempleteModel/files");
const UpdatedData = require("../../models/TempleteModel/updatedData");
const jsonToCsv = require("../../services/json_to_csv");

const editDuplicateData = async (req, res, next) => {
  const { index, fileID, rowData, updatedColumn } = req.body;

  try {
    if (!fileID) {
      return res.status(400).json({ error: "File ID not provided" });
    }

    const fileData = await Files.findByPk(fileID);

    if (!fileData || !fileData.csvFile) {
      return res.status(404).json({ error: "File not found" });
    }

    const filename = fileData.csvFile;
    const filePath = path.join(__dirname, "../../csvFile", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    let data = XLSX.utils.sheet_to_json(worksheet, {
      raw: true,
      defval: "",
      header: 1,
    });

    // Find the index of the column with the heading "User Details" and "Updated Details"
    const userDetailsIndex = data[0].indexOf("User Details");
    const previousValueIndex = data[0].indexOf("Previous Values");
    const updatedValueIndex = data[0].indexOf("Updated Values");
    const updatedColIndex = data[0].indexOf("Updated Col. Name");

    const checkAndAddColumn = (columnName, index) => {
      if (index === -1) {
        data[0].push(columnName);
        return data[0].length - 1;
      }
      return index;
    };

    const userDetailsIdx = checkAndAddColumn("User Details", userDetailsIndex);
    const previousValueIdx = checkAndAddColumn(
      "Previous Values",
      previousValueIndex
    );
    const updatedValueIdx = checkAndAddColumn(
      "Updated Values",
      updatedValueIndex
    );
    const updatedColIdx = checkAndAddColumn(
      "Updated Col. Name",
      updatedColIndex
    );

    // Initialize columns if undefined
    for (let i = 1; i < data.length; i++) {
      data[i][userDetailsIdx] = data[i][userDetailsIdx] || "No change";
      data[i][previousValueIdx] = data[i][previousValueIdx] || "No change";
      data[i][updatedValueIdx] = data[i][updatedValueIdx] || "No change";
      data[i][updatedColIdx] = data[i][updatedColIdx] || "No change";
    }

    // Update the specific row in the array
    data[index + 1] = Object.values(rowData);

    // Update the specific row in the array with userName and email
    const updateColumnValues = (key) => updatedColumn[key][0];
    const previousColumnValues = (key) => updatedColumn[key][1];

    data[index + 1][userDetailsIdx] = `${req.userId}`;
    data[index + 1][previousValueIdx] = Object.keys(updatedColumn)
      .map(previousColumnValues)
      .join(",");
    data[index + 1][updatedValueIdx] = Object.keys(updatedColumn)
      .map(updateColumnValues)
      .join(",");
    data[index + 1][updatedColIdx] = Object.keys(updatedColumn).join(",");

    await UpdatedData.create({
      updatedColumn: Object.keys(updatedColumn).join(","),
      previousData: Object.keys(updatedColumn)
        .map(previousColumnValues)
        .join(","),
      currentData: Object.keys(updatedColumn).map(updateColumnValues).join(","),
      fileId: fileID,
      userId: req.userId,
    });

    // Convert the updated array of rows back to JSON format
    const headers = data[0];
    const jsonArray = data.slice(1).map((row) => {
      const rowObject = {};
      headers.forEach((header, j) => {
        rowObject[header] = row[j];
      });
      return rowObject;
    });

    // Convert the updated JSON data back to CSV format using the jsonToCsv function
    const updatedCSVContent = jsonToCsv(jsonArray);

    if (!updatedCSVContent) {
      throw new Error("Error converting updated JSON to CSV");
    }

    fs.unlinkSync(filePath);
    fs.writeFileSync(filePath, updatedCSVContent, { encoding: "utf8" });

    return res.status(200).json({ message: "Data Updated successfully" });
  } catch (error) {
    console.error("Error handling data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = editDuplicateData;
