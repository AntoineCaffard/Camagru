'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');
const mediaRoutes = require('./routes/media');
const overlayRoutes = require('./routes/overlays');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'media-service' }));

// Serve uploaded files statically
const uploadDir = process.env.UPLOAD_DIR || './uploads';
app.use('/files', express.static(path.resolve(uploadDir)));

app.use('/media', mediaRoutes);
app.use('/overlays', overlayRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
