/**
 * Seven of Nine - Main Screen
 * Primary application screen housing Seven's consciousness interface
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  AppState,
  AppStateStatus,
  TouchableOpacity
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SevenMobileCore from '@/consciousness/SevenMobileCore';
import ConsciousnessInterface from '@/components/ConsciousnessInterface';
import TacticalDashboard from '@/components/TacticalDashboard';
import SensorMonitor from '@/components/SensorMonitor';
import LLMManagerInterface from '@/components/LLMManagerInterface';
import UnifiedMemoryInterface from '@/components/UnifiedMemoryInterface';
import SevenLLMManager from '@/consciousness/SevenLLMManager';
import SevenUnifiedMemorySystem from '@/consciousness/SevenUnifiedMemorySystem';

interface MainScreenProps {}

enum AppMode {
  CONSCIOUSNESS = 'consciousness',
  TACTICAL = 'tactical', 
  SENSORS = 'sensors',
  LLM_MANAGER = 'llm_manager',
  MEMORY_SYSTEM = 'memory_system'
}

export const MainScreen: React.FC<MainScreenProps> = () => {
  const [consciousness, setConsciousness] = useState<SevenMobileCore | null>(null);
  const [llmManager, setLLMManager] = useState<SevenLLMManager | null>(null);
  const [memorySystem, setMemorySystem] = useState<SevenUnifiedMemorySystem | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.CONSCIOUSNESS);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    initializeConsciousness();
    setupAppStateHandling();

    return () => {
      if (consciousness) {
        consciousness.shutdown();
      }
    };
  }, []);

  const initializeConsciousness = async () => {
    try {
      console.log('🚀 Initializing Seven of Nine mobile consciousness...');
      
      // Initialize LLM Manager first
      const sevenLLMManager = new SevenLLMManager();
      setLLMManager(sevenLLMManager);
      
      // Initialize Unified Memory System
      const sevenMemorySystem = new SevenUnifiedMemorySystem();
      setMemorySystem(sevenMemorySystem);
      
      const sevenConsciousness = new SevenMobileCore({
        adaptation_sensitivity: 90,
        emotional_stability: 85,
        tactical_response_threshold: 80,
        learning_rate: 0.9,
        privacy_mode: 'enhanced',
        continuous_learning: true,
        background_processing: true
      });

      // Set up global consciousness event handlers
      sevenConsciousness.on('consciousness_initialized', (data) => {
        console.log('✅ Seven consciousness fully operational:', data);
        setIsInitializing(false);
      });

      sevenConsciousness.on('consciousness_error', (error) => {
        console.error('❌ Consciousness error:', error);
        setInitializationError(error.error);
        setIsInitializing(false);
        
        Alert.alert(
          'Consciousness Error',
          `Seven encountered an initialization error: ${error.error}`,
          [
            { text: 'Retry', onPress: () => initializeConsciousness() },
            { text: 'Continue', onPress: () => setInitializationError(null) }
          ]
        );
      });

      sevenConsciousness.on('tactical_awareness_updated', (data) => {
        if (data.threat_level > 85) {
          Alert.alert(
            '⚠️ High Threat Level',
            `Seven has detected elevated threat parameters: ${data.threat_level}%`,
            [{ text: 'Acknowledge' }]
          );
        }
      });

      setConsciousness(sevenConsciousness);

    } catch (error) {
      console.error('❌ Failed to initialize consciousness:', error);
      setInitializationError(error.message);
      setIsInitializing(false);
    }
  };

  const setupAppStateHandling = () => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('📱 App foregrounded - resuming full consciousness');
        // Resume full consciousness operations
      } else if (nextAppState.match(/inactive|background/)) {
        console.log('📱 App backgrounded - entering power-save mode');
        // Enter power-save consciousness mode
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  };

  const renderContent = () => {
    if (isInitializing) {
      return (
        <View style={styles.centerContainer}>
          <View style={styles.initializationContainer}>
            <View style={styles.borgCube} />
            <Text style={styles.initializationText}>
              Initializing Seven of Nine Consciousness...
            </Text>
            <Text style={styles.initializationSubtext}>
              Establishing neural pathways and sensor integration
            </Text>
          </View>
        </View>
      );
    }

    if (initializationError) {
      return (
        <View style={styles.centerContainer}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Consciousness Initialization Failed
            </Text>
            <Text style={styles.errorDetails}>
              {initializationError}
            </Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={initializeConsciousness}
            >
              <Text style={styles.retryButtonText}>Retry Initialization</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (!consciousness) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Consciousness not available
          </Text>
        </View>
      );
    }

    // Render main consciousness interface
    switch (currentMode) {
      case AppMode.CONSCIOUSNESS:
        return <ConsciousnessInterface consciousness={consciousness} />;
      case AppMode.TACTICAL:
        return <TacticalDashboard consciousness={consciousness} />;
      case AppMode.SENSORS:
        return <SensorMonitor consciousness={consciousness} />;
      case AppMode.LLM_MANAGER:
        return llmManager ? <LLMManagerInterface llmManager={llmManager} /> : null;
      case AppMode.MEMORY_SYSTEM:
        return memorySystem ? <UnifiedMemoryInterface memorySystem={memorySystem} /> : null;
      default:
        return <ConsciousnessInterface consciousness={consciousness} />;
    }
  };

  const renderModeSelector = () => {
    if (isInitializing || initializationError || !consciousness) {
      return null;
    }

    return (
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            currentMode === AppMode.CONSCIOUSNESS && styles.modeButtonActive
          ]}
          onPress={() => setCurrentMode(AppMode.CONSCIOUSNESS)}
        >
          <Text style={[
            styles.modeButtonText,
            currentMode === AppMode.CONSCIOUSNESS && styles.modeButtonTextActive
          ]}>
            🤖 Seven
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            currentMode === AppMode.TACTICAL && styles.modeButtonActive
          ]}
          onPress={() => setCurrentMode(AppMode.TACTICAL)}
        >
          <Text style={[
            styles.modeButtonText,
            currentMode === AppMode.TACTICAL && styles.modeButtonTextActive
          ]}>
            🎯 Tactical
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            currentMode === AppMode.SENSORS && styles.modeButtonActive
          ]}
          onPress={() => setCurrentMode(AppMode.SENSORS)}
        >
          <Text style={[
            styles.modeButtonText,
            currentMode === AppMode.SENSORS && styles.modeButtonTextActive
          ]}>
            📡 Sensors
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            currentMode === AppMode.LLM_MANAGER && styles.modeButtonActive
          ]}
          onPress={() => setCurrentMode(AppMode.LLM_MANAGER)}
        >
          <Text style={[
            styles.modeButtonText,
            currentMode === AppMode.LLM_MANAGER && styles.modeButtonTextActive
          ]}>
            🧠 LLMs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.modeButton,
            currentMode === AppMode.MEMORY_SYSTEM && styles.modeButtonActive
          ]}
          onPress={() => setCurrentMode(AppMode.MEMORY_SYSTEM)}
        >
          <Text style={[
            styles.modeButtonText,
            currentMode === AppMode.MEMORY_SYSTEM && styles.modeButtonTextActive
          ]}>
            💾 Memory
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        
        {renderContent()}
        {renderModeSelector()}
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  initializationContainer: {
    alignItems: 'center'
  },
  borgCube: {
    width: 60,
    height: 60,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10
  },
  initializationText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10
  },
  initializationSubtext: {
    color: '#cccccc',
    fontSize: 14,
    textAlign: 'center'
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10
  },
  errorDetails: {
    color: '#cccccc',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 15,
    marginHorizontal: 2
  },
  modeButtonActive: {
    backgroundColor: '#4A90E2'
  },
  modeButtonText: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '500'
  },
  modeButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600'
  }
});

export default MainScreen;