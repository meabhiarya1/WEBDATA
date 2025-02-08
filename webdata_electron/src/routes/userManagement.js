// routes/users.js
const express = require("express");
const router = express.Router();
const createUser = require("../controllers/userManagement/CreateUser");
const allUser = require("../controllers/userManagement/Alluser");
const singleUser = require("../controllers/userManagement/singleUser");
const updatedUser = require("../controllers/userManagement/UpdateUser");
const deleteUser = require("../controllers/userManagement/DeleteUser");
const logIn = require("../controllers/userManagement/Login");
const logout = require("../controllers/userManagement/Logout");
const authMiddleware = require("../middleware/authMiddleware");
const getUserActivityDetails = require("../controllers/userManagement/userActivityDetails");

router.post("/createuser", authMiddleware, createUser);
router.post("/getallusers", authMiddleware, allUser);
router.post("/getuser", authMiddleware, singleUser);
router.post("/updateuser/:id", authMiddleware, updatedUser);
router.post("/deleteuser/:id", authMiddleware, deleteUser);
router.get('/getuseractivitydetails/:email', authMiddleware, getUserActivityDetails);
router.post("/login", logIn);
router.post("/logout", logout);


module.exports = router;
