const fs = require("fs");
const os = require("os");
const path = require("path");
const { exec } = require("child_process");


const onCsvBackupHandler = async (req, res) => {
    try {
        const csvFolderPath = path.join(__dirname, "../../csvFile");
        const desktopPath = path.join(os.homedir(), "Desktop");
        const backupFolderPath = path.join(desktopPath, "webdata_csv_backup");
        console.log(csvFolderPath)

        // Check if CSV folder exists
        if (!fs.existsSync(csvFolderPath)) {
            return res.status(404).json({ message: "CSV folder not found!" });
        }


        // Check if the backup folder exists
        if (fs.existsSync(backupFolderPath)) {
            // Remove existing backup folder
            fs.rmSync(backupFolderPath, { recursive: true, force: true });
            console.log("Existing backup folder removed.");
        }


        // Copy CSV folder to the backup location
        fs.cpSync(csvFolderPath, backupFolderPath, { recursive: true });
        console.log(`CSV folder backed up successfully to ${backupFolderPath}`);


        res.status(200).json({ message: "Backup completed successfully!" });
    } catch (error) {
        console.error("Error during backup:", error);
        res.status(500).json({ message: "An error occurred during the backup.", error: error.message });
    }
}

const onMysqlBackupHandler = async (req, res) => {
    try {
        // Prepare the backup file path with the current timestamp
        const timestamp = new Date().toISOString().replace(/[-T:\.Z]/g, '_');
        const desktopPath = path.join(os.homedir(), "Desktop");
        const backupFolderPath = path.join(desktopPath, "mysql_backup");
        const backupFilePath = path.join(backupFolderPath, `backup_${"webdataconversion_2"}_${timestamp}.sql`);

        // Ensure the backup folder exists
        if (!fs.existsSync(backupFolderPath)) {
            fs.mkdirSync(backupFolderPath, { recursive: true });
        }

        // Update mysqldump command - quote the path if there are spaces in the path
        const mysqldumpPath = `"${process.env.MYSQL_PATH}"`; // Enclose the path in double quotes
        const command = `${mysqldumpPath} -u ${process.env.SQL_USER} -p${process.env.SQL_PASS} ${process.env.SQL_DATABASE_NAME} > "${backupFilePath.replace(/\\/g, '\\\\')}"`;

        // Execute the backup command
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error during MySQL backup: ${stderr}`);
                return res.status(500).json({ message: "An error occurred during MySQL backup", error: stderr });
            }
            console.log(`Backup successful! File saved at ${backupFilePath}`);
            res.status(200).json({ message: "MySQL backup completed successfully!", backupFilePath });
        });

    } catch (error) {
        console.error("Error during MySQL backup:", error);
        res.status(500).json({ message: "An error occurred during MySQL backup", error: error.message });
    }
};


module.exports = { onCsvBackupHandler, onMysqlBackupHandler };