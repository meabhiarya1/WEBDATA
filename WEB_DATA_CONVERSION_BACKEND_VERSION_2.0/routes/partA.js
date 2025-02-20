const express = require("express");
const uploadCsvPartA = require("../middleware/partAMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const PartA = require("../controllers/PartA/PartA");
const errorData = require("../controllers/PartA/errorData");

const router = express.Router();

router.post("/uploadfiles", authMiddleware, uploadCsvPartA, PartA);

router.get("/geterrordata/:id", errorData);

module.exports = router;
