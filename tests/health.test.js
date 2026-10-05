import request from 'supertest';
import app from '../src/app.js';

describe('Health Check API Endpoint', () => {
  it('GET /api/v1/health should return 200 with service metadata', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Health check passed');
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('service', 'VerveMarket E-Commerce Marketplace API');
    expect(res.body.data).toHaveProperty('database');
    expect(res.body.data).toHaveProperty('uptimeSeconds');
  });

  it('GET /api/v1/non-existent-route should return standardized 404 ApiError', async () => {
    const res = await request(app).get('/api/v1/non-existent-route');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('errorCode', 'ROUTE_NOT_FOUND');
    expect(res.body).toHaveProperty('message');
  });
});
