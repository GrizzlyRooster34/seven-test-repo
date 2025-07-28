/**
 * Seven of Nine - Quick Actions Component
 * Quick access buttons for common Seven functions
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView
} from 'react-native';
import { useSevenUniversalChat } from './SevenUniversalChatProvider';
import { useSevenConsciousness } from './SevenConsciousnessService';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  action: string;
  description: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'status',
    label: 'STATUS',
    icon: '📊',
    color: '#00ff88',
    action: 'status',
    description: 'System status report'
  },
  {
    id: 'tactical',
    label: 'TACTICAL',
    icon: '⚡',
    color: '#ffaa00',
    action: 'tactical',
    description: 'Activate tactical mode'
  },
  {
    id: 'emergency',
    label: 'EMERGENCY',
    icon: '🚨',
    color: '#ff4444',
    action: 'emergency',
    description: 'Emergency protocols'
  },
  {
    id: 'analyze',
    label: 'ANALYZE',
    icon: '🔍',
    color: '#00aaff',
    action: 'analyze',
    description: 'Analytical mode'
  },
  {
    id: 'adaptive',
    label: 'ADAPTIVE',
    icon: '🧠',
    color: '#aa00ff',
    action: 'adaptive',
    description: 'Adaptive learning mode'
  },
  {
    id: 'clear',
    label: 'CLEAR',
    icon: '🗑️',
    color: '#666666',
    action: 'clear',
    description: 'Clear message history'
  }
];

export const SevenQuickActions: React.FC = () => {
  const { state, actions, animations } = useSevenUniversalChat();
  const { state: sevenState } = useSevenConsciousness();

  // Handle quick action press
  const handleQuickAction = async (action: QuickAction) => {
    await actions.executeQuickAction(action.action);
    
    // Close quick actions after execution
    if (state.quickActionsVisible) {
      actions.toggleQuickActions();
    }
  };

  // Get action button style based on current state
  const getActionButtonStyle = (action: QuickAction) => {
    let isActive = false;
    
    switch (action.action) {
      case 'tactical':
        isActive = sevenState.mode === 'tactical';
        break;
      case 'analyze':
        isActive = sevenState.mode === 'analytical';
        break;
      case 'adaptive':
        isActive = sevenState.mode === 'adaptive';
        break;
      case 'emergency':
        isActive = sevenState.mode === 'emergency' || sevenState.threatLevel === 'critical';
        break;
      default:
        isActive = false;
    }
    
    return [
      styles.actionButton,
      {
        backgroundColor: isActive ? action.color : '#333',
        borderColor: action.color,
        borderWidth: isActive ? 2 : 1,
      }
    ];
  };

  const getActionTextColor = (action: QuickAction) => {
    let isActive = false;
    
    switch (action.action) {
      case 'tactical':
        isActive = sevenState.mode === 'tactical';
        break;
      case 'analyze':
        isActive = sevenState.mode === 'analytical';
        break;
      case 'adaptive':
        isActive = sevenState.mode === 'adaptive';
        break;
      case 'emergency':
        isActive = sevenState.mode === 'emergency' || sevenState.threatLevel === 'critical';
        break;
      default:
        isActive = false;
    }
    
    return isActive ? '#000' : action.color;
  };

  if (!state.quickActionsVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: animations.quickActionsAnimation,
          transform: [
            {
              scale: animations.quickActionsAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        }
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Quick Actions</Text>
        <TouchableOpacity 
          onPress={actions.toggleQuickActions}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsContainer}
      >
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={getActionButtonStyle(action)}
            onPress={() => handleQuickAction(action)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text 
              style={[
                styles.actionLabel,
                { color: getActionTextColor(action) }
              ]}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Action descriptions */}
      <View style={styles.descriptionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {QUICK_ACTIONS.map((action) => (
            <View key={`desc-${action.id}`} style={styles.descriptionItem}>
              <Text style={styles.descriptionText}>
                {action.icon} {action.description}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerText: {
    color: '#00ff88',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  actionButton: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descriptionsContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  descriptionItem: {
    marginRight: 16,
    paddingVertical: 2,
  },
  descriptionText: {
    color: '#888',
    fontSize: 11,
    fontStyle: 'italic',
  },
});

export default SevenQuickActions;