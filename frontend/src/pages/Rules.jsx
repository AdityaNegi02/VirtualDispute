import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Rules = () => {
  const [laws, setLaws] = useState([]);

  useEffect(() => {
    const fetchLaws = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/cases/laws'
        );
        setLaws(data);
      } catch (err) {
        console.error('Error fetching laws', err);
      }
    };

    fetchLaws();
  }, []);

  return (
    <div className="rules-page">
      <header style={{ marginBottom: '60px', textAlign: 'center' }}>
        <span className="label-small">Legal Framework</span>

        <h1
          className="font-display"
          style={{
            fontSize: '72px',
            margin: 0,
          }}
        >
          Rules
        </h1>

        <p
          className="font-mono"
          style={{
            marginTop: '10px',
            opacity: 0.6,
          }}
        >
          Indian Penal Code · Virtual Jurisdictions
        </p>
      </header>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          width: '100%',
        }}
      >
        {laws.map((law, index) => (
          <div
            key={index}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div
              className="card-minimal"
              style={{
                borderLeft: '4px solid var(--accent)',
                maxWidth: '800px',
                width: '90%',
              }}
            >
              <p
                style={{
                  fontSize: '18px',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-wrap',
                  textAlign: 'left',
                }}
              >
                {law}
              </p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Rules;