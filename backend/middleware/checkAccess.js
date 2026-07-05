// Enforces: 1 free landing page, then payment required.
// Never trusts the frontend — all checks run against the users table.

const { hasActiveSubscription } = require('../models/userModel');

const PRICE = {
  website: 39900, // ₹399.00 in paise
  'landing-page': 4900, // ₹49.00 in paise
  monthly: 99900 // ₹999.00 in paise
};

function getRequiredPlan(businessType) {
  return businessType === 'landing-page' ? 'landing-page' : 'website';
}

// Use for the /generate route: allows the first free landing page through,
// blocks nothing else at generation time (payment is enforced at download).
function checkGenerationAccess(req, res, next) {
  const user = req.user;
  const { businessType } = req.body;

  if (hasActiveSubscription(user)) return next();

  if (businessType === 'landing-page' && !user.freeLandingPageUsed) {
    req.isFreeGeneration = true;
    return next();
  }

  req.isFreeGeneration = false;
  next();
}

// Use for the /download route: hard gate, no preview bypass.
function checkDownloadAccess(req, res, next) {
  const user = req.user;
  const { websiteId, businessType } = req.body;

  if (hasActiveSubscription(user)) return next();

  if (businessType === 'landing-page' && !user.freeLandingPageUsed) {
    return next(); // first landing page download is free
  }

  const requiredPlan = getRequiredPlan(businessType);
  const alreadyUnlocked = user.unlockedWebsites.some(
    (w) => String(w.websiteId) === String(websiteId) && w.plan === requiredPlan
  );

  if (alreadyUnlocked) return next();

  const err = new Error('Payment required to download this source code.');
  err.statusCode = 402;
  err.publicMessage = JSON.stringify({
    reason: 'PAYMENT_REQUIRED',
    plans: [
      { id: 'website', label: 'One Website', price: PRICE.website / 100 },
      { id: 'landing-page', label: 'One Landing Page', price: PRICE['landing-page'] / 100 },
      { id: 'monthly', label: 'Unlimited Monthly', price: PRICE.monthly / 100 }
    ]
  });
  next(err);
}

module.exports = { checkGenerationAccess, checkDownloadAccess, PRICE, getRequiredPlan };
