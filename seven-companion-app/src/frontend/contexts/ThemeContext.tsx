/**
 * THEME CONTEXT
 * 
 * React context for managing Creator's authentic themes across the app
 */

import React, { createContext, useContext } from 'react';
import { SevenTheme } from '../themes/CreatorAuthenticThemes';

const ThemeContext = createContext<SevenTheme | null>(null);

export const ThemeProvider = ThemeContext.Provider;

export const useTheme = (): SevenTheme => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
};