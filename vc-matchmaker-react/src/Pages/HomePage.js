import React from 'react';
import Hero from '../components/Hero';
import Logos from '../components/Logos';

function HomePage() {
  return (
    <div className="home-page">
      <Hero />
      <Logos />
      {/* Additional sections will be added as we migrate */}
    </div>
  );
}

export default HomePage;