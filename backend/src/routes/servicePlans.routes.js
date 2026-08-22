const router = require('express').Router();
const ctrl = require('../controllers/servicePlan.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', ctrl.listPlans);
router.post('/', requireAuth, requireRole('admin'), ctrl.createPlan);

module.exports = router;
