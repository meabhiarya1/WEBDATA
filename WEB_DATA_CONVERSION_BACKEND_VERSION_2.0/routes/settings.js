const express = require("express");
const router = express.Router();

const { onCsvBackupHandler, onMysqlBackupHandler } = require('../controllers/Settings/Settings');
const authMiddleware = require("../middleware/authMiddleware");

router.post("/csvbackup", authMiddleware, onCsvBackupHandler);
router.post('/mysqlbackup', authMiddleware, onMysqlBackupHandler);

module.exports = router;