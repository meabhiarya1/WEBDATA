// In your UserActivity model (e.g., UserActivity.js)
const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const UserActivity = sequelize.define("UserActivity", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = UserActivity;
