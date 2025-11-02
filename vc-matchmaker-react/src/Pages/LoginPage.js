import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userType, setUserType] = useState('founder');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const { signIn, signUp, signInWithGoogle, user, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get user type from URL parameter
  const urlParams = new URLSearchParams(location.search);
  const typeFromUrl = urlParams.get('type');

  // Set initial userType based on URL parameter
  useEffect(() => {
    if (typeFromUrl && (typeFromUrl === 'founder' || typeFromUrl === 'vc')) {
      setUserType(typeFromUrl);
    }
  }, [typeFromUrl]);

  // Redirect if already logged in - go directly to dashboard
  useEffect(() => {
    if (user) {
      const dashboardPath = user.userType === 'founder' ? '/founder' : '/vc';
      navigate(dashboardPath, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const userData = await signIn(email, password);
        // Redirect directly to dashboard based on user type
        const dashboardPath = userData?.userType === 'founder' ? '/founder' : '/vc';
        navigate(dashboardPath, { replace: true });
      } else {
        if (password !== confirmPassword) {
          setLocalError('Passwords do not match');
          return;
        }
        await signUp(email, password, { displayName, userType });
        const dashboardPath = userType === 'founder' ? '/founder' : '/vc';
        navigate(dashboardPath, { replace: true });
      }
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLocalError('');
    setIsLoading(true);
    
    try {
      const userData = await signInWithGoogle();
      // Redirect directly to dashboard based on user type
      const dashboardPath = userData?.userType === 'founder' ? '/founder' : '/vc';
      navigate(dashboardPath, { replace: true });
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      padding: '1rem'
    }}>
      <div style={{ 
        maxWidth: '400px', 
        width: '100%', 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '8px', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
            {isLogin ? 'Welcome back to VC Matchmaker' : 'Join the VC Matchmaker community'}
          </p>
          
          {isLogin && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              backgroundColor: '#eff6ff', 
              border: '1px solid #bfdbfe', 
              borderRadius: '6px',
              fontSize: '0.875rem'
            }}>
              <p style={{ color: '#1d4ed8', fontWeight: '600', marginBottom: '0.5rem' }}>
                Demo Credentials:
              </p>
              <div style={{ color: '#1e40af' }}>
                <p><strong>Founder:</strong> founder / founder</p>
                <p><strong>VC:</strong> admin / auth</p>
              </div>
            </div>
          )}
        </div>

        {(error || localError) && (
          <div style={{ 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            color: '#dc2626', 
            padding: '0.75rem', 
            borderRadius: '6px', 
            marginBottom: '1rem',
            fontSize: '0.875rem'
          }}>
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Full Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required={!isLogin}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px', 
                  fontSize: '1rem',
                  outline: 'none'
                }}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                fontSize: '1rem',
                outline: 'none'
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                fontSize: '1rem',
                outline: 'none'
              }}
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px', 
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                  placeholder="Confirm your password"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                  I am a:
                </label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '6px', 
                    fontSize: '1rem',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="founder">Startup Founder</option>
                  <option value="vc">Venture Capitalist</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{ 
              width: '100%', 
              backgroundColor: isLoading ? '#9ca3af' : '#3b82f6', 
              color: 'white', 
              padding: '0.75rem', 
              borderRadius: '6px', 
              fontSize: '1rem', 
              fontWeight: '500',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', height: '1px', backgroundColor: '#e5e7eb' }}></div>
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', fontSize: '0.875rem' }}>
            <span style={{ backgroundColor: 'white', padding: '0 1rem', color: '#6b7280' }}>Or</span>
          </div>
        </div>

        {isLogin && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                onClick={() => {
                  setEmail('founder');
                  setPassword('founder');
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Demo Founder
              </button>
              <button
                onClick={() => {
                  setEmail('admin');
                  setPassword('auth');
                }}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Demo VC
              </button>
            </div>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          style={{ 
            width: '100%', 
            backgroundColor: 'white', 
            color: '#374151', 
            padding: '0.75rem', 
            borderRadius: '6px', 
            fontSize: '1rem', 
            fontWeight: '500',
            border: '1px solid #d1d5db',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#3b82f6', 
              fontSize: '0.875rem', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link 
            to="/" 
            style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem', 
              textDecoration: 'none' 
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;