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
    CREATE TABLE IF NOT EXISTS likes (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      image_id   UUID NOT NULL,
      user_id    UUID NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (image_id, user_id)
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS comments (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      image_id   UUID NOT NULL,
      user_id    UUID NOT NULL,
      username   TEXT NOT NULL,
      body       TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

migrate().catch(console.error);

module.exports = { query };
