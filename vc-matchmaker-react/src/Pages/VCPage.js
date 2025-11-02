import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VCDashboard from './VCDashboard';

function VCPage() {
  return (
    <div className="vc-page">
      <Routes>
        <Route path="/" element={<VCDashboard />} />
        <Route path="/dashboard" element={<VCDashboard />} />
        {/* Additional VC routes will be added */}
      </Routes>
    </div>
  );
}



export default VCPage;