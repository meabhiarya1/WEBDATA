const File = require("../../models/TempleteModel/files");
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

const removeLeadingTrailingZeros = (value) => {
    if (typeof value === 'string' || typeof value === 'number') {
        return String(value).replace(/^0+/, '');
    }
    return value;
};

const TaskStatusDetails = async (req, res) => {
    const { id } = req.params;
    const { selectedHeader, headerValue } = req.body;

    try {
        const fileData = await File.findOne({ where: { id } });

        if (!fileData) {
            return res.status(404).json({ error: "File not found" });
        }

        const filename = fileData.csvFile;
        const filePath = path.join(__dirname, "../../csvFile/", filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "CSV file not found" });
        }

        let workbook, worksheet;
        workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        // Remove leading and trailing zeros from headerValue
        const cleanedHeaderValue = removeLeadingTrailingZeros(headerValue);

        // Filter the rows where the value of selectedHeader matches the cleaned headerValue
        const data = jsonData.filter((row) => {
            if (row.hasOwnProperty(selectedHeader)) {
                const cellValue = removeLeadingTrailingZeros(row[selectedHeader]);
                return cellValue === cleanedHeaderValue;
            }
            return false;
        });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = TaskStatusDetails;
