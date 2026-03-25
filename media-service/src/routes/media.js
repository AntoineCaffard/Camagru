'use strict';

const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../models/db');
const { authenticate } = require('../utils/auth');

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || './uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => cb(null, `${uuidv4()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

// POST /media/upload
router.post('/upload', authenticate, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image file provided' });

    const { overlay } = req.body;
    const { rows } = await query(
      'INSERT INTO images (user_id, filename, overlay) VALUES ($1, $2, $3) RETURNING *',
      [req.user.sub, req.file.filename, overlay || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// GET /media  – list public images (paginated)
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    const { rows } = await query(
      'SELECT * FROM images WHERE is_public = TRUE ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    const total = await query("SELECT COUNT(*) FROM images WHERE is_public = TRUE");
    res.json({ images: rows, total: parseInt(total.rows[0].count), page, limit });
  } catch (err) {
    next(err);
  }
});

// GET /media/:id
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM images WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Image not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /media/:id
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM images WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Image not found' });
    if (rows[0].user_id !== req.user.sub) return res.status(403).json({ error: 'Forbidden' });

    await query('DELETE FROM images WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
