const db = require('../db');

// POST /api/reviews  (household only, on a completed booking)
// body: { bookingId, rating, comment }
async function createReview(req, res) {
  const { bookingId, rating, comment } = req.body;
  if (!bookingId || !rating) return res.status(400).json({ error: 'bookingId and rating are required' });

  const bookingResult = await db.query(
    `SELECT * FROM bookings WHERE id = $1 AND household_id = $2`,
    [bookingId, req.user.id]
  );
  if (!bookingResult.rows.length) return res.status(404).json({ error: 'Booking not found' });
  const booking = bookingResult.rows[0];
  if (booking.status !== 'completed') {
    return res.status(400).json({ error: 'You can only review completed bookings' });
  }

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const reviewResult = await client.query(
      `INSERT INTO reviews (booking_id, household_id, helper_id, rating, comment)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [bookingId, req.user.id, booking.helper_id, rating, comment]
    );

    await client.query(
      `UPDATE helpers SET
         rating_avg = ((rating_avg * rating_count) + $1) / (rating_count + 1),
         rating_count = rating_count + 1
       WHERE id = $2`,
      [rating, booking.helper_id]
    );

    await client.query('COMMIT');
    res.status(201).json(reviewResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.code === '23505') return res.status(409).json({ error: 'This booking has already been reviewed' });
    console.error(err);
    res.status(500).json({ error: 'Failed to submit review' });
  } finally {
    client.release();
  }
}

// GET /api/reviews/helper/:helperId
async function listHelperReviews(req, res) {
  const { helperId } = req.params;
  const result = await db.query(
    `SELECT r.*, u.full_name AS household_name FROM reviews r
     JOIN users u ON u.id = r.household_id WHERE r.helper_id = $1 ORDER BY r.created_at DESC`,
    [helperId]
  );
  res.json(result.rows);
}

module.exports = { createReview, listHelperReviews };
