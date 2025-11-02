import React from 'react';

function Logos() {
  const logos = [
    'Sequoia Capital',
    'Andreessen Horowitz', 
    'Benchmark',
    'Greylock Partners',
    'Kleiner Perkins',
    'Accel'
  ];

  return (
    <div style={{ backgroundColor: '#f9fafb', padding: '4rem 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '2rem' }}>
            Trusted by Leading VCs
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '2rem' 
          }}>
            {logos.map((logo, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <div style={{ 
                  color: '#4b5563', 
                  fontWeight: '600', 
                  fontSize: '0.875rem', 
                  textAlign: 'center' 
                }}>
                  {logo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logos;