const userModel = require('../models/userModel');
const websiteModel = require('../models/websiteModel');

async function listUsers(req, res, next) {
  try {
    const users = await userModel.findAll();
    res.json({
      success: true,
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        freeLandingPageUsed: u.freeLandingPageUsed,
        subscription: u.subscription,
        unlockedCount: u.unlockedWebsites.length
      }))
    });
  } catch (err) {
    next(err);
  }
}

async function listWebsites(req, res, next) {
  try {
    const websites = await websiteModel.findAll();
    res.json({
      success: true,
      websites: websites.map((w) => ({
        id: w.id,
        userId: w.userId,
        businessName: w.businessName,
        businessType: w.businessType,
        isPaid: w.isPaid,
        isFreeGeneration: w.isFreeGeneration
      }))
    });
  } catch (err) {
    next(err);
  }
}

async function stats(req, res, next) {
  try {
    const [users, websites] = await Promise.all([userModel.findAll(), websiteModel.findAll()]);
    const activeSubscriptions = users.filter((u) => userModel.hasActiveSubscription(u)).length;
    const paidWebsites = websites.filter((w) => w.isPaid && !w.isFreeGeneration).length;

    res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalWebsites: websites.length,
        activeSubscriptions,
        paidDownloads: paidWebsites
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, listWebsites, stats };
