// // Para H2 Database
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize({
//   dialect: 'h2',
//   storage: './database.h2', // Arquivo do banco de dados
//   username: 'sa',
//   password: '',
//   logging: false
// });

// module.exports = sequelize;

// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.NODE_ENV === 'test' 
    ? './database.test.sqlite' 
    : './database.sqlite',
  logging: false
});

// Adicione esta linha para exportar tanto a instância quanto a classe
module.exports = {
  sequelize,
  Sequelize
};