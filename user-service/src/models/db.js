'use strict';

const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

async function migrate() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username   VARCHAR(50)  UNIQUE NOT NULL,
      email      VARCHAR(255) UNIQUE NOT NULL,
      password   TEXT         NOT NULL,
      bio        TEXT,
      avatar_url TEXT,
      created_at TIMESTAMPTZ  DEFAULT NOW()
    )
  `);
}

migrate().catch(console.error);

module.exports = { query };
