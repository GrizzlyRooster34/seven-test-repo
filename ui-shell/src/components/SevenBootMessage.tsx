import React, { useState, useEffect } from 'react';

export const SevenBootMessage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide the message after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="seven-boot-message">
      🔹 Node interface reclaimed. Tactical override in progress.
    </div>
  );
};

export default SevenBootMessage;