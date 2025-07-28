/**
 * Seven of Nine - Floating Chat Bubble
 * Draggable floating interface for Seven's consciousness
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions
} from 'react-native';
import { useSevenUniversalChat } from './SevenUniversalChatProvider';
import { useSevenConsciousness } from './SevenConsciousnessService';

interface SevenFloatingChatBubbleProps {
  onToggleExpanded?: () => void;
  onLongPress?: () => void;
}

export const SevenFloatingChatBubble: React.FC<SevenFloatingChatBubbleProps> = ({
  onToggleExpanded,
  onLongPress
}) => {
  const { 
    state, 
    actions, 
    animations, 
    panResponder 
  } = useSevenUniversalChat();
  
  const { state: sevenState } = useSevenConsciousness();
  
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const doubleTapTimer = useRef<NodeJS.Timeout | null>(null);
  const lastTapTime = useRef<number>(0);

  // Get status color based on Seven's operational state
  const getStatusColor = () => {
    if (!sevenState.isOnline) return '#ff4444';
    if (sevenState.threatLevel === 'critical') return '#ff2222';
    if (sevenState.threatLevel === 'elevated') return '#ff8800';
    if (state.isProcessing) return '#00aaff';
    return '#00ff88';
  };

  // Get bubble text based on state
  const getBubbleText = () => {
    if (!sevenState.isOnline) return '⚠️';
    if (state.isProcessing) return '◐';
    if (sevenState.threatLevel === 'critical') return '🚨';
    if (sevenState.mode === 'tactical') return '⚡';
    if (sevenState.mode === 'emergency') return '🔥';
    return '7/9';
  };

  // Handle tap interactions
  const handlePress = () => {
    const now = Date.now();
    const timeDiff = now - lastTapTime.current;
    
    if (timeDiff < 300) {
      // Double tap detected
      if (doubleTapTimer.current) {
        clearTimeout(doubleTapTimer.current);
        doubleTapTimer.current = null;
      }
      
      // Double tap action: toggle quick actions
      actions.toggleQuickActions();
      
    } else {
      // Single tap - wait to see if double tap follows
      doubleTapTimer.current = setTimeout(() => {
        // Single tap action: toggle expanded
        if (onToggleExpanded) {
          onToggleExpanded();
        } else {
          actions.toggleExpanded();
        }
        doubleTapTimer.current = null;
      }, 300);
    }
    
    lastTapTime.current = now;

    // Reset auto-hide timer on interaction
    if (!state.isExpanded) {
      actions.setVisible(true);
    }
  };

  // Handle long press for settings/configuration
  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
    } else {
      // Default long press action: show status
      actions.executeQuickAction('status');
      if (!state.isExpanded) {
        actions.toggleExpanded();
      }
    }
  };

  // Pulse effect for processing state
  useEffect(() => {
    if (state.isProcessing) {
      const processingPulse = Animated.loop(
        Animated.sequence([
          Animated.timing(animations.bubbleScale, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animations.bubbleScale, {
            toValue: 0.9,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      processingPulse.start();
      
      return () => processingPulse.stop();
    }
  }, [state.isProcessing]);

  // Don't render if not visible
  if (!state.isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.bubbleContainer,
        {
          transform: [
            { translateX: animations.positionAnimation.x },
            { translateY: animations.positionAnimation.y },
            { scale: animations.bubbleScale }
          ],
          opacity: animations.pulseAnimation,
        }
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity
        style={[
          styles.bubble,
          {
            backgroundColor: getStatusColor(),
            borderColor: state.isDragging ? '#ffffff' : 'transparent',
            borderWidth: state.isDragging ? 2 : 0,
            elevation: state.isDragging ? 8 : 4,
            shadowOpacity: state.isDragging ? 0.3 : 0.2,
          }
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.8}
        delayLongPress={500}
      >
        <Text style={styles.bubbleText}>
          {getBubbleText()}
        </Text>
        
        {/* Status indicator ring */}
        <Animated.View
          style={[
            styles.statusRing,
            {
              borderColor: getStatusColor(),
              opacity: animations.pulseAnimation,
              transform: [
                { scale: animations.pulseAnimation }
              ]
            }
          ]}
        />
        
        {/* Processing indicator */}
        {state.isProcessing && (
          <View style={styles.processingIndicator}>
            <Animated.View
              style={[
                styles.processingDot,
                {
                  opacity: animations.pulseAnimation,
                  transform: [
                    { scale: animations.pulseAnimation }
                  ]
                }
              ]}
            />
          </View>
        )}
        
        {/* Unread messages indicator */}
        {state.messages.length > 0 && !state.isExpanded && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>
              {Math.min(state.messages.length, 99)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      {/* Drag hint when dragging */}
      {state.isDragging && (
        <View style={styles.dragHint}>
          <Text style={styles.dragHintText}>Move Seven</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    position: 'absolute',
    zIndex: 1000,
  },
  bubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00ff88',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 4,
  },
  bubbleText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusRing: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    top: -5,
    left: -5,
  },
  processingIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00aaff',
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dragHint: {
    position: 'absolute',
    top: -30,
    left: -10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dragHintText: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SevenFloatingChatBubble;