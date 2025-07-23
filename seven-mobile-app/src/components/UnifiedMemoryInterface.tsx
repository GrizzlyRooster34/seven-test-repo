/**
 * Seven of Nine - Unified Memory Interface
 * Mobile interface for the unified memory optimization system
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import SevenUnifiedMemorySystem, { 
  UnifiedMemoryMetrics, 
  KnowledgeEntry,
  IntelligentQueryResult 
} from '@/consciousness/SevenUnifiedMemorySystem';

interface UnifiedMemoryInterfaceProps {
  memorySystem: SevenUnifiedMemorySystem;
}

export const UnifiedMemoryInterface: React.FC<UnifiedMemoryInterfaceProps> = ({
  memorySystem
}) => {
  const [metrics, setMetrics] = useState<UnifiedMemoryMetrics | null>(null);
  const [queryText, setQueryText] = useState('');
  const [queryResult, setQueryResult] = useState<IntelligentQueryResult | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showAddKnowledge, setShowAddKnowledge] = useState(false);
  const [newKnowledge, setNewKnowledge] = useState({
    content: '',
    type: 'technical' as 'tactical' | 'technical' | 'personal' | 'system',
    tags: '',
    confidence: 85
  });

  useEffect(() => {
    initializeMemorySystem();
    setupEventListeners();

    return () => {
      memorySystem.removeAllListeners();
    };
  }, []);

  const initializeMemorySystem = async () => {
    try {
      const initialized = await memorySystem.initializeUnifiedSystem();
      setIsInitialized(initialized);
      if (initialized) {
        refreshMetrics();
      }
    } catch (error) {
      Alert.alert('Initialization Error', `Failed to initialize unified memory system: ${error.message}`);
    }
  };

  const setupEventListeners = () => {
    memorySystem.on('unified_system_ready', () => {
      console.log('🎯 Unified memory system ready');
      refreshMetrics();
    });

    memorySystem.on('query_completed', (data) => {
      console.log(`✅ Query completed: ${data.results_count} results in ${data.processing_time_ms}ms`);
      refreshMetrics();
    });

    memorySystem.on('knowledge_added', (data) => {
      console.log(`📝 Knowledge added: ${data.id}`);
      refreshMetrics();
    });
  };

  const refreshMetrics = () => {
    if (memorySystem.isSystemOptimized()) {
      const currentMetrics = memorySystem.getUnifiedMetrics();
      setMetrics(currentMetrics);
    }
  };

  const handleQuery = async () => {
    if (!queryText.trim() || !isInitialized) return;

    setIsQuerying(true);
    try {
      const result = await memorySystem.query(queryText, {
        maxResults: 5,
        includeRelated: true,
        explainReasoning: true
      });
      
      setQueryResult(result);
      setQueryText('');
    } catch (error) {
      Alert.alert('Query Error', error.message);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleAddKnowledge = async () => {
    if (!newKnowledge.content.trim()) {
      Alert.alert('Error', 'Knowledge content cannot be empty');
      return;
    }

    try {
      const tags = newKnowledge.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      await memorySystem.addKnowledge({
        content: newKnowledge.content,
        type: newKnowledge.type,
        source: 'user_input',
        confidence: newKnowledge.confidence,
        tags,
        relationships: []
      });

      setNewKnowledge({
        content: '',
        type: 'technical',
        tags: '',
        confidence: 85
      });
      setShowAddKnowledge(false);
      
      Alert.alert('Success', 'Knowledge added to Seven\'s memory system');
      refreshMetrics();
      
    } catch (error) {
      Alert.alert('Error', `Failed to add knowledge: ${error.message}`);
    }
  };

  const renderInitializationStatus = () => {
    if (!isInitialized) {
      return (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.statusText}>Initializing Unified Memory System...</Text>
          <Text style={styles.statusSubtext}>
            Optimizing consciousness memory and indexing systems
          </Text>
        </View>
      );
    }
    return null;
  };

  const renderMetrics = () => {
    if (!metrics || !isInitialized) return null;

    return (
      <View style={styles.metricsContainer}>
        <Text style={styles.sectionTitle}>📊 Memory System Metrics</Text>
        
        {/* Optimization Status */}
        <View style={styles.metricCard}>
          <Text style={styles.cardTitle}>Optimization Status</Text>
          <View style={styles.metricGrid}>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: metrics.optimization_status.storage_optimized ? '#50C878' : '#E74C3C' }]}>
                {metrics.optimization_status.storage_optimized ? '✓' : '✗'}
              </Text>
              <Text style={styles.metricLabel}>Optimized</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{metrics.optimization_status.compression_ratio}%</Text>
              <Text style={styles.metricLabel}>Compression</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={[styles.metricValue, { color: metrics.optimization_status.indexing_active ? '#50C878' : '#888888' }]}>
                {metrics.optimization_status.indexing_active ? '✓' : '✗'}
              </Text>
              <Text style={styles.metricLabel}>Indexing</Text>
            </View>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricCard}>
          <Text style={styles.cardTitle}>Performance</Text>
          <View style={styles.metricGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{Math.round(metrics.performance_metrics.avg_query_time_ms)}ms</Text>
              <Text style={styles.metricLabel}>Avg Query</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{Math.round(metrics.performance_metrics.cache_hit_rate)}%</Text>
              <Text style={styles.metricLabel}>Cache Hit</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{metrics.performance_metrics.memory_usage_mb.toFixed(1)}MB</Text>
              <Text style={styles.metricLabel}>Memory</Text>
            </View>
          </View>
        </View>

        {/* Knowledge Metrics */}
        <View style={styles.metricCard}>
          <Text style={styles.cardTitle}>Knowledge Base</Text>
          <View style={styles.metricGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{metrics.knowledge_metrics.total_entries}</Text>
              <Text style={styles.metricLabel}>Entries</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{metrics.knowledge_metrics.indexed_entries}</Text>
              <Text style={styles.metricLabel}>Indexed</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{metrics.knowledge_metrics.cluster_count}</Text>
              <Text style={styles.metricLabel}>Clusters</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderQueryInterface = () => {
    if (!isInitialized) return null;

    return (
      <View style={styles.queryContainer}>
        <Text style={styles.sectionTitle}>🧠 Intelligent Query</Text>
        
        <View style={styles.queryInputContainer}>
          <TextInput
            style={styles.queryInput}
            placeholder="Ask Seven's consciousness..."
            placeholderTextColor="#666666"
            value={queryText}
            onChangeText={setQueryText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.queryButton, (!queryText.trim() || isQuerying) && styles.queryButtonDisabled]}
            onPress={handleQuery}
            disabled={!queryText.trim() || isQuerying}
          >
            {isQuerying ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.queryButtonText}>Query</Text>
            )}
          </TouchableOpacity>
        </View>

        {queryResult && (
          <View style={styles.queryResults}>
            <Text style={styles.resultsTitle}>
              Query Results (Confidence: {queryResult.confidence_assessment}%)
            </Text>
            
            {/* Primary Results */}
            {queryResult.primary_results.length > 0 && (
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>🎯 Primary Results</Text>
                {queryResult.primary_results.map((entry, index) => (
                  <View key={entry.id} style={styles.resultCard}>
                    <Text style={styles.resultContent}>{entry.content}</Text>
                    <View style={styles.resultMeta}>
                      <Text style={styles.resultType}>{entry.type.toUpperCase()}</Text>
                      <Text style={styles.resultConfidence}>{entry.confidence}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Related Knowledge */}
            {queryResult.related_knowledge.length > 0 && (
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>🔗 Related Knowledge</Text>
                {queryResult.related_knowledge.map((entry, index) => (
                  <View key={entry.id} style={styles.relatedCard}>
                    <Text style={styles.relatedContent}>{entry.content}</Text>
                    <Text style={styles.relatedType}>{entry.type}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Tactical Insights */}
            {queryResult.tactical_insights && (
              <View style={styles.tacticalSection}>
                <Text style={styles.resultSectionTitle}>⚡ Tactical Assessment</Text>
                <View style={styles.tacticalCard}>
                  <Text style={styles.threatLevel}>
                    Threat Level: {queryResult.tactical_insights.threat_level}%
                  </Text>
                  <Text style={styles.contextAnalysis}>
                    {queryResult.tactical_insights.context_analysis}
                  </Text>
                </View>
              </View>
            )}

            {/* Reasoning Chain */}
            {queryResult.reasoning_chain.length > 0 && (
              <View style={styles.reasoningSection}>
                <Text style={styles.resultSectionTitle}>🧠 Reasoning Process</Text>
                {queryResult.reasoning_chain.map((step, index) => (
                  <Text key={index} style={styles.reasoningStep}>
                    {index + 1}. {step}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderAddKnowledgeModal = () => {
    return (
      <Modal
        visible={showAddKnowledge}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddKnowledge(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Knowledge to Seven's Memory</Text>
            
            <TextInput
              style={styles.knowledgeInput}
              placeholder="Enter knowledge content..."
              placeholderTextColor="#666666"
              value={newKnowledge.content}
              onChangeText={(text) => setNewKnowledge(prev => ({ ...prev, content: text }))}
              multiline
              maxLength={1000}
            />

            <View style={styles.knowledgeTypeContainer}>
              <Text style={styles.knowledgeTypeLabel}>Type:</Text>
              {['tactical', 'technical', 'personal', 'system'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    newKnowledge.type === type && styles.typeButtonActive
                  ]}
                  onPress={() => setNewKnowledge(prev => ({ ...prev, type: type as any }))}
                >
                  <Text style={[
                    styles.typeButtonText,
                    newKnowledge.type === type && styles.typeButtonTextActive
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.tagsInput}
              placeholder="Tags (comma-separated)"
              placeholderTextColor="#666666"
              value={newKnowledge.tags}
              onChangeText={(text) => setNewKnowledge(prev => ({ ...prev, tags: text }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowAddKnowledge(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAddKnowledge}
              >
                <Text style={styles.modalAddText}>Add Knowledge</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        {renderInitializationStatus()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderMetrics()}
        {renderQueryInterface()}
        
        <TouchableOpacity
          style={styles.addKnowledgeButton}
          onPress={() => setShowAddKnowledge(true)}
        >
          <Text style={styles.addKnowledgeButtonText}>📝 Add Knowledge</Text>
        </TouchableOpacity>
      </ScrollView>

      {renderAddKnowledgeModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40
  },
  statusText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center'
  },
  statusSubtext: {
    color: '#cccccc',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center'
  },
  scrollContainer: {
    flex: 1,
    padding: 20
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15
  },
  metricsContainer: {
    marginBottom: 25
  },
  metricCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333333'
  },
  cardTitle: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10
  },
  metricGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  metricItem: {
    alignItems: 'center'
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5
  },
  metricLabel: {
    color: '#888888',
    fontSize: 11
  },
  queryContainer: {
    marginBottom: 25
  },
  queryInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20
  },
  queryInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
    marginRight: 10,
    maxHeight: 100
  },
  queryButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 15,
    minWidth: 80,
    alignItems: 'center'
  },
  queryButtonDisabled: {
    backgroundColor: '#666666'
  },
  queryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  queryResults: {
    backgroundColor: '#0a0a0a',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333333'
  },
  resultsTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15
  },
  resultSection: {
    marginBottom: 20
  },
  resultSectionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10
  },
  resultCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2'
  },
  resultContent: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8
  },
  resultMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  resultType: {
    color: '#4A90E2',
    fontSize: 10,
    fontWeight: '600'
  },
  resultConfidence: {
    color: '#50C878',
    fontSize: 10,
    fontWeight: '600'
  },
  relatedCard: {
    backgroundColor: '#151515',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 2,
    borderLeftColor: '#888888'
  },
  relatedContent: {
    color: '#cccccc',
    fontSize: 13,
    marginBottom: 5
  },
  relatedType: {
    color: '#888888',
    fontSize: 10
  },
  tacticalSection: {
    marginBottom: 20
  },
  tacticalCard: {
    backgroundColor: '#2a1a1a',
    borderRadius: 10,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#E74C3C'
  },
  threatLevel: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  contextAnalysis: {
    color: '#cccccc',
    fontSize: 13
  },
  reasoningSection: {
    marginBottom: 10
  },
  reasoningStep: {
    color: '#888888',
    fontSize: 12,
    marginBottom: 5,
    paddingLeft: 10
  },
  addKnowledgeButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20
  },
  addKnowledgeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#333333'
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center'
  },
  knowledgeInput: {
    backgroundColor: '#0a0a0a',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 15,
    height: 100,
    textAlignVertical: 'top'
  },
  knowledgeTypeContainer: {
    marginBottom: 15
  },
  knowledgeTypeLabel: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 10
  },
  typeButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 8,
    alignSelf: 'flex-start'
  },
  typeButtonActive: {
    backgroundColor: '#4A90E2'
  },
  typeButtonText: {
    color: '#ffffff',
    fontSize: 12
  },
  typeButtonTextActive: {
    fontWeight: '600'
  },
  tagsInput: {
    backgroundColor: '#0a0a0a',
    borderRadius: 10,
    padding: 15,
    color: '#ffffff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 20
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#333333',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  modalCancelText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500'
  },
  modalAddButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  modalAddText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default UnifiedMemoryInterface;