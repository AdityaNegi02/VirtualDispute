// backend/src/models/Case.js
const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    initiatorPhone: {
      type: String,
      required: true,
    },
    respondentPhone: {
      type: String,
      required: true,
    },
    user1_statement: String,
    user1_evidence: [
      {
        fileName: String,
        fileUrl: String,
      }
    ],
    user2_statement: String,
    user2_evidence: [
      {
        fileName: String,
        fileUrl: String,
      }
    ],
    ai_conclusion: String,
    relevant_laws: String,
    status: {
      type: String,
      enum: ['pending_respondent', 'under_review', 'resolved'],
      default: 'pending_respondent',
    },
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links to the User who opened the case
    },
    respondent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Links to the accused/other party
    },
    evidenceFiles: [
      {
        fileName: String,
        fileUrl: String, // URL from AWS S3 or your local upload folder
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        }
      }
    ],
    aiSummary: {
      type: String, // The Python RAG engine will inject its initial case analysis here
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Case', caseSchema);