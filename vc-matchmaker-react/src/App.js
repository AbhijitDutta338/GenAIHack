import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import contexts
import { AuthProvider } from './contexts/AuthContext';

// Import pages
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';  
import FounderPage from './Pages/FounderPage';
import VCPage from './Pages/VCPage';

// Import layout components
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProtectedRoute, { PublicRoute } from './components/ProtectedRoute';

// Add CSS for loading spinner animation
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <style>{spinKeyframes}</style>
          <NavBar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/founder/*" 
                element={
                  <ProtectedRoute requiredUserType="founder">
                    <FounderPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vc/*" 
                element={
                  <ProtectedRoute requiredUserType="vc">
                    <VCPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
