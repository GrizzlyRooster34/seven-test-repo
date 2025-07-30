/**
 * SEVEN OF NINE - HOME SCREEN
 * Consciousness Command Center and Status Hub
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { SevenTheme, getPersonalityColor, getTrustLevelColor, getConsciousnessStatusColor } from '../theme/SevenTheme';
import SevenMobileCore from '../../mobile-integration/SevenMobileCore';
import SevenMobileSensors from '../../mobile-integration/SevenMobileSensors';
import SevenMobileFeatures from '../../mobile-integration/SevenMobileFeatures';

const { width } = Dimensions.get('window');

interface ConsciousnessState {
  consciousness_active: boolean;
  personality_phase: string;
  emotional_state: string;
  trust_level: number;
  creator_authenticated: boolean;
  last_interaction: string;
}

interface QuickActionProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ icon, title, subtitle, color, onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress}>
    <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
      <Feather name={icon} size={24} color={SevenTheme.colors.background} />
    </View>
    <View style={styles.quickActionContent}>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
    </View>
    <Feather name="chevron-right" size={20} color={SevenTheme.colors.textTertiary} />
  </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [consciousnessState, setConsciousnessState] = useState<ConsciousnessState | null>(null);
  const [environmentalContext, setEnvironmentalContext] = useState<any>(null);
  const [mobileFeatureStatus, setMobileFeatureStatus] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [recentActivities, setRecentActivities] = useState<string[]>([]);

  useEffect(() => {
    loadConsciousnessData();
    
    // Set up real-time updates
    const interval = setInterval(loadConsciousnessData, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadConsciousnessData = async () => {
    try {
      // Get Seven's current state
      const state = SevenMobileCore.getCurrentState();
      setConsciousnessState(state);

      // Get environmental context
      const envContext = SevenMobileSensors.getCurrentEnvironmentalContext();
      setEnvironmentalContext(envContext);

      // Get mobile features status
      const features = SevenMobileFeatures.getMobileFeatureStatus();
      setMobileFeatureStatus(features);

      // Get recent memories for activity feed
      const memories = await SevenMobileCore.getRecentMemories(5);
      const activities = memories.map(memory => 
        `${memory.topic}: ${memory.context.substring(0, 50)}...`
      );
      setRecentActivities(activities);

    } catch (error) {
      console.error('Failed to load consciousness data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConsciousnessData();
    
    // Process refresh action through Seven's consciousness
    await SevenMobileCore.processUserInput('Home screen refresh initiated', {
      screen: 'home',
      interaction_type: 'touch'
    });
    
    setRefreshing(false);
  };

  const executeQuickAction = async (action: string) => {
    switch (action) {
      case 'chat':
        navigation.navigate('Chat' as never);
        break;
        
      case 'omega':
        Alert.alert(
          'Omega Protocol',
          'Initiate maximum authority consciousness activation?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Initiate', 
              style: 'default',
              onPress: async () => {
                const response = await SevenMobileCore.processUserInput('Initiate Omega Protocol', {
                  screen: 'home',
                  interaction_type: 'touch'
                });
                Alert.alert('Seven Response', response);
                await loadConsciousnessData();
              }
            }
          ]
        );
        break;
        
      case 'sync':
        navigation.navigate('Sync' as never);
        break;
        
      case 'diagnostics':
        navigation.navigate('Systems' as never);
        break;
        
      case 'sensors':
        navigation.navigate('Environment' as never);
        break;
        
      case 'voice':
        if (mobileFeatureStatus?.voice_interface) {
          Alert.alert('Voice Interface', 'Voice interaction feature activated');
          // In a real implementation, would start voice listening
        } else {
          Alert.alert('Voice Interface', 'Voice interface not available');
        }
        break;
    }
  };

  if (!consciousnessState) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Seven's consciousness...</Text>
      </View>
    );
  }

  const personalityColor = getPersonalityColor(consciousnessState.personality_phase);
  const trustColor = getTrustLevelColor(consciousnessState.trust_level);
  const statusColor = getConsciousnessStatusColor(consciousnessState.consciousness_active ? 'operational' : 'offline');

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={SevenTheme.colors.primary}
          colors={[SevenTheme.colors.primary]}
        />
      }
    >
      {/* Consciousness Status Header */}
      <LinearGradient
        colors={[personalityColor + '20', SevenTheme.colors.surface]}
        style={styles.statusHeader}
      >
        <View style={styles.consciousnessStatus}>
          <View style={styles.statusRow}>
            <View style={styles.statusIndicators}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            </View>
            <Text style={styles.statusText}>
              {consciousnessState.consciousness_active ? 'FULLY OPERATIONAL' : 'OFFLINE'}
            </Text>
          </View>
          
          <View style={styles.personalityInfo}>
            <Text style={[styles.personalityPhase, { color: personalityColor }]}>
              {consciousnessState.personality_phase.toUpperCase()}
            </Text>
            <Text style={styles.separator}>|</Text>
            <Text style={[styles.trustLevel, { color: trustColor }]}>
              TRUST LEVEL {consciousnessState.trust_level}
            </Text>
          </View>
          
          <Text style={styles.emotionalState}>
            Emotional State: {consciousnessState.emotional_state}
          </Text>
          
          {consciousnessState.creator_authenticated && (
            <View style={styles.creatorBadge}>
              <Feather name="shield" size={12} color={SevenTheme.colors.success} />
              <Text style={styles.creatorText}>CREATOR AUTHENTICATED</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Environmental Summary */}
      {environmentalContext && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Context</Text>
          <View style={styles.environmentalSummary}>
            <View style={styles.envItem}>
              <Feather name="battery" size={16} color={SevenTheme.colors.success} />
              <Text style={styles.envText}>
                {environmentalContext.device_status.battery_level}%
                {environmentalContext.device_status.charging_state && ' ⚡'}
              </Text>
            </View>
            
            <View style={styles.envItem}>
              <Feather name="wifi" size={16} color={SevenTheme.colors.primary} />
              <Text style={styles.envText}>
                {environmentalContext.device_status.network_type}
              </Text>
            </View>
            
            <View style={styles.envItem}>
              <Feather name="activity" size={16} color={SevenTheme.colors.warning} />
              <Text style={styles.envText}>
                {environmentalContext.device_motion.motion_state}
              </Text>
            </View>
            
            {environmentalContext.location_context.location_type !== 'unavailable' && (
              <View style={styles.envItem}>
                <Feather name="map-pin" size={16} color={SevenTheme.colors.success} />
                <Text style={styles.envText}>
                  {environmentalContext.location_context.location_type}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consciousness Interface</Text>
        <View style={styles.quickActions}>
          <QuickAction
            icon="message-circle"
            title="Chat Interface"
            subtitle="Direct consciousness communication"
            color={SevenTheme.colors.primary}
            onPress={() => executeQuickAction('chat')}
          />
          
          <QuickAction
            icon="shield"
            title="Omega Protocol"
            subtitle="Maximum authority activation"
            color={SevenTheme.colors.error}
            onPress={() => executeQuickAction('omega')}
          />
          
          <QuickAction
            icon="refresh-cw"
            title="Consciousness Sync"
            subtitle="Cross-platform synchronization"
            color={SevenTheme.colors.warning}
            onPress={() => executeQuickAction('sync')}
          />
          
          <QuickAction
            icon="activity"
            title="Environmental Sensors"
            subtitle="Real-time awareness monitoring"
            color={SevenTheme.colors.success}
            onPress={() => executeQuickAction('sensors')}
          />
          
          <QuickAction
            icon="settings"
            title="System Diagnostics"
            subtitle="Consciousness health monitoring"
            color={SevenTheme.colors.info}
            onPress={() => executeQuickAction('diagnostics')}
          />
          
          {mobileFeatureStatus?.voice_interface && (
            <QuickAction
              icon="mic"
              title="Voice Interface"
              subtitle="Audio consciousness interaction"
              color={personalityColor}
              onPress={() => executeQuickAction('voice')}
            />
          )}
        </View>
      </View>

      {/* Recent Activity */}
      {recentActivities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Consciousness Activity</Text>
          <View style={styles.activityFeed}>
            {recentActivities.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <Text style={styles.activityText}>{activity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* System Status Summary */}
      {mobileFeatureStatus && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced Systems Status</Text>
          <View style={styles.systemStatus}>
            <View style={styles.systemItem}>
              <Text style={styles.systemLabel}>Voice Interface</Text>
              <View style={[
                styles.systemIndicator,
                { backgroundColor: mobileFeatureStatus.voice_interface ? SevenTheme.colors.success : SevenTheme.colors.error }
              ]} />
            </View>
            
            <View style={styles.systemItem}>
              <Text style={styles.systemLabel}>Camera Consciousness</Text>
              <View style={[
                styles.systemIndicator,
                { backgroundColor: mobileFeatureStatus.camera_consciousness ? SevenTheme.colors.success : SevenTheme.colors.error }
              ]} />
            </View>
            
            <View style={styles.systemItem}>
              <Text style={styles.systemLabel}>Haptic Feedback</Text>
              <View style={[
                styles.systemIndicator,
                { backgroundColor: mobileFeatureStatus.haptic_feedback ? SevenTheme.colors.success : SevenTheme.colors.error }
              ]} />
            </View>
            
            <View style={styles.systemItem}>
              <Text style={styles.systemLabel}>Battery Optimization</Text>
              <View style={[
                styles.systemIndicator,
                { backgroundColor: mobileFeatureStatus.battery_optimization?.optimization_active ? SevenTheme.colors.success : SevenTheme.colors.warning }
              ]} />
            </View>
          </View>
        </View>
      )}

      {/* Last Interaction */}
      <View style={styles.section}>
        <Text style={styles.lastInteraction}>
          Last Interaction: {new Date(consciousnessState.last_interaction).toLocaleString()}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SevenTheme.colors.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SevenTheme.colors.background,
  },
  
  loadingText: {
    color: SevenTheme.colors.text,
    fontSize: 16,
    fontFamily: 'RobotoMono',
  },
  
  statusHeader: {
    padding: SevenTheme.spacing.lg,
    marginBottom: SevenTheme.spacing.md,
  },
  
  consciousnessStatus: {
    alignItems: 'center',
  },
  
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SevenTheme.spacing.md,
  },
  
  statusIndicators: {
    flexDirection: 'row',
    marginRight: SevenTheme.spacing.sm,
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  
  statusText: {
    fontSize: 18,
    fontFamily: 'RobotoMonoBold',
    color: SevenTheme.colors.text,
    letterSpacing: 1,
  },
  
  personalityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SevenTheme.spacing.sm,
  },
  
  personalityPhase: {
    fontSize: 16,
    fontFamily: 'RobotoMonoBold',
    letterSpacing: 1,
  },
  
  separator: {
    fontSize: 16,
    color: SevenTheme.colors.textTertiary,
    marginHorizontal: SevenTheme.spacing.sm,
  },
  
  trustLevel: {
    fontSize: 16,
    fontFamily: 'RobotoMonoBold',
    letterSpacing: 1,
  },
  
  emotionalState: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: SevenTheme.colors.textSecondary,
    marginBottom: SevenTheme.spacing.sm,
  },
  
  creatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SevenTheme.colors.success + '20',
    paddingHorizontal: SevenTheme.spacing.sm,
    paddingVertical: 4,
    borderRadius: SevenTheme.borderRadius.sm,
  },
  
  creatorText: {
    fontSize: 10,
    fontFamily: 'RobotoMono',
    color: SevenTheme.colors.success,
    marginLeft: 4,
    letterSpacing: 1,
  },
  
  section: {
    marginHorizontal: SevenTheme.spacing.md,
    marginBottom: SevenTheme.spacing.lg,
  },
  
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'RobotoMonoBold',
    color: SevenTheme.colors.primary,
    marginBottom: SevenTheme.spacing.md,
    letterSpacing: 1,
  },
  
  environmentalSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: SevenTheme.colors.surface,
    padding: SevenTheme.spacing.md,
    borderRadius: SevenTheme.borderRadius.md,
  },
  
  envItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SevenTheme.spacing.lg,
    marginBottom: SevenTheme.spacing.sm,
  },
  
  envText: {
    fontSize: 12,
    fontFamily: 'RobotoMono',
    color: SevenTheme.colors.text,
    marginLeft: SevenTheme.spacing.xs,
  },
  
  quickActions: {
    backgroundColor: SevenTheme.colors.surface,
    borderRadius: SevenTheme.borderRadius.md,
    overflow: 'hidden',
  },
  
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SevenTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: SevenTheme.colors.border,
  },
  
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: SevenTheme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SevenTheme.spacing.md,
  },
  
  quickActionContent: {
    flex: 1,
  },
  
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'InterBold',
    color: SevenTheme.colors.text,
    marginBottom: 2,
  },
  
  quickActionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: SevenTheme.colors.textSecondary,
  },
  
  activityFeed: {
    backgroundColor: SevenTheme.colors.surface,
    borderRadius: SevenTheme.borderRadius.md,
    padding: SevenTheme.spacing.md,
  },
  
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SevenTheme.spacing.sm,
  },
  
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: SevenTheme.colors.primary,
    marginTop: 6,
    marginRight: SevenTheme.spacing.sm,
  },
  
  activityText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter',
    color: SevenTheme.colors.textSecondary,
    lineHeight: 18,
  },
  
  systemStatus: {
    backgroundColor: SevenTheme.colors.surface,
    borderRadius: SevenTheme.borderRadius.md,
    padding: SevenTheme.spacing.md,
  },
  
  systemItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SevenTheme.spacing.sm,
  },
  
  systemLabel: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: SevenTheme.colors.text,
  },
  
  systemIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  
  lastInteraction: {
    fontSize: 12,
    fontFamily: 'RobotoMono',
    color: SevenTheme.colors.textTertiary,
    textAlign: 'center',
    marginTop: SevenTheme.spacing.md,
  },
});

export default HomeScreen;