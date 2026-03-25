'use strict';

const router = require('express').Router();
const { query } = require('../models/db');
const { authenticate } = require('../middleware/auth');

// POST /likes/:imageId
router.post('/:imageId', authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      'INSERT INTO likes (image_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [req.params.imageId, req.user.sub]
    );
    if (!rows[0]) return res.status(409).json({ error: 'Already liked' });
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /likes/:imageId
router.delete('/:imageId', authenticate, async (req, res, next) => {
  try {
    await query('DELETE FROM likes WHERE image_id = $1 AND user_id = $2', [
      req.params.imageId,
      req.user.sub,
    ]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// GET /likes/:imageId  – count + whether current user liked
router.get('/:imageId', async (req, res, next) => {
  try {
    const countResult = await query('SELECT COUNT(*) FROM likes WHERE image_id = $1', [req.params.imageId]);
    res.json({ count: parseInt(countResult.rows[0].count) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
