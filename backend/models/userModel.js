const { query } = require('../db/pool');

function rowToUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    phone: row.phone,
    freeLandingPageUsed: row.free_landing_page_used,
    unlockedWebsites: row.unlocked_websites || [],
    subscription: row.subscription || { active: false, plan: null, startedAt: null, expiresAt: null }
  };
}

// Mirrors the Mongoose-style helper: returns true if subscription is currently active,
// treating an expired subscription as inactive.
function hasActiveSubscription(user) {
  if (!user?.subscription?.active) return false;
  if (user.subscription.expiresAt && new Date(user.subscription.expiresAt) < new Date()) {
    return false;
  }
  return true;
}

async function findByEmail(email) {
  const res = await query('select * from users where email = $1', [email.toLowerCase().trim()]);
  return rowToUser(res.rows[0]);
}

async function findById(id) {
  const res = await query('select * from users where id = $1', [id]);
  return rowToUser(res.rows[0]);
}

async function createUser(email) {
  const res = await query('insert into users (email) values ($1) returning *', [email.toLowerCase().trim()]);
  return rowToUser(res.rows[0]);
}

async function findOrCreateByEmail(email) {
  const existing = await findByEmail(email);
  if (existing) return existing;
  return createUser(email);
}

async function markFreeLandingPageUsed(id) {
  const res = await query(
    'update users set free_landing_page_used = true where id = $1 returning *',
    [id]
  );
  return rowToUser(res.rows[0]);
}

async function addUnlockedWebsite(id, websiteId, plan) {
  const res = await query(
    `update users
     set unlocked_websites = unlocked_websites || $2::jsonb
     where id = $1
     returning *`,
    [id, JSON.stringify([{ websiteId, plan, unlockedAt: new Date().toISOString() }])]
  );
  return rowToUser(res.rows[0]);
}

async function setSubscription(id, subscription) {
  const res = await query(
    'update users set subscription = $2::jsonb where id = $1 returning *',
    [id, JSON.stringify(subscription)]
  );
  return rowToUser(res.rows[0]);
}

async function findAll(limit = 500) {
  const res = await query('select * from users order by created_at desc limit $1', [limit]);
  return res.rows.map(rowToUser);
}

module.exports = {
  findByEmail,
  findById,
  findAll,
  createUser,
  findOrCreateByEmail,
  markFreeLandingPageUsed,
  addUnlockedWebsite,
  setSubscription,
  hasActiveSubscription
};
