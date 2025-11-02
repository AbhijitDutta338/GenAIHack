import React, { useState } from 'react';

const DealFlowStartupModal = ({ startup, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [dealNotes, setDealNotes] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  if (!startup) return null;

  const handleGenerateNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/vc/dealflow/startup/${startup.id}/generate-notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const notes = await response.json();
      setDealNotes(notes);
      setActiveTab('notes');
      alert('✓ Deal notes generated successfully!');
    } catch (err) {
      console.error('Failed to generate notes:', err);
      alert('Failed to generate deal notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleIngestDocuments = async (docType) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/vc/dealflow/startup/${startup.id}/ingest-documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: docType })
      });
      const result = await response.json();
      setDocuments(prev => [...prev, result.document]);
      setActiveTab('documents');
      alert(`✓ ${docType.replace('_', ' ')} ingested successfully!`);
    } catch (err) {
      console.error('Failed to ingest documents:', err);
      alert('Failed to ingest documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          maxWidth: '1000px',
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
              justifyContent: 'center'
            }}
          >
            ×
          </button>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              {startup.company?.charAt(0) || startup.title?.charAt(0) || '?'}
            </div>
            
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '8px'
              }}>
                {startup.company || startup.title}
              </h1>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {startup.stage}
                </span>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  {startup.industry}
                </span>
                {startup.match && (
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {startup.match}% Match
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={handleGenerateNotes}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <span>📝</span>
              {loading ? 'Generating...' : 'Generate Deal Notes'}
            </button>
            <button
              onClick={() => handleIngestDocuments('call_transcript')}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <span>📞</span>
              Ingest Call Transcript
            </button>
            <button
              onClick={() => handleIngestDocuments('email_thread')}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <span>📧</span>
              Ingest Email Thread
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          padding: '0 30px'
        }}>
          {['overview', 'notes', 'documents'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 20px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === tab ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}
            >
              {tab}
              {tab === 'notes' && dealNotes && ' ✓'}
              {tab === 'documents' && documents.length > 0 && ` (${documents.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          {activeTab === 'overview' && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                Deal Overview
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>FIT SCORE</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{startup.fit || 'N/A'}/10</div>
                </div>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>TEAM SCORE</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{startup.team || 'N/A'}/10</div>
                </div>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>MARKET SCORE</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{startup.market || 'N/A'}/10</div>
                </div>
              </div>

              {startup.full_data && (
                <>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                    Company Details
                  </h3>
                  <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.6', marginBottom: '20px' }}>
                    {startup.full_data.description || startup.full_data.pitch}
                  </p>
                  
                  {startup.full_data.metrics && (
                    <div style={{
                      padding: '20px',
                      backgroundColor: '#eff6ff',
                      borderRadius: '8px',
                      marginBottom: '20px'
                    }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '12px' }}>
                        KEY METRICS
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>MRR: </span>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                            {startup.full_data.metrics.mrr}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>Growth: </span>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                            {startup.full_data.metrics.growth}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>Customers: </span>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                            {startup.full_data.metrics.customers}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>Burn: </span>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>
                            {startup.full_data.metrics.burn}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              {dealNotes ? (
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                    {dealNotes.summary}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
                    Generated on {new Date(dealNotes.generated_at).toLocaleString()}
                  </p>

                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>
                      Investment Thesis
                    </h3>
                    <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.6' }}>
                      {dealNotes.investment_thesis}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#15803d', marginBottom: '12px' }}>
                        ✓ Strengths
                      </h3>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {dealNotes.strengths.map((strength, idx) => (
                          <li key={idx} style={{
                            padding: '8px 12px',
                            backgroundColor: '#dcfce7',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            color: '#166534'
                          }}>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#dc2626', marginBottom: '12px' }}>
                        ⚠ Concerns
                      </h3>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {dealNotes.concerns.map((concern, idx) => (
                          <li key={idx} style={{
                            padding: '8px 12px',
                            backgroundColor: '#fee2e2',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            fontSize: '14px',
                            color: '#991b1b'
                          }}>
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={{
                    padding: '20px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '8px',
                    marginBottom: '20px'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#15803d', marginBottom: '12px' }}>
                      Recommendation: {dealNotes.recommendation}
                    </h3>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                      Next Steps:
                    </h4>
                    <ul style={{ marginLeft: '20px', color: '#374151' }}>
                      {dealNotes.next_steps.map((step, idx) => (
                        <li key={idx} style={{ marginBottom: '4px', fontSize: '14px' }}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{
                    padding: '16px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '8px'
                  }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
                      Valuation Analysis
                    </h4>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      <div>Asking: {dealNotes.valuation_analysis.asking}</div>
                      <div>Comparable Range: {dealNotes.valuation_analysis.comparable_range}</div>
                      <div style={{ fontWeight: '600', marginTop: '4px' }}>
                        Recommendation: {dealNotes.valuation_analysis.recommendation}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                  <p style={{ fontSize: '16px', color: '#6b7280' }}>
                    No deal notes generated yet. Click "Generate Deal Notes" to create AI-powered analysis.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              {documents.length > 0 ? (
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
                    Ingested Documents ({documents.length})
                  </h2>
                  {documents.map((doc, idx) => (
                    <div key={idx} style={{
                      padding: '20px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                            {doc.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#6b7280' }}>
                            Ingested on {new Date(doc.ingested_at).toLocaleString()}
                          </p>
                        </div>
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: '#dcfce7',
                          color: '#15803d',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          height: 'fit-content'
                        }}>
                          {doc.status}
                        </span>
                      </div>

                      {doc.insights && (
                        <>
                          <p style={{ fontSize: '15px', color: '#374151', marginBottom: '12px' }}>
                            {doc.insights.summary}
                          </p>
                          {doc.insights.key_points && (
                            <div>
                              <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                                Key Points:
                              </h4>
                              <ul style={{ marginLeft: '20px', color: '#4b5563' }}>
                                {doc.insights.key_points.map((point, i) => (
                                  <li key={i} style={{ marginBottom: '4px', fontSize: '14px' }}>{point}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {doc.insights.sentiment && (
                            <div style={{
                              marginTop: '12px',
                              padding: '8px 12px',
                              backgroundColor: doc.insights.sentiment === 'positive' ? '#dcfce7' : '#fee2e2',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: doc.insights.sentiment === 'positive' ? '#15803d' : '#dc2626'
                            }}>
                              Sentiment: {doc.insights.sentiment.toUpperCase()}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                  <p style={{ fontSize: '16px', color: '#6b7280' }}>
                    No documents ingested yet. Use the buttons above to ingest call transcripts or email threads.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '20px 30px',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
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
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DealFlowStartupModal;
