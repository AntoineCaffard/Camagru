'use strict';

const router = require('express').Router();
const axios = require('axios');
const { query } = require('../models/db');
const { authenticate } = require('../middleware/auth');

const NOTIFICATION_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005';

// POST /comments/:imageId
router.post('/:imageId', authenticate, async (req, res, next) => {
  try {
    const { body } = req.body;
    if (!body || !body.trim()) {
      return res.status(400).json({ error: 'Comment body is required' });
    }

    const { rows } = await query(
      'INSERT INTO comments (image_id, user_id, username, body) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.params.imageId, req.user.sub, req.user.username, body.trim()]
    );

    // Fire-and-forget notification
    axios
      .post(`${NOTIFICATION_URL}/notifications/comment`, {
        imageId: req.params.imageId,
        commenterUsername: req.user.username,
        commentBody: body.trim(),
      })
      .catch(() => {});

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /comments/:imageId
router.get('/:imageId', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT * FROM comments WHERE image_id = $1 ORDER BY created_at ASC',
      [req.params.imageId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// DELETE /comments/:id
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM comments WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Comment not found' });
    if (rows[0].user_id !== req.user.sub) return res.status(403).json({ error: 'Forbidden' });

    await query('DELETE FROM comments WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
