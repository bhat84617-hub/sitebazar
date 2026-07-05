const crypto = require('crypto');
const Razorpay = require('razorpay');
const userModel = require('../models/userModel');
const { PRICE, getRequiredPlan } = require('../middleware/checkAccess');

function getRazorpayInstance() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const err = new Error('Payment gateway is not configured yet.');
    err.statusCode = 500;
    throw err;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

async function createOrder(req, res, next) {
  try {
    const { planType } = req.body; // 'website' | 'landing-page' | 'monthly'
    const amount = PRICE[planType];
    if (!amount) {
      const err = new Error('Invalid plan selected.');
      err.statusCode = 400;
      throw err;
    }

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount, // amount is always calculated server-side, in paise
      currency: 'INR',
      receipt: `sitebazar_${planType}_${Date.now()}`,
      notes: { planType, userId: String(req.user.id) }
    });

    res.json({
      success: true,
      order: { id: order.id, amount: order.amount, currency: order.currency },
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    next(err);
  }
}

async function verifyPayment(req, res, next) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType, websiteId } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      const err = new Error('Payment verification failed.');
      err.statusCode = 400;
      throw err;
    }

    if (planType === 'monthly') {
      await userModel.setSubscription(req.user.id, {
        active: true,
        plan: 'monthly',
        startedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    } else {
      const plan = getRequiredPlan(planType === 'landing-page' ? 'landing-page' : 'website');
      await userModel.addUnlockedWebsite(req.user.id, websiteId, plan);
    }

    res.json({ success: true, message: 'Payment verified. Access unlocked.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, verifyPayment };
