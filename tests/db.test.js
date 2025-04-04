const { sequelize } = require('../config/db');

describe('Conexão com o Banco de Dados', () => {
  test('Deve autenticar com sucesso', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  test('Deve sincronizar os modelos', async () => {
    await expect(sequelize.sync()).resolves.not.toThrow();
  });
});