/**
 * SEVEN CONTEXT
 * 
 * React context for Seven's consciousness state and communication
 */

import React, { createContext, useContext } from 'react';
import { ConsciousnessMode } from '../../backend/consciousness/mode-manager';

interface SevenContextType {
  currentMode: ConsciousnessMode;
  onModeChange: (mode: ConsciousnessMode) => void;
  isConnected: boolean;
}

const SevenContext = createContext<SevenContextType | null>(null);

export const SevenProvider = SevenContext.Provider;

export const useSevenContext = (): SevenContextType => {
  const context = useContext(SevenContext);
  if (!context) {
    throw new Error('useSevenContext must be used within a SevenProvider');
  }
  return context;
};