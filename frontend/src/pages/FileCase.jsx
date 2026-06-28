import React, { useState } from 'react';
import axios from 'axios';

const FileCase = ({ onCaseFiled }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    respondentPhone: '',
    user1_statement: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title.toUpperCase());
    data.append('description', formData.description);
    data.append('initiatorPhone', user.mobile);
    data.append('respondentPhone', formData.respondentPhone);
    data.append('user1_statement', formData.user1_statement);
    if (file) data.append('evidenceFile', file);

    try {
      await axios.post('http://localhost:5000/api/cases/file', data);
      alert('SUCCESS: CASE_ENROLLED_IN_JURISDICTION');
      onCaseFiled();
      setFormData({ title: '', description: '', respondentPhone: '', user1_statement: '' });
      setFile(null);
    } catch (err) {
      alert(err.response?.data?.message || 'ERROR: PROTOCOL_FAILURE');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '60px' }}>
      <div>
        <span className="label-small">Protocol Initiation</span>
        <h2 className="font-display" style={{ fontSize: '32px' }}>File Dispute</h2>
        <p style={{ fontSize: '14px', opacity: 0.7, lineHeight: '1.6', marginTop: '16px' }}>
          Enrolling a new dispute requires a valid respondent identifier and a formal legal statement for the AI Oracle to process.
        </p>
      </div>

      <div className="card-minimal">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div>
              <label className="label-small">Dispute Title</label>
              <input 
                className="input-minimal" 
                placeholder="e.g. CONTRACT_BREACH" required 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div>
              <label className="label-small">Respondent ID</label>
              <input 
                className="input-minimal" 
                placeholder="+91 XXXXX XXXXX" required 
                value={formData.respondentPhone}
                onChange={(e) => setFormData({...formData, respondentPhone: e.target.value})} 
              />
            </div>
          </div>

          <label className="label-small">Short Description</label>
          <input 
            className="input-minimal" 
            placeholder="Core summary of the conflict..." required 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
          />

          <label className="label-small">Formal Petitioner Statement</label>
          <textarea 
            className="input-minimal" 
            style={{ minHeight: '120px' }}
            placeholder="Provide exhaustive legal details..." required 
            value={formData.user1_statement}
            onChange={(e) => setFormData({...formData, user1_statement: e.target.value})} 
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <div>
              <label className="label-small">Documentary Evidence(in single pdf file)</label>
              <input 
                type="file" 
                style={{ fontSize: '11px', fontWeight: 700 }}
                onChange={(e) => setFile(e.target.files[0])} 
              />
            </div>
            <button className="btn-black" type="submit" disabled={loading} style={{ width: 'auto' }}>
              {loading ? 'ENROLLING...' : 'ENROLL_DISPUTE →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileCase;