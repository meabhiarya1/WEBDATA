const Assigndata = require("../../models/TempleteModel/assigndata");
const User = require('../../models/User');

const getUserTasksDetails = async (req, res) => {
    const email = req.params.email;
    try {
        if (!email) {
            return res.status(400).json({ error: "User email is required!" });
        }
        const userDetail = await User.findOne({ where: { email: email } });

        if (!userDetail) {
            return res.status(200).json(userDetail);
        }

        const response = await Assigndata.findAll({ where: { userId: userDetail.id } });
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = getUserTasksDetails;