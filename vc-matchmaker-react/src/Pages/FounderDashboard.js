import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import DocumentsModal from '../components/DocumentsModal';
import FounderChatbot from '../components/FounderChatbot';

const FounderDashboard = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  
  // Check if founder has completed profile (simulate with localStorage)
  const [profileCompleted, setProfileCompleted] = useState(() => {
    const savedProfile = localStorage.getItem('founderProfile');
    return savedProfile ? JSON.parse(savedProfile).completed : false;
  });

  // Completed profile state
  const [completedProfile, setCompletedProfile] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1: Basic Company Information
    companyName: '',
    tagline: '',
    description: '',
    industry: '',
    stage: '',
    
    // Step 2: Product Information
    productType: '',
    targetMarket: '',
    businessModel: '',
    revenue: '',
    
    // Step 3: Team Information
    foundersCount: '',
    teamSize: '',
    keyTeamMembers: '',
    
    // Step 4: Financial Information
    fundingRaised: '',
    fundingSought: '',
    currentValuation: '',
    monthlyBurn: '',
    runway: '',
    
    // Step 5: Technology & Innovation
    techStack: '',
    ipStatus: '',
    competitiveAdvantage: '',
    
    // Step 6: Market & Traction
    marketSize: '',
    customers: '',
    partnerships: '',
    achievements: '',
    
    // Step 7: Investment & Goals
    useOfFunds: '',
    investorType: '',
    timeline: '',
    exitStrategy: ''
  });

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getFounderDashboard();
        setDashboardData(data);
        setCompletedProfile(data.completedProfileSample);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please check if the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get form configuration from API data
  const formSteps = dashboardData?.formSteps || [];
  const totalSteps = formSteps.length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Startup Profile Data:', formData);
    
    // Mark profile as completed and save to localStorage
    const profileData = {
      ...formData,
      completed: true,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem('founderProfile', JSON.stringify(profileData));
    setProfileCompleted(true);
    
    alert('Startup profile saved successfully! Welcome to your dashboard.');
  };

  // Function to edit profile (go back to form)
  const handleEditProfile = () => {
    setProfileCompleted(false);
  };

  // Render completed dashboard view
  const renderCompletedDashboard = () => (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#111827'
          }}>
            Founder Dashboard
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleEditProfile}
              style={{
                padding: '8px 16px',
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Edit Profile
            </button>
            <button
              onClick={() => setShowDocumentsModal(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Documents
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Startup Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '600',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              STARTUP
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '8px'
            }}>
              {completedProfile.companyName}
            </h2>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginBottom: '12px'
            }}>
              {completedProfile.tagline}
            </div>
            <p style={{
              fontSize: '14px',
              color: '#374151',
              lineHeight: '1.5'
            }}>
              {completedProfile.description}
            </p>
          </div>

          {/* Readiness Score Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '600',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              READINESS
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              marginBottom: '8px'
            }}>
              <span style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#111827'
              }}>
                {completedProfile.readinessScore}
              </span>
              <span style={{
                fontSize: '16px',
                color: '#6b7280',
                marginLeft: '4px'
              }}>
                /100
              </span>
            </div>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '16px'
            }}>
              {completedProfile.readinessLevel}
            </div>
            <div style={{ fontSize: '14px', color: '#374151' }}>
              <div style={{ marginBottom: '4px' }}>
                Profile {completedProfile.profileCompletion}
              </div>
              <div style={{ marginBottom: '4px' }}>
                Metrics {completedProfile.metricsCompletion}
              </div>
              <div>
                Documents {completedProfile.documentsCompletion}
              </div>
            </div>
          </div>

          {/* Latest Metrics Card */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              fontSize: '12px',
              color: '#6b7280',
              fontWeight: '600',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              LATEST METRICS
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px'
            }}>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  MRR
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {completedProfile.metrics.mrr}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  ARR
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {completedProfile.metrics.arr}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  Growth %
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {completedProfile.metrics.growth}
                </div>
              </div>
              <div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginBottom: '4px'
                }}>
                  Runway
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {completedProfile.metrics.runway}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended VCs Section */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '16px'
          }}>
            🎯 Recommended VCs for You
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '20px'
          }}>
            Based on your profile, stage, and industry - sorted by match score
          </p>

          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {dashboardData?.recommendedVCs?.map((vc) => (
              <div
                key={vc.id}
                style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  {/* VC Logo */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '12px',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    flexShrink: 0
                  }}>
                    {vc.logo}
                  </div>

                  {/* VC Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#111827',
                          margin: '0 0 4px 0'
                        }}>
                          {vc.name}
                        </h3>
                        <div style={{
                          fontSize: '13px',
                          color: '#6b7280',
                          marginBottom: '8px'
                        }}>
                          {vc.stage.join(', ')} • {vc.checkSize}
                        </div>
                      </div>

                      {/* Match Scores */}
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: vc.matchScore >= 85 ? '#10b981' : vc.matchScore >= 75 ? '#3b82f6' : '#f59e0b'
                          }}>
                            {vc.matchScore}%
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            fontWeight: '600'
                          }}>
                            Match
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: vc.readinessForThisVC >= 85 ? '#10b981' : vc.readinessForThisVC >= 75 ? '#3b82f6' : '#f59e0b'
                          }}>
                            {vc.readinessForThisVC}%
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            fontWeight: '600'
                          }}>
                            Ready
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Investment Thesis */}
                    <div style={{
                      backgroundColor: '#f9fafb',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: '600',
                        marginBottom: '4px'
                      }}>
                        Investment Thesis
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#374151',
                        fontWeight: '500'
                      }}>
                        {vc.investmentThesis}
                      </div>
                    </div>

                    {/* Reasoning */}
                    <div style={{
                      fontSize: '13px',
                      color: '#374151',
                      marginBottom: '12px',
                      lineHeight: '1.5'
                    }}>
                      💡 {vc.reasoning}
                    </div>

                    {/* Portfolio Companies */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      flexWrap: 'wrap',
                      marginBottom: '12px'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        fontWeight: '600'
                      }}>
                        Portfolio:
                      </span>
                      {vc.portfolioCompanies.slice(0, 3).map((company, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '12px',
                            color: '#3b82f6',
                            backgroundColor: '#eff6ff',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontWeight: '500'
                          }}
                        >
                          {company}
                        </span>
                      ))}
                    </div>

                    {/* Contact Button */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Contact: ${vc.partnerName}\nEmail: ${vc.partnerEmail}\n\nIn production, this would open an email composer or warm intro request.`);
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                      >
                        Request Intro to {vc.partnerName}
                      </button>
                      <button
                        style={{
                          padding: '10px 20px',
                          backgroundColor: 'white',
                          color: '#374151',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Viewing full profile for ${vc.name}...\n\nIn production, this would show:\n- Full investment criteria\n- Recent investments\n- Partner bios\n- Success stories`);
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                      >
                        View Full Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Modal */}
        {showDocumentsModal && (
          <DocumentsModal onClose={() => setShowDocumentsModal(false)} />
        )}

        {/* Chatbot */}
        <FounderChatbot />
      </div>
    </div>
  );

  // Helper function to render form fields dynamically
  const renderFormField = (field) => {
    const commonStyle = {
      width: '100%',
      padding: '10px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '16px'
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            style={{
              ...commonStyle,
              resize: 'vertical'
            }}
          />
        );
      
      case 'select':
        return (
          <select
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            required={field.required}
            style={commonStyle}
          >
            <option value="">Select {field.label}</option>
            {field.options && field.options.map((option, idx) => (
              <option key={idx} value={option.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'number':
        return (
          <input
            type="number"
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            required={field.required}
            style={commonStyle}
          />
        );
      
      default: // text
        return (
          <input
            type="text"
            name={field.name}
            value={formData[field.name]}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            required={field.required}
            style={commonStyle}
          />
        );
    }
  };

  const renderStepContent = () => {
    const currentStepData = formSteps.find(step => step.step === currentStep);
    
    if (!currentStepData) return null;

    return (
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#1f2937', marginBottom: '10px' }}>{currentStepData.title}</h3>
        <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>
          {currentStepData.description}
        </p>
        {currentStepData.fields.map((field, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              {field.label} {field.required && '*'}
            </label>
            {renderFormField(field)}
          </div>
        ))}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading dashboard data...</h2>
        <p style={{ color: '#6b7280', marginTop: '10px' }}>Fetching data from backend API</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#dc2626' }}>
        <h2>Error Loading Dashboard</h2>
        <p style={{ marginTop: '10px' }}>{error}</p>
        <p style={{ color: '#6b7280', marginTop: '20px' }}>
          Make sure the FastAPI backend is running on http://localhost:8000
        </p>
      </div>
    );
  }

  // Conditionally render completed dashboard or form
  if (profileCompleted && completedProfile) {
    return renderCompletedDashboard();
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '40px'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '10px'
          }}>
            Founder Dashboard
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '10px' }}>
            Welcome back, {user?.email || 'Founder'}! Complete your startup profile to connect with the right investors.
          </p>
          
          {/* Progress Bar */}
          <div style={{ marginTop: '20px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>Progress</span>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>{currentStep} of {totalSteps}</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(currentStep / totalSteps) * 100}%`,
                height: '100%',
                backgroundColor: '#3b82f6',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              style={{
                padding: '12px 24px',
                backgroundColor: currentStep === 1 ? '#f3f4f6' : '#6b7280',
                color: currentStep === 1 ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              Previous
            </button>

            {currentStep === totalSteps ? (
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Save Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FounderDashboard;