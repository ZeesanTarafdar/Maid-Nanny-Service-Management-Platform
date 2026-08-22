const db = require('../db');

// POST /api/bookings  (household only)
// body: { helperId, servicePlanId, scheduledDate, scheduledTime, durationHours, address, notes }
async function createBooking(req, res) {
  const { helperId, servicePlanId, scheduledDate, scheduledTime, durationHours, address, notes } = req.body;
  if (!helperId || !servicePlanId || !scheduledDate || !address) {
    return res.status(400).json({ error: 'helperId, servicePlanId, scheduledDate and address are required' });
  }

  const priceResult = await db.query(
    `SELECT COALESCE(sv.custom_price, sp.base_price) AS price, sp.cycle
     FROM service_plans sp
     LEFT JOIN services sv ON sv.service_plan_id = sp.id AND sv.helper_id = $1
     WHERE sp.id = $2`,
    [helperId, servicePlanId]
  );
  if (!priceResult.rows.length) return res.status(404).json({ error: 'Service plan not found' });

  const { price, cycle } = priceResult.rows[0];
  const totalPrice = cycle === 'hourly' ? Number(price) * Number(durationHours || 1) : Number(price);

  const result = await db.query(
    `INSERT INTO bookings (household_id, helper_id, service_plan_id, scheduled_date, scheduled_time,
                            duration_hours, address, notes, total_price)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [req.user.id, helperId, servicePlanId, scheduledDate, scheduledTime, durationHours, address, notes, totalPrice]
  );
  res.status(201).json(result.rows[0]);
}

// GET /api/bookings/mine  (household: their bookings; helper: bookings assigned to them)
async function myBookings(req, res) {
  if (req.user.role === 'household') {
    const result = await db.query(
      `SELECT b.*, u.full_name AS helper_name, sp.name AS plan_name, sp.cycle,
              r.rating AS review_rating, r.comment AS review_comment
       FROM bookings b
       JOIN helpers h ON h.id = b.helper_id
       JOIN users u ON u.id = h.user_id
       JOIN service_plans sp ON sp.id = b.service_plan_id
       LEFT JOIN reviews r ON r.booking_id = b.id
       WHERE b.household_id = $1 ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    return res.json(result.rows);
  }

  if (req.user.role === 'helper') {
    const result = await db.query(
      `SELECT b.*, u.full_name AS household_name, sp.name AS plan_name, sp.cycle
       FROM bookings b
       JOIN helpers h ON h.id = b.helper_id
       JOIN users u ON u.id = b.household_id
       JOIN service_plans sp ON sp.id = b.service_plan_id
       WHERE h.user_id = $1 ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    return res.json(result.rows);
  }

  res.status(403).json({ error: 'Only households and helpers have personal bookings' });
}

// PATCH /api/bookings/:id/status  (helper accepts/rejects/completes; household cancels)
// body: { status }
const ALLOWED_TRANSITIONS = {
  helper: { accepted: ['requested'], rejected: ['requested'], in_progress: ['accepted'], completed: ['in_progress'] },
  household: { cancelled: ['requested', 'accepted'] },
  admin: { cancelled: ['requested', 'accepted', 'in_progress'], completed: ['in_progress'] },
};

async function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const role = req.user.role;

  const bookingResult = await db.query(
    `SELECT b.*, h.user_id AS helper_user_id FROM bookings b JOIN helpers h ON h.id = b.helper_id WHERE b.id = $1`,
    [id]
  );
  if (!bookingResult.rows.length) return res.status(404).json({ error: 'Booking not found' });
  const booking = bookingResult.rows[0];

  const isOwner =
    (role === 'household' && booking.household_id === req.user.id) ||
    (role === 'helper' && booking.helper_user_id === req.user.id) ||
    role === 'admin';
  if (!isOwner) return res.status(403).json({ error: 'You cannot modify this booking' });

  const allowedFrom = ALLOWED_TRANSITIONS[role]?.[status];
  if (!allowedFrom || !allowedFrom.includes(booking.status)) {
    return res.status(400).json({ error: `Cannot change status from ${booking.status} to ${status} as ${role}` });
  }

  const result = await db.query(
    `UPDATE bookings SET status = $1, updated_at = now() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  res.json(result.rows[0]);
}

module.exports = { createBooking, myBookings, updateStatus };
