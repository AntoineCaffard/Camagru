'use strict';

const nodemailer = require('nodemailer');

let transporter;

function getTransporter() {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

async function sendMail(to, subject, text, html) {
  const from = process.env.FROM_ADDRESS || 'noreply@camagru.com';
  return getTransporter().sendMail({ from, to, subject, text, html });
}

module.exports = { sendMail };
