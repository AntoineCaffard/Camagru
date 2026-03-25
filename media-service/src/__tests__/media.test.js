'use strict';

const request = require('supertest');
const app = require('../app');

jest.mock('../models/db', () => ({ query: jest.fn() }));

const db = require('../models/db');

afterEach(() => jest.clearAllMocks());

describe('GET /health', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('media-service');
  });
});

describe('GET /media', () => {
  it('returns paginated images', async () => {
    db.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ count: '0' }] });

    const res = await request(app).get('/media');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('images');
    expect(res.body).toHaveProperty('total');
  });
});

describe('GET /media/:id', () => {
  it('returns 404 when image not found', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/media/nonexistent-id');
    expect(res.status).toBe(404);
  });
});
