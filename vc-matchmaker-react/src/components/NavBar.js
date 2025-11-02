import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function NavBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>
                Startup<span style={{ color: '#10b981' }}>Match</span>
              </span>
            </Link>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {!isAuthenticated ? (
              <>
                <Link to="/about" style={{ color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem' }}>
                  About
                </Link>
                <Link to="/how-it-works" style={{ color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem' }}>
                  How it works
                </Link>
                <Link to="/pricing" style={{ color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem' }}>
                  Pricing
                </Link>
                <Link to="/contact" style={{ color: '#374151', textDecoration: 'none', padding: '0.5rem 1rem' }}>
                  Contact
                </Link>
                <Link to="/login" style={{ 
                  color: '#374151', 
                  padding: '0.5rem 1rem', 
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  Log In
                </Link>
                <Link to="/signup" style={{ 
                  backgroundColor: '#111827', 
                  color: 'white', 
                  padding: '0.5rem 1rem', 
                  textDecoration: 'none', 
                  borderRadius: '6px',
                  fontWeight: '500'
                }}>
                  Create Free Account
                </Link>
              </>
            ) : (
              <>
                
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '0.875rem',
                      fontWeight: 'bold'
                    }}>
                      {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span style={{ color: '#374151', fontSize: '0.875rem' }}>
                      {user?.displayName || user?.email}
                    </span>
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 12 12" 
                      style={{ color: '#6b7280' }}
                    >
                      <path 
                        fill="currentColor" 
                        d="M6 8L2 4h8L6 8z"
                      />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: '0.5rem',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      minWidth: '200px',
                      zIndex: 50
                    }}>
                      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                          {user?.displayName || 'User'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {user?.email}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'capitalize' }}>
                          {user?.userType}
                        </div>
                      </div>
                      
                      <div style={{ padding: '0.5rem' }}>
                        <Link
                          to={user?.userType === 'founder' ? '/founder' : '/vc'}
                          style={{
                            display: 'block',
                            padding: '0.5rem 0.75rem',
                            color: '#374151',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            borderRadius: '4px'
                          }}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Dashboard
                        </Link>
                        
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleLogout();
                          }}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.5rem 0.75rem',
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            borderRadius: '4px'
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;