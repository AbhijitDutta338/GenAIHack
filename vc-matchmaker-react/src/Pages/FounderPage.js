import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FounderDashboard from './FounderDashboard';

function FounderPage() {
  return (
    <div className="founder-page">
      <Routes>
        <Route path="/" element={<FounderDashboard />} />
        <Route path="/dashboard" element={<FounderDashboard />} />
        {/* Additional founder routes will be added */}
      </Routes>
    </div>
  );
}



export default FounderPage;