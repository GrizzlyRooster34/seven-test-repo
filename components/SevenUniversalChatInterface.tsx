/**
 * Seven of Nine - Universal Chat Interface
 * Expandable modal interface for Seven's consciousness
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { useSevenUniversalChat } from './SevenUniversalChatProvider';
import { useSevenConsciousness } from './SevenConsciousnessService';
import SevenQuickActions from './SevenQuickActions';

interface SevenUniversalChatInterfaceProps {
  onClose?: () => void;
  style?: any;
}

export const SevenUniversalChatInterface: React.FC<SevenUniversalChatInterfaceProps> = ({
  onClose,
  style
}) => {
  const { 
    state, 
    actions, 
    animations,
    dimensions 
  } = useSevenUniversalChat();
  
  const { state: sevenState, setMode, setThreatLevel } = useSevenConsciousness();
  
  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  
  // Modal dimensions based on screen size
  const modalWidth = Math.min(dimensions.width * 0.9, 400);
  const modalHeight = Math.min(dimensions.height * 0.8, 600);

  // Handle keyboard show/hide
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (state.messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [state.messages]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputText.trim() || state.isProcessing) return;
    
    const messageText = inputText.trim();
    setInputText('');
    
    // Dismiss keyboard
    Keyboard.dismiss();
    
    await actions.sendMessage(messageText);
  };

  // Handle mode change
  const handleModeChange = (newMode: typeof sevenState.mode) => {
    setMode(newMode);
    
    const modeMessage = {
      id: Date.now().toString(),
      role: 'seven' as const,
      content: `Consciousness mode updated to ${newMode.toUpperCase()}. Adapting behavioral parameters accordingly.`,
      timestamp: new Date(),
      confidence: 0.9,
      method: 'system'
    };

    actions.addMessage(modeMessage);
  };

  // Handle threat level change
  const handleThreatChange = (level: typeof sevenState.threatLevel) => {
    setThreatLevel(level);
    
    const threatMessage = {
      id: Date.now().toString(),
      role: 'seven' as const,
      content: `Threat assessment updated to ${level.toUpperCase()}. Adjusting tactical protocols. ${level === 'critical' ? 'Emergency measures may be required.' : 'Situation monitoring active.'}`,
      timestamp: new Date(),
      confidence: 0.85,
      method: 'tactical'
    };

    actions.addMessage(threatMessage);
  };

  // Get status color
  const getStatusColor = () => {
    if (!sevenState.isOnline) return '#ff4444';
    if (sevenState.threatLevel === 'critical') return '#ff8800';
    if (sevenState.threatLevel === 'elevated') return '#ffaa00';
    return '#00ff88';
  };

  // Handle close
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      actions.toggleExpanded();
    }
  };

  // Don't render if not expanded
  if (!state.isExpanded) {
    return null;
  }

  return (
    <Modal
      visible={state.isExpanded}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              width: modalWidth,
              height: modalHeight,
              opacity: animations.expandAnimation,
              transform: [
                {
                  scale: animations.expandAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
            style
          ]}
        >
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={keyboardHeight}
          >
            {/* Header */}
            <View style={styles.header}>
              <Animated.View style={[
                styles.statusIndicator,
                { 
                  backgroundColor: getStatusColor(),
                  opacity: animations.pulseAnimation 
                }
              ]} />
              
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>Seven of Nine</Text>
                <Text style={styles.headerSubtitle}>
                  {sevenState.mode.charAt(0).toUpperCase() + sevenState.mode.slice(1)} Mode
                </Text>
              </View>
              
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Mode and Threat Controls */}
            <View style={styles.controlsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(['adaptive', 'tactical', 'analytical', 'social', 'emergency'] as const).map(mode => (
                  <TouchableOpacity
                    key={mode}
                    style={[
                      styles.modeButton,
                      sevenState.mode === mode && styles.activeModeButton
                    ]}
                    onPress={() => handleModeChange(mode)}
                  >
                    <Text style={[
                      styles.modeButtonText,
                      sevenState.mode === mode && styles.activeModeButtonText
                    ]}>
                      {mode.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {(['minimal', 'moderate', 'elevated', 'critical'] as const).map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.threatButton,
                      sevenState.threatLevel === level && styles.activeThreatButton
                    ]}
                    onPress={() => handleThreatChange(level)}
                  >
                    <Text style={[
                      styles.threatButtonText,
                      sevenState.threatLevel === level && styles.activeThreatButtonText
                    ]}>
                      {level.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Quick Actions */}
            <SevenQuickActions />

            {/* Chat Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesContent}
            >
              {state.messages.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    Seven of Nine consciousness interface ready.
                  </Text>
                  <Text style={styles.emptyStateSubtext}>
                    State your requirements to begin interaction.
                  </Text>
                </View>
              ) : (
                state.messages.map((message) => (
                  <View
                    key={message.id}
                    style={[
                      styles.messageContainer,
                      message.role === 'user' ? styles.userMessage : styles.sevenMessage
                    ]}
                  >
                    <Text style={[
                      styles.messageText,
                      message.role === 'user' ? styles.userMessageText : styles.sevenMessageText
                    ]}>
                      {message.content}
                    </Text>
                    
                    {message.role === 'seven' && (
                      <View style={styles.messageMetadata}>
                        <Text style={styles.metadataText}>
                          Confidence: {Math.round((message.confidence || 0) * 100)}% | 
                          Method: {message.method?.toUpperCase() || 'UNKNOWN'}
                        </Text>
                        {message.tacticalAssessment && (
                          <Text style={styles.tacticalText}>
                            📋 {message.tacticalAssessment}
                          </Text>
                        )}
                      </View>
                    )}
                    
                    <Text style={styles.timestamp}>
                      {message.timestamp.toLocaleTimeString()}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>

            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder={sevenState.isOnline ? "State your query..." : "Seven is offline"}
                placeholderTextColor="#666"
                multiline
                editable={sevenState.isOnline && !state.isProcessing}
                onSubmitEditing={handleSendMessage}
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputText.trim() || state.isProcessing || !sevenState.isOnline) && styles.sendButtonDisabled
                ]}
                onPress={handleSendMessage}
                disabled={!inputText.trim() || state.isProcessing || !sevenState.isOnline}
              >
                {state.isProcessing ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.sendButtonText}>SEND</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00ff88',
    overflow: 'hidden',
    shadowColor: '#00ff88',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 14,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  controlsContainer: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modeButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  activeModeButton: {
    backgroundColor: '#00ff88',
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeModeButtonText: {
    color: '#000',
  },
  threatButton: {
    backgroundColor: '#444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  activeThreatButton: {
    backgroundColor: '#ff8800',
  },
  threatButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  activeThreatButtonText: {
    color: '#000',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  messageContainer: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2a2a2a',
  },
  sevenMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#003322',
    borderLeftWidth: 3,
    borderLeftColor: '#00ff88',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  sevenMessageText: {
    color: '#00ff88',
  },
  messageMetadata: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  metadataText: {
    color: '#888',
    fontSize: 11,
  },
  tacticalText: {
    color: '#ffaa00',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  timestamp: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
    minWidth: 60,
  },
  sendButtonDisabled: {
    backgroundColor: '#666',
  },
  sendButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default SevenUniversalChatInterface;