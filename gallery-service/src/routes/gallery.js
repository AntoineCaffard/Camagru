'use strict';

const router = require('express').Router();
const axios = require('axios');

const MEDIA_URL = process.env.MEDIA_SERVICE_URL || 'http://localhost:3002';

// GET /gallery  – paginated gallery fetched from media-service
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const { data } = await axios.get(`${MEDIA_URL}/media`, { params: { page, limit } });
    res.json(data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    next(err);
  }
});

// GET /gallery/:id  – single image detail
router.get('/:id', async (req, res, next) => {
  try {
    const { data } = await axios.get(`${MEDIA_URL}/media/${req.params.id}`);
    res.json(data);
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    next(err);
  }
});

module.exports = router;
