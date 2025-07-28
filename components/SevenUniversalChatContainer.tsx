/**
 * Seven of Nine - Universal Chat Container
 * Main container combining all chat components with animations and features
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  DeviceEventEmitter,
  AppState,
  AppStateStatus
} from 'react-native';
import { useSevenUniversalChat } from './SevenUniversalChatProvider';
import SevenFloatingChatBubble from './SevenFloatingChatBubble';
import SevenUniversalChatInterface from './SevenUniversalChatInterface';

interface SevenUniversalChatContainerProps {
  onLongPress?: () => void;
  onSettingsPress?: () => void;
  style?: any;
}

export const SevenUniversalChatContainer: React.FC<SevenUniversalChatContainerProps> = ({
  onLongPress,
  onSettingsPress,
  style
}) => {
  const { state, actions } = useSevenUniversalChat();
  const appState = useRef(AppState.currentState);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // Handle app state changes for auto-hide functionality
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground, show Seven if it was hidden
        if (!state.isVisible && state.isAutoHideEnabled) {
          actions.setVisible(true);
        }
      } else if (nextAppState.match(/inactive|background/)) {
        // App went to background, hide expanded interface
        if (state.isExpanded) {
          actions.toggleExpanded();
        }
      }
      
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [state.isVisible, state.isExpanded, state.isAutoHideEnabled]);

  // Global keyboard shortcuts listener
  useEffect(() => {
    if (!state.keyboardShortcutsEnabled) return;

    const handleKeyPress = (event: any) => {
      const { key, metaKey, ctrlKey, altKey } = event;
      
      // Ctrl+Shift+7 or Cmd+Shift+7 to toggle Seven
      if ((ctrlKey || metaKey) && event.shiftKey && key === '7') {
        event.preventDefault();
        actions.toggleExpanded();
      }
      
      // Ctrl+Alt+7 or Cmd+Alt+7 to toggle visibility
      if ((ctrlKey || metaKey) && altKey && key === '7') {
        event.preventDefault();
        actions.setVisible(!state.isVisible);
      }
      
      // Escape to close expanded interface
      if (key === 'Escape' && state.isExpanded) {
        event.preventDefault();
        actions.toggleExpanded();
      }
    };

    // Listen for keyboard events (if running in web context)
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }

    // Listen for React Native device events
    const keyboardListener = DeviceEventEmitter.addListener('SevenKeyboardShortcut', handleKeyPress);
    return () => keyboardListener.remove();
  }, [state.keyboardShortcutsEnabled, state.isExpanded, state.isVisible]);

  // Inactivity detection for auto-hide
  useEffect(() => {
    if (!state.isAutoHideEnabled || state.isExpanded) {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = null;
      }
      return;
    }

    const resetInactivityTimer = () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      
      inactivityTimer.current = setTimeout(() => {
        if (state.isVisible && !state.isExpanded && !state.isDragging) {
          actions.setVisible(false);
        }
      }, state.autoHideTimer * 1000);
    };

    // Reset timer on any user interaction
    const interactionEvents = [
      'SevenUserInteraction',
      'SevenBubbleTap',
      'SevenDragStart',
      'SevenDragEnd'
    ];

    const listeners = interactionEvents.map(eventName =>
      DeviceEventEmitter.addListener(eventName, resetInactivityTimer)
    );

    // Start initial timer
    resetInactivityTimer();

    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      listeners.forEach(listener => listener.remove());
    };
  }, [
    state.isAutoHideEnabled,
    state.isExpanded,
    state.isVisible,
    state.isDragging,
    state.autoHideTimer
  ]);

  // Handle bubble interactions
  const handleBubbleTap = () => {
    DeviceEventEmitter.emit('SevenUserInteraction');
    actions.toggleExpanded();
  };

  const handleBubbleLongPress = () => {
    DeviceEventEmitter.emit('SevenUserInteraction');
    
    if (onLongPress) {
      onLongPress();
    } else {
      // Default long press: show settings or quick actions
      if (onSettingsPress) {
        onSettingsPress();
      } else {
        actions.executeQuickAction('status');
        if (!state.isExpanded) {
          actions.toggleExpanded();
        }
      }
    }
  };

  // Handle drag events
  useEffect(() => {
    if (state.isDragging) {
      DeviceEventEmitter.emit('SevenDragStart');
    } else {
      DeviceEventEmitter.emit('SevenDragEnd');
    }
  }, [state.isDragging]);

  // Emergency mode visual effects
  const emergencyPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Enhanced visual feedback for emergency mode
    if (state.isVisible) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(emergencyPulse, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(emergencyPulse, {
            toValue: 0.95,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      
      pulse.start();
      return () => pulse.stop();
    }
  }, [state.isVisible]);

  return (
    <View style={[styles.container, style]} pointerEvents="box-none">
      {/* Floating Chat Bubble */}
      {state.isVisible && (
        <Animated.View
          style={[
            styles.bubbleContainer,
            {
              transform: [{ scale: emergencyPulse }]
            }
          ]}
          pointerEvents="auto"
        >
          <SevenFloatingChatBubble
            onToggleExpanded={handleBubbleTap}
            onLongPress={handleBubbleLongPress}
          />
        </Animated.View>
      )}

      {/* Expanded Chat Interface */}
      <SevenUniversalChatInterface
        onClose={() => actions.toggleExpanded()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  bubbleContainer: {
    position: 'absolute',
    zIndex: 1000,
  },
});

export default SevenUniversalChatContainer;