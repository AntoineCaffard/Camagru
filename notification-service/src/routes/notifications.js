'use strict';

const router = require('express').Router();
const { sendMail } = require('../utils/mailer');

// POST /notifications/comment  – called by social-service
router.post('/comment', async (req, res, next) => {
  try {
    const { to, commenterUsername, commentBody, imageId } = req.body;
    if (!to) {
      return res.status(400).json({ error: 'Recipient "to" is required' });
    }

    await sendMail(
      to,
      `New comment on your photo`,
      `${commenterUsername} commented on your photo (${imageId}): ${commentBody}`,
      `<p><strong>${commenterUsername}</strong> commented on your <a href="/gallery/${imageId}">photo</a>:</p><blockquote>${commentBody}</blockquote>`
    );

    res.status(202).json({ message: 'Notification queued' });
  } catch (err) {
    next(err);
  }
});

// POST /notifications/welcome  – sent on registration
router.post('/welcome', async (req, res, next) => {
  try {
    const { to, username } = req.body;
    if (!to || !username) {
      return res.status(400).json({ error: 'to and username are required' });
    }

    await sendMail(
      to,
      'Welcome to Camagru!',
      `Hi ${username}, welcome to Camagru. Start sharing your photos!`,
      `<h1>Welcome to Camagru, ${username}!</h1><p>Start sharing your photos now.</p>`
    );

    res.status(202).json({ message: 'Welcome email queued' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
