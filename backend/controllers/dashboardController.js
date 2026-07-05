const websiteModel = require('../models/websiteModel');
const { hasActiveSubscription } = require('../models/userModel');

async function myDashboard(req, res, next) {
  try {
    const websites = await websiteModel.findByUser(req.user.id);
    res.json({
      success: true,
      user: {
        email: req.user.email,
        freeLandingPageUsed: req.user.freeLandingPageUsed,
        subscription: req.user.subscription,
        subscriptionActive: hasActiveSubscription(req.user)
      },
      websites: websites.map((w) => ({
        id: w.id,
        businessName: w.businessName,
        businessType: w.businessType,
        isPaid: w.isPaid
      }))
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { myDashboard };
