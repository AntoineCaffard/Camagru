'use strict';

const request = require('supertest');
const app = require('../app');

jest.mock('../utils/mailer', () => ({
  sendMail: jest.fn().mockResolvedValue({}),
}));

const { sendMail } = require('../utils/mailer');

afterEach(() => jest.clearAllMocks());

describe('GET /health', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.service).toBe('notification-service');
  });
});

describe('POST /notifications/comment', () => {
  it('returns 400 when "to" is missing', async () => {
    const res = await request(app)
      .post('/notifications/comment')
      .send({ commenterUsername: 'alice', commentBody: 'nice!', imageId: 'img-1' });
    expect(res.status).toBe(400);
  });

  it('sends an email and returns 202', async () => {
    const res = await request(app).post('/notifications/comment').send({
      to: 'bob@example.com',
      commenterUsername: 'alice',
      commentBody: 'nice!',
      imageId: 'img-1',
    });
    expect(res.status).toBe(202);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });
});

describe('POST /notifications/welcome', () => {
  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/notifications/welcome').send({ to: 'a@b.com' });
    expect(res.status).toBe(400);
  });

  it('sends a welcome email and returns 202', async () => {
    const res = await request(app)
      .post('/notifications/welcome')
      .send({ to: 'alice@example.com', username: 'alice' });
    expect(res.status).toBe(202);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });
});
