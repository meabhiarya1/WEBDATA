const User = require("../../models/User");
const UserActivity = require("../../models/UserActivity");

const logout = async (req, res) => {
  const { userId } = req.body; // Assuming userId is passed in the request body or you can get it from token

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Log the logout event
    await UserActivity.create({
      userId: user.id,
      action: "logout",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = logout;
