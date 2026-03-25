'use strict';

const request = require('supertest');
const app = require('../app');

// Mock the DB module so tests don't need a real Postgres instance
jest.mock('../models/db', () => ({
  query: jest.fn(),
}));

const db = require('../models/db');

afterEach(() => jest.clearAllMocks());

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('user-service');
  });
});

describe('POST /auth/register', () => {
  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/auth/register').send({ username: 'alice' });
    expect(res.status).toBe(400);
  });

  it('registers a new user and returns a token', async () => {
    const fakeUser = { id: 'uuid-1', username: 'alice', email: 'alice@example.com', created_at: new Date() };
    db.query.mockResolvedValueOnce({ rows: [fakeUser] });

    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'alice', email: 'alice@example.com', password: 'secret123' });

    expect(res.status).toBe(201);
    expect(res.body.user.username).toBe('alice');
    expect(res.body.token).toBeDefined();
  });

  it('returns 409 on duplicate key', async () => {
    const pgError = new Error('duplicate');
    pgError.code = '23505';
    db.query.mockRejectedValueOnce(pgError);

    const res = await request(app)
      .post('/auth/register')
      .send({ username: 'alice', email: 'alice@example.com', password: 'secret123' });

    expect(res.status).toBe(409);
  });
});

describe('POST /auth/login', () => {
  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('returns 401 when user not found', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).post('/auth/login').send({ email: 'x@y.com', password: 'pw' });
    expect(res.status).toBe(401);
  });
});
