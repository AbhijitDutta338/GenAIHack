import React from 'react';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#1f2937', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>VC Matchmaker</h3>
            <p style={{ color: '#d1d5db', marginBottom: '1rem' }}>
              Connecting innovative startups with the right venture capital partners.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <button style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer' }}>About</button>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <button style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer' }}>Contact</button>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <button style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer' }}>Privacy</button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <button style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer' }}>For Startups</button>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <button style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer' }}>For VCs</button>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <button style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer' }}>Resources</button>
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{ marginTop: '2rem', borderTop: '1px solid #374151', paddingTop: '2rem' }}>
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>
            © 2024 VC Matchmaker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;