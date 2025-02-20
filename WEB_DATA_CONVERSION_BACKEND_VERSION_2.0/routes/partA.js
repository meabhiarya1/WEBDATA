const express = require("express");
const uploadCsvPartA = require("../middleware/partAMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const PartA = require("../controllers/PartA/PartA");

const router = express.Router();

router.post("/uploadfiles", authMiddleware, uploadCsvPartA, PartA);

module.exports = router;
