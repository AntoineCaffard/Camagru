'use strict';

const request = require('supertest');
const app = require('../app');

describe('GET /health', () => {
  it('returns 200 with service name', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('api-gateway');
  });
});

describe('unknown routes', () => {
  it('returns 404 for unknown path', async () => {
    const res = await request(app).get('/unknown-route-xyz');
    expect(res.status).toBe(404);
  });
});
