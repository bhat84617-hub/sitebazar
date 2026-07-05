const express = require('express');
const router = express.Router();
const { identifyUser } = require('../middleware/auth');
const { hasActiveSubscription } = require('../models/userModel');

function isAdminEmail(email) {
  const allowList = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowList.includes((email || '').toLowerCase());
}

// POST /api/auth/identify — finds or creates a user by email, returns a token
router.post('/identify', identifyUser, (req, res) => {
  res.json({
    success: true,
    token: req.token,
    user: {
      email: req.user.email,
      freeLandingPageUsed: req.user.freeLandingPageUsed,
      subscriptionActive: hasActiveSubscription(req.user),
      isAdmin: isAdminEmail(req.user.email)
    }
  });
});

module.exports = router;
