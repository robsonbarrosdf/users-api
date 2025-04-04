const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

const User = require('./User')(sequelize, Sequelize.DataTypes);

module.exports = {
  sequelize,
  User
};