// Simple, free admin gate: list allowed admin emails in the ADMIN_EMAILS env var
// (comma-separated), e.g. ADMIN_EMAILS=you@gmail.com,partner@gmail.com
// No third-party auth service, no cost — just an env-configured allowlist.

function requireAdmin(req, res, next) {
  const allowList = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!allowList.length) {
    const err = new Error('Admin access is not configured yet. Set ADMIN_EMAILS in the backend environment variables.');
    err.statusCode = 500;
    throw err;
  }

  if (!allowList.includes(req.user.email.toLowerCase())) {
    const err = new Error('You do not have admin access.');
    err.statusCode = 403;
    throw err;
  }

  next();
}

module.exports = { requireAdmin };
