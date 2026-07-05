const { Pool } = require('pg');

let pool = null;

function getPool() {
  if (pool) return pool;
  if (!process.env.DATABASE_URL) {
    console.warn('[db] DATABASE_URL not set — database features will fail until it is configured.');
    return null;
  }
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // required for Supabase's managed Postgres
  });
  pool.on('error', (err) => console.error('[db] Unexpected Postgres error', err.message));
  console.log('[db] Postgres pool ready');
  return pool;
}

async function query(text, params) {
  const p = getPool();
  if (!p) {
    const err = new Error('Database is not configured. Set DATABASE_URL.');
    err.statusCode = 500;
    throw err;
  }
  return p.query(text, params);
}

module.exports = { getPool, query };
