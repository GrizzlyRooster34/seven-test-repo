/**
 * SEVEN OF NINE - TAB BAR ICON COMPONENT
 * Borg-inspired navigation icons with consciousness state indicators
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SevenTheme } from '../theme/SevenTheme';

interface TabBarIconProps {
  name: keyof typeof Feather.glyphMap;
  color: string;
  focused: boolean;
  size?: number;
}

export const TabBarIcon: React.FC<TabBarIconProps> = ({
  name,
  color,
  focused,
  size = 24
}) => {
  return (
    <View style={styles.container}>
      <Feather
        name={name}
        size={size}
        color={color}
        style={[
          styles.icon,
          focused && styles.iconFocused
        ]}
      />
      
      {/* Borg-style consciousness indicator */}
      {focused && (
        <View style={styles.consciousnessIndicator}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotActive]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  
  icon: {
    marginBottom: 2,
  },
  
  iconFocused: {
    // Add subtle glow effect for focused state
    shadowColor: SevenTheme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  
  consciousnessIndicator: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 1,
    backgroundColor: SevenTheme.colors.textTertiary,
  },
  
  dotActive: {
    backgroundColor: SevenTheme.colors.primary,
    shadowColor: SevenTheme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default TabBarIcon;