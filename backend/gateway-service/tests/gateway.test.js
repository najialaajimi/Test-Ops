const request = require('supertest');
const app = require('../src/index');

describe('Gateway Service - Health', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('gateway-service');
  });
});

describe('Gateway Service - 404', () => {
  it('GET /unknown returns 404', async () => {
    const res = await request(app).get('/unknown');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Route not found');
  });
});
