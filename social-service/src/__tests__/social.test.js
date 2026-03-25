'use strict';

const request = require('supertest');
const app = require('../app');

jest.mock('../models/db', () => ({ query: jest.fn() }));
jest.mock('axios');

const db = require('../models/db');

afterEach(() => jest.clearAllMocks());

describe('GET /health', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('social-service');
  });
});

describe('GET /likes/:imageId', () => {
  it('returns like count', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ count: '5' }] });
    const res = await request(app).get('/likes/img-1');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(5);
  });
});

describe('GET /comments/:imageId', () => {
  it('returns comments array', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/comments/img-1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('POST /comments/:imageId', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).post('/comments/img-1').send({ body: 'hello' });
    expect(res.status).toBe(401);
  });

  it('returns 400 when body is empty', async () => {
    // sign a fake JWT
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ sub: 'user-1', username: 'alice' }, 'dev_secret');
    const res = await request(app)
      .post('/comments/img-1')
      .set('Authorization', `Bearer ${token}`)
      .send({ body: '   ' });
    expect(res.status).toBe(400);
  });
});
