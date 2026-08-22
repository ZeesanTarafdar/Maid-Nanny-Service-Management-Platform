const router = require('express').Router();
const ctrl = require('../controllers/booking.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post('/', requireAuth, requireRole('household'), ctrl.createBooking);
router.get('/mine', requireAuth, ctrl.myBookings);
router.patch('/:id/status', requireAuth, ctrl.updateStatus);

module.exports = router;
