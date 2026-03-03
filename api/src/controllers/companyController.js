const pool = require('../config/db');

const saveDraft = async (req, res) => {
  try {
    const { sessionId, companyName, noOfShareholders, totalCapital } = req.body;

    await pool.query(
      `INSERT INTO companies (session_id, company_name, no_of_shareholders, total_capital, status)
       VALUES (?, ?, ?, ?, 'draft')
       ON DUPLICATE KEY UPDATE
         company_name = VALUES(company_name),
         no_of_shareholders = VALUES(no_of_shareholders),
         total_capital = VALUES(total_capital)`,
      [sessionId, companyName, noOfShareholders, totalCapital]
    );

    return res.status(200).json({ message: 'Draft saved' });

  } catch (error) {
    console.error('Error saving draft:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getCompanyBySessionId = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM companies WHERE session_id = ? AND status = ?',
      [sessionId, 'draft']
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No draft found' });
    }

    return res.status(200).json(rows[0]);

  } catch (error) {
    console.error('Error fetching draft:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM companies');
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching all companies:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllCompaniesWithShareholders = async (req, res) => {
  try {
    const [companies] = await pool.query('SELECT * FROM companies');
    const companyIds = companies.map(c => c.id);

    if (companyIds.length === 0) {
      return res.status(200).json([]);
    }

    const [shareholders] = await pool.query(
      'SELECT * FROM shareholders WHERE company_id IN (?)',
      [companyIds]
    );

    const result = companies.map(company => ({
      ...company,
      shareholders: shareholders.filter(s => s.company_id === company.id)
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching companies with shareholders:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { saveDraft, getCompanyBySessionId, getAllCompanies, getAllCompaniesWithShareholders };
