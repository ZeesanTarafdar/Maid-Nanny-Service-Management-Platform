// Runs seed.sql against the configured DATABASE_URL.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
  const client = await pool.connect();
  try {
    console.log('Applying seed.sql ...');
    await client.query(seedSql);
    console.log('Seed data inserted successfully.');
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
