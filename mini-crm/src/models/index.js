
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const config = require('../config');

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config.db);
} else {
  sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db);
}

const models = [
  require('./customer')(sequelize, Sequelize.DataTypes),
  require('./product')(sequelize, Sequelize.DataTypes),
  require('./order')(sequelize, Sequelize.DataTypes),
  require('./product')(sequelize, Sequelize.DataTypes),
  require('./order')(sequelize, Sequelize.DataTypes),
  require('./orderItem')(sequelize, Sequelize.DataTypes),
  require('./etlImport')(sequelize, Sequelize.DataTypes),
];

models.forEach(model => {
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
