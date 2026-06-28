// backend/src/routes/caseRoutes.js
const express = require('express');
const router = express.Router();
const { fileCase, respondToCase, getMyCases, getLaws } = require('../controllers/caseController');
const upload = require('../middleware/upload');

// Fetch law book sections
router.get('/laws', getLaws);

// Fetch cases filed against a mobile number
router.get('/my-cases/:mobile', getMyCases);

// User 1 files the case
router.post('/file', upload.single('evidenceFile'), fileCase);

// User 2 responds to the case
router.post('/respond/:caseId', upload.single('evidenceFile'), respondToCase);

module.exports = router;