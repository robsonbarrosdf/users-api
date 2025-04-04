const request = require('supertest');
const app = require('../server');
const { User } = require('../models');

describe('Operações CRUD de Usuários', () => {
  let authToken;
  let createdUserId;

  // Dados de teste
  const testUser = {
    name: 'Usuário Teste',
    email: 'crudtest@example.com',
    password: 'senhaSegura123',
    address: 'Rua dos Testes, 123',
    phone: '11999998888'
  };

  const updatedData = {
    name: 'Usuário Atualizado',
    address: 'Nova Rua, 456'
  };

  beforeAll(async () => {
    // Limpa a tabela antes dos testes
    await User.destroy({ where: {} });
    
    // Registra um usuário e obtém o token
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    authToken = registerResponse.body.token;
    createdUserId = registerResponse.body.id;
  });

  test('Listar todos os usuários (GET /api/users)', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.some(user => user.email === testUser.email)).toBeTruthy();
  });

  test('Obter usuário específico (GET /api/users/:id)', async () => {
    const response = await request(app)
      .get(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(createdUserId);
    expect(response.body.email).toBe(testUser.email);
  });

  test('Atualizar usuário (PUT /api/users/:id)', async () => {
    const response = await request(app)
      .put(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedData);
    
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedData.name);
    expect(response.body.address).toBe(updatedData.address);
    // Verifica se campos não enviados permanecem iguais
    expect(response.body.email).toBe(testUser.email);
    expect(response.body.phone).toBe(testUser.phone);
  });

  test('Tentar atualizar usuário sem autenticação deve falhar', async () => {
    const response = await request(app)
      .put(`/api/users/${createdUserId}`)
      .send(updatedData);
    
    expect(response.statusCode).toBe(401);
  });

  test('Deletar usuário (DELETE /api/users/:id)', async () => {
    const response = await request(app)
      .delete(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.statusCode).toBe(200);
    
    // Verifica se o usuário foi realmente removido
    const deletedUser = await User.findByPk(createdUserId);
    expect(deletedUser).toBeNull();
  });

  test('Tentar acessar usuário deletado deve retornar 404', async () => {
    const response = await request(app)
      .get(`/api/users/${createdUserId}`)
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(response.statusCode).toBe(404);
  });
});