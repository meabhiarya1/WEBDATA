const Sequelize = require("sequelize");

const sequelize = require("../../utils/database");

const MappedData = sequelize.define("mappeddata", {
  key: {
    type: Sequelize.STRING,
  },
  value: {
    type: Sequelize.STRING,
  },

  templeteId: {
    type: Sequelize.INTEGER,
    references: {
      model: "templetes", // 'Templete' refers to the table name
      key: "id",
    },
  },
});

module.exports = MappedData;
