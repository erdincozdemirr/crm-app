const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

describe('Customers API Integration', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('GET /api/customers initially returns empty array', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('POST /api/customers creates customer', async () => {
    const payload = {
      firstName: 'Test',
      lastName: 'User',
      phone: '+905551112233'
    };

    const res = await request(app)
      .post('/api/customers')
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.firstName).toBe('Test');
    expect(res.body.id).toBeDefined();
  });

  test('GET /api/customers returns created customer', async () => {
    const res = await request(app).get('/api/customers');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].firstName).toBe('Test');
  });
});
