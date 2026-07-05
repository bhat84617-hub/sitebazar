const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/requireAdmin');
const { listUsers, listWebsites, stats } = require('../controllers/adminController');

router.get('/admin/users', requireAuth, requireAdmin, listUsers);
router.get('/admin/websites', requireAuth, requireAdmin, listWebsites);
router.get('/admin/stats', requireAuth, requireAdmin, stats);

module.exports = router;
