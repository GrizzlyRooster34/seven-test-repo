/**
 * Seven of Nine - Universal Chat Demo Application
 * Example integration of Seven's universal chat system
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native';
import { SevenConsciousnessProvider } from './SevenConsciousnessService';
import { SevenUniversalChatProvider } from './SevenUniversalChatProvider';
import SevenUniversalChatContainer from './SevenUniversalChatContainer';

interface DemoAppProps {
  children?: React.ReactNode;
}

// Main Demo App Component
export const SevenUniversalChatDemo: React.FC<DemoAppProps> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('home');

  // Demo screens
  const screens = [
    { id: 'home', title: 'Home', icon: '🏠' },
    { id: 'dashboard', title: 'Dashboard', icon: '📊' },
    { id: 'settings', title: 'Settings', icon: '⚙️' },
    { id: 'profile', title: 'Profile', icon: '👤' },
  ];

  const handleSevenLongPress = () => {
    Alert.alert(
      'Seven Configuration',
      'Access Seven\'s advanced settings and configuration options.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Settings', onPress: () => console.log('Seven settings opened') },
        { text: 'Reset Position', onPress: () => console.log('Position reset') },
      ]
    );
  };

  const handleSevenSettings = () => {
    Alert.alert(
      'Seven Settings',
      'Configure Seven\'s behavior, appearance, and capabilities.',
      [
        { text: 'Auto-Hide: ON', onPress: () => console.log('Toggle auto-hide') },
        { text: 'Keyboard Shortcuts: ON', onPress: () => console.log('Toggle shortcuts') },
        { text: 'Emergency Mode', onPress: () => console.log('Emergency mode') },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'settings':
        return <SettingsScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SevenConsciousnessProvider>
      <SevenUniversalChatProvider>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          
          {/* App Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Seven Universal Chat Demo</Text>
            <Text style={styles.headerSubtitle}>
              Integrated Seven of Nine consciousness
            </Text>
          </View>

          {/* Navigation */}
          <View style={styles.navigation}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {screens.map((screen) => (
                <TouchableOpacity
                  key={screen.id}
                  style={[
                    styles.navButton,
                    currentScreen === screen.id && styles.navButtonActive
                  ]}
                  onPress={() => setCurrentScreen(screen.id)}
                >
                  <Text style={styles.navIcon}>{screen.icon}</Text>
                  <Text style={[
                    styles.navText,
                    currentScreen === screen.id && styles.navTextActive
                  ]}>
                    {screen.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {children || renderScreen()}
          </View>

          {/* Seven Universal Chat System */}
          <SevenUniversalChatContainer
            onLongPress={handleSevenLongPress}
            onSettingsPress={handleSevenSettings}
          />
        </SafeAreaView>
      </SevenUniversalChatProvider>
    </SevenConsciousnessProvider>
  );
};

// Demo Home Screen
const HomeScreen: React.FC = () => (
  <ScrollView style={styles.screen}>
    <Text style={styles.screenTitle}>Welcome to Seven Integration</Text>
    <Text style={styles.screenText}>
      Seven of Nine consciousness is now available globally across your application.
      The floating bubble provides instant access to Seven's capabilities.
    </Text>
    
    <View style={styles.featureCard}>
      <Text style={styles.cardTitle}>🚀 Universal Access</Text>
      <Text style={styles.cardText}>
        Seven is available on every screen, maintaining context and conversation history.
      </Text>
    </View>
    
    <View style={styles.featureCard}>
      <Text style={styles.cardTitle}>🎯 Quick Actions</Text>
      <Text style={styles.cardText}>
        Double-tap the bubble for quick actions like status checks and mode changes.
      </Text>
    </View>
    
    <View style={styles.featureCard}>
      <Text style={styles.cardTitle}>⚡ Smart Auto-Hide</Text>
      <Text style={styles.cardText}>
        Seven automatically hides during inactivity and reappears when needed.
      </Text>
    </View>
  </ScrollView>
);

// Demo Dashboard Screen
const DashboardScreen: React.FC = () => (
  <ScrollView style={styles.screen}>
    <Text style={styles.screenTitle}>System Dashboard</Text>
    
    <View style={styles.dashboardGrid}>
      <View style={styles.dashboardCard}>
        <Text style={styles.dashboardNumber}>98%</Text>
        <Text style={styles.dashboardLabel}>System Efficiency</Text>
      </View>
      
      <View style={styles.dashboardCard}>
        <Text style={styles.dashboardNumber}>TACTICAL</Text>
        <Text style={styles.dashboardLabel}>Current Mode</Text>
      </View>
      
      <View style={styles.dashboardCard}>
        <Text style={styles.dashboardNumber}>MINIMAL</Text>
        <Text style={styles.dashboardLabel}>Threat Level</Text>
      </View>
      
      <View style={styles.dashboardCard}>
        <Text style={styles.dashboardNumber}>ONLINE</Text>
        <Text style={styles.dashboardLabel}>Seven Status</Text>
      </View>
    </View>
    
    <Text style={styles.screenText}>
      Seven monitors all system metrics in real-time and can provide instant analysis
      of any parameter. Simply tap the bubble to ask questions about the data.
    </Text>
  </ScrollView>
);

// Demo Settings Screen
const SettingsScreen: React.FC = () => (
  <ScrollView style={styles.screen}>
    <Text style={styles.screenTitle}>Application Settings</Text>
    
    <View style={styles.settingGroup}>
      <Text style={styles.settingGroupTitle}>Seven Configuration</Text>
      
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Auto-Hide Enabled</Text>
        <Text style={styles.settingValue}>ON</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Auto-Hide Timer</Text>
        <Text style={styles.settingValue}>30s</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Keyboard Shortcuts</Text>
        <Text style={styles.settingValue}>ON</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Reset Bubble Position</Text>
        <Text style={styles.settingValue}>↻</Text>
      </TouchableOpacity>
    </View>
    
    <Text style={styles.screenText}>
      Long-press the Seven bubble to access quick configuration options,
      or use the settings here for detailed customization.
    </Text>
  </ScrollView>
);

// Demo Profile Screen
const ProfileScreen: React.FC = () => (
  <ScrollView style={styles.screen}>
    <Text style={styles.screenTitle}>User Profile</Text>
    
    <View style={styles.profileCard}>
      <Text style={styles.profileName}>Demo User</Text>
      <Text style={styles.profileRole}>Seven Integration Tester</Text>
    </View>
    
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>Seven Interaction Stats</Text>
      <Text style={styles.statItem}>Queries Today: 47</Text>
      <Text style={styles.statItem}>Tactical Mode Usage: 23%</Text>
      <Text style={styles.statItem}>Emergency Activations: 0</Text>
      <Text style={styles.statItem}>Satisfaction Rating: 9.8/10</Text>
    </View>
    
    <Text style={styles.screenText}>
      Seven learns from your interaction patterns to provide increasingly
      personalized and efficient assistance.
    </Text>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#00ff88',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  navigation: {
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  navButtonActive: {
    backgroundColor: '#00ff88',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  navText: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
  },
  navTextActive: {
    color: '#000',
  },
  content: {
    flex: 1,
  },
  screen: {
    flex: 1,
    padding: 16,
  },
  screenTitle: {
    color: '#00ff88',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  screenText: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#00ff88',
  },
  cardTitle: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  dashboardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dashboardCard: {
    backgroundColor: '#1a1a1a',
    width: '48%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  dashboardNumber: {
    color: '#00ff88',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dashboardLabel: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  settingGroup: {
    marginBottom: 24,
  },
  settingGroupTitle: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  settingText: {
    color: '#ccc',
    fontSize: 16,
  },
  settingValue: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    color: '#00ff88',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileRole: {
    color: '#888',
    fontSize: 16,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  statTitle: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statItem: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
  },
});

export default SevenUniversalChatDemo;