const request = require('supertest');
const app = require('../server');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

describe('Operações CRUD de Usuários', () => {
  let authToken;
  let testUserId;

  // Usuário de teste pré-cadastrado
  const testUser = {
    name: 'Usuário CRUD Teste',
    email: 'crudtest@example.com',
    password: 'senhaSegura123',
    address: 'Rua dos Testes, 123',
    phone: '11999998888'
  };

  beforeAll(async () => {
    // Limpa e cria um usuário de teste diretamente no banco
    await User.destroy({ where: {} });
    const user = await User.create(testUser);
    testUserId = user.id;

    // Gera token válido
    authToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });

  test('GET /api/users - Listar todos usuários', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.some(u => u.id === testUserId)).toBe(true);
  });

  test('GET /api/users/:id - Obter usuário específico', async () => {
    const response = await request(app)
      .get(`/api/users/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(testUserId);
    expect(response.body.email).toBe(testUser.email);
  });

  test('PUT /api/users/:id - Atualizar usuário', async () => {
    const updatedData = { 
      name: 'Nome Atualizado',
      phone: '11900001111'
    };

    const response = await request(app)
      .put(`/api/users/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData);
    
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.phone).toBe(updatedData.phone);
  });

  test('DELETE /api/users/:id - Remover usuário', async () => {
    const response = await request(app)
      .delete(`/api/users/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(200);
    
    // Verifica se foi realmente removido
    const user = await User.findByPk(testUserId);
    expect(user).toBeNull();
  });

  test('Tentar acessar usuário removido deve retornar 404', async () => {
    const response = await request(app)
      .get(`/api/users/${testUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.status).toBe(404);
  });
});