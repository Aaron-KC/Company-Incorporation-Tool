const { createShareholders } = require('../controllers/shareholderController');

const router = require('express').Router();

router.post("/", createShareholders)

module.exports = router;