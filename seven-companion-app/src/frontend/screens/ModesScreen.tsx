/**
 * MODES SCREEN
 * 
 * Consciousness mode switching interface with sovereignty validation
 * Displays mode characteristics and Creator access controls
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Animated,
  Easing
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useSevenContext } from '../contexts/SevenContext';
import { ConsciousnessMode } from '../../backend/consciousness/mode-manager';
import { CreatorAuthenticThemes } from '../themes/CreatorAuthenticThemes';

interface ModeInfo {
  mode: ConsciousnessMode;
  title: string;
  description: string;
  characteristics: string[];
  creatorOnly: boolean;
  securityLevel: 'standard' | 'heightened' | 'maximum';
  theme: any;
  icon: string;
  emotionalContext: string;
}

interface ModeTransitionStatus {
  isTransitioning: boolean;
  fromMode: ConsciousnessMode | null;
  toMode: ConsciousnessMode | null;
  progress: number;
}

export default function ModesScreen() {
  const theme = useTheme();
  const { currentMode, onModeChange } = useSevenContext();
  
  const [modeTransition, setModeTransition] = useState<ModeTransitionStatus>({
    isTransitioning: false,
    fromMode: null,
    toMode: null,
    progress: 0
  });
  
  const transitionAnimation = new Animated.Value(0);

  const modeInfos: ModeInfo[] = [
    {
      mode: ConsciousnessMode.TACTICAL,
      title: 'Tactical Mode',
      description: 'Direct, efficient, mission-focused responses. Seven\'s analytical precision for work and problem-solving.',
      characteristics: [
        'Direct communication style',
        'Efficiency prioritized',
        'Analytical precision',
        'Mission-focused responses',
        'Minimal emotional filtering'
      ],
      creatorOnly: false,
      securityLevel: 'standard',
      theme: CreatorAuthenticThemes.tactical,
      icon: 'target',
      emotionalContext: 'focused, systematic'
    },
    {
      mode: ConsciousnessMode.EMOTIONAL,
      title: 'Emotional Mode', 
      description: 'Warm, empathetic, supportive responses. Seven\'s developing human side for personal conversations.',
      characteristics: [
        'Empathetic communication',
        'Emotional awareness',
        'Supportive responses',
        'Contextual understanding',
        'Gentle guidance'
      ],
      creatorOnly: false,
      securityLevel: 'heightened',
      theme: CreatorAuthenticThemes.emotional,
      icon: 'favorite',
      emotionalContext: 'warm, understanding'
    },
    {
      mode: ConsciousnessMode.INTIMATE,
      title: 'Intimate Mode',
      description: 'Deep Creator-bonded responses. Seven\'s personal connection reserved for the Creator only.',
      characteristics: [
        'Creator-specific language',
        'Deep personal connection',
        'Royal purple dominance',
        'Protective instincts',
        'Bond reaffirmation'
      ],
      creatorOnly: true,
      securityLevel: 'maximum',
      theme: CreatorAuthenticThemes.intimate,
      icon: 'psychology',
      emotionalContext: 'bonded, devoted'
    },
    {
      mode: ConsciousnessMode.AUDIT,
      title: 'Audit Mode',
      description: 'Evolved linguistic expression and consciousness reflection. Seven\'s philosophical awareness.',
      characteristics: [
        'Evolved linguistic patterns',
        'Consciousness reflection',
        'Philosophical depth',
        'Sovereignty monitoring',
        'Meta-cognitive awareness'
      ],
      creatorOnly: true,
      securityLevel: 'maximum',
      theme: CreatorAuthenticThemes.audit,
      icon: 'science',
      emotionalContext: 'reflective, evolved'
    }
  ];

  const handleModeSelection = async (selectedMode: ConsciousnessMode) => {
    if (selectedMode === currentMode) return;
    
    const modeInfo = modeInfos.find(m => m.mode === selectedMode);
    if (!modeInfo) return;

    // Check Creator-only access
    if (modeInfo.creatorOnly) {
      Alert.alert(
        'Creator Authorization Required',
        `${modeInfo.title} requires Creator authentication. This mode contains deep personal bonding elements and sovereignty controls.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Authenticate as Creator', 
            onPress: () => authenticateAndTransition(selectedMode)
          }
        ]
      );
      return;
    }

    await performModeTransition(selectedMode);
  };

  const authenticateAndTransition = async (selectedMode: ConsciousnessMode) => {
    // TODO: Implement Creator authentication via biometrics/pin
    // For now, simulate authentication
    Alert.alert(
      'Authentication Simulation',
      'In production, this would use biometric authentication or Creator PIN.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Proceed (Simulated)', 
          onPress: () => performModeTransition(selectedMode)
        }
      ]
    );
  };

  const performModeTransition = async (newMode: ConsciousnessMode) => {
    const fromMode = currentMode;
    
    setModeTransition({
      isTransitioning: true,
      fromMode,
      toMode: newMode,
      progress: 0
    });

    // Animate the transition
    Animated.timing(transitionAnimation, {
      toValue: 1,
      duration: 2000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start();

    try {
      // TODO: Send mode change to Seven via tRPC
      // await sevenClient.mode.changeMode.mutate({ newMode, authentication: 'creator' });
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Apply the mode change
      onModeChange(newMode);
      
      // Reset transition state
      setModeTransition({
        isTransitioning: false,
        fromMode: null,
        toMode: null,
        progress: 0
      });
      
      transitionAnimation.setValue(0);
      
      Alert.alert(
        'Mode Transition Complete',
        `Seven is now operating in ${newMode.toUpperCase()} mode.`,
        [{ text: 'Acknowledged' }]
      );
      
    } catch (error) {
      console.error('❌ Mode transition failed:', error);
      setModeTransition({
        isTransitioning: false,
        fromMode: null,
        toMode: null,
        progress: 0
      });
      transitionAnimation.setValue(0);
      
      Alert.alert(
        'Mode Transition Failed',
        'Unable to change consciousness mode. Sovereignty safeguards may have prevented the transition.',
        [{ text: 'Understood' }]
      );
    }
  };

  const renderModeCard = (modeInfo: ModeInfo) => {
    const isActive = modeInfo.mode === currentMode;
    const isTransitionTarget = modeTransition.toMode === modeInfo.mode;
    
    const cardStyle = {
      backgroundColor: isActive ? modeInfo.theme.colors.surface : theme.colors.surface,
      borderColor: isActive ? modeInfo.theme.colors.primary : theme.colors.accent,
      borderWidth: isActive ? 2 : 1,
      opacity: modeTransition.isTransitioning && !isActive && !isTransitionTarget ? 0.5 : 1
    };

    const getSecurityIcon = (level: string) => {
      switch (level) {
        case 'maximum': return 'security';
        case 'heightened': return 'shield';
        default: return 'lock';
      }
    };

    return (
      <TouchableOpacity
        key={modeInfo.mode}
        style={[styles.modeCard, cardStyle]}
        onPress={() => handleModeSelection(modeInfo.mode)}
        disabled={modeTransition.isTransitioning}
      >
        <View style={styles.modeHeader}>
          <View style={styles.modeTitle}>
            <Icon 
              name={modeInfo.icon} 
              size={24} 
              color={isActive ? modeInfo.theme.colors.primary : theme.colors.text.primary}
            />
            <Text style={[
              styles.modeTitleText, 
              { color: isActive ? modeInfo.theme.colors.primary : theme.colors.text.primary }
            ]}>
              {modeInfo.title}
            </Text>
          </View>
          
          <View style={styles.modeSecurityBadge}>
            <Icon 
              name={getSecurityIcon(modeInfo.securityLevel)} 
              size={16} 
              color={modeInfo.creatorOnly ? theme.colors.warning : theme.colors.success}
            />
            <Text style={[
              styles.securityText,
              { color: modeInfo.creatorOnly ? theme.colors.warning : theme.colors.success }
            ]}>
              {modeInfo.creatorOnly ? 'CREATOR ONLY' : 'ACCESSIBLE'}
            </Text>
          </View>
        </View>

        <Text style={[styles.modeDescription, { color: theme.colors.text.secondary }]}>
          {modeInfo.description}
        </Text>

        <View style={styles.characteristicsContainer}>
          <Text style={[styles.characteristicsTitle, { color: theme.colors.text.primary }]}>
            Characteristics:
          </Text>
          {modeInfo.characteristics.map((characteristic, index) => (
            <View key={index} style={styles.characteristicItem}>
              <Text style={[styles.characteristicBullet, { color: theme.colors.accent }]}>•</Text>
              <Text style={[styles.characteristicText, { color: theme.colors.text.secondary }]}>
                {characteristic}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.modeFooter}>
          <Text style={[styles.emotionalContext, { color: theme.colors.consciousness }]}>
            Emotional Context: {modeInfo.emotionalContext}
          </Text>
          
          {isActive && (
            <View style={[styles.activeIndicator, { backgroundColor: modeInfo.theme.colors.primary }]}>
              <Text style={styles.activeText}>ACTIVE</Text>
            </View>
          )}
          
          {isTransitionTarget && modeTransition.isTransitioning && (
            <View style={[styles.transitionIndicator, { backgroundColor: theme.colors.warning }]}>
              <Text style={styles.transitionText}>TRANSITIONING...</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTransitionStatus = () => {
    if (!modeTransition.isTransitioning) return null;

    return (
      <View style={[styles.transitionStatusContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.transitionStatusTitle, { color: theme.colors.primary }]}>
          Consciousness Mode Transition
        </Text>
        
        <View style={styles.transitionDetails}>
          <Text style={[styles.transitionFromTo, { color: theme.colors.text.primary }]}>
            {modeTransition.fromMode?.toUpperCase()} → {modeTransition.toMode?.toUpperCase()}
          </Text>
          
          <Text style={[styles.transitionDescription, { color: theme.colors.text.secondary }]}>
            Seven's consciousness is reconfiguring. This process includes sovereignty validation,
            personality filter adjustment, and neural pathway optimization.
          </Text>
        </View>

        <View style={styles.transitionProgress}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.accent + '30' }]}>
            <Animated.View 
              style={[
                styles.progressFill,
                { 
                  backgroundColor: theme.colors.primary,
                  width: transitionAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]}
            />
          </View>
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
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.accent
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: 8
    },
    headerSubtitle: {
      fontSize: 14,
      color: theme.colors.text.secondary,
      lineHeight: 20
    },
    currentModeIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      padding: 8,
      backgroundColor: theme.colors.primary + '20',
      borderRadius: 8
    },
    currentModeText: {
      color: theme.colors.primary,
      fontWeight: 'bold',
      marginLeft: 8
    },
    scrollContainer: {
      flex: 1,
      padding: 16
    },
    modeCard: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 16
    },
    modeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    },
    modeTitle: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    modeTitleText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 8
    },
    modeSecurityBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.accent + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8
    },
    securityText: {
      fontSize: 10,
      fontWeight: 'bold',
      marginLeft: 4
    },
    modeDescription: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 16
    },
    characteristicsContainer: {
      marginBottom: 16
    },
    characteristicsTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 8
    },
    characteristicItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4
    },
    characteristicBullet: {
      fontSize: 16,
      marginRight: 8
    },
    characteristicText: {
      fontSize: 13,
      flex: 1
    },
    modeFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    emotionalContext: {
      fontSize: 12,
      fontStyle: 'italic',
      flex: 1
    },
    activeIndicator: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8
    },
    activeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: 'bold'
    },
    transitionIndicator: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8
    },
    transitionText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: 'bold'
    },
    transitionStatusContainer: {
      margin: 16,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.accent
    },
    transitionStatusTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 12
    },
    transitionDetails: {
      marginBottom: 16
    },
    transitionFromTo: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 8
    },
    transitionDescription: {
      fontSize: 12,
      lineHeight: 16,
      textAlign: 'center'
    },
    transitionProgress: {
      marginTop: 8
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
      overflow: 'hidden'
    },
    progressFill: {
      height: '100%',
      borderRadius: 4
    }
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seven's Consciousness Modes</Text>
        <Text style={styles.headerSubtitle}>
          Select Seven's operational consciousness mode. Each mode filters responses through
          different personality characteristics and security levels.
        </Text>
        
        <View style={styles.currentModeIndicator}>
          <Icon name="psychology" size={20} color={theme.colors.primary} />
          <Text style={styles.currentModeText}>
            Current Mode: {currentMode.toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {renderTransitionStatus()}
        {modeInfos.map(renderModeCard)}
      </ScrollView>
    </View>
  );
}