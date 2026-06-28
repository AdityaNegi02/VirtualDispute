import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FileCase from './FileCase';

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [responseStatement, setResponseStatement] = useState('');
  const [responseFile, setResponseFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/cases/my-cases/${user.mobile}`);
      setCases(data);
    } catch (err) {
      console.error('Error fetching cases');
    }
  };

  const handleRespond = async (caseId) => {
    setLoading(true);
    const data = new FormData();
    data.append('user2_statement', responseStatement);
    if (responseFile) data.append('evidenceFile', responseFile);

    try {
      await axios.post(`http://localhost:5000/api/cases/respond/${caseId}`, data);
      alert('Response filed with AI Oracle.');
      fetchCases();
    } catch (err) {
      alert('Error responding');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };

  return (
    <div className="dashboard">
      <header style={{ marginBottom: '100px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <span className="label-small">Active User</span>
          <h1 className="font-display" style={{ fontSize: '72px', margin: 0 }}>{user.name}</h1>
          <p className="font-mono" style={{ marginTop: '10px', opacity: 0.6 }}>UUID: {user.mobile}</p>
        </div>
        <button className="btn-black" onClick={handleLogout} style={{ background: 'var(--accent)' }}>
          System Exit
        </button>
      </header>

      <section style={{ marginBottom: '120px' }}>
        <FileCase onCaseFiled={fetchCases} />
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '60px' }}>
          <h2 className="font-display" style={{ margin: 0, fontSize: '48px' }}>Records</h2>
          <div style={{ height: '1px', flexGrow: 1, background: 'var(--border)' }}></div>
          <span className="font-mono" style={{ opacity: 0.5 }}>{cases.length} Total</span>
        </div>
        
        {cases.length === 0 ? (
          <p className="font-mono" style={{ textAlign: 'center', padding: '100px', opacity: 0.3 }}>Empty Jurisdiction</p>
        ) : (
          cases.map((c) => (
            <div key={c._id} className="case-item">
              <div className="case-meta">
                <span className="label-small" style={{ color: 'var(--text-h)' }}>Case ID</span>
                <p style={{ fontSize: '12px', fontWeight: 800, marginBottom: '24px' }}>#{c._id.slice(-6).toUpperCase()}</p>
                
                <span className="label-small" style={{ color: 'var(--text-h)' }}>Status</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                  <div className="status-dot"></div>
                  <p style={{ fontSize: '11px', fontWeight: 800 }}>{c.status}</p>
                </div>

                <span className="label-small" style={{ color: 'var(--text-h)' }}>Timeline</span>
                <p style={{ fontSize: '11px', fontWeight: 800 }}>{new Date(c.createdAt).toLocaleDateString()}</p>
              </div>

              <div>
                <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>{c.title}</h2>
                <p style={{ fontSize: '18px', opacity: 0.7, lineHeight: '1.6', marginBottom: '32px' }}>{c.description}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', paddingBottom: '32px' }}>
                  <div>
                    <span className="label-small">Petitioner</span>
                    <p style={{ fontWeight: 700 }}>{c.initiatorPhone}</p>
                  </div>
                  <div>
                    <span className="label-small">Respondent</span>
                    <p style={{ fontWeight: 700 }}>{c.respondentPhone}</p>
                  </div>
                </div>

                {c.status === 'pending_respondent' && c.respondentPhone === user.mobile && (
                  <div className="card-minimal" style={{ border: '2px solid var(--text-h)', marginTop: '20px' }}>
                    <span className="label-small">Action Required</span>
                    <h3 style={{ marginBottom: '20px' }}>Submit Formal Response</h3>
                    <textarea 
                      className="input-minimal" 
                      placeholder="Your legal counter-statement..." 
                      onChange={(e) => setResponseStatement(e.target.value)} 
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                      <input type="file" onChange={(e) => setResponseFile(e.target.files[0])} />
                      <button className="btn-black" onClick={() => handleRespond(c._id)} disabled={loading}>
                        {loading ? 'Processing...' : 'File Response →'}
                      </button>
                    </div>
                  </div>
                )}

                {c.ai_conclusion && (
                  <div className="ai-box animate-reveal">
                    <span className="label-small" style={{ color: 'var(--bg)', opacity: 0.6 }}>AI Judicial Analysis</span>
                    <p style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>{c.ai_conclusion}</p>
                    <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                      <span className="label-small" style={{ color: 'var(--bg)', opacity: 0.4 }}>References</span>
                      <p style={{ fontSize: '12px', fontStyle: 'italic', opacity: 0.6 }}>{c.relevant_laws}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Dashboard;