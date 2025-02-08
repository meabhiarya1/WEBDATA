const UserActivity = require("../../models/UserActivity");

const moment = require("moment-timezone");

const userDetails = async (req, res) => {
  const userId = req.params.id;

  try {
    // Validate the userId
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userActivitydetails = await UserActivity.findAll({
      where: {
        userId: userId,
      },
    });

    // Check if any activity records were found
    if (!userActivitydetails || userActivitydetails.length === 0) {
      return res.status(404).json({ error: "No activity found for this user" });
    }

    // Convert timestamps to India Standard Time (IST)
    const formattedDetails = userActivitydetails.map((activity) => ({
      ...activity.dataValues,
      timestamp: moment(activity.timestamp).tz("Asia/Kolkata").format(),
    }));

    res.status(200).json({ userActivitydetails: formattedDetails });
  } catch (err) {
    res.status(500).json({
      error: "An error occurred while fetching user activity details",
      details: err.message,
    });
  }
};

module.exports = userDetails;
