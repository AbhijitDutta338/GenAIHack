import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div style={{ 
      backgroundColor: 'white',
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '4rem 1rem',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          marginBottom: '1.5rem',
          color: '#111827'
        }}>
          AI-Powered Startup & VC<br />Matchmaking
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          marginBottom: '3rem', 
          color: '#6b7280',
          maxWidth: '600px',
          margin: '0 auto 3rem auto'
        }}>
          Founders get discovered. VCs find the right investments. Powered by intelligent weighted models.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link 
            to="/login?type=founder"
            style={{ 
              backgroundColor: '#111827', 
              color: 'white', 
              fontWeight: '500', 
              padding: '0.75rem 2rem', 
              borderRadius: '8px', 
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            I'm a Founder
          </Link>
          <Link 
            to="/login?type=vc"
            style={{ 
              border: '1px solid #d1d5db', 
              color: '#111827', 
              fontWeight: '500', 
              padding: '0.75rem 2rem', 
              borderRadius: '8px', 
              backgroundColor: 'white',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            I'm a VC
          </Link>
        </div>
        
        <p style={{ 
          color: '#6b7280', 
          fontSize: '1rem',
          marginBottom: '2rem'
        }}>
          Our platform categorizes and scores startups using trusted VC weighted models, combining founder-submitted details and public data. We then match VCs with the top startups based on investment intent and goals.
        </p>
      </div>
    </div>
  );
}

export default Hero;