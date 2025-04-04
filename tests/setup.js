const { sequelize } = require('../config/db');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Recria o banco antes dos testes
});

afterAll(async () => {
  await sequelize.close(); // Fecha a conexão
});