import React, { useState } from 'react';

const DocumentsModal = ({ onClose }) => {
  const [uploadedDocuments] = useState([
    {
      id: 1,
      name: 'Pitch Deck - Q4 2025.pdf',
      type: 'pitch_deck',
      size: '2.4 MB',
      uploadedDate: '2025-10-28',
      status: 'processed',
      icon: '📊'
    },
    {
      id: 2,
      name: 'Financial Projections.pdf',
      type: 'financials',
      size: '1.1 MB',
      uploadedDate: '2025-10-25',
      status: 'processed',
      icon: '💰'
    },
    {
      id: 3,
      name: 'Product Roadmap 2026.pdf',
      type: 'roadmap',
      size: '890 KB',
      uploadedDate: '2025-10-20',
      status: 'processed',
      icon: '🗺️'
    },
    {
      id: 4,
      name: 'Team Bios & Backgrounds.pdf',
      type: 'team',
      size: '650 KB',
      uploadedDate: '2025-10-15',
      status: 'processed',
      icon: '👥'
    },
    {
      id: 5,
      name: 'Market Analysis Report.pdf',
      type: 'market_research',
      size: '3.2 MB',
      uploadedDate: '2025-10-10',
      status: 'processing',
      icon: '📈'
    },
    {
      id: 6,
      name: 'Customer Testimonials.pdf',
      type: 'testimonials',
      size: '1.8 MB',
      uploadedDate: '2025-10-05',
      status: 'processed',
      icon: '⭐'
    }
  ]);

  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleViewDocument = (doc) => {
    setSelectedDoc(doc);
    // In production, this would open the actual PDF
    alert(`Opening ${doc.name}...\n\nIn production, this would display the PDF viewer.`);
  };

  const handleUploadNew = () => {
    alert('File upload dialog would open here.\n\nIn production, you could upload:\n- Pitch Decks\n- Financial Documents\n- Product Documentation\n- Business Plans\n- Legal Documents');
  };

  const getStatusBadge = (status) => {
    if (status === 'processed') {
      return {
        bg: '#d1fae5',
        color: '#065f46',
        text: 'Processed'
      };
    } else if (status === 'processing') {
      return {
        bg: '#fef3c7',
        color: '#92400e',
        text: 'Processing'
      };
    }
    return {
      bg: '#fee2e2',
      color: '#991b1b',
      text: 'Failed'
    };
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#111827',
              margin: 0
            }}>
              📄 Documents
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '4px 0 0 0'
            }}>
              Manage your startup documents and pitch materials
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              fontSize: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e5e7eb';
              e.target.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.color = '#6b7280';
            }}
          >
            ×
          </button>
        </div>

        {/* Upload Button */}
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
          <button
            onClick={handleUploadNew}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '20px' }}>📤</span>
            Upload New Document
          </button>
        </div>

        {/* Documents List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px'
        }}>
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {uploadedDocuments.map((doc) => {
              const statusBadge = getStatusBadge(doc.status);
              return (
                <div
                  key={doc.id}
                  style={{
                    backgroundColor: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                  onClick={() => handleViewDocument(doc)}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    {/* Icon */}
                    <div style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0
                    }}>
                      {doc.icon}
                    </div>

                    {/* Document Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <h3 style={{
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#111827',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {doc.name}
                        </h3>
                        <span style={{
                          backgroundColor: statusBadge.bg,
                          color: statusBadge.color,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          flexShrink: 0
                        }}>
                          {statusBadge.text}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        display: 'flex',
                        gap: '12px',
                        marginTop: '4px'
                      }}>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>Uploaded {new Date(doc.uploadedDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDocument(doc);
                        }}
                      >
                        View
                      </button>
                      <button
                        style={{
                          padding: '6px 12px',
                          backgroundColor: 'white',
                          color: '#6b7280',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Downloading ${doc.name}...`);
                        }}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State (if no documents) */}
          {uploadedDocuments.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9ca3af'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#6b7280', marginBottom: '8px' }}>
                No documents uploaded yet
              </h3>
              <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                Upload your pitch deck, financials, and other materials to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsModal;
