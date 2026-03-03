const { saveDraft, getCompanyBySessionId, getAllCompanies, getAllCompaniesWithShareholders } = require('../controllers/companyController');

const router = require('express').Router();

router.post("/draft", saveDraft)
router.get("/draft/:sessionId", getCompanyBySessionId)
router.get("/all", getAllCompanies)
router.get("/all-with-shareholders", getAllCompaniesWithShareholders)

module.exports = router;