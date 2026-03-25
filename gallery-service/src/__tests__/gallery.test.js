'use strict';

const request = require('supertest');
const app = require('../app');

jest.mock('axios');
const axios = require('axios');

afterEach(() => jest.clearAllMocks());

describe('GET /health', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('gallery-service');
  });
});

describe('GET /gallery', () => {
  it('proxies images from media-service', async () => {
    axios.get.mockResolvedValueOnce({ data: { images: [], total: 0, page: 1, limit: 20 } });
    const res = await request(app).get('/gallery');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('images');
  });

  it('returns upstream error status', async () => {
    const err = new Error('Not found');
    err.response = { status: 404, data: { error: 'not found' } };
    axios.get.mockRejectedValueOnce(err);
    const res = await request(app).get('/gallery/bad-id');
    expect(res.status).toBe(404);
  });
});
