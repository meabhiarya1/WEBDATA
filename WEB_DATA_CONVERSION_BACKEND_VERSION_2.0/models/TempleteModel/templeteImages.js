const Sequelize = require("sequelize");
const sequelize = require("../../utils/database");

const ImageDataPath = sequelize.define("imagedatapath", {
  imagePath: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  templeteId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "templetes", // The name of the related table
      key: "id",
    },
    onDelete: "CASCADE",
  },
});

module.exports = ImageDataPath;
