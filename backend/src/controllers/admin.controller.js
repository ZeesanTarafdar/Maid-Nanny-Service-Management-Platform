const db = require('../db');

// GET /api/admin/helpers?status=pending
async function listHelpersForReview(req, res) {
  const { status = 'pending' } = req.query;
  const result = await db.query(
    `SELECT h.*, u.full_name, u.email, u.phone, u.city FROM helpers h
     JOIN users u ON u.id = h.user_id WHERE h.verification_status = $1
     ORDER BY h.created_at ASC`,
    [status]
  );
  res.json(result.rows);
}

// PATCH /api/admin/helpers/:id/verify
// body: { status: 'approved' | 'rejected', notes }
async function verifyHelper(req, res) {
  const { id } = req.params;
  const { status, notes } = req.body;
  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'status must be approved or rejected' });
  }
  const result = await db.query(
    `UPDATE helpers SET verification_status = $1, verification_notes = $2, updated_at = now()
     WHERE id = $3 RETURNING *`,
    [status, notes, id]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'Helper not found' });
  res.json(result.rows[0]);
}

// GET /api/admin/bookings?status=requested
async function listAllBookings(req, res) {
  const { status } = req.query;
  const params = [];
  let where = '1=1';
  if (status) {
    params.push(status);
    where += ` AND b.status = $${params.length}`;
  }
  const result = await db.query(
    `SELECT b.*, uh.full_name AS household_name, uu.full_name AS helper_name, sp.name AS plan_name
     FROM bookings b
     JOIN users uh ON uh.id = b.household_id
     JOIN helpers h ON h.id = b.helper_id
     JOIN users uu ON uu.id = h.user_id
     JOIN service_plans sp ON sp.id = b.service_plan_id
     WHERE ${where} ORDER BY b.created_at DESC`,
    params
  );
  res.json(result.rows);
}

// GET /api/admin/stats
async function dashboardStats(req, res) {
  const [households, helpers, verifiedHelpers, bookings, activeBookings] = await Promise.all([
    db.query(`SELECT COUNT(*) FROM users WHERE role = 'household'`),
    db.query(`SELECT COUNT(*) FROM helpers`),
    db.query(`SELECT COUNT(*) FROM helpers WHERE verification_status = 'approved'`),
    db.query(`SELECT COUNT(*) FROM bookings`),
    db.query(`SELECT COUNT(*) FROM bookings WHERE status IN ('requested','accepted','in_progress')`),
  ]);
  res.json({
    registeredHouseholds: Number(households.rows[0].count),
    totalHelpers: Number(helpers.rows[0].count),
    verifiedHelpers: Number(verifiedHelpers.rows[0].count),
    totalBookings: Number(bookings.rows[0].count),
    activeBookings: Number(activeBookings.rows[0].count),
  });
}

module.exports = { listHelpersForReview, verifyHelper, listAllBookings, dashboardStats };
