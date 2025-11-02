import React from 'react';

const StartupDetailModal = ({ startup, onClose, onSourceToDealFlow }) => {
  if (!startup) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}
    onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '30px',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1,
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              {startup.name.charAt(0)}
            </div>
            
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '8px'
              }}>
                {startup.name}
              </h1>
              <p style={{
                fontSize: '18px',
                color: '#6b7280',
                fontStyle: 'italic',
                marginBottom: '12px'
              }}>
                {startup.tagline}
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {startup.stage}
                </span>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {startup.industry}
                </span>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  📍 {startup.location}
                </span>
                <span style={{
                  padding: '6px 12px',
                  backgroundColor: '#e0e7ff',
                  color: '#3730a3',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {startup.match}% Match
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {/* Description */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '12px'
            }}>
              About
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#4b5563',
              lineHeight: '1.8'
            }}>
              {startup.description}
            </p>
          </section>

          {/* The Pitch */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '12px'
            }}>
              The Opportunity
            </h2>
            <div style={{
              padding: '20px',
              backgroundColor: '#eff6ff',
              borderLeft: '4px solid #3b82f6',
              borderRadius: '8px'
            }}>
              <p style={{
                fontSize: '16px',
                color: '#1e40af',
                lineHeight: '1.8',
                margin: 0
              }}>
                {startup.pitch}
              </p>
            </div>
          </section>

          {/* Key Metrics Grid */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Key Metrics
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div style={{
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Monthly Revenue</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{startup.metrics.mrr}</div>
                <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '600', marginTop: '4px' }}>{startup.metrics.growth}</div>
              </div>
              <div style={{
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Customers</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{startup.metrics.customers}</div>
              </div>
              <div style={{
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Monthly Burn</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{startup.metrics.burn}</div>
              </div>
              <div style={{
                padding: '20px',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Team Size</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{startup.teamSize}</div>
              </div>
            </div>
          </section>

          {/* Funding */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Funding Details
            </h2>
            <div style={{
              padding: '20px',
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Seeking</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#15803d' }}>{startup.funding.seeking}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Already Raised</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827' }}>{startup.funding.raised}</div>
                </div>
                <div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>Valuation</div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827' }}>{startup.funding.valuation}</div>
                </div>
              </div>
            </div>
          </section>

          {/* Founders */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Founding Team
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {startup.founders.map((founder, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginRight: '16px',
                    flexShrink: 0
                  }}>
                    {founder.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                      {founder.name}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '6px' }}>
                      {founder.role}
                    </p>
                    <p style={{ fontSize: '13px', color: '#9ca3af' }}>
                      {founder.background}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Highlights */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Key Highlights
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {startup.highlights.map((highlight, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px',
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    ✓
                  </span>
                  <span style={{ fontSize: '15px', color: '#374151' }}>
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Documents */}
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px'
            }}>
              Documents
            </h2>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {Object.entries(startup.documents).map(([key, value]) => (
                <div key={key} style={{
                  padding: '12px 16px',
                  backgroundColor: value === 'Available' ? '#dcfce7' : '#fef3c7',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '18px' }}>📄</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                    {key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: value === 'Available' ? '#15803d' : '#92400e',
                    fontWeight: '600'
                  }}>
                    • {value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '20px 30px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end',
          position: 'sticky',
          bottom: 0,
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              backgroundColor: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
          >
            Close
          </button>
          <button
            onClick={() => onSourceToDealFlow(startup)}
            style={{
              padding: '12px 32px',
              backgroundColor: '#10b981',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            Source to Deal Flow →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartupDetailModal;
