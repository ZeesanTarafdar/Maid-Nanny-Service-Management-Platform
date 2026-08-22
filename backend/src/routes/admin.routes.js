const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

router.use(requireAuth, requireRole('admin'));
router.get('/helpers', ctrl.listHelpersForReview);
router.patch('/helpers/:id/verify', ctrl.verifyHelper);
router.get('/bookings', ctrl.listAllBookings);
router.get('/stats', ctrl.dashboardStats);

module.exports = router;
