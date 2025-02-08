const Sequelize = require("sequelize");

const sequelize = require("../../utils/database");

const Templete = sequelize.define("templetes", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  pageCount: {
    type: Sequelize.INTEGER,
  },
  TempleteType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  typeOption: {
    type: Sequelize.STRING,
  },

  patternDefinition: {
    type: Sequelize.STRING,
  },
  blankDefination: {
    type: Sequelize.STRING,
  },
  isPermittedToEdit: {
    type: Sequelize.BOOLEAN,
  },
});

module.exports = Templete;
