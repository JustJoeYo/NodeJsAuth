/*const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;*/




'use strict';
const Sequelize = require('sequelize');
const cls = require('cls-hooked');
const namespace = cls.createNamespace('my-very-own-namespace');
Sequelize.useCLS(namespace);
const config = require("../config/db.config.js");

// server connection settings
var db_instance = new Sequelize(config.DB.database, config.DB.username, config.DB.password, {
  host: config.DB.host,
  dialect: config.dialect,
  define: {
    timestamps: false
  },
  logging: false
});

var sequelize = db_instance;

// checks the database connectivity
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// create the modal instance 
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;