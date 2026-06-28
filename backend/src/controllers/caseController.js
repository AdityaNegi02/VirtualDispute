// backend/src/controllers/caseController.js
const Case = require('../models/Case');
const User = require('../models/User');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// @desc    Initiator files a case
// @route   POST /api/cases/file
const fileCase = async (req, res) => {
  try {
    const { title, description, initiatorPhone, respondentPhone, user1_statement } = req.body;

    if (!title || !initiatorPhone || !respondentPhone) {
      return res.status(400).json({ message: 'Title and Phone numbers are required' });
    }

    // Validate 10-digit mobile numbers
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(initiatorPhone) || !mobileRegex.test(respondentPhone)) {
      return res.status(400).json({ message: 'Invalid mobile numbers. Must be exactly 10 digits.' });
    }

    // CHECK IF RESPONDENT IS REGISTERED
    const respondentExists = await User.findOne({ mobile: respondentPhone });
    if (!respondentExists) {
      return res.status(404).json({ message: `Respondent with number ${respondentPhone} is not registered on this platform. Both parties must be registered.` });
    }

    let evidenceFile = null;
    if (req.file) {
      evidenceFile = {
        fileName: req.file.originalname,
        fileUrl: req.file.path
      };
    }

    const newCase = await Case.create({
      title,
      description,
      initiatorPhone,
      respondentPhone,
      user1_statement,
      user1_evidence: evidenceFile ? [evidenceFile] : [],
      status: 'pending_respondent'
    });

    res.status(201).json({ message: 'Case filed. Waiting for respondent.', case: newCase });
  } catch (error) {
    console.error('File Case Error:', error);
    res.status(500).json({ message: 'Error filing case', error: error.message });
  }
};

// @desc    Respondent submits evidence and triggers AI analysis
// @route   POST /api/cases/respond/:caseId
const respondToCase = async (req, res) => {
  try {
    const { user2_statement } = req.body;
    const { caseId } = req.params;

    const existingCase = await Case.findById(caseId);
    if (!existingCase) return res.status(404).json({ message: 'Case not found' });

    let evidenceFile = null;
    if (req.file) {
      evidenceFile = {
        fileName: req.file.originalname,
        fileUrl: req.file.path
      };
    }

    existingCase.user2_statement = user2_statement;
    if (evidenceFile) existingCase.user2_evidence.push(evidenceFile);
    existingCase.status = 'under_review';

    // TRIGGER AI ANALYSIS NOW
    try {
      const formData = new FormData();
      formData.append('user1_statement', existingCase.user1_statement);
      formData.append('user2_statement', user2_statement);
      
      // Combine evidence descriptions or paths for the AI
      const user1_ev = existingCase.user1_evidence[0]?.fileUrl || "";
      if (user1_ev && fs.existsSync(user1_ev)) {
         // Note: For simplicity, AI currently processes one file. 
         // In a full version, we'd send both. Sending respondent file as primary for now.
      }

      if (req.file) {
        formData.append('file', fs.createReadStream(req.file.path), req.file.originalname);
      }

      const pythonResponse = await axios.post('http://localhost:8000/analyze-dispute', formData, {
        headers: { ...formData.getHeaders() }
      });

      existingCase.ai_conclusion = pythonResponse.data.conclusion;
      existingCase.relevant_laws = pythonResponse.data.relevant_laws;
      existingCase.status = 'resolved';
    } catch (err) {
      console.error("AI Engine Error:", err.message);
    }

    await existingCase.save();
    res.status(200).json({ message: 'Response submitted and analyzed', case: existingCase });
  } catch (error) {
    res.status(500).json({ message: 'Error responding to case', error: error.message });
  }
};

// @desc    Get cases for a specific user (either initiator or respondent)
// @route   GET /api/cases/my-cases/:mobile
const getMyCases = async (req, res) => {
  try {
    const { mobile } = req.params;
    const cases = await Case.find({
      $or: [{ initiatorPhone: mobile }, { respondentPhone: mobile }]
    }).sort({ createdAt: -1 });
    res.status(200).json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cases', error: error.message });
  }
};

const path = require('path');

// @desc    Get the content of the law book
// @route   GET /api/cases/laws
const getLaws = async (req, res) => {
  try {
    const lawBookPath = path.join(__dirname, '../../..', 'engine/data/law_book.txt');
    const content = fs.readFileSync(lawBookPath, 'utf-8');
    
    // Split into sections for better display
    const sections = content.split('---').map(s => s.trim());
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Error reading law book', error: error.message });
  }
};

module.exports = { fileCase, respondToCase, getMyCases, getLaws };