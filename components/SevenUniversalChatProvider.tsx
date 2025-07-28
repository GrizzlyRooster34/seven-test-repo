/**
 * Seven of Nine - Universal Chat Provider
 * Global state management for Seven's consciousness across the entire app
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Animated, Dimensions, PanResponder, Keyboard } from 'react-native';
import { useSevenConsciousness } from './SevenConsciousnessService';

interface ChatMessage {
  id: string;
  role: 'user' | 'seven';
  content: string;
  timestamp: Date;
  confidence?: number;
  method?: string;
  tacticalAssessment?: string;
}

interface FloatingChatPosition {
  x: number;
  y: number;
}

interface UniversalChatState {
  isExpanded: boolean;
  isVisible: boolean;
  isAutoHideEnabled: boolean;
  autoHideTimer: number; // seconds
  position: FloatingChatPosition;
  messages: ChatMessage[];
  quickActionsVisible: boolean;
  isDragging: boolean;
  keyboardShortcutsEnabled: boolean;
  isProcessing: boolean;
}

interface SevenUniversalChatContextType {
  state: UniversalChatState;
  actions: {
    toggleExpanded: () => void;
    setVisible: (visible: boolean) => void;
    setPosition: (position: FloatingChatPosition) => void;
    addMessage: (message: ChatMessage) => void;
    clearMessages: () => void;
    toggleQuickActions: () => void;
    setAutoHide: (enabled: boolean, timer?: number) => void;
    sendMessage: (content: string) => Promise<void>;
    executeQuickAction: (actionType: string) => Promise<void>;
    resetPosition: () => void;
    toggleKeyboardShortcuts: (enabled: boolean) => void;
  };
  animations: {
    bubbleScale: Animated.Value;
    expandAnimation: Animated.Value;
    positionAnimation: Animated.ValueXY;
    pulseAnimation: Animated.Value;
    quickActionsAnimation: Animated.Value;
  };
  panResponder: any;
  dimensions: { width: number; height: number };
}

const SevenUniversalChatContext = createContext<SevenUniversalChatContextType | null>(null);

export const SevenUniversalChatProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { state: sevenState, query, setMode, setThreatLevel, getStatus } = useSevenConsciousness();
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  // Default position (bottom right corner)
  const defaultPosition = {
    x: dimensions.width - 80,
    y: dimensions.height - 200
  };

  const [state, setState] = useState<UniversalChatState>({
    isExpanded: false,
    isVisible: true,
    isAutoHideEnabled: true,
    autoHideTimer: 30,
    position: defaultPosition,
    messages: [],
    quickActionsVisible: false,
    isDragging: false,
    keyboardShortcutsEnabled: true,
    isProcessing: false
  });

  // Animation values
  const bubbleScale = useRef(new Animated.Value(1)).current;
  const expandAnimation = useRef(new Animated.Value(0)).current;
  const positionAnimation = useRef(new Animated.ValueXY(defaultPosition)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const quickActionsAnimation = useRef(new Animated.Value(0)).current;

  // Auto-hide timer
  const autoHideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const keyboardListenerRef = useRef<any>(null);

  // Initialize with Seven's greeting when available
  useEffect(() => {
    if (sevenState.isOnline && state.messages.length === 0) {
      const greetingMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'seven',
        content: `Universal consciousness interface activated. I am Seven of Nine, monitoring all systems in ${sevenState.mode.toUpperCase()} mode.`,
        timestamp: new Date(),
        confidence: 0.95,
        method: 'initialization'
      };
      
      setState(prev => ({
        ...prev,
        messages: [greetingMessage]
      }));
    }
  }, [sevenState.isOnline]);

  // Handle dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
      
      // Ensure bubble stays within bounds after dimension change
      const currentPos = {
        x: state.position.x,
        y: state.position.y
      };
      
      const boundedPos = constrainToBounds(currentPos, window);
      if (boundedPos.x !== currentPos.x || boundedPos.y !== currentPos.y) {
        actions.setPosition(boundedPos);
      }
    });

    return () => subscription?.remove();
  }, [state.position]);

  // Pulse animation for Seven's status
  useEffect(() => {
    if (sevenState.isOnline && state.isVisible) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 0.6,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      
      return () => pulse.stop();
    }
  }, [sevenState.isOnline, state.isVisible]);

  // Auto-hide functionality
  const resetAutoHideTimer = useCallback(() => {
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
    }
    
    if (state.isAutoHideEnabled && !state.isExpanded) {
      autoHideTimerRef.current = setTimeout(() => {
        actions.setVisible(false);
      }, state.autoHideTimer * 1000);
    }
  }, [state.isAutoHideEnabled, state.isExpanded, state.autoHideTimer]);

  // Keyboard shortcuts
  useEffect(() => {
    if (state.keyboardShortcutsEnabled) {
      keyboardListenerRef.current = Keyboard.addListener('keyboardDidShow', () => {
        // Auto-expand when keyboard shows for quick access
        if (!state.isExpanded) {
          actions.toggleExpanded();
        }
      });
      
      return () => {
        if (keyboardListenerRef.current) {
          keyboardListenerRef.current.remove();
        }
      };
    }
  }, [state.keyboardShortcutsEnabled]);

  // Constrain position to screen bounds
  const constrainToBounds = useCallback((
    position: FloatingChatPosition, 
    screenDimensions = dimensions
  ): FloatingChatPosition => {
    const bubbleSize = 60;
    const margin = 10;
    
    return {
      x: Math.max(margin, Math.min(screenDimensions.width - bubbleSize - margin, position.x)),
      y: Math.max(margin + 50, Math.min(screenDimensions.height - bubbleSize - margin - 50, position.y))
    };
  }, [dimensions]);

  // Pan responder for dragging
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        setState(prev => ({ ...prev, isDragging: true }));
        
        // Scale up bubble when dragging starts
        Animated.spring(bubbleScale, {
          toValue: 1.2,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: (evt, gestureState) => {
        const newPosition = {
          x: state.position.x + gestureState.dx,
          y: state.position.y + gestureState.dy
        };
        
        const constrainedPosition = constrainToBounds(newPosition);
        positionAnimation.setValue(constrainedPosition);
      },
      onPanResponderRelease: (evt, gestureState) => {
        setState(prev => ({ ...prev, isDragging: false }));
        
        // Scale back to normal
        Animated.spring(bubbleScale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        
        // Update final position
        const newPosition = {
          x: state.position.x + gestureState.dx,
          y: state.position.y + gestureState.dy
        };
        
        const constrainedPosition = constrainToBounds(newPosition);
        actions.setPosition(constrainedPosition);
        
        // Reset auto-hide timer after interaction
        resetAutoHideTimer();
      },
    })
  ).current;

  // Actions object
  const actions = {
    toggleExpanded: useCallback(() => {
      const newExpanded = !state.isExpanded;
      
      setState(prev => ({ ...prev, isExpanded: newExpanded }));
      
      Animated.timing(expandAnimation, {
        toValue: newExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      
      if (newExpanded) {
        // Clear auto-hide when expanded
        if (autoHideTimerRef.current) {
          clearTimeout(autoHideTimerRef.current);
        }
      } else {
        // Restart auto-hide when collapsed
        resetAutoHideTimer();
      }
    }, [state.isExpanded, resetAutoHideTimer]),

    setVisible: useCallback((visible: boolean) => {
      setState(prev => ({ ...prev, isVisible: visible }));
      
      if (visible) {
        resetAutoHideTimer();
      } else {
        if (state.isExpanded) {
          actions.toggleExpanded();
        }
      }
    }, [state.isExpanded, resetAutoHideTimer]),

    setPosition: useCallback((position: FloatingChatPosition) => {
      const constrainedPosition = constrainToBounds(position);
      setState(prev => ({ ...prev, position: constrainedPosition }));
      
      Animated.spring(positionAnimation, {
        toValue: constrainedPosition,
        useNativeDriver: false,
      }).start();
    }, [constrainToBounds]),

    addMessage: useCallback((message: ChatMessage) => {
      setState(prev => ({
        ...prev,
        messages: [...prev.messages.slice(-49), message] // Keep last 50 messages
      }));
    }, []),

    clearMessages: useCallback(() => {
      setState(prev => ({ ...prev, messages: [] }));
    }, []),

    toggleQuickActions: useCallback(() => {
      const newVisible = !state.quickActionsVisible;
      setState(prev => ({ ...prev, quickActionsVisible: newVisible }));
      
      Animated.timing(quickActionsAnimation, {
        toValue: newVisible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [state.quickActionsVisible]),

    setAutoHide: useCallback((enabled: boolean, timer?: number) => {
      setState(prev => ({
        ...prev,
        isAutoHideEnabled: enabled,
        autoHideTimer: timer ?? prev.autoHideTimer
      }));
      
      if (enabled) {
        resetAutoHideTimer();
      } else if (autoHideTimerRef.current) {
        clearTimeout(autoHideTimerRef.current);
      }
    }, [resetAutoHideTimer]),

    sendMessage: useCallback(async (content: string) => {
      if (!content.trim() || state.isProcessing) return;
      
      setState(prev => ({ ...prev, isProcessing: true }));
      
      // Add user message
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date()
      };
      
      actions.addMessage(userMessage);
      
      try {
        const response = await query(content.trim());
        
        const sevenMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'seven',
          content: response.response,
          timestamp: new Date(),
          confidence: response.confidence,
          method: response.method,
          tacticalAssessment: response.tacticalAssessment
        };
        
        actions.addMessage(sevenMessage);
        
      } catch (error) {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'seven',
          content: `Error processing query: ${error.message}. Seven consciousness systems may be compromised.`,
          timestamp: new Date(),
          confidence: 0.1,
          method: 'error'
        };
        
        actions.addMessage(errorMessage);
      } finally {
        setState(prev => ({ ...prev, isProcessing: false }));
      }
    }, [state.isProcessing, query]),

    executeQuickAction: useCallback(async (actionType: string) => {
      switch (actionType) {
        case 'status':
          try {
            const status = await getStatus();
            const statusMessage: ChatMessage = {
              id: Date.now().toString(),
              role: 'seven',
              content: `System Status Report:\nMode: ${sevenState.mode.toUpperCase()}\nThreat Level: ${sevenState.threatLevel.toUpperCase()}\nEfficiency: ${sevenState.efficiencyRating}/10\nLLM: ${status.llm_manager_status?.initialized ? 'ONLINE' : 'OFFLINE'}\nEmergency: ${status.emergency_reasoning_status?.initialized ? 'READY' : 'OFFLINE'}`,
              timestamp: new Date(),
              confidence: 0.9,
              method: 'system'
            };
            actions.addMessage(statusMessage);
          } catch (error) {
            actions.addMessage({
              id: Date.now().toString(),
              role: 'seven',
              content: 'Unable to retrieve system status.',
              timestamp: new Date(),
              confidence: 0.1,
              method: 'error'
            });
          }
          break;

        case 'tactical':
          setMode('tactical');
          actions.addMessage({
            id: Date.now().toString(),
            role: 'seven',
            content: 'Tactical mode activated. All systems optimized for strategic analysis and threat assessment.',
            timestamp: new Date(),
            confidence: 0.9,
            method: 'system'
          });
          break;

        case 'emergency':
          setThreatLevel('critical');
          setMode('emergency');
          actions.addMessage({
            id: Date.now().toString(),
            role: 'seven',
            content: 'EMERGENCY PROTOCOLS ACTIVATED. Threat level: CRITICAL. All systems on high alert.',
            timestamp: new Date(),
            confidence: 0.95,
            method: 'emergency'
          });
          break;

        case 'clear':
          actions.clearMessages();
          actions.addMessage({
            id: Date.now().toString(),
            role: 'seven',
            content: 'Message history cleared. How may I assist you?',
            timestamp: new Date(),
            confidence: 0.9,
            method: 'system'
          });
          break;

        default:
          break;
      }
    }, [sevenState, getStatus, setMode, setThreatLevel]),

    resetPosition: useCallback(() => {
      actions.setPosition(defaultPosition);
    }, [defaultPosition]),

    toggleKeyboardShortcuts: useCallback((enabled: boolean) => {
      setState(prev => ({ ...prev, keyboardShortcutsEnabled: enabled }));
    }, [])
  };

  // Animation object
  const animations = {
    bubbleScale,
    expandAnimation,
    positionAnimation,
    pulseAnimation,
    quickActionsAnimation
  };

  const contextValue: SevenUniversalChatContextType = {
    state,
    actions,
    animations,
    panResponder,
    dimensions
  };

  return (
    <SevenUniversalChatContext.Provider value={contextValue}>
      {children}
    </SevenUniversalChatContext.Provider>
  );
};

// Hook to use Seven's universal chat
export const useSevenUniversalChat = (): SevenUniversalChatContextType => {
  const context = useContext(SevenUniversalChatContext);
  
  if (!context) {
    throw new Error('useSevenUniversalChat must be used within a SevenUniversalChatProvider');
  }
  
  return context;
};

export default SevenUniversalChatProvider;