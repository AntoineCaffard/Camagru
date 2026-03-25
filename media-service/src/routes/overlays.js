'use strict';

const router = require('express').Router();
const { query } = require('../models/db');

// GET /overlays
router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM overlays ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
