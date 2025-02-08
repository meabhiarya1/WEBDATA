// const Sequelize = require("sequelize");

// const sequelize = new Sequelize("omrusermanagement", "root", "12345678", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;

// const Sequelize = require("sequelize");

// const sequelize = new Sequelize("omrscannerduplex", "root", "root", {
//   dialect: "mysql",
//   host: "localhost",
// });

const Sequelize = require("sequelize");

const sequelize = new Sequelize("webdataconversion_2", "root", "root", {
  dialect: "mysql",
  host: "localhost",
  logging: false,
  timezone: "+05:30",
});

module.exports = sequelize;
