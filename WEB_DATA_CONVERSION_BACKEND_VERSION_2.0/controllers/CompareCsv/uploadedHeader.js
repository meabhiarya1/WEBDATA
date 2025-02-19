
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

exports.getCsvHeaders=async(req, res)=> {
  try {
    const { fileName } = req.query;
    if (!fileName) {
      return res.status(400).json({ error: "Missing fileName parameter." });
    }

    const filePath = path.join(__dirname, '../', '../', 'csvFile', fileName);
console.log(filePath)
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found." });
    }

    // Read the CSV file and extract headers
    const headers = await new Promise((resolve, reject) => {
      const stream = fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (headerList) => {
          stream.destroy(); // Stop reading after getting headers
          resolve(headerList);
        })
        .on('error', (error) => reject(error));
    });

    return res.json({ headers });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
