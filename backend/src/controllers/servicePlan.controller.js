const db = require('../db');

// GET /api/service-plans?serviceType=maid
async function listPlans(req, res) {
  const { serviceType } = req.query;
  const params = [];
  let where = 'is_active = true';
  if (serviceType) {
    params.push(serviceType);
    where += ` AND service_type = $${params.length}`;
  }
  const result = await db.query(
    `SELECT * FROM service_plans WHERE ${where} ORDER BY service_type, cycle`,
    params
  );
  res.json(result.rows);
}

// POST /api/service-plans (admin only)
async function createPlan(req, res) {
  const { serviceType, cycle, name, description, basePrice } = req.body;
  const result = await db.query(
    `INSERT INTO service_plans (service_type, cycle, name, description, base_price)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [serviceType, cycle, name, description, basePrice]
  );
  res.status(201).json(result.rows[0]);
}

module.exports = { listPlans, createPlan };
