const router = require('express').Router();
const ctrl = require('../controllers/review.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

router.post('/', requireAuth, requireRole('household'), ctrl.createReview);
router.get('/helper/:helperId', ctrl.listHelperReviews);

module.exports = router;
