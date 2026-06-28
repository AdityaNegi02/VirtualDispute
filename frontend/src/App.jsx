import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Rules from './pages/Rules';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

const AppContent = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <Router>
      <nav className="nav-bar">
        <div className="font-mono" style={{ fontSize: '14px', color: 'var(--text-h)' }}>
          <span style={{ color: 'var(--accent)' }}>●</span> VIRTUAL_DISPUTE_SYSTEM
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/rules" className="nav-link">Rules</Link>
          <Link to="/dashboard" className="nav-link">Records</Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="container animate-reveal">
        <main style={{ marginTop: '80px' }}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/rules" element={<Rules />} />
          </Routes>
        </main>

        <footer className="footer-section">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px' }}>
            <div>
              <span className="label-small">Developed By</span>
              <h2 className="font-display" style={{ fontSize: '48px', margin: 0 }}>Aditya Negi</h2>
              <p className="font-mono" style={{ marginTop: '10px', opacity: 0.6 }}>· MERN · C++ · PYTHON</p>
            </div>
            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-end' }}>
              <a href="https://github.com/AdityaNegi02" target="_blank" rel="noreferrer" className="nav-link">Github</a>
              <a href="https://www.linkedin.com/in/aditya-negi-1825122b3/" className="nav-link">LinkedIn</a>
              <a href="https://adityanegii.netlify.app/" className="nav-link">Portfolio</a>
            </div>
          </div>
          <div style={{ marginTop: '60px', borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <span className="font-mono" style={{ opacity: 0.4 }}>© 2026 ALL RIGHTS RESERVED</span>
            <span className="font-mono" style={{ color: '#10b981' }}>SYSTEM_STATUS: OPERATIONAL</span>
          </div>
        </footer>
      </div>
    </Router>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;