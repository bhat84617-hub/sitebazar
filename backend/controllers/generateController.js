const websiteModel = require('../models/websiteModel');
const userModel = require('../models/userModel');
const { generateWebsiteContent } = require('../services/aiService');

async function generateWebsite(req, res, next) {
  try {
    const { businessName, businessType, description } = req.body;
    if (!businessName || !businessType) {
      const err = new Error('Business name and type are required.');
      err.statusCode = 400;
      throw err;
    }

    const generatedContent = await generateWebsiteContent(businessType, businessName, description || '');

    const website = await websiteModel.createWebsite({
      userId: req.user.id,
      businessName,
      businessType,
      description,
      generatedContent,
      isFreeGeneration: !!req.isFreeGeneration
    });

    res.json({
      success: true,
      website: {
        id: website.id,
        businessName,
        businessType,
        content: generatedContent
      }
    });
  } catch (err) {
    next(err);
  }
}

async function downloadWebsite(req, res, next) {
  try {
    const { websiteId } = req.body;
    const website = await websiteModel.findById(websiteId);
    if (!website || String(website.userId) !== String(req.user.id)) {
      const err = new Error('Website not found.');
      err.statusCode = 404;
      throw err;
    }

    // Mark first free landing page as used, once actually downloaded
    if (website.businessType === 'landing-page' && !userModel.hasActiveSubscription(req.user)) {
      const alreadyUnlocked = req.user.unlockedWebsites.some(
        (w) => String(w.websiteId) === String(websiteId)
      );
      if (!req.user.freeLandingPageUsed && !alreadyUnlocked) {
        await userModel.markFreeLandingPageUsed(req.user.id);
        // record it as unlocked too, so re-downloading the same free site later doesn't ask for payment again
        await userModel.addUnlockedWebsite(req.user.id, websiteId, 'landing-page');
      }
    }

    await websiteModel.markPaid(websiteId);

    res.json({
      success: true,
      content: website.generatedContent,
      businessType: website.businessType,
      businessName: website.businessName
    });
  } catch (err) {
    next(err);
  }
}

async function getWebsite(req, res, next) {
  try {
    const website = await websiteModel.findById(req.params.id);
    if (!website || String(website.userId) !== String(req.user.id)) {
      const err = new Error('Website not found.');
      err.statusCode = 404;
      throw err;
    }
    res.json({
      success: true,
      website: {
        id: website.id,
        businessName: website.businessName,
        businessType: website.businessType,
        content: website.generatedContent
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { generateWebsite, downloadWebsite, getWebsite };
