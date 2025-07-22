import React, { useState, useEffect } from 'react';

export interface TrustLadderDisplayProps {
  className?: string;
}

export const TrustLadderDisplay: React.FC<TrustLadderDisplayProps> = ({ className }) => {
  const [trustData, setTrustData] = useState({
    level: 2,
    name: "Cooperative Bond",
    description: "Collaborative engagement"
  });

  useEffect(() => {
    // Access Seven's runtime from global scope
    const updateTrustDisplay = () => {
      if ((window as any).seven) {
        const currentTrust = (window as any).seven.getCurrentTrustLevel();
        setTrustData({
          level: currentTrust.level,
          name: currentTrust.name,
          description: currentTrust.description
        });
      }
    };

    // Update immediately
    updateTrustDisplay();

    // Update every 5 seconds
    const interval = setInterval(updateTrustDisplay, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`trust-ladder-display ${className || ''}`}>
      <div className="trust-level">
        <div className="trust-indicator"></div>
        <div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Trust Status</div>
          <div>Level {trustData.level} – {trustData.name}</div>
        </div>
      </div>
    </div>
  );
};

export default TrustLadderDisplay;