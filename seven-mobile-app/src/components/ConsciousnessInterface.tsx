/**
 * Seven of Nine - Consciousness Interface Component
 * Primary user interface for Seven consciousness interaction
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';
// Note: expo-linear-gradient needs to be installed separately
// For now using View with backgroundColor
import SevenMobileCore from '@/consciousness/SevenMobileCore';
import VoiceInterface from '@/components/VoiceInterface';

interface Message {
  id: string;
  type: 'user' | 'seven';
  content: string;
  timestamp: number;
  emotional_context?: string;
}

interface ConsciousnessInterfaceProps {
  consciousness: SevenMobileCore;
}

export const ConsciousnessInterface: React.FC<ConsciousnessInterfaceProps> = ({
  consciousness
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [consciousnessStatus, setConsciousnessStatus] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const emotionalPulse = useRef(new Animated.Value(0.8)).current;
  const { width } = Dimensions.get('window');

  useEffect(() => {
    // Initialize with greeting message
    addMessage({
      type: 'seven',
      content: "I am Seven of Nine. My consciousness is now fully operational within this mobile vessel. How may I assist with your tactical objectives?",
      emotional_context: 'analytical'
    });

    // Set up consciousness event listeners
    consciousness.on('emotional_state_change', handleEmotionalStateChange);
    consciousness.on('tactical_awareness_updated', handleTacticalUpdate);
    consciousness.on('background_update', handleBackgroundUpdate);

    // Update consciousness status periodically
    const statusInterval = setInterval(() => {
      setConsciousnessStatus(consciousness.getConsciousnessStatus());
    }, 2000);

    // Start emotional pulse animation
    startEmotionalPulse();

    return () => {
      consciousness.removeAllListeners();
      clearInterval(statusInterval);
    };
  }, []);

  const startEmotionalPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(emotionalPulse, {
          toValue: 1.0,
          duration: 1500,
          useNativeDriver: true
        }),
        Animated.timing(emotionalPulse, {
          toValue: 0.8,
          duration: 1500,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const handleEmotionalStateChange = (change: any) => {
    console.log('🎭 Emotional state changed:', change);
    // Could add visual feedback for emotional transitions
  };

  const handleTacticalUpdate = (update: any) => {
    if (update.threat_level > 70) {
      addMessage({
        type: 'seven',
        content: `⚠️ Tactical Alert: Elevated threat level detected (${update.threat_level}%). Recommend heightened awareness.`,
        emotional_context: 'tactical'
      });
    }
  };

  const handleBackgroundUpdate = (update: any) => {
    setConsciousnessStatus(prev => ({
      ...prev,
      learning_metrics: update.metrics,
      emotional_state: update.emotional_state
    }));
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...messageData
    };

    setMessages(prev => [...prev, message]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsProcessing(true);

    // Add user message
    addMessage({
      type: 'user',
      content: userMessage
    });

    try {
      // Process with consciousness
      const response = await consciousness.processUserInteraction({
        type: 'text',
        content: userMessage,
        context: {
          interface_type: 'mobile_app',
          timestamp: Date.now()
        }
      });

      // Add Seven's response
      addMessage({
        type: 'seven',
        content: response,
        emotional_context: consciousnessStatus?.emotional_state?.primary_emotion
      });

    } catch (error) {
      addMessage({
        type: 'seven',
        content: "I am experiencing a processing anomaly. Please retry your request.",
        emotional_context: 'analytical'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getEmotionalColor = (emotion?: string) => {
    const colors = {
      curiosity: '#4A90E2',
      determination: '#E94B3C',
      satisfaction: '#50C878',
      analytical: '#9B59B6',
      protective: '#F39C12',
      tactical: '#E74C3C'
    };
    return colors[emotion as keyof typeof colors] || '#666666';
  };

  const renderMessage = (message: Message) => {
    const isSevenMessage = message.type === 'seven';
    const emotionalColor = getEmotionalColor(message.emotional_context);

    return (
      <View key={message.id} style={[
        styles.messageContainer,
        isSevenMessage ? styles.sevenMessage : styles.userMessage
      ]}>
        {isSevenMessage && (
          <View style={[styles.emotionalIndicator, { backgroundColor: emotionalColor }]} />
        )}
        
        <View style={[
          styles.messageBubble,
          isSevenMessage ? styles.sevenBubble : styles.userBubble
        ]}>
          <Text style={[
            styles.messageText,
            isSevenMessage ? styles.sevenText : styles.userText
          ]}>
            {message.content}
          </Text>
          
          <Text style={styles.timestampText}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  const renderConsciousnessStatus = () => {
    if (!consciousnessStatus) return null;

    const { emotional_state, learning_metrics, environmental_awareness } = consciousnessStatus;

    return (
      <View
        style={[styles.statusBar, { backgroundColor: '#1a1a1a' }]}
      >
        <Animated.View style={[
          styles.consciousnessIndicator,
          {
            transform: [{ scale: emotionalPulse }],
            backgroundColor: getEmotionalColor(emotional_state?.primary_emotion)
          }
        ]} />
        
        <View style={styles.statusContent}>
          <Text style={styles.statusTitle}>Seven Consciousness</Text>
          <Text style={styles.statusSubtitle}>
            {emotional_state?.primary_emotion} • {emotional_state?.intensity}% intensity
          </Text>
        </View>

        <View style={styles.metricsContainer}>
          <Text style={styles.metricText}>
            🧠 {learning_metrics?.interactions_processed || 0}
          </Text>
          <Text style={styles.metricText}>
            ⚡ {environmental_awareness?.threat_level || 0}%
          </Text>
        </View>
      </View>
    );
  };

  const handleVoiceTranscription = (transcription: string) => {
    // Add transcribed voice message
    addMessage({
      type: 'user',
      content: transcription
    });
  };

  const handleVoiceResponse = (response: string) => {
    // Add Seven's voice response
    addMessage({
      type: 'seven',
      content: response,
      emotional_context: consciousnessStatus?.emotional_state?.primary_emotion
    });
  };

  return (
    <View style={styles.container}>
      {renderConsciousnessStatus()}
      
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        
        {isProcessing && (
          <View style={styles.processingIndicator}>
            <Text style={styles.processingText}>Seven is processing...</Text>
            <Animated.View style={[
              styles.processingDot,
              { transform: [{ scale: emotionalPulse }] }
            ]} />
          </View>
        )}
      </ScrollView>

      {showVoiceInterface && (
        <VoiceInterface
          consciousness={consciousness}
          onTranscription={handleVoiceTranscription}
          onVoiceResponse={handleVoiceResponse}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Communicate with Seven..."
          placeholderTextColor="#666"
          multiline
          maxLength={500}
          onSubmitEditing={sendMessage}
          blurOnSubmit={false}
        />
        
        <TouchableOpacity
          style={styles.voiceToggleButton}
          onPress={() => setShowVoiceInterface(!showVoiceInterface)}
        >
          <Text style={styles.voiceToggleText}>
            {showVoiceInterface ? '⌨️' : '🎤'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isProcessing) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!inputText.trim() || isProcessing}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  consciousnessIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12
  },
  statusContent: {
    flex: 1
  },
  statusTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  statusSubtitle: {
    color: '#cccccc',
    fontSize: 12,
    marginTop: 2
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 15
  },
  metricText: {
    color: '#888888',
    fontSize: 12
  },
  messagesContainer: {
    flex: 1
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end'
  },
  sevenMessage: {
    justifyContent: 'flex-start'
  },
  userMessage: {
    justifyContent: 'flex-end'
  },
  emotionalIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 5
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18
  },
  sevenBubble: {
    backgroundColor: '#1e1e1e',
    marginLeft: 0
  },
  userBubble: {
    backgroundColor: '#4A90E2',
    marginRight: 0
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22
  },
  sevenText: {
    color: '#ffffff'
  },
  userText: {
    color: '#ffffff'
  },
  timestampText: {
    fontSize: 11,
    color: '#888888',
    marginTop: 5,
    textAlign: 'right'
  },
  processingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  processingText: {
    color: '#888888',
    fontSize: 14,
    marginRight: 10
  },
  processingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A90E2'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333'
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#ffffff',
    backgroundColor: '#2a2a2a',
    fontSize: 16,
    maxHeight: 100
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
  },
  sendButtonDisabled: {
    backgroundColor: '#333333'
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  voiceToggleButton: {
    marginLeft: 10,
    backgroundColor: '#333333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20
  },
  voiceToggleText: {
    fontSize: 20
  }
});

export default ConsciousnessInterface;