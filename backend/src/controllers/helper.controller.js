const db = require('../db');

// GET /api/helpers?serviceType=maid&city=Kolkata&minExperience=1&plan=hourly
async function listHelpers(req, res) {
  const { serviceType, city, minExperience, plan } = req.query;
  const conditions = [`h.verification_status = 'approved'`];
  const params = [];

  if (serviceType) {
    params.push(serviceType);
    conditions.push(`h.service_type = $${params.length}`);
  }
  if (city) {
    params.push(`%${city}%`);
    conditions.push(`u.city ILIKE $${params.length}`);
  }
  if (minExperience) {
    params.push(minExperience);
    conditions.push(`h.experience_years >= $${params.length}`);
  }
  if (plan) {
    params.push(plan);
    conditions.push(`EXISTS (
      SELECT 1 FROM services sv JOIN service_plans sp ON sv.service_plan_id = sp.id
      WHERE sv.helper_id = h.id AND sp.cycle = $${params.length} AND sv.is_active = true
    )`);
  }

  const query = `
    SELECT h.id, h.service_type, h.experience_years, h.bio, h.skills,
           h.hourly_rate, h.monthly_rate, h.yearly_rate, h.rating_avg, h.rating_count,
           u.full_name, u.city, u.address
    FROM helpers h
    JOIN users u ON u.id = h.user_id
    WHERE ${conditions.join(' AND ')}
    ORDER BY h.rating_avg DESC, h.experience_years DESC
  `;
  const result = await db.query(query, params);
  res.json(result.rows);
}

// GET /api/helpers/:id
async function getHelper(req, res) {
  const { id } = req.params;
  const result = await db.query(
    `SELECT h.*, u.full_name, u.city, u.address, u.phone, u.email
     FROM helpers h JOIN users u ON u.id = h.user_id WHERE h.id = $1`,
    [id]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'Helper not found' });

  const plans = await db.query(
    `SELECT sv.id AS service_id, sp.id AS plan_id, sp.name, sp.cycle, sp.description,
            COALESCE(sv.custom_price, sp.base_price) AS price
     FROM services sv JOIN service_plans sp ON sv.service_plan_id = sp.id
     WHERE sv.helper_id = $1 AND sv.is_active = true`,
    [id]
  );

  res.json({ ...result.rows[0], plans: plans.rows });
}

// GET /api/helpers/me/profile  (logged-in helper's own profile)
async function getMyProfile(req, res) {
  const result = await db.query(`SELECT * FROM helpers WHERE user_id = $1`, [req.user.id]);
  if (!result.rows.length) return res.status(404).json({ error: 'Helper profile not found' });
  res.json(result.rows[0]);
}

// PATCH /api/helpers/me/profile
// body: any subset of { experienceYears, bio, skills, hourlyRate, monthlyRate, yearlyRate, availability }
async function updateMyProfile(req, res) {
  const { experienceYears, bio, skills, hourlyRate, monthlyRate, yearlyRate, availability } = req.body;

  const result = await db.query(
    `UPDATE helpers SET
       experience_years = COALESCE($1, experience_years),
       bio = COALESCE($2, bio),
       skills = COALESCE($3, skills),
       hourly_rate = COALESCE($4, hourly_rate),
       monthly_rate = COALESCE($5, monthly_rate),
       yearly_rate = COALESCE($6, yearly_rate),
       availability = COALESCE($7, availability),
       updated_at = now()
     WHERE user_id = $8 RETURNING *`,
    [experienceYears, bio, skills, hourlyRate, monthlyRate, yearlyRate, availability, req.user.id]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'Helper profile not found' });
  res.json(result.rows[0]);
}

// POST /api/helpers/me/documents
// body: { idDocumentUrl, backgroundCheckUrl }
async function uploadDocuments(req, res) {
  const { idDocumentUrl, backgroundCheckUrl } = req.body;
  const result = await db.query(
    `UPDATE helpers SET
       id_document_url = COALESCE($1, id_document_url),
       background_check_url = COALESCE($2, background_check_url),
       verification_status = 'pending',
       updated_at = now()
     WHERE user_id = $3 RETURNING *`,
    [idDocumentUrl, backgroundCheckUrl, req.user.id]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'Helper profile not found' });
  res.json(result.rows[0]);
}

// POST /api/helpers/me/services
// body: { servicePlanId, customPrice }
async function addService(req, res) {
  const { servicePlanId, customPrice } = req.body;
  const helper = await db.query(`SELECT id FROM helpers WHERE user_id = $1`, [req.user.id]);
  if (!helper.rows.length) return res.status(404).json({ error: 'Helper profile not found' });

  const result = await db.query(
    `INSERT INTO services (helper_id, service_plan_id, custom_price)
     VALUES ($1,$2,$3)
     ON CONFLICT (helper_id, service_plan_id) DO UPDATE SET custom_price = EXCLUDED.custom_price, is_active = true
     RETURNING *`,
    [helper.rows[0].id, servicePlanId, customPrice]
  );
  res.status(201).json(result.rows[0]);
}

module.exports = { listHelpers, getHelper, getMyProfile, updateMyProfile, uploadDocuments, addService };
