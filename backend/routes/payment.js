const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

router.post('/create-order', requireAuth, createOrder);
router.post('/verify-payment', requireAuth, verifyPayment);

module.exports = router;
