const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/register
// body: { fullName, email, phone, password, role: 'household' | 'helper', city, address,
//         serviceType (required if role === 'helper') }
async function register(req, res) {
  const { fullName, email, phone, password, role, city, address, serviceType } = req.body;

  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ error: 'fullName, email, password and role are required' });
  }
  if (!['household', 'helper'].includes(role)) {
    return res.status(400).json({ error: 'role must be household or helper' });
  }
  if (role === 'helper' && !serviceType) {
    return res.status(400).json({ error: 'serviceType is required for helper registration' });
  }

  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      `INSERT INTO users (full_name, email, phone, password_hash, role, city, address)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, full_name, email, phone, role, city, address`,
      [fullName, email, phone, passwordHash, role, city, address]
    );
    const user = userResult.rows[0];

    let helperProfile = null;
    if (role === 'helper') {
      const helperResult = await client.query(
        `INSERT INTO helpers (user_id, service_type) VALUES ($1,$2) RETURNING *`,
        [user.id, serviceType]
      );
      helperProfile = helperResult.rows[0];
    }

    await client.query('COMMIT');

    const token = signToken(user);
    res.status(201).json({ token, user, helperProfile });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    client.release();
  }
}

// POST /api/auth/login
// body: { email, password }
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' });

  delete user.password_hash;
  const token = signToken(user);
  res.json({ token, user });
}

// GET /api/auth/me
async function me(req, res) {
  const result = await db.query(
    'SELECT id, full_name, email, phone, role, city, address, created_at FROM users WHERE id = $1',
    [req.user.id]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'User not found' });
  res.json(result.rows[0]);
}

module.exports = { register, login, me };
