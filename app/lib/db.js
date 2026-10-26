import { Pool } from "pg";

// Reuse one pool across hot reloads in dev
const pool =
  globalThis.__pgPool ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
globalThis.__pgPool = pool;

let ready;
function ensureTable() {
  ready ??= pool.query(`
    CREATE TABLE IF NOT EXISTS date_choices (
      id SERIAL PRIMARY KEY,
      place TEXT NOT NULL,
      emoji TEXT NOT NULL,
      date DATE NOT NULL,
      time TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  return ready;
}

export async function saveChoice({ place, emoji, date, time }) {
  await ensureTable();
  await pool.query(
    "INSERT INTO date_choices (place, emoji, date, time) VALUES ($1, $2, $3, $4)",
    [place, emoji, date, time]
  );
}

export async function listChoices() {
  await ensureTable();
  const { rows } = await pool.query(
    "SELECT id, place, emoji, to_char(date, 'YYYY-MM-DD') AS date, time, created_at FROM date_choices ORDER BY created_at DESC"
  );
  return rows;
}
