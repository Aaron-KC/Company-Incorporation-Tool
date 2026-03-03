const pool = require('../config/db');

const createShareholders = async (req, res) => {
  try {
    const { shareholders, companyId } = req.body;

    const values = shareholders.map(s => [s.firstName, s.lastName, s.nationality, companyId]);

    await pool.query(
      'INSERT INTO shareholders (first_name, last_name, nationality, company_id) VALUES ?',
      [values]
    );

    await pool.query('UPDATE companies SET status = ? WHERE id = ?', ['submitted', companyId]);

    return res.status(201).json({ message: 'Shareholders created successfully' });
  } catch (error) {
    console.error('Error creating shareholders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}    

module.exports = {
  createShareholders,
};