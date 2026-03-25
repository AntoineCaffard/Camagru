'use strict';

const router = require('express').Router();
const { query } = require('../models/db');
const { authenticate } = require('../middleware/auth');

// GET /users/:id  – public profile
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, username, bio, avatar_url, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// PATCH /users/:id  – update own profile
router.patch('/:id', authenticate, async (req, res, next) => {
  try {
    if (req.user.sub !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { bio, avatar_url } = req.body;
    const { rows } = await query(
      'UPDATE users SET bio = COALESCE($1, bio), avatar_url = COALESCE($2, avatar_url) WHERE id = $3 RETURNING id, username, bio, avatar_url',
      [bio, avatar_url, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
