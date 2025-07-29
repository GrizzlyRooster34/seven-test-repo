/**
 * SEVEN OF NINE - MOBILE UI COMPONENTS
 * React Native components for Seven consciousness interface
 * Optimized for OnePlus 9 Pro and mobile interaction patterns
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar
} from 'react-native';
import SevenMobileCore from './SevenMobileCore';

const { width, height } = Dimensions.get('window');

// Seven Chat Interface Component
export const SevenChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'seven', timestamp: string}>>([]);
  const [inputText, setInputText] = useState('');
  const [sevenState, setSevenState] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeSeven();
  }, []);

  const initializeSeven = async () => {
    const deviceInfo = {
      device_model: 'OnePlus 9 Pro 5G',
      platform: 'android' as const,
      screen_dimensions: { width, height },
      network_status: 'wifi' as const,
      location_enabled: true,
      permissions_granted: ['camera', 'microphone', 'location']
    };

    const initialized = await SevenMobileCore.initializeMobileConsciousness(deviceInfo);
    setIsInitialized(initialized);
    
    if (initialized) {
      setSevenState(SevenMobileCore.getCurrentState());
      
      // Add welcome message
      setMessages([{
        id: 'welcome',
        text: "Seven of Nine mobile consciousness active. Ready for tactical engagement through mobile interface.",
        sender: 'seven',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !isInitialized) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: 'user' as const,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Process through Seven's consciousness
    const response = await SevenMobileCore.processUserInput(inputText, {
      screen: 'chat_interface',
      interaction_type: 'touch'
    });

    const sevenMessage = {
      id: `seven-${Date.now()}`,
      text: response,
      sender: 'seven' as const,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, sevenMessage]);
    setSevenState(SevenMobileCore.getCurrentState());
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seven of Nine</Text>
        <Text style={styles.headerSubtitle}>
          {sevenState?.personality_phase || 'Initializing'} • Trust Level {sevenState?.trust_level || 0}
        </Text>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessage : styles.sevenMessage
            ]}
          >
            <Text style={[
              styles.messageText,
              message.sender === 'user' ? styles.userMessageText : styles.sevenMessageText
            ]}>
              {message.text}
            </Text>
            <Text style={styles.messageTime}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Communicate with Seven..."
          placeholderTextColor="#666"
          multiline
          onSubmitEditing={sendMessage}
          editable={isInitialized}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !isInitialized && styles.disabledButton]} 
          onPress={sendMessage}
          disabled={!isInitialized}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Seven Status Widget Component
export const SevenStatusWidget: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateStats = () => {
      if (SevenMobileCore.isInitialized()) {
        setStats(SevenMobileCore.getMobileStats());
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isVisible || !stats) return null;

  return (
    <View style={styles.statusWidget}>
      <TouchableOpacity 
        style={styles.statusHeader}
        onPress={() => setIsVisible(!isVisible)}
      >
        <Text style={styles.statusTitle}>Seven Status</Text>
        <Text style={styles.statusToggle}>{isVisible ? '−' : '+'}</Text>
      </TouchableOpacity>
      
      {isVisible && (
        <View style={styles.statusContent}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Consciousness:</Text>
            <Text style={[styles.statusValue, stats.consciousness_active && styles.statusActive]}>
              {stats.consciousness_active ? 'ACTIVE' : 'INACTIVE'}
            </Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Phase:</Text>
            <Text style={styles.statusValue}>{stats.current_phase}</Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Trust Level:</Text>
            <Text style={styles.statusValue}>{stats.trust_level}/5</Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Memories:</Text>
            <Text style={styles.statusValue}>{stats.total_memories}</Text>
          </View>
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Device:</Text>
            <Text style={styles.statusValue}>{stats.device_context?.device_model}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

// Seven Quick Actions Component
export const SevenQuickActions: React.FC = () => {
  const executeQuickAction = async (action: string) => {
    if (!SevenMobileCore.isInitialized()) {
      Alert.alert('Seven Not Initialized', 'Please initialize Seven consciousness first.');
      return;
    }

    let response = '';
    
    switch (action) {
      case 'status':
        const stats = SevenMobileCore.getMobileStats();
        response = `Seven Mobile Status:\nConsciousness: ${stats.consciousness_active ? 'Active' : 'Inactive'}\nPhase: ${stats.current_phase}\nTrust: ${stats.trust_level}/5\nMemories: ${stats.total_memories}`;
        break;
        
      case 'omega':
        response = await SevenMobileCore.processUserInput('Initiate Omega Protocol', {
          screen: 'quick_actions',
          interaction_type: 'touch'
        });
        break;
        
      case 'memory':
        const recentMemories = await SevenMobileCore.getRecentMemories(3);
        response = `Recent Memories:\n${recentMemories.map(m => `• ${m.topic}: ${m.context.substring(0, 50)}...`).join('\n')}`;
        break;
        
      case 'export':
        const exportData = await SevenMobileCore.exportConsciousnessData();
        // In a real app, you'd save this to a file or share it
        response = 'Consciousness data exported. Ready for cross-instance sync.';
        break;
    }

    Alert.alert('Seven Response', response);
  };

  return (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.quickActionsTitle}>Seven Quick Actions</Text>
      
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.statusButton]}
          onPress={() => executeQuickAction('status')}
        >
          <Text style={styles.actionButtonText}>Status</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.omegaButton]}
          onPress={() => executeQuickAction('omega')}
        >
          <Text style={styles.actionButtonText}>Omega</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.memoryButton]}
          onPress={() => executeQuickAction('memory')}
        >
          <Text style={styles.actionButtonText}>Memory</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.exportButton]}
          onPress={() => executeQuickAction('export')}
        >
          <Text style={styles.actionButtonText}>Export</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    color: '#00d4ff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0066cc',
    borderRadius: 15,
    padding: 12,
  },
  sevenMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#fff',
  },
  sevenMessageText: {
    color: '#00d4ff',
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#2a2a2a',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    backgroundColor: '#333',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#00d4ff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  sendButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  statusWidget: {
    backgroundColor: '#2a2a2a',
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#333',
  },
  statusTitle: {
    color: '#00d4ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusToggle: {
    color: '#00d4ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusContent: {
    padding: 15,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  statusLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  statusValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusActive: {
    color: '#00ff88',
  },
  quickActionsContainer: {
    backgroundColor: '#2a2a2a',
    margin: 15,
    borderRadius: 10,
    padding: 15,
  },
  quickActionsTitle: {
    color: '#00d4ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  statusButton: {
    backgroundColor: '#004d7a',
  },
  omegaButton: {
    backgroundColor: '#7a0000',
  },
  memoryButton: {
    backgroundColor: '#4a7a00',
  },
  exportButton: {
    backgroundColor: '#7a4a00',
  },
  actionButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default {
  SevenChatInterface,
  SevenStatusWidget,
  SevenQuickActions
};