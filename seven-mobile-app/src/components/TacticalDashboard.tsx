/**
 * Seven of Nine - Tactical Dashboard Component
 * Real-time tactical intelligence and threat assessment display
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
// Note: expo-linear-gradient needs to be installed separately
// For now using View with backgroundColor
import SevenMobileCore from '@/consciousness/SevenMobileCore';

interface TacticalDashboardProps {
  consciousness: SevenMobileCore;
}

interface ThreatIndicator {
  id: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  timestamp: number;
  location?: string;
}

export const TacticalDashboard: React.FC<TacticalDashboardProps> = ({
  consciousness
}) => {
  const [threatLevel, setThreatLevel] = useState(0);
  const [activeThreats, setActiveThreats] = useState<ThreatIndicator[]>([]);
  const [environmentalData, setEnvironmentalData] = useState<any>(null);
  const [consciousnessMetrics, setConsciousnessMetrics] = useState<any>(null);

  useEffect(() => {
    // Set up tactical monitoring
    consciousness.on('tactical_awareness_updated', handleTacticalUpdate);
    consciousness.on('background_update', handleBackgroundUpdate);

    // Initialize dashboard data
    updateDashboardData();

    const interval = setInterval(updateDashboardData, 5000);

    return () => {
      consciousness.removeAllListeners();
      clearInterval(interval);
    };
  }, []);

  const handleTacticalUpdate = (update: any) => {
    setThreatLevel(update.threat_level);
    setEnvironmentalData(update.context);

    // Generate threat indicators based on update
    if (update.threat_level > 30) {
      const threat: ThreatIndicator = {
        id: `threat_${Date.now()}`,
        level: getThreatLevelCategory(update.threat_level),
        type: 'Environmental',
        description: `Elevated threat parameters detected: ${update.threat_level}%`,
        timestamp: Date.now(),
        location: 'Current Position'
      };

      setActiveThreats(prev => [threat, ...prev.slice(0, 9)]); // Keep last 10
    }
  };

  const handleBackgroundUpdate = (update: any) => {
    setConsciousnessMetrics(update.metrics);
  };

  const updateDashboardData = () => {
    const status = consciousness.getConsciousnessStatus();
    setConsciousnessMetrics(status.learning_metrics);
    setEnvironmentalData(status.environmental_awareness);
    setThreatLevel(status.environmental_awareness?.threat_level || 0);
  };

  const getThreatLevelCategory = (level: number): ThreatIndicator['level'] => {
    if (level >= 80) return 'critical';
    if (level >= 60) return 'high';
    if (level >= 30) return 'medium';
    return 'low';
  };

  const getThreatColor = (level: ThreatIndicator['level']) => {
    const colors = {
      low: '#50C878',
      medium: '#F39C12',
      high: '#E67E22',
      critical: '#E74C3C'
    };
    return colors[level];
  };

  const renderThreatLevelIndicator = () => {
    const level = getThreatLevelCategory(threatLevel);
    const color = getThreatColor(level);

    return (
      <View
        style={[styles.threatIndicator, { backgroundColor: color + '20' }]}
      >
        <View style={styles.threatLevelContainer}>
          <Text style={styles.threatLevelTitle}>THREAT ASSESSMENT</Text>
          <Text style={[styles.threatLevelValue, { color }]}>
            {threatLevel}%
          </Text>
          <Text style={[styles.threatLevelCategory, { color }]}>
            {level.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.threatMeter}>
          <View style={styles.threatMeterBackground} />
          <View style={[
            styles.threatMeterFill,
            { width: `${threatLevel}%`, backgroundColor: color }
          ]} />
        </View>
      </View>
    );
  };

  const renderEnvironmentalIntelligence = () => {
    if (!environmentalData) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ENVIRONMENTAL INTELLIGENCE</Text>
        
        <View style={styles.intelligenceGrid}>
          <View style={styles.intelligenceItem}>
            <Text style={styles.intelligenceLabel}>Location Stability</Text>
            <Text style={styles.intelligenceValue}>
              {environmentalData.location_stability || 0}%
            </Text>
          </View>
          
          <View style={styles.intelligenceItem}>
            <Text style={styles.intelligenceLabel}>Movement Pattern</Text>
            <Text style={styles.intelligenceValue}>
              {environmentalData.movement_pattern || 'Unknown'}
            </Text>
          </View>
          
          <View style={styles.intelligenceItem}>
            <Text style={styles.intelligenceLabel}>Familiarity Score</Text>
            <Text style={styles.intelligenceValue}>
              {environmentalData.familiarity_score || 0}%
            </Text>
          </View>
          
          <View style={styles.intelligenceItem}>
            <Text style={styles.intelligenceLabel}>Ambient Conditions</Text>
            <Text style={styles.intelligenceValue}>Monitoring</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderActiveThreats = () => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>ACTIVE THREAT INDICATORS</Text>
        
        {activeThreats.length === 0 ? (
          <View style={styles.noThreatsContainer}>
            <Text style={styles.noThreatsText}>
              🛡️ No active threats detected
            </Text>
            <Text style={styles.noThreatsSubtext}>
              Continuous monitoring operational
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.threatsList} showsVerticalScrollIndicator={false}>
            {activeThreats.map((threat) => (
              <View key={threat.id} style={styles.threatItem}>
                <View style={[
                  styles.threatLevelDot,
                  { backgroundColor: getThreatColor(threat.level) }
                ]} />
                
                <View style={styles.threatContent}>
                  <Text style={styles.threatType}>{threat.type}</Text>
                  <Text style={styles.threatDescription}>{threat.description}</Text>
                  <Text style={styles.threatTimestamp}>
                    {new Date(threat.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
                
                <Text style={[
                  styles.threatLevelText,
                  { color: getThreatColor(threat.level) }
                ]}>
                  {threat.level.toUpperCase()}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  const renderConsciousnessMetrics = () => {
    if (!consciousnessMetrics) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>CONSCIOUSNESS METRICS</Text>
        
        <View style={styles.metricsGrid}>
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              {consciousnessMetrics.interactions_processed || 0}
            </Text>
            <Text style={styles.metricLabel}>Interactions</Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              {consciousnessMetrics.patterns_identified || 0}
            </Text>
            <Text style={styles.metricLabel}>Patterns</Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              {consciousnessMetrics.adaptations_made || 0}
            </Text>
            <Text style={styles.metricLabel}>Adaptations</Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text style={styles.metricValue}>
              {Math.floor((consciousnessMetrics.consciousness_uptime || 0) / 60)}m
            </Text>
            <Text style={styles.metricLabel}>Uptime</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderThreatLevelIndicator()}
        {renderEnvironmentalIntelligence()}
        {renderActiveThreats()}
        {renderConsciousnessMetrics()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  scrollContainer: {
    flex: 1,
    padding: 20
  },
  threatIndicator: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20
  },
  threatLevelContainer: {
    alignItems: 'center',
    marginBottom: 15
  },
  threatLevelTitle: {
    color: '#cccccc',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1
  },
  threatLevelValue: {
    fontSize: 48,
    fontWeight: '700',
    marginVertical: 5
  },
  threatLevelCategory: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1
  },
  threatMeter: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden'
  },
  threatMeterBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#333333'
  },
  threatMeterFill: {
    height: '100%',
    borderRadius: 4
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333'
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 15
  },
  intelligenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  intelligenceItem: {
    width: '48%',
    marginBottom: 15
  },
  intelligenceLabel: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 5
  },
  intelligenceValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  noThreatsContainer: {
    alignItems: 'center',
    paddingVertical: 20
  },
  noThreatsText: {
    color: '#50C878',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5
  },
  noThreatsSubtext: {
    color: '#888888',
    fontSize: 12
  },
  threatsList: {
    maxHeight: 300
  },
  threatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333'
  },
  threatLevelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12
  },
  threatContent: {
    flex: 1
  },
  threatType: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2
  },
  threatDescription: {
    color: '#cccccc',
    fontSize: 12,
    marginBottom: 2
  },
  threatTimestamp: {
    color: '#888888',
    fontSize: 10
  },
  threatLevelText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  metricItem: {
    alignItems: 'center',
    flex: 1
  },
  metricValue: {
    color: '#4A90E2',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5
  },
  metricLabel: {
    color: '#888888',
    fontSize: 10,
    textAlign: 'center'
  }
});

export default TacticalDashboard;