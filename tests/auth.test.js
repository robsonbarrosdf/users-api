// const request = require('supertest');
// const app = require('../server');
// const { User } = require('../models');

// describe('Autenticação', () => {
//   const testUser = {
//     name: 'Test User',
//     email: 'test@example.com',
//     password: 'password123',
//     address: '123 Test St',
//     phone: '555-1234'
//   };

//   beforeAll(async () => {
//     // Limpa a tabela antes dos testes
//     await User.destroy({ where: {} });
//   });

//   test('Registro de novo usuário', async () => {
//     const response = await request(app)
//       .post('/api/auth/register')  // ← Corrigido para usar o endpoint correto
//       .send(testUser);
    
//     expect(response.statusCode).toBe(201);
//     expect(response.body).toHaveProperty('token');
//     expect(response.body).toHaveProperty('email', testUser.email);
//   });

//   test('Login com credenciais válidas', async () => {
//     // Primeiro registra o usuário (ou usa o mesmo do teste anterior)
//     await request(app)
//       .post('/api/auth/register')
//       .send(testUser);

//     const response = await request(app)
//       .post('/api/auth/login')
//       .send({
//         email: testUser.email,
//         password: testUser.password
//       });
    
//     expect(response.statusCode).toBe(200);
//     expect(response.body).toHaveProperty('token');
//   });

//   test('Login com credenciais inválidas', async () => {
//     const response = await request(app)
//       .post('/api/auth/login')
//       .send({
//         email: 'emailinexistente@test.com',
//         password: 'senhaerrada'
//       });
    
//     expect(response.statusCode).toBe(401);
//   });

//   test('Registro com campos faltando deve falhar', async () => {
//     const response = await request(app)
//       .post('/api/auth/register')
//       .send({
//         name: 'Usuário Incompleto',
//         email: 'incompleto@test.com'
//         // Faltam password, address e phone
//       });
    
//     expect(response.statusCode).toBe(400);
//   });  
// });

const request = require('supertest');
const app = require('../server');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

describe('Operações CRUD de Usuários', () => {
  let authToken;
  let createdUserId;

  beforeAll(async () => {
    // Cria um usuário de teste diretamente no banco
    const testUser = await User.create({
      name: 'Admin Teste',
      email: 'admin@test.com',
      password: 'senhaSegura123',
      address: 'Endereço Admin',
      phone: '11999999999'
    });

    // Gera token manualmente para garantir validade
    authToken = jwt.sign(
      { id: testUser.id, email: testUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    createdUserId = testUser.id;
  });

  test('GET /api/users deve retornar 200', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${authToken}`); // Formato correto
    
    console.log('Response status:', response.statusCode);
    console.log('Response body:', response.body);
    
    expect(response.statusCode).toBe(200);
  });
});