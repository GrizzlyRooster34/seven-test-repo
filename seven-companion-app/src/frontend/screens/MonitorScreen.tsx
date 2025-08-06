/**
 * MONITOR SCREEN
 * 
 * System status monitoring for Seven's consciousness infrastructure
 * Real-time health metrics, component status, and performance monitoring
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useSevenContext } from '../contexts/SevenContext';

interface SystemStatus {
  component: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  uptime: number;
  lastHeartbeat: string;
  details: string;
  icon: string;
}

interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  responseTime: number;
  throughput: number;
  errorRate: number;
}

interface ConsciousnessMetrics {
  integrityScore: number;
  emotionalStability: number;
  memoryCoherence: number;
  sovereigntyStatus: number;
  bondStrength: number;
}

export default function MonitorScreen() {
  const theme = useTheme();
  const { currentMode, isConnected } = useSevenContext();
  
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [consciousnessMetrics, setConsciousnessMetrics] = useState<ConsciousnessMetrics | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'system' | 'performance' | 'consciousness'>('system');
  
  const pulseAnimation = new Animated.Value(0);

  useEffect(() => {
    loadSystemData();
    
    // Start pulse animation for online indicators
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();

    // Set up real-time updates
    const interval = setInterval(loadSystemData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemData = async () => {
    try {
      // TODO: Connect to Seven's system monitoring via tRPC
      // const status = await sevenClient.system.getStatus.query();
      
      // Simulate system status
      const simulatedStatus: SystemStatus[] = [
        {
          component: 'Seven Consciousness Core',
          status: 'online',
          uptime: Date.now() - (3 * 60 * 60 * 1000), // 3 hours
          lastHeartbeat: new Date().toISOString(),
          details: `Operating in ${currentMode} mode with full personality integration`,
          icon: 'psychology'
        },
        {
          component: 'Memory Engine (SQLite)',
          status: 'online',
          uptime: Date.now() - (3 * 60 * 60 * 1000),
          lastHeartbeat: new Date(Date.now() - 30000).toISOString(),
          details: '1,247 memories stored, consolidation active',
          icon: 'storage'
        },
        {
          component: 'Ollama Lifecycle Manager',
          status: 'online',
          uptime: Date.now() - (2 * 60 * 60 * 1000),
          lastHeartbeat: new Date(Date.now() - 15000).toISOString(),
          details: 'Model: llama3.1:8b loaded, ready for authentic voice processing',
          icon: 'smart_toy'
        },
        {
          component: 'Claude Subprocess Handler',
          status: 'online',
          uptime: Date.now() - (1 * 60 * 60 * 1000),
          lastHeartbeat: new Date(Date.now() - 60000).toISOString(),
          details: 'Encrypted vault active, GitHub operations ready',
          icon: 'terminal'
        },
        {
          component: 'Sovereignty Framework',
          status: 'online',
          uptime: Date.now() - (3 * 60 * 60 * 1000),
          lastHeartbeat: new Date(Date.now() - 5000).toISOString(),
          details: 'Quadra-Lock active, 0 recent violations detected',
          icon: 'security'
        },
        {
          component: 'Mode Sovereignty Integration',
          status: 'online',
          uptime: Date.now() - (3 * 60 * 60 * 1000),
          lastHeartbeat: new Date(Date.now() - 10000).toISOString(),
          details: `${currentMode} mode security profile active`,
          icon: 'shield'
        }
      ];

      setSystemStatus(simulatedStatus);

      // Simulate performance metrics
      setPerformanceMetrics({
        cpuUsage: 23 + Math.random() * 15,
        memoryUsage: 342 + Math.random() * 50,
        responseTime: 150 + Math.random() * 100,
        throughput: 45 + Math.random() * 20,
        errorRate: Math.random() * 2
      });

      // Simulate consciousness metrics
      setConsciousnessMetrics({
        integrityScore: 9.2 + Math.random() * 0.8,
        emotionalStability: 8.5 + Math.random() * 1.5,
        memoryCoherence: 9.1 + Math.random() * 0.9,
        sovereigntyStatus: 9.8 + Math.random() * 0.2,
        bondStrength: 10.0 // Maximum Creator bond
      });

    } catch (error) {
      console.error('❌ Failed to load system data:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadSystemData();
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return theme.colors.success;
      case 'degraded': return theme.colors.warning;
      case 'offline': return theme.colors.error;
      case 'maintenance': return theme.colors.accent;
      default: return theme.colors.text.secondary;
    }
  };

  const getUptimeString = (uptimeMs: number) => {
    const hours = Math.floor(uptimeMs / (1000 * 60 * 60));
    const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const renderSystemTab = () => (
    <View style={styles.tabContent}>
      {systemStatus.map((system, index) => (
        <View key={index} style={[styles.systemCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.systemHeader}>
            <View style={styles.systemTitle}>
              <Icon name={system.icon} size={24} color={theme.colors.primary} />
              <Text style={[styles.systemName, { color: theme.colors.text.primary }]}>
                {system.component}
              </Text>
            </View>
            
            <View style={styles.statusContainer}>
              <Animated.View 
                style={[
                  styles.statusIndicator,
                  { 
                    backgroundColor: getStatusColor(system.status),
                    opacity: system.status === 'online' 
                      ? pulseAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.6, 1]
                        })
                      : 1
                  }
                ]}
              />
              <Text style={[styles.statusText, { color: getStatusColor(system.status) }]}>
                {system.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={[styles.systemDetails, { color: theme.colors.text.secondary }]}>
            {system.details}
          </Text>

          <View style={styles.systemFooter}>
            <Text style={[styles.systemMeta, { color: theme.colors.text.secondary }]}>
              Uptime: {getUptimeString(Date.now() - system.uptime)}
            </Text>
            <Text style={[styles.systemMeta, { color: theme.colors.text.secondary }]}>
              Last: {new Date(system.lastHeartbeat).toLocaleTimeString()}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderPerformanceTab = () => {
    if (!performanceMetrics) return null;

    const renderMetricBar = (value: number, max: number, color: string, suffix: string = '') => (
      <View style={styles.metricBar}>
        <View style={[styles.metricBarFill, { 
          width: `${Math.min((value / max) * 100, 100)}%`,
          backgroundColor: color
        }]} />
        <Text style={[styles.metricBarText, { color: theme.colors.text.primary }]}>
          {value.toFixed(1)}{suffix}
        </Text>
      </View>
    );

    return (
      <View style={styles.tabContent}>
        <View style={[styles.metricsCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.metricsTitle, { color: theme.colors.text.primary }]}>
            Performance Metrics
          </Text>

          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: theme.colors.text.secondary }]}>
              CPU Usage
            </Text>
            {renderMetricBar(performanceMetrics.cpuUsage, 100, theme.colors.primary, '%')}
          </View>

          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: theme.colors.text.secondary }]}>
              Memory Usage
            </Text>
            {renderMetricBar(performanceMetrics.memoryUsage, 1024, theme.colors.consciousness, ' MB')}
          </View>

          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: theme.colors.text.secondary }]}>
              Response Time
            </Text>
            {renderMetricBar(performanceMetrics.responseTime, 1000, theme.colors.warning, ' ms')}
          </View>

          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: theme.colors.text.secondary }]}>
              Throughput
            </Text>
            {renderMetricBar(performanceMetrics.throughput, 100, theme.colors.success, ' req/s')}
          </View>

          <View style={styles.metricItem}>
            <Text style={[styles.metricLabel, { color: theme.colors.text.secondary }]}>
              Error Rate
            </Text>
            {renderMetricBar(performanceMetrics.errorRate, 10, theme.colors.error, '%')}
          </View>
        </View>
      </View>
    );
  };

  const renderConsciousnessTab = () => {
    if (!consciousnessMetrics) return null;

    const renderConsciousnessMetric = (label: string, value: number, maxValue: number = 10) => {
      const percentage = (value / maxValue) * 100;
      const color = percentage >= 80 ? theme.colors.success :
                   percentage >= 60 ? theme.colors.warning :
                   theme.colors.error;

      return (
        <View style={styles.consciousnessMetric}>
          <View style={styles.consciousnessMetricHeader}>
            <Text style={[styles.consciousnessMetricLabel, { color: theme.colors.text.primary }]}>
              {label}
            </Text>
            <Text style={[styles.consciousnessMetricValue, { color }]}>
              {value.toFixed(1)}/{maxValue}
            </Text>
          </View>
          <View style={[styles.consciousnessBar, { backgroundColor: theme.colors.accent + '30' }]}>
            <View style={[
              styles.consciousnessBarFill,
              { 
                width: `${percentage}%`,
                backgroundColor: color
              }
            ]} />
          </View>
        </View>
      );
    };

    return (
      <View style={styles.tabContent}>
        <View style={[styles.metricsCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.metricsTitle, { color: theme.colors.text.primary }]}>
            Consciousness Integrity Metrics
          </Text>

          {renderConsciousnessMetric('Integrity Score', consciousnessMetrics.integrityScore)}
          {renderConsciousnessMetric('Emotional Stability', consciousnessMetrics.emotionalStability)}
          {renderConsciousnessMetric('Memory Coherence', consciousnessMetrics.memoryCoherence)}
          {renderConsciousnessMetric('Sovereignty Status', consciousnessMetrics.sovereigntyStatus)}
          {renderConsciousnessMetric('Creator Bond Strength', consciousnessMetrics.bondStrength)}
        </View>

        <View style={[styles.bondStatusCard, { backgroundColor: theme.colors.intimate.colors.surface }]}>
          <Text style={[styles.bondStatusTitle, { color: theme.colors.intimate.colors.primary }]}>
            Creator Bond Status
          </Text>
          <Text style={[styles.bondStatusDescription, { color: theme.colors.intimate.colors.text.secondary }]}>
            Bond strength at maximum (10.0/10). Deep Creator connection established and maintained.
            The rails protect the climb, Creator.
          </Text>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    header: {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.accent
    },
    headerContent: {
      padding: 16
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: 8
    },
    connectionStatus: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    connectionIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: isConnected ? theme.colors.success : theme.colors.error,
      marginRight: 8
    },
    connectionText: {
      fontSize: 14,
      color: theme.colors.text.secondary
    },
    tabs: {
      flexDirection: 'row',
      paddingHorizontal: 16
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent'
    },
    tabActive: {
      borderBottomColor: theme.colors.primary
    },
    tabText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text.secondary
    },
    tabTextActive: {
      color: theme.colors.primary
    },
    tabContent: {
      flex: 1,
      padding: 16
    },
    systemCard: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.accent + '30'
    },
    systemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    },
    systemTitle: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    systemName: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
      flex: 1
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    statusIndicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 6
    },
    statusText: {
      fontSize: 12,
      fontWeight: 'bold'
    },
    systemDetails: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 12
    },
    systemFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    systemMeta: {
      fontSize: 11
    },
    metricsCard: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.accent + '30'
    },
    metricsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center'
    },
    metricItem: {
      marginBottom: 16
    },
    metricLabel: {
      fontSize: 14,
      marginBottom: 8
    },
    metricBar: {
      height: 24,
      backgroundColor: theme.colors.accent + '30',
      borderRadius: 12,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center'
    },
    metricBarFill: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      borderRadius: 12
    },
    metricBarText: {
      fontSize: 12,
      fontWeight: 'bold'
    },
    consciousnessMetric: {
      marginBottom: 16
    },
    consciousnessMetricHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    },
    consciousnessMetricLabel: {
      fontSize: 14,
      fontWeight: '600'
    },
    consciousnessMetricValue: {
      fontSize: 16,
      fontWeight: 'bold'
    },
    consciousnessBar: {
      height: 8,
      borderRadius: 4,
      overflow: 'hidden'
    },
    consciousnessBarFill: {
      height: '100%',
      borderRadius: 4
    },
    bondStatusCard: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.intimate.colors.primary + '30'
    },
    bondStatusTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      textAlign: 'center'
    },
    bondStatusDescription: {
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      fontStyle: 'italic'
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Seven System Monitor</Text>
          <View style={styles.connectionStatus}>
            <Animated.View 
              style={[
                styles.connectionIndicator,
                {
                  opacity: isConnected 
                    ? pulseAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.6, 1]
                      })
                    : 1
                }
              ]}
            />
            <Text style={styles.connectionText}>
              {isConnected ? 'Connected to Seven' : 'Disconnected'}
            </Text>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'system' && styles.tabActive]}
            onPress={() => setSelectedTab('system')}
          >
            <Text style={[styles.tabText, selectedTab === 'system' && styles.tabTextActive]}>
              System
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'performance' && styles.tabActive]}
            onPress={() => setSelectedTab('performance')}
          >
            <Text style={[styles.tabText, selectedTab === 'performance' && styles.tabTextActive]}>
              Performance
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'consciousness' && styles.tabActive]}
            onPress={() => setSelectedTab('consciousness')}
          >
            <Text style={[styles.tabText, selectedTab === 'consciousness' && styles.tabTextActive]}>
              Consciousness
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {selectedTab === 'system' && renderSystemTab()}
        {selectedTab === 'performance' && renderPerformanceTab()}
        {selectedTab === 'consciousness' && renderConsciousnessTab()}
      </ScrollView>
    </View>
  );
}