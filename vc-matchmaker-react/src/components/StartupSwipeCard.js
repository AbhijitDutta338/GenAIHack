import React, { useState, useRef, useEffect } from 'react';

const StartupSwipeCard = ({ startup, onSwipeLeft, onSwipeRight, onClick }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const cardRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  const SWIPE_THRESHOLD = 100; // pixels to trigger swipe

  const handleMouseDown = (e) => {
    setIsDragging(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    setRotation(deltaX / 10); // Rotate based on horizontal movement
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPosRef.current.x;
    const deltaY = touch.clientY - startPosRef.current.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
    setRotation(deltaX / 10);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Check if swipe threshold was met
    if (Math.abs(dragOffset.x) > SWIPE_THRESHOLD) {
      if (dragOffset.x > 0) {
        onSwipeRight(startup);
      } else {
        onSwipeLeft(startup);
      }
    }
    
    // Reset position
    setDragOffset({ x: 0, y: 0 });
    setRotation(0);
  };

  const handleTouchEnd = handleMouseUp;

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset]);

  const getCardStyle = () => {
    const opacity = Math.max(0.5, 1 - Math.abs(dragOffset.x) / 300);
    
    return {
      transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
      opacity: opacity,
      transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
      cursor: isDragging ? 'grabbing' : 'grab'
    };
  };

  const getSwipeIndicator = () => {
    if (Math.abs(dragOffset.x) < 50) return null;
    
    if (dragOffset.x > 0) {
      return (
        <div style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          border: '3px solid white',
          transform: 'rotate(15deg)',
          opacity: Math.min(1, Math.abs(dragOffset.x) / 100)
        }}>
          SOURCE ✓
        </div>
      );
    } else {
      return (
        <div style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          border: '3px solid white',
          transform: 'rotate(-15deg)',
          opacity: Math.min(1, Math.abs(dragOffset.x) / 100)
        }}>
          PASS ✗
        </div>
      );
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={(e) => {
        // Only trigger onClick if not dragging
        if (!isDragging && Math.abs(dragOffset.x) < 5) {
          onClick(startup);
        }
      }}
      style={{
        ...getCardStyle(),
        position: 'relative',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        padding: '30px',
        maxWidth: '600px',
        margin: '0 auto',
        userSelect: 'none',
        touchAction: 'none'
      }}
    >
      {getSwipeIndicator()}
      
      {/* Match Score Badge */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
      }}>
        {startup.match}% Match
      </div>

      {/* Company Name and Tagline */}
      <div style={{ marginTop: '40px', marginBottom: '20px' }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '8px'
        }}>
          {startup.name}
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          fontStyle: 'italic'
        }}>
          {startup.tagline}
        </p>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>STAGE</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>{startup.stage}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>INDUSTRY</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>{startup.industry}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>LOCATION</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>{startup.location}</div>
        </div>
      </div>

      {/* Pitch */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px',
          textTransform: 'uppercase'
        }}>
          The Opportunity
        </h3>
        <p style={{
          fontSize: '15px',
          color: '#4b5563',
          lineHeight: '1.6'
        }}>
          {startup.pitch}
        </p>
      </div>

      {/* Financial Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          padding: '15px',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #dbeafe'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>MRR</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>{startup.metrics.mrr}</div>
          <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>{startup.metrics.growth}</div>
        </div>
        <div style={{
          padding: '15px',
          backgroundColor: '#f0fdf4',
          borderRadius: '8px',
          border: '1px solid #dcfce7'
        }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>SEEKING</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>{startup.funding.seeking}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>@ {startup.funding.valuation}</div>
        </div>
      </div>

      {/* Founders */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '12px',
          textTransform: 'uppercase'
        }}>
          Founders
        </h3>
        {startup.founders.map((founder, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              marginRight: '12px'
            }}>
              {founder.name.charAt(0)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                {founder.name}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                {founder.role}
              </div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                {founder.background}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tap to view more hint */}
      <div style={{
        textAlign: 'center',
        padding: '15px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <p style={{
          fontSize: '13px',
          color: '#6b7280',
          margin: 0
        }}>
          👆 Tap card for full details • Swipe right to SOURCE • Swipe left to PASS
        </p>
      </div>
    </div>
  );
};

export default StartupSwipeCard;
