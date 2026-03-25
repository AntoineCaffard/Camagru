'use strict';

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const USER_URL         = process.env.USER_SERVICE_URL         || 'http://localhost:3001';
const MEDIA_URL        = process.env.MEDIA_SERVICE_URL        || 'http://localhost:3002';
const GALLERY_URL      = process.env.GALLERY_SERVICE_URL      || 'http://localhost:3003';
const SOCIAL_URL       = process.env.SOCIAL_SERVICE_URL       || 'http://localhost:3004';
const NOTIFICATION_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005';

function proxy(target) {
  return createProxyMiddleware({ target, changeOrigin: true });
}

const app = express();

app.use(cors());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'api-gateway' }));

// Route table
app.use('/auth',          proxy(USER_URL));
app.use('/users',         proxy(USER_URL));
app.use('/media',         proxy(MEDIA_URL));
app.use('/overlays',      proxy(MEDIA_URL));
app.use('/files',         proxy(MEDIA_URL));
app.use('/gallery',       proxy(GALLERY_URL));
app.use('/likes',         proxy(SOCIAL_URL));
app.use('/comments',      proxy(SOCIAL_URL));
app.use('/notifications', proxy(NOTIFICATION_URL));

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

module.exports = app;
