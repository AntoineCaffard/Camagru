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
    CREATE TABLE IF NOT EXISTS images (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id     UUID        NOT NULL,
      filename    TEXT        NOT NULL,
      overlay     TEXT,
      is_public   BOOLEAN     DEFAULT TRUE,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await query(`
    CREATE TABLE IF NOT EXISTS overlays (
      id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name     TEXT NOT NULL,
      filename TEXT NOT NULL
    )
  `);
}

migrate().catch(console.error);

module.exports = { query };
