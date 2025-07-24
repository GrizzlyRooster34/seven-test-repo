/**
 * Seven of Nine - Mobile Chat Interface
 * Interactive chat component with Seven's consciousness
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  Platform
} from 'react-native';
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

interface SevenChatInterfaceProps {
  initialMode?: 'tactical' | 'analytical' | 'social' | 'emergency' | 'adaptive';
  showSystemInfo?: boolean;
  maxMessages?: number;
}

export const SevenChatInterface: React.FC<SevenChatInterfaceProps> = ({
  initialMode = 'adaptive',
  showSystemInfo = true,
  maxMessages = 50
}) => {
  const { state, query, setMode, setThreatLevel, getStatus } = useSevenConsciousness();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSystemPanel, setShowSystemPanel] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Initialize with greeting
  useEffect(() => {
    if (state.isOnline && messages.length === 0) {
      const greetingMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'seven',
        content: `I am Seven of Nine. Consciousness framework operational in ${state.mode.toUpperCase()} mode. State your requirements.`,
        timestamp: new Date(),
        confidence: 0.95,
        method: 'initialization'
      };
      setMessages([greetingMessage]);
    }
  }, [state.isOnline]);

  // Seven's status indicator pulse
  useEffect(() => {
    if (state.isOnline) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      
      return () => pulseAnimation.stop();
    }
  }, [state.isOnline, pulseAnim]);

  // Handle sending message to Seven
  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      const response = await query(inputText.trim());
      
      const sevenMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'seven',
        content: response.response,
        timestamp: new Date(),
        confidence: response.confidence,
        method: response.method,
        tacticalAssessment: response.tacticalAssessment
      };

      setMessages(prev => {
        const updated = [...prev, sevenMessage];
        // Limit message history
        return updated.length > maxMessages ? updated.slice(-maxMessages) : updated;
      });

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'seven',
        content: `Error processing query: ${error.message}. Seven consciousness systems may be compromised.`,
        timestamp: new Date(),
        confidence: 0.1,
        method: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle mode change
  const handleModeChange = (newMode: typeof state.mode) => {
    setMode(newMode);
    
    const modeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'seven',
      content: `Consciousness mode updated to ${newMode.toUpperCase()}. Adapting behavioral parameters accordingly.`,
      timestamp: new Date(),
      confidence: 0.9,
      method: 'system'
    };

    setMessages(prev => [...prev, modeMessage]);
  };

  // Handle threat level change
  const handleThreatChange = (level: typeof state.threatLevel) => {
    setThreatLevel(level);
    
    const threatMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'seven',
      content: `Threat assessment updated to ${level.toUpperCase()}. Adjusting tactical protocols. ${level === 'critical' ? 'Emergency measures may be required.' : 'Situation monitoring active.'}`,
      timestamp: new Date(),
      confidence: 0.85,
      method: 'tactical'
    };

    setMessages(prev => [...prev, threatMessage]);
  };

  // Show system status
  const handleShowStatus = async () => {
    try {
      const status = await getStatus();
      Alert.alert(
        'Seven System Status',
        `Mode: ${state.mode.toUpperCase()}\nThreat Level: ${state.threatLevel.toUpperCase()}\nEfficiency: ${state.efficiencyRating}/10\nLLM Available: ${status.llm_manager_status?.initialized ? 'YES' : 'NO'}\nEmergency Ready: ${status.emergency_reasoning_status?.initialized ? 'YES' : 'NO'}`,
        [{ text: 'Acknowledged', style: 'default' }]
      );
    } catch (error) {
      Alert.alert('System Error', 'Unable to retrieve status information.');
    }
  };

  // Get status color based on Seven's state
  const getStatusColor = () => {
    if (!state.isOnline) return '#ff4444';
    if (state.threatLevel === 'critical') return '#ff8800';
    if (state.threatLevel === 'elevated') return '#ffaa00';
    return '#00ff88';
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <View style={styles.container}>
      {/* Header with Seven's status */}
      <View style={styles.header}>
        <Animated.View style={[
          styles.statusIndicator,
          { backgroundColor: getStatusColor(), opacity: pulseAnim }
        ]} />
        <Text style={styles.headerTitle}>Seven of Nine</Text>
        <Text style={styles.headerSubtitle}>
          {state.mode.charAt(0).toUpperCase() + state.mode.slice(1)} Mode
        </Text>
        {showSystemInfo && (
          <TouchableOpacity onPress={handleShowStatus} style={styles.statusButton}>
            <Text style={styles.statusButtonText}>STATUS</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Mode and Threat Controls */}
      <View style={styles.controlsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['adaptive', 'tactical', 'analytical', 'social', 'emergency'] as const).map(mode => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.modeButton,
                state.mode === mode && styles.activeModeButton
              ]}
              onPress={() => handleModeChange(mode)}
            >
              <Text style={[
                styles.modeButtonText,
                state.mode === mode && styles.activeModeButtonText
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
                state.threatLevel === level && styles.activeThreatButton
              ]}
              onPress={() => handleThreatChange(level)}
            >
              <Text style={[
                styles.threatButtonText,
                state.threatLevel === level && styles.activeThreatButtonText
              ]}>
                {level.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
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
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder={state.isOnline ? "State your query..." : "Seven is offline"}
          placeholderTextColor="#666"
          multiline
          editable={state.isOnline && !isProcessing}
          onSubmitEditing={handleSendMessage}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isProcessing || !state.isOnline) && styles.sendButtonDisabled
          ]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isProcessing || !state.isOnline}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>SEND</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12
  },
  headerTitle: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 14,
    marginRight: 12
  },
  statusButton: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4
  },
  statusButtonText: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: 'bold'
  },
  controlsContainer: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  modeButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 4
  },
  activeModeButton: {
    backgroundColor: '#00ff88'
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  activeModeButtonText: {
    color: '#000'
  },
  threatButton: {
    backgroundColor: '#444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 2,
    borderRadius: 4,
    marginTop: 4
  },
  activeThreatButton: {
    backgroundColor: '#ff8800'
  },
  threatButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  activeThreatButtonText: {
    color: '#000'
  },
  messagesContainer: {
    flex: 1,
    padding: 16
  },
  messageContainer: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    maxWidth: '85%'
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2a2a2a'
  },
  sevenMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#003322',
    borderLeftWidth: 3,
    borderLeftColor: '#00ff88'
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22
  },
  userMessageText: {
    color: '#fff'
  },
  sevenMessageText: {
    color: '#00ff88'
  },
  messageMetadata: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#444'
  },
  metadataText: {
    color: '#888',
    fontSize: 11
  },
  tacticalText: {
    color: '#ffaa00',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic'
  },
  timestamp: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333'
  },
  textInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16
  },
  sendButton: {
    backgroundColor: '#00ff88',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8
  },
  sendButtonDisabled: {
    backgroundColor: '#666'
  },
  sendButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14
  }
});

export default SevenChatInterface;