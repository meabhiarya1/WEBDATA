const Sequelize = require("sequelize");

const sequelize = require("../../utils/database");

const MetaData = sequelize.define("templetedata", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  attribute: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  coordinateX: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  coordinateY: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  width: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  height: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  fieldType: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  dataFieldType: {
    type: Sequelize.STRING,
  },

  pageNo: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  fieldRange: {
    type: Sequelize.STRING,
  },

  fieldLength: {
    type: Sequelize.STRING,
  },

  templeteId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "templetes", // 'Templete' refers to the table name
      key: "id",
    },
  },
});

module.exports = MetaData;
