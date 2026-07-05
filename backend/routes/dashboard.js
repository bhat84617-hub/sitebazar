const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { myDashboard } = require('../controllers/dashboardController');

router.get('/my-dashboard', requireAuth, myDashboard);

module.exports = router;
