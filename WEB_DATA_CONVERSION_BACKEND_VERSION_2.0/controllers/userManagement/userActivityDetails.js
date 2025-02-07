const UserActivity = require("../../models/UserActivity");
const User = require('../../models/User');


const moment = require("moment-timezone");

const getUserActivityDetails = async (req, res) => {
    const email = req.params.email;
    try {
        // Validate the userId
        if (!email) {
            return res.status(400).json({ error: "User email is required!" });
        }

        const userDetail = await User.findOne({
            where: {
                email: email,
            },
        });

        if (!userDetail) {
            return res.status(404).json({ error: "User not found" });
        }


        const userActivitydetails = await UserActivity.findAll({
            where: {
                userId: userDetail.id,
            },
        });

        // Check if any activity records were found
        if (!userActivitydetails || userActivitydetails.length === 0) {
            return res.status(404).json({ error: "No activity found for this user" });
        }

        // Convert timestamps to India Standard Time (IST)
        const data = userActivitydetails.map((activity) => ({
            ...activity.dataValues,
            timestamp: moment(activity.timestamp).tz("Asia/Kolkata").format(),
        }));

        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({
            error: "An error occurred while fetching user activity details",
            details: err.message,
        });
    }
}


module.exports = getUserActivityDetails;