import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import StartupSwipeCard from '../components/StartupSwipeCard';
import StartupDetailModal from '../components/StartupDetailModal';
import DealFlowStartupModal from '../components/DealFlowStartupModal';
import RedFlagsTooltip from '../components/RedFlagsTooltip';

const VCDashboard = () => {
  const { user } = useAuth();
  // State for active tab - Changed default to 'startups'
  const [activeTab, setActiveTab] = useState('startups');

  // Data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // Settings state
  const [investmentThesis, setInvestmentThesis] = useState('');
  const [modelWeights, setModelWeights] = useState({
    berkus: 0.25,
    billatyne: 0.2,
    risk: 0.15,
    vcmethod: 0.4
  });

  // Startup swipe state
  const [currentStartupIndex, setCurrentStartupIndex] = useState(0);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sourcedStartups, setSourcedStartups] = useState([]);
  const [passedStartups, setPassedStartups] = useState([]);
  
  // Deal flow state
  const [selectedDealFlowStartup, setSelectedDealFlowStartup] = useState(null);
  const [showDealFlowModal, setShowDealFlowModal] = useState(false);
  const [dealflowData, setDealflowData] = useState([]);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getVCDashboard();
        setDashboardData(data);
        setInvestmentThesis(data.defaultInvestmentThesis);
        setModelWeights(data.defaultModelWeights);
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

  // Calculate total weight
  const totalWeight = Object.values(modelWeights).reduce((sum, weight) => sum + weight, 0);

  // Handle weight changes
  const handleWeightChange = (model, value) => {
    const numValue = parseFloat(value) || 0;
    setModelWeights(prev => ({
      ...prev,
      [model]: numValue
    }));
  };

  // Handle save functions
  const handleSaveThesis = () => {
    // In a real app, this would save to backend
    alert('Investment thesis saved successfully!');
  };

  const handleApplyWeights = () => {
    // In a real app, this would apply weights to backend
    alert('Model weights applied successfully!');
  };

  // Danger zone functions
  const handleResetWeights = () => {
    if (window.confirm('Are you sure you want to reset all model weights to default values?')) {
      setModelWeights({
        berkus: 0.25,
        billatyne: 0.25,
        risk: 0.25,
        vcmethod: 0.25
      });
    }
  };

  const handleClearStorage = () => {
    if (window.confirm('Are you sure you want to clear all local session storage? This cannot be undone.')) {
      localStorage.clear();
      alert('Local session storage cleared!');
    }
  };

  const handleRotateKeys = () => {
    if (window.confirm('Are you sure you want to rotate API keys/tokens? This will require re-authentication.')) {
      alert('API keys rotation initiated!');
    }
  };

  // Startup swipe handlers
  const handleSwipeRight = async (startup) => {
    // Source to deal flow
    try {
      await apiService.sourceStartupToDealFlow(startup);
      setSourcedStartups(prev => [...prev, startup]);
      setCurrentStartupIndex(prev => prev + 1);
      
      // Refresh deal flow data
      await refreshDealFlow();
      
      // Show success notification
      alert(`✓ ${startup.name} has been sourced to your deal flow!`);
    } catch (err) {
      console.error('Failed to source startup:', err);
      alert('Failed to source startup. Please try again.');
    }
  };

  const handleSwipeLeft = (startup) => {
    // Pass on startup
    setPassedStartups(prev => [...prev, startup]);
    setCurrentStartupIndex(prev => prev + 1);
  };

  const handleStartupClick = (startup) => {
    setSelectedStartup(startup);
    setShowDetailModal(true);
  };

  const handleSourceFromModal = async (startup) => {
    try {
      await apiService.sourceStartupToDealFlow(startup);
      setSourcedStartups(prev => [...prev, startup]);
      setShowDetailModal(false);
      setCurrentStartupIndex(prev => prev + 1);
      
      // Refresh deal flow data
      await refreshDealFlow();
      
      // Show success notification
      alert(`✓ ${startup.name} has been sourced to your deal flow!`);
    } catch (err) {
      console.error('Failed to source startup:', err);
      alert('Failed to source startup. Please try again.');
    }
  };

  // Deal flow handlers
  const refreshDealFlow = async () => {
    try {
      const data = await apiService.getDealflowStages();
      setDealflowData(data);
    } catch (err) {
      console.error('Failed to refresh deal flow:', err);
    }
  };

  const handleDealFlowStartupClick = (deal) => {
    setSelectedDealFlowStartup(deal);
    setShowDealFlowModal(true);
  };

  // Load deal flow data on mount and when switching to dealflow tab
  useEffect(() => {
    if (activeTab === 'dealflow') {
      refreshDealFlow();
    }
  }, [activeTab]);

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

  // Extract data from API response
  const weightedModels = dashboardData?.weightedModels || [];
  const scoreGauges = dashboardData?.scoreGauges || [];
  const recentAlerts = dashboardData?.recentAlerts || [];
  const portfolioSummary = dashboardData?.portfolioSummary || {};
  const portfolioHoldings = dashboardData?.portfolioHoldings || [];
  const dealflowStages = dashboardData?.dealflowStages || [];
  const keyMetrics = dashboardData?.keyMetrics || {};
  const holdingsData = dashboardData?.holdingsData || [];
  const startupsToWatch = dashboardData?.startupsToWatch || [];
  
  // Sample data matching the original dashboard

  // Startups Content - Swipeable Cards
  const renderStartupsContent = () => {
    const remainingStartups = startupsToWatch.filter(
      (startup, index) => index >= currentStartupIndex
    );

    if (remainingStartups.length === 0) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '20px'
          }}>
            🎉
          </div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '12px'
          }}>
            You've reviewed all startups!
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '24px'
          }}>
            Check back later for new opportunities or review your sourced startups in the Deal Flow tab.
          </p>
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            marginTop: '30px'
          }}>
            <div style={{
              padding: '20px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px',
              minWidth: '150px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#15803d' }}>
                {sourcedStartups.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                Sourced
              </div>
            </div>
            <div style={{
              padding: '20px',
              backgroundColor: '#fee2e2',
              borderRadius: '12px',
              minWidth: '150px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626' }}>
                {passedStartups.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                Passed
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setCurrentStartupIndex(0);
              setSourcedStartups([]);
              setPassedStartups([]);
            }}
            style={{
              marginTop: '30px',
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Review Again
          </button>
        </div>
      );
    }

    const currentStartup = remainingStartups[0];

    return (
      <div>
        {/* Header with progress */}
        <div style={{
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px'
          }}>
            Discover Top Startups
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '16px' }}>
            Swipe right to source, left to pass, or tap for details
          </p>
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#f3f4f6',
            borderRadius: '20px',
            fontSize: '14px',
            color: '#6b7280'
          }}>
            {currentStartupIndex + 1} of {startupsToWatch.length} startups
          </div>
        </div>

        {/* Swipe Card */}
        <div style={{ marginBottom: '30px' }}>
          <StartupSwipeCard
            startup={currentStartup}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onClick={handleStartupClick}
          />
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '30px'
        }}>
          <button
            onClick={() => handleSwipeLeft(currentStartup)}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '3px solid #ef4444',
              color: '#ef4444',
              fontSize: '32px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#ef4444';
              e.target.style.color = 'white';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#ef4444';
              e.target.style.transform = 'scale(1)';
            }}
            title="Pass"
          >
            ✗
          </button>
          <button
            onClick={() => handleStartupClick(currentStartup)}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '3px solid #3b82f6',
              color: '#3b82f6',
              fontSize: '32px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.color = 'white';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#3b82f6';
              e.target.style.transform = 'scale(1)';
            }}
            title="View Details"
          >
            ℹ
          </button>
          <button
            onClick={() => handleSwipeRight(currentStartup)}
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '3px solid #10b981',
              color: '#10b981',
              fontSize: '32px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#10b981';
              e.target.style.color = 'white';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#10b981';
              e.target.style.transform = 'scale(1)';
            }}
            title="Source to Deal Flow"
          >
            ✓
          </button>
        </div>

        {/* Stats Summary */}
        <div style={{
          marginTop: '40px',
          display: 'flex',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <div style={{
            padding: '16px 24px',
            backgroundColor: '#dcfce7',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d' }}>
              {sourcedStartups.length}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
              Sourced Today
            </div>
          </div>
          <div style={{
            padding: '16px 24px',
            backgroundColor: '#fee2e2',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
              {passedStartups.length}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
              Passed
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Settings Content
  const renderSettingsContent = () => (
    <div style={{ maxWidth: '800px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Settings
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Configure thesis and model weightings (demo only).
        </p>
      </div>

      {/* Investment Thesis Section */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#6b7280', 
          marginBottom: '15px',
          textTransform: 'uppercase'
        }}>
          INVESTMENT THESIS
        </h3>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative' }}>
            <textarea
              value={investmentThesis}
              onChange={(e) => setInvestmentThesis(e.target.value)}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '16px',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.5',
                resize: 'vertical',
                backgroundColor: '#f9fafb'
              }}
              placeholder="Enter your investment thesis..."
            />
            
            {/* Edit Icon */}
            <div style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: '#6b7280',
              cursor: 'pointer'
            }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
          
          <div style={{ padding: '16px', backgroundColor: 'white', borderTop: '1px solid #e5e7eb' }}>
            <button
              onClick={handleSaveThesis}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              Save Thesis
            </button>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              (Non-persistent demo)
            </span>
          </div>
        </div>
      </div>

      {/* Model Weighting Section */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#6b7280', 
          marginBottom: '20px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}>
          MODEL WEIGHTING
        </h3>
        
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Weight Input Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '24px', 
            marginBottom: '32px' 
          }}>
            {[
              { key: 'berkus', label: 'BERKUS' },
              { key: 'billatyne', label: 'BILLATYNE' },
              { key: 'risk', label: 'RISK' },
              { key: 'vcmethod', label: 'VCMETHOD' }
            ].map(({ key, label }) => (
              <div key={key}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '13px', 
                  color: '#374151', 
                  fontWeight: '600',
                  marginBottom: '10px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  {label}
                </label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={modelWeights[key]}
                  onChange={(e) => handleWeightChange(key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 20px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    color: '#111827',
                    backgroundColor: '#f9fafb',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
              </div>
            ))}
          </div>

          {/* Total Weight Display */}
          <div style={{ 
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: totalWeight === 1 ? '#f0fdf4' : '#fef2f2',
            borderRadius: '8px',
            border: `1px solid ${totalWeight === 1 ? '#bbf7d0' : '#fecaca'}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ 
                fontSize: '15px', 
                color: '#374151', 
                fontWeight: '500' 
              }}>
                Total Weight:
              </span>
              <strong style={{ 
                fontSize: '18px',
                color: totalWeight === 1 ? '#10b981' : '#ef4444',
                fontWeight: '700'
              }}>
                {totalWeight.toFixed(2)}
              </strong>
              <span style={{ 
                fontSize: '13px', 
                color: totalWeight === 1 ? '#10b981' : '#ef4444',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {totalWeight === 1 ? (
                  <>
                    <span style={{ fontSize: '16px' }}>✓</span>
                    Ensure sum equals 1.00
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '16px' }}>⚠</span>
                    Ensure sum equals 1.00
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Apply Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleApplyWeights}
              disabled={totalWeight !== 1}
              style={{
                backgroundColor: totalWeight === 1 ? '#10b981' : '#9ca3af',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '600',
                cursor: totalWeight === 1 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                boxShadow: totalWeight === 1 ? '0 2px 4px rgba(16, 185, 129, 0.2)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (totalWeight === 1) {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (totalWeight === 1) {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.2)';
                }
              }}
            >
              Apply Weights
            </button>
            <span style={{ 
              fontSize: '13px', 
              color: '#6b7280',
              fontStyle: 'italic'
            }}>
              (Would rescale lift on backend in production)
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone Section */}
      <div>
        <h3 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#6b7280', 
          marginBottom: '15px',
          textTransform: 'uppercase'
        }}>
          DANGER ZONE
        </h3>
        
        <div style={{
          backgroundColor: '#fef2f2',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #fecaca',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626', marginBottom: '8px' }}>
              Planned Functions
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#7f1d1d', fontSize: '14px' }}>
              <li style={{ marginBottom: '4px', cursor: 'pointer' }} onClick={handleResetWeights}>
                Reset model weights
              </li>
              <li style={{ marginBottom: '4px', cursor: 'pointer' }} onClick={handleClearStorage}>
                Clear local session storage
              </li>
              <li style={{ marginBottom: '4px', cursor: 'pointer' }} onClick={handleRotateKeys}>
                Rotate API keys / tokens
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // Dealflow Content
  const renderDealflowContent = () => (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Dealflow
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
          Pipeline by stage with lightweight scoring & notes.
        </p>
        <p style={{ color: '#9ca3af', fontSize: '14px', fontStyle: 'italic' }}>
          Drag & drop, inline voting & notes editing are planned enhancements.
        </p>
      </div>

      {/* Pipeline Kanban Board */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        overflowX: 'auto',
        paddingBottom: '10px'
      }}>
        {(dealflowData.length > 0 ? dealflowData : dealflowStages).map((stage, stageIndex) => (
          <div key={stageIndex} style={{
            minWidth: '280px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #e5e7eb'
          }}>
            {/* Stage Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                margin: 0
              }}>
                {stage.name}
              </h3>
              <span style={{
                backgroundColor: '#e5e7eb',
                color: '#6b7280',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {stage.count}
              </span>
            </div>

            {/* Deal Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {stage.deals.map((deal, dealIndex) => (
                <RedFlagsTooltip key={dealIndex} startup={deal}>
                  <div 
                    onClick={() => handleDealFlowStartupClick(deal)}
                    style={{
                      backgroundColor: 'white',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'}
                  >
                    {/* Deal ID */}
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#2563eb',
                      marginBottom: '8px'
                    }}>
                      {deal.id}
                    </div>

                    {/* Deal Description */}
                    <div style={{
                      fontSize: '14px',
                      color: '#374151',
                      marginBottom: '12px',
                      lineHeight: '1.4'
                    }}>
                      {deal.title}
                    </div>

                    {/* Scoring Metrics */}
                    <div style={{
                      display: 'flex',
                      gap: '12px',
                      fontSize: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#6b7280', fontWeight: '500' }}>Fit:</span>
                        <span style={{ 
                          color: deal.fit >= 8 ? '#10b981' : deal.fit >= 6 ? '#f59e0b' : '#ef4444',
                          fontWeight: '600'
                        }}>
                          {deal.fit}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#6b7280', fontWeight: '500' }}>Team:</span>
                        <span style={{ 
                          color: deal.team >= 8 ? '#10b981' : deal.team >= 6 ? '#f59e0b' : '#ef4444',
                          fontWeight: '600'
                        }}>
                          {deal.team}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: '#6b7280', fontWeight: '500' }}>Market:</span>
                        <span style={{ 
                          color: deal.market >= 8 ? '#10b981' : deal.market >= 6 ? '#f59e0b' : '#ef4444',
                          fontWeight: '600'
                        }}>
                          {deal.market}
                        </span>
                      </div>
                    </div>
                  </div>
                </RedFlagsTooltip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Portfolio Content
  const renderPortfolioContent = () => (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Portfolio
        </h2>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Holdings, performance and diversification overview
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#6b7280', 
          marginBottom: '15px',
          textTransform: 'uppercase'
        }}>
          SUMMARY
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {Object.entries(portfolioSummary).map(([key, data]) => (
            <div key={key} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                {data.label}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
                {data.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Holdings Table */}
      <div>
        <h3 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#6b7280', 
          marginBottom: '15px',
          textTransform: 'uppercase'
        }}>
          HOLDINGS
        </h3>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    color: '#6b7280', 
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    Name
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    color: '#6b7280', 
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    Stage
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'left', 
                    fontSize: '12px', 
                    color: '#6b7280', 
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    Sector
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'right', 
                    fontSize: '12px', 
                    color: '#6b7280', 
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    Ownership
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'right', 
                    fontSize: '12px', 
                    color: '#6b7280', 
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    Cost ($M)
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'right', 
                    fontSize: '12px', 
                    color: '#6b7280', 
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    Value ($M)
                  </th>
                  <th style={{ 
                    padding: '16px 20px', 
                    textAlign: 'right', 
                    fontSize: '12px', 
                    color: '#6b7280', 
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}>
                    MOIC
                  </th>
                </tr>
              </thead>
              <tbody>
                {portfolioHoldings.map((holding, index) => (
                  <tr key={index} style={{ 
                    borderTop: index > 0 ? '1px solid #f3f4f6' : 'none',
                    '&:hover': { backgroundColor: '#f9fafb' }
                  }}>
                    <td style={{ 
                      padding: '16px 20px', 
                      fontSize: '14px', 
                      color: '#2563eb', 
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      {holding.name}
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      fontSize: '14px', 
                      color: '#374151' 
                    }}>
                      {holding.stage}
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      fontSize: '14px', 
                      color: '#374151' 
                    }}>
                      {holding.sector}
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      textAlign: 'right', 
                      fontSize: '14px', 
                      color: '#374151' 
                    }}>
                      {holding.ownership}
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      textAlign: 'right', 
                      fontSize: '14px', 
                      color: '#374151' 
                    }}>
                      {holding.cost}
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      textAlign: 'right', 
                      fontSize: '14px', 
                      color: '#374151' 
                    }}>
                      {holding.value}
                    </td>
                    <td style={{ 
                      padding: '16px 20px', 
                      textAlign: 'right', 
                      fontSize: '14px', 
                      color: parseFloat(holding.moic) >= 1 ? '#10b981' : '#ef4444',
                      fontWeight: '500'
                    }}>
                      {holding.moic}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Diversification Section */}
      <div style={{ marginTop: '40px' }}>
        <h3 style={{ 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#6b7280', 
          marginBottom: '15px',
          textTransform: 'uppercase'
        }}>
          DIVERSIFICATION
        </h3>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          borderStyle: 'dashed'
        }}>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '14px',
            textAlign: 'center',
            margin: 0
          }}>
            Upcoming charts: Sector allocation • Stage mix • Geography heatmap
          </p>
        </div>
      </div>
    </div>
  );

  // Metric Card Component
  const MetricCard = ({ title, value, subtext, bgColor = 'white' }) => (
    <div style={{
      backgroundColor: bgColor,
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        fontSize: '12px',
        color: '#6b7280',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: '8px'
      }}>
        {title}
      </div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
        {value}
      </div>
      {subtext && (
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {subtext}
        </div>
      )}
    </div>
  );

  // Holdings Chart Component (simplified)
  const HoldingsChart = () => (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div>
        <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginBottom: '10px' }}>
          Holdings P&L
        </div>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', textAlign: 'center' }}>
          ₹0.76M
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', marginTop: '5px' }}>
          28.65%
        </div>
      </div>
    </div>
  );

  // Main Dashboard Content
  const renderDashboardContent = () => (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Left Column */}
      <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
          <MetricCard title="FUNDS DEPLOYED" value={keyMetrics.fundsDeployed.value} subtext={keyMetrics.fundsDeployed.subtext} />
          <MetricCard title="CASH AVAILABLE" value={keyMetrics.cashAvailable.value} />
          <MetricCard title="IRR" value={keyMetrics.irr.value} />
          <MetricCard title="TVPI / DPI" value={keyMetrics.tvpiDpi.value} subtext={keyMetrics.tvpiDpi.subtext} />
        </div>

        {/* Holdings Chart and Weighted Models */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <HoldingsChart />
          
          {/* Weighted Models Snapshot */}
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '15px' }}>
              Weighted Models Snapshot
            </h3>
            {weightedModels.map((model, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#374151' }}>{model.symbol}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '40px',
                    height: '6px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${model.value}%`,
                      height: '100%',
                      backgroundColor: '#10b981',
                      borderRadius: '3px'
                    }} />
                  </div>
                  <span style={{ fontSize: '12px', color: '#374151', width: '20px' }}>{model.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Holdings Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '15px 20px',
            borderBottom: '1px solid #e5e7eb',
            backgroundColor: '#f9fafb'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>HOLDINGS</h3>
          </div>
          
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Name</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Qty</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Avg Cost</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Price</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>P&L ₹</th>
                  <th style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>Weight</th>
                </tr>
              </thead>
              <tbody>
                {holdingsData.map((holding, index) => (
                  <tr key={index} style={{ borderTop: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px', fontSize: '12px', color: '#111827', fontWeight: '600' }}>{holding.name}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#374151' }}>{holding.qty.toLocaleString()}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#374151' }}>{holding.avgCost}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#374151' }}>{holding.price}</td>
                    <td style={{ 
                      padding: '12px', 
                      textAlign: 'right', 
                      fontSize: '12px', 
                      color: holding.pnl.includes('-') ? '#ef4444' : '#10b981',
                      fontWeight: '500'
                    }}>
                      {holding.pnl}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontSize: '12px', color: '#374151' }}>{holding.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Startups to Watch */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '15px' }}>
            TOP STARTUPS TO WATCH
          </h3>
          {startupsToWatch.map((startup, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: index < startupsToWatch.length - 1 ? '1px solid #f3f4f6' : 'none'
            }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#111827' }}>{startup.name}</div>
                <div style={{ fontSize: '10px', color: '#6b7280' }}>{startup.description}</div>
              </div>
              <div style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '600'
              }}>
                {startup.match}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Alerts */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '15px' }}>
            RECENT ALERTS
          </h3>
          {recentAlerts.map((alert, index) => (
            <div key={index} style={{
              padding: '8px 0',
              borderBottom: index < recentAlerts.length - 1 ? '1px solid #f3f4f6' : 'none'
            }}>
              <div style={{ fontSize: '11px', color: '#374151', lineHeight: '1.4' }}>
                • {alert}
              </div>
            </div>
          ))}
        </div>

        {/* Score Gauges */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '15px' }}>
            SCORE GAUGES
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            {scoreGauges.map((gauge, index) => (
              <div key={index}>
                <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '5px' }}>{gauge.name}</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>{gauge.score}</div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginTop: '5px'
                }}>
                  <div style={{
                    width: `${gauge.score}%`,
                    height: '100%',
                    backgroundColor: '#10b981',
                    borderRadius: '2px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Removed unused renderPortfolioTab function

  // Removed unused renderStartupsTab and renderDealFlowTab functions

  const renderContent = () => {
    switch (activeTab) {
      case 'startups':
        return renderStartupsContent();
      case 'portfolio':
        return renderPortfolioContent();
      case 'dealflow':
        return renderDealflowContent();
      case 'settings':
        return renderSettingsContent();
      case 'dashboard':
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '20px'
    }}>
      {/* Startup Detail Modal */}
      {showDetailModal && selectedStartup && (
        <StartupDetailModal
          startup={selectedStartup}
          onClose={() => setShowDetailModal(false)}
          onSourceToDealFlow={handleSourceFromModal}
        />
      )}
      
      {/* Deal Flow Startup Modal */}
      {showDealFlowModal && selectedDealFlowStartup && (
        <DealFlowStartupModal
          startup={selectedDealFlowStartup}
          onClose={() => setShowDealFlowModal(false)}
          onRefresh={refreshDealFlow}
        />
      )}
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '10px'
          }}>
            VC Dashboard
          </h1>
          <p style={{ color: '#6b7280' }}>
            Welcome back, {user?.email || 'VC Partner'}! Manage your portfolio and discover new investment opportunities.
          </p>
        </div>

        {/* Top Navigation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '20px',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid #e5e7eb'
          }}>
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'portfolio', label: 'Portfolio' },
              { key: 'startups', label: 'Startups' },
              { key: 'dealflow', label: 'Dealflow' },
              { key: 'settings', label: 'Settings' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: '16px 24px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.key ? '3px solid #3b82f6' : '3px solid transparent',
                  color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  textTransform: 'uppercase'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        <div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default VCDashboard;