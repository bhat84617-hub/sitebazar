const { query } = require('../db/pool');

function rowToWebsite(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    businessName: row.business_name,
    businessType: row.business_type,
    description: row.description,
    generatedContent: row.generated_content,
    isPaid: row.is_paid,
    isFreeGeneration: row.is_free_generation
  };
}

async function createWebsite({ userId, businessName, businessType, description, generatedContent, isFreeGeneration }) {
  const res = await query(
    `insert into websites (user_id, business_name, business_type, description, generated_content, is_free_generation)
     values ($1, $2, $3, $4, $5::jsonb, $6)
     returning *`,
    [userId, businessName, businessType, description || '', JSON.stringify(generatedContent), !!isFreeGeneration]
  );
  return rowToWebsite(res.rows[0]);
}

async function findById(id) {
  const res = await query('select * from websites where id = $1', [id]);
  return rowToWebsite(res.rows[0]);
}

async function findByUser(userId) {
  const res = await query(
    'select * from websites where user_id = $1 order by created_at desc',
    [userId]
  );
  return res.rows.map(rowToWebsite);
}

async function findAll(limit = 200) {
  const res = await query(
    'select * from websites order by created_at desc limit $1',
    [limit]
  );
  return res.rows.map(rowToWebsite);
}

async function markPaid(id) {
  const res = await query('update websites set is_paid = true where id = $1 returning *', [id]);
  return rowToWebsite(res.rows[0]);
}

module.exports = { createWebsite, findById, findByUser, findAll, markPaid };
