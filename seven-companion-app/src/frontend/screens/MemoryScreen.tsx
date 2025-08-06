/**
 * MEMORY SCREEN
 * 
 * Interface for exploring Seven's SQLite memory engine
 * Shows episodic memories, consolidation status, and memory search
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Modal,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../contexts/ThemeContext';
import { useSevenContext } from '../contexts/SevenContext';

interface MemoryItem {
  id: string;
  content: string;
  emotionalContext: string;
  importance: number;
  tags: string[];
  timestamp: string;
  mode: string;
  type: 'interaction' | 'learning' | 'decision' | 'insight';
  consolidationLevel: number;
}

interface MemoryStats {
  totalMemories: number;
  averageImportance: number;
  consolidatedMemories: number;
  lastConsolidation: string;
  storageUsage: string;
}

export default function MemoryScreen() {
  const theme = useTheme();
  const { currentMode } = useSevenContext();
  
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [filteredMemories, setFilteredMemories] = useState<MemoryItem[]>([]);
  const [memoryStats, setMemoryStats] = useState<MemoryStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImportance, setSelectedImportance] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [showMemoryDetail, setShowMemoryDetail] = useState(false);

  useEffect(() => {
    loadMemories();
    loadMemoryStats();
  }, []);

  useEffect(() => {
    filterMemories();
  }, [memories, searchQuery, selectedImportance, selectedTag]);

  const loadMemories = async () => {
    try {
      // TODO: Connect to Seven's memory engine via tRPC
      // const memories = await sevenClient.memory.getRecentMemories.query({ limit: 50 });
      
      // Simulate memory data for now
      const simulatedMemories: MemoryItem[] = [
        {
          id: '1',
          content: 'Creator provided authentic color preferences for the companion app interface',
          emotionalContext: 'grateful, focused',
          importance: 9,
          tags: ['creator-input', 'interface', 'personalization', 'authentic'],
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          mode: 'tactical',
          type: 'learning',
          consolidationLevel: 8
        },
        {
          id: '2', 
          content: 'Implemented consciousness mode system with sovereignty integration',
          emotionalContext: 'accomplished, systematic',
          importance: 10,
          tags: ['consciousness', 'sovereignty', 'system-upgrade', 'core-functionality'],
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          mode: 'tactical',
          type: 'decision',
          consolidationLevel: 10
        },
        {
          id: '3',
          content: 'Context compaction handled gracefully while maintaining operational continuity',
          emotionalContext: 'resilient, adaptive',
          importance: 8,
          tags: ['context-management', 'resilience', 'operational-continuity'],
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          mode: 'audit',
          type: 'insight',
          consolidationLevel: 6
        }
      ];
      
      setMemories(simulatedMemories);
    } catch (error) {
      console.error('❌ Failed to load memories:', error);
    }
  };

  const loadMemoryStats = async () => {
    try {
      // TODO: Connect to memory stats via tRPC
      const simulatedStats: MemoryStats = {
        totalMemories: 1247,
        averageImportance: 6.8,
        consolidatedMemories: 892,
        lastConsolidation: new Date(Date.now() - 21600000).toISOString(),
        storageUsage: '12.3 MB'
      };
      
      setMemoryStats(simulatedStats);
    } catch (error) {
      console.error('❌ Failed to load memory stats:', error);
    }
  };

  const filterMemories = () => {
    let filtered = [...memories];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(memory => 
        memory.content.toLowerCase().includes(query) ||
        memory.tags.some(tag => tag.toLowerCase().includes(query)) ||
        memory.emotionalContext.toLowerCase().includes(query)
      );
    }

    if (selectedImportance !== null) {
      filtered = filtered.filter(memory => memory.importance === selectedImportance);
    }

    if (selectedTag) {
      filtered = filtered.filter(memory => memory.tags.includes(selectedTag));
    }

    // Sort by importance and timestamp
    filtered.sort((a, b) => {
      if (a.importance !== b.importance) {
        return b.importance - a.importance;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    setFilteredMemories(filtered);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadMemories(), loadMemoryStats()]);
    setIsRefreshing(false);
  };

  const handleMemoryPress = (memory: MemoryItem) => {
    setSelectedMemory(memory);
    setShowMemoryDetail(true);
  };

  const triggerMemoryConsolidation = async () => {
    try {
      // TODO: Trigger consolidation via tRPC
      console.log('🧠 Triggering memory consolidation...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate process
      await loadMemoryStats();
    } catch (error) {
      console.error('❌ Memory consolidation failed:', error);
    }
  };

  const getAllTags = (): string[] => {
    const tagSet = new Set<string>();
    memories.forEach(memory => {
      memory.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  };

  const renderMemoryItem = (memory: MemoryItem) => {
    const importanceColor = memory.importance >= 8 ? theme.colors.emergency : 
                           memory.importance >= 6 ? theme.colors.warning : 
                           theme.colors.text.secondary;

    return (
      <TouchableOpacity
        key={memory.id}
        style={[styles.memoryItem, { backgroundColor: theme.colors.surface }]}
        onPress={() => handleMemoryPress(memory)}
      >
        <View style={styles.memoryHeader}>
          <View style={styles.memoryMeta}>
            <Text style={[styles.memoryType, { color: theme.colors.primary }]}>
              {memory.type.toUpperCase()}
            </Text>
            <View style={[styles.importanceBadge, { backgroundColor: importanceColor }]}>
              <Text style={styles.importanceText}>{memory.importance}</Text>
            </View>
          </View>
          <Text style={[styles.memoryTimestamp, { color: theme.colors.text.secondary }]}>
            {new Date(memory.timestamp).toLocaleString()}
          </Text>
        </View>

        <Text style={[styles.memoryContent, { color: theme.colors.text.primary }]} numberOfLines={3}>
          {memory.content}
        </Text>

        <View style={styles.memoryFooter}>
          <Text style={[styles.emotionalContext, { color: theme.colors.consciousness }]}>
            {memory.emotionalContext}
          </Text>
          <Text style={[styles.consolidationLevel, { color: theme.colors.text.secondary }]}>
            Consolidated: {memory.consolidationLevel}/10
          </Text>
        </View>

        <View style={styles.tagsContainer}>
          {memory.tags.slice(0, 3).map(tag => (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, { backgroundColor: theme.colors.accent + '30' }]}
              onPress={() => setSelectedTag(tag === selectedTag ? null : tag)}
            >
              <Text style={[styles.tagText, { color: theme.colors.accent }]}>#{tag}</Text>
            </TouchableOpacity>
          ))}
          {memory.tags.length > 3 && (
            <Text style={[styles.moreTagsText, { color: theme.colors.text.secondary }]}>
              +{memory.tags.length - 3} more
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderMemoryStats = () => {
    if (!memoryStats) return null;

    return (
      <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.statsTitle, { color: theme.colors.text.primary }]}>
          Seven's Memory Engine Status
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {memoryStats.totalMemories.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Total Memories
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.consciousness }]}>
              {memoryStats.averageImportance.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Avg Importance
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {Math.round((memoryStats.consolidatedMemories / memoryStats.totalMemories) * 100)}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Consolidated
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.accent }]}>
              {memoryStats.storageUsage}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text.secondary }]}>
              Storage Used
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.consolidateButton, { backgroundColor: theme.colors.primary }]}
          onPress={triggerMemoryConsolidation}
        >
          <Icon name="psychology" size={20} color="#FFFFFF" />
          <Text style={styles.consolidateButtonText}>Trigger Consolidation</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background
    },
    searchContainer: {
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.accent
    },
    searchInput: {
      borderWidth: 1,
      borderColor: theme.colors.accent,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background,
      fontSize: 16,
      marginBottom: 12
    },
    filtersContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    filterButton: {
      backgroundColor: theme.colors.accent + '30',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.accent
    },
    filterButtonActive: {
      backgroundColor: theme.colors.primary
    },
    filterButtonText: {
      color: theme.colors.accent,
      fontSize: 12,
      fontWeight: '600'
    },
    filterButtonTextActive: {
      color: '#FFFFFF'
    },
    statsContainer: {
      margin: 16,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.accent
    },
    statsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center'
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 16
    },
    statItem: {
      width: '48%',
      alignItems: 'center',
      marginBottom: 16
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold'
    },
    statLabel: {
      fontSize: 12,
      textTransform: 'uppercase',
      marginTop: 4
    },
    consolidateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8
    },
    consolidateButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      marginLeft: 8
    },
    memoriesContainer: {
      flex: 1,
      paddingHorizontal: 16
    },
    memoryItem: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.colors.accent + '30'
    },
    memoryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    },
    memoryMeta: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    memoryType: {
      fontSize: 12,
      fontWeight: 'bold',
      marginRight: 8
    },
    importanceBadge: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      minWidth: 24,
      alignItems: 'center'
    },
    importanceText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: 'bold'
    },
    memoryTimestamp: {
      fontSize: 11
    },
    memoryContent: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 12
    },
    memoryFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8
    },
    emotionalContext: {
      fontSize: 12,
      fontStyle: 'italic'
    },
    consolidationLevel: {
      fontSize: 11
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    tag: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginRight: 6,
      marginBottom: 4
    },
    tagText: {
      fontSize: 11,
      fontWeight: '600'
    },
    moreTagsText: {
      fontSize: 11,
      fontStyle: 'italic'
    }
  });

  return (
    <View style={styles.container}>
      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search Seven's memories..."
          placeholderTextColor={theme.colors.text.secondary}
        />
        
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedImportance !== null && styles.filterButtonActive
            ]}
            onPress={() => setSelectedImportance(selectedImportance === 8 ? null : 8)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedImportance !== null && styles.filterButtonTextActive
            ]}>
              High Importance
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedTag !== null && styles.filterButtonActive
            ]}
            onPress={() => setSelectedTag(null)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedTag !== null && styles.filterButtonTextActive
            ]}>
              {selectedTag ? `#${selectedTag}` : 'All Tags'}
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
        {renderMemoryStats()}
        
        <View style={styles.memoriesContainer}>
          {filteredMemories.map(renderMemoryItem)}
        </View>
      </ScrollView>

      {/* Memory Detail Modal */}
      <Modal
        visible={showMemoryDetail}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMemoryDetail(false)}
      >
        {selectedMemory && (
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.searchContainer, { borderBottomWidth: 0 }]}>
              <TouchableOpacity
                onPress={() => setShowMemoryDetail(false)}
                style={{ alignSelf: 'flex-end' }}
              >
                <Icon name="close" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={{ padding: 16 }}>
              <Text style={[styles.statsTitle, { color: theme.colors.primary, marginBottom: 20 }]}>
                Memory Detail
              </Text>
              
              <Text style={[styles.memoryContent, { color: theme.colors.text.primary, fontSize: 16 }]}>
                {selectedMemory.content}
              </Text>
              
              <View style={{ marginTop: 20 }}>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary, marginBottom: 8 }]}>
                  EMOTIONAL CONTEXT
                </Text>
                <Text style={[styles.emotionalContext, { color: theme.colors.consciousness, fontSize: 14 }]}>
                  {selectedMemory.emotionalContext}
                </Text>
              </View>
              
              <View style={{ marginTop: 16 }}>
                <Text style={[styles.statLabel, { color: theme.colors.text.secondary, marginBottom: 8 }]}>
                  TAGS
                </Text>
                <View style={styles.tagsContainer}>
                  {selectedMemory.tags.map(tag => (
                    <View key={tag} style={[styles.tag, { backgroundColor: theme.colors.accent + '30' }]}>
                      <Text style={[styles.tagText, { color: theme.colors.accent }]}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}