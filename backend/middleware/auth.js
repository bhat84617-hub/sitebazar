const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-fallback-secret-change-in-production';

function signToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '90d' });
}

// Identifies (or creates) a user from an email, and issues a token.
// Real production version could add OTP verification before this step.
async function identifyUser(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      const err = new Error('Email is required to continue.');
      err.statusCode = 400;
      throw err;
    }
    const user = await userModel.findOrCreateByEmail(email);
    const token = signToken(user);
    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
}

// Validates a bearer token on protected routes
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      const err = new Error('Please verify your email to continue.');
      err.statusCode = 401;
      throw err;
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userModel.findById(decoded.userId);
    if (!user) {
      const err = new Error('Session expired. Please verify your email again.');
      err.statusCode = 401;
      throw err;
    }
    req.user = user;
    next();
  } catch (err) {
    if (!err.statusCode) err.statusCode = 401;
    next(err);
  }
}

module.exports = { identifyUser, requireAuth, signToken };
