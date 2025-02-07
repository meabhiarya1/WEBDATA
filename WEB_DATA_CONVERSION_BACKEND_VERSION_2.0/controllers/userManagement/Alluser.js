const User = require("../../models/User");

const getUsers = async (req, res) => {
  const userRole = req.role;
  // console.log(req)
  if (userRole == "Moderator" || userRole == "Admin") {
    try {
      const selectedAttributes = [
        "id",
        "userName",
        "mobile",
        "email",
        "permissions",
        "role",
      ];
      const users = await User.findAll({
        attributes: selectedAttributes,
      });
      // console.log(users);
      res.status(201).json({ message: "Users get successfully", users });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    return res
      .status(500)
      .json({ message: "Only Moderator or Admin can access this." });
  }
};
module.exports = getUsers;
