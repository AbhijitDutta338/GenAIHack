import React, { useState } from 'react';

const RedFlagsTooltip = ({ startup, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [redFlags, setRedFlags] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRedFlags = async () => {
    if (redFlags.length > 0) return; // Already loaded
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/vc/dealflow/startup/${startup.id}`);
      const data = await response.json();
      setRedFlags(data.red_flags || []);
    } catch (err) {
      console.error('Failed to fetch red flags:', err);
      setRedFlags([{
        severity: 'low',
        flag: 'Unable to load',
        detail: 'Could not fetch risk analysis'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
    fetchRedFlags();
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return { bg: '#fee2e2', border: '#dc2626', text: '#dc2626' };
      case 'medium':
        return { bg: '#fef3c7', border: '#f59e0b', text: '#f59e0b' };
      case 'low':
        return { bg: '#dbeafe', border: '#3b82f6', text: '#3b82f6' };
      default:
        return { bg: '#f3f4f6', border: '#6b7280', text: '#6b7280' };
    }
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
          zIndex: 1000,
          minWidth: '320px',
          maxWidth: '400px'
        }}>
          {/* Arrow */}
          <div style={{
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '8px solid white',
            position: 'absolute',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            filter: 'drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.1))'
          }} />
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            padding: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <span style={{ fontSize: '20px', marginRight: '8px' }}>🚩</span>
              <h4 style={{
                fontSize: '15px',
                fontWeight: '700',
                color: '#111827',
                margin: 0
              }}>
                Risk Factors
              </h4>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                Loading analysis...
              </div>
            ) : redFlags.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {redFlags.map((flag, index) => {
                  const colors = getSeverityColor(flag.severity);
                  return (
                    <div
                      key={index}
                      style={{
                        padding: '12px',
                        backgroundColor: colors.bg,
                        borderLeft: `3px solid ${colors.border}`,
                        borderRadius: '6px'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px'
                      }}>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#111827'
                        }}>
                          {flag.flag}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          color: colors.text,
                          padding: '2px 8px',
                          backgroundColor: 'white',
                          borderRadius: '4px'
                        }}>
                          {flag.severity}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '12px',
                        color: '#4b5563',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        {flag.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '12px', color: '#10b981', fontSize: '14px' }}>
                ✓ No significant risks identified
              </div>
            )}

            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid #e5e7eb',
              fontSize: '11px',
              color: '#9ca3af',
              textAlign: 'center'
            }}>
              AI-generated risk assessment
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedFlagsTooltip;
