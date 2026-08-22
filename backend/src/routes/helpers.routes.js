const router = require('express').Router();
const ctrl = require('../controllers/helper.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', ctrl.listHelpers);
router.get('/me/profile', requireAuth, requireRole('helper'), ctrl.getMyProfile);
router.patch('/me/profile', requireAuth, requireRole('helper'), ctrl.updateMyProfile);
router.post('/me/documents', requireAuth, requireRole('helper'), ctrl.uploadDocuments);
router.post('/me/services', requireAuth, requireRole('helper'), ctrl.addService);
router.get('/:id', ctrl.getHelper);

module.exports = router;
