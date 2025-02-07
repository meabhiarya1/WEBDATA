const Sequelize = require("sequelize");

const sequelize = require("../../utils/database");

const UpdatedDetails = sequelize.define("updatedDetails", {
  updatedColumn: {
    type: Sequelize.TEXT,
  },
  previousData: {
    type: Sequelize.TEXT,
  },
  currentData: {
    type: Sequelize.STRING,
  },
  rowIndex: {
    type: Sequelize.STRING,
  },
  imageNames: {
    type: Sequelize.STRING,
  },
  verified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  fileId: {
    type: Sequelize.STRING,
  },
});

module.exports = UpdatedDetails;
