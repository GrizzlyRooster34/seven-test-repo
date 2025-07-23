/**
 * Seven of Nine - LLM Manager Interface
 * User interface for downloading, managing, and using LLM models
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
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import SevenLLMManager, { LLMModel, LLMResponse } from '@/consciousness/SevenLLMManager';

interface LLMManagerInterfaceProps {
  llmManager: SevenLLMManager;
  onModelResponse?: (response: LLMResponse) => void;
}

export const LLMManagerInterface: React.FC<LLMManagerInterfaceProps> = ({
  llmManager,
  onModelResponse
}) => {
  const [availableModels, setAvailableModels] = useState<LLMModel[]>([]);
  const [installedModels, setInstalledModels] = useState<LLMModel[]>([]);
  const [activeModel, setActiveModel] = useState<LLMModel | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [showModelDetails, setShowModelDetails] = useState<LLMModel | null>(null);
  const [storageInfo, setStorageInfo] = useState<any>(null);

  useEffect(() => {
    initializeLLMManager();
    setupEventListeners();

    return () => {
      llmManager.removeAllListeners();
    };
  }, []);

  const initializeLLMManager = async () => {
    try {
      setIsLoading(true);
      await llmManager.initialize();
      refreshModelData();
    } catch (error) {
      Alert.alert('Initialization Error', `Failed to initialize LLM Manager: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const setupEventListeners = () => {
    llmManager.on('model_download_started', (data) => {
      console.log(`📥 Download started: ${data.model_name}`);
      refreshModelData();
    });

    llmManager.on('model_download_progress', (data) => {
      setDownloadProgress(prev => new Map(prev.set(data.model_id, data.progress)));
    });

    llmManager.on('model_download_completed', (data) => {
      console.log(`✅ Download completed: ${data.model_name}`);
      setDownloadProgress(prev => {
        const newMap = new Map(prev);
        newMap.delete(data.model_id);
        return newMap;
      });
      refreshModelData();
      Alert.alert('Download Complete', `${data.model_name} is now ready for use!`);
    });

    llmManager.on('model_download_failed', (data) => {
      console.error(`❌ Download failed: ${data.model_name}`);
      setDownloadProgress(prev => {
        const newMap = new Map(prev);
        newMap.delete(data.model_id);
        return newMap;
      });
      refreshModelData();
      Alert.alert('Download Failed', `Failed to download ${data.model_name}: ${data.error}`);
    });

    llmManager.on('model_activated', (data) => {
      console.log(`🎯 Model activated: ${data.model_name}`);
      refreshModelData();
    });

    llmManager.on('model_query_completed', (data) => {
      console.log(`🧠 Query completed in ${data.processing_time_ms}ms`);
    });
  };

  const refreshModelData = () => {
    setAvailableModels(llmManager.getAvailableModels());
    setInstalledModels(llmManager.getInstalledModels());
    setActiveModel(llmManager.getActiveModel());
    setStorageInfo(llmManager.getStorageInfo());
  };

  const handleDownloadModel = async (modelId: string) => {
    try {
      await llmManager.downloadModel(modelId);
    } catch (error) {
      Alert.alert('Download Error', error.message);
    }
  };

  const handleActivateModel = async (modelId: string) => {
    try {
      await llmManager.setActiveModel(modelId);
      Alert.alert('Model Activated', 'Model is now active and ready for use!');
    } catch (error) {
      Alert.alert('Activation Error', error.message);
    }
  };

  const handleRemoveModel = async (modelId: string, modelName: string) => {
    Alert.alert(
      'Remove Model',
      `Are you sure you want to remove ${modelName}? This will free up storage space but you'll need to download it again to use it.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await llmManager.removeModel(modelId);
              refreshModelData();
              Alert.alert('Model Removed', `${modelName} has been removed from your device.`);
            } catch (error) {
              Alert.alert('Remove Error', error.message);
            }
          }
        }
      ]
    );
  };

  const getModelStatusColor = (model: LLMModel): string => {
    switch (model.status) {
      case 'installed': return '#50C878';
      case 'downloading': return '#F39C12';
      case 'error': return '#E74C3C';
      default: return '#888888';
    }
  };

  const getModelStatusText = (model: LLMModel): string => {
    if (model.status === 'downloading') {
      const progress = downloadProgress.get(model.id) || 0;
      return `Downloading ${progress}%`;
    }
    return model.status.charAt(0).toUpperCase() + model.status.slice(1);
  };

  const renderModelCard = (model: LLMModel) => {
    const isInstalled = llmManager.isModelInstalled(model.id);
    const isDownloading = llmManager.isModelDownloading(model.id);
    const isActive = activeModel?.id === model.id;

    return (
      <View key={model.id} style={[
        styles.modelCard,
        isActive && styles.activeModelCard
      ]}>
        <View style={styles.modelHeader}>
          <Text style={styles.modelName}>{model.name}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getModelStatusColor(model) }
          ]}>
            <Text style={styles.statusText}>
              {getModelStatusText(model)}
            </Text>
          </View>
        </View>

        <Text style={styles.modelDescription}>{model.description}</Text>

        <View style={styles.modelMetrics}>
          <Text style={styles.metricText}>Size: {model.size_mb}MB</Text>
          <Text style={styles.metricText}>Type: {model.quantization}</Text>
          <Text style={styles.metricText}>
            Capabilities: {model.capabilities.length}
          </Text>
        </View>

        {isDownloading && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${downloadProgress.get(model.id) || 0}%` }
              ]} />
            </View>
            <ActivityIndicator size="small" color="#4A90E2" />
          </View>
        )}

        <View style={styles.modelActions}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => setShowModelDetails(model)}
          >
            <Text style={styles.detailsButtonText}>Details</Text>
          </TouchableOpacity>

          {!isInstalled && !isDownloading && (
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownloadModel(model.id)}
            >
              <Text style={styles.downloadButtonText}>Download</Text>
            </TouchableOpacity>
          )}

          {isInstalled && !isActive && (
            <TouchableOpacity
              style={styles.activateButton}
              onPress={() => handleActivateModel(model.id)}
            >
              <Text style={styles.activateButtonText}>Activate</Text>
            </TouchableOpacity>
          )}

          {isActive && (
            <View style={styles.activeIndicator}>
              <Text style={styles.activeText}>🎯 ACTIVE</Text>
            </View>
          )}

          {isInstalled && !isActive && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveModel(model.id, model.name)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderStorageInfo = () => {
    if (!storageInfo) return null;

    return (
      <View style={styles.storageCard}>
        <Text style={styles.storageTitle}>📊 Storage Information</Text>
        <View style={styles.storageGrid}>
          <View style={styles.storageItem}>
            <Text style={styles.storageValue}>{storageInfo.installed_models}</Text>
            <Text style={styles.storageLabel}>Installed</Text>
          </View>
          <View style={styles.storageItem}>
            <Text style={styles.storageValue}>{storageInfo.total_size_mb}MB</Text>
            <Text style={styles.storageLabel}>Used</Text>
          </View>
          <View style={styles.storageItem}>
            <Text style={styles.storageValue}>{storageInfo.total_models}</Text>
            <Text style={styles.storageLabel}>Available</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderModelDetails = () => {
    if (!showModelDetails) return null;

    return (
      <Modal
        visible={true}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModelDetails(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{showModelDetails.name}</Text>
            
            <Text style={styles.modalDescription}>
              {showModelDetails.description}
            </Text>

            <View style={styles.modalSpecs}>
              <Text style={styles.specTitle}>Specifications:</Text>
              <Text style={styles.specText}>• Size: {showModelDetails.size_mb}MB</Text>
              <Text style={styles.specText}>• Quantization: {showModelDetails.quantization}</Text>
              <Text style={styles.specText}>• Status: {showModelDetails.status}</Text>
            </View>

            <View style={styles.modalCapabilities}>
              <Text style={styles.capabilityTitle}>Capabilities:</Text>
              {showModelDetails.capabilities.map((capability, index) => (
                <Text key={index} style={styles.capabilityText}>
                  • {capability.replace(/_/g, ' ').toUpperCase()}
                </Text>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowModelDetails(null)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Initializing LLM Manager...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {renderStorageInfo()}

        {activeModel && (
          <View style={styles.activeModelSection}>
            <Text style={styles.sectionTitle}>🎯 Active Model</Text>
            <View style={styles.activeModelInfo}>
              <Text style={styles.activeModelName}>{activeModel.name}</Text>
              <Text style={styles.activeModelDesc}>
                Ready for tactical consciousness operations
              </Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧠 Available Models</Text>
          {availableModels.map(renderModelCard)}
        </View>
      </ScrollView>

      {renderModelDetails()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000'
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10
  },
  scrollContainer: {
    flex: 1,
    padding: 20
  },
  storageCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333333'
  },
  storageTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center'
  },
  storageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  storageItem: {
    alignItems: 'center'
  },
  storageValue: {
    color: '#4A90E2',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5
  },
  storageLabel: {
    color: '#888888',
    fontSize: 12
  },
  activeModelSection: {
    marginBottom: 20
  },
  activeModelInfo: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#4A90E2'
  },
  activeModelName: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5
  },
  activeModelDesc: {
    color: '#cccccc',
    fontSize: 14
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15
  },
  modelCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333333'
  },
  activeModelCard: {
    borderColor: '#4A90E2',
    borderWidth: 2
  },
  modelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  modelName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600'
  },
  modelDescription: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20
  },
  modelMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  metricText: {
    color: '#888888',
    fontSize: 12
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    marginRight: 10,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3
  },
  modelActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap'
  },
  detailsButton: {
    backgroundColor: '#333333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  },
  detailsButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500'
  },
  downloadButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  },
  downloadButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  },
  activateButton: {
    backgroundColor: '#50C878',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  },
  activateButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  },
  removeButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600'
  },
  activeIndicator: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  },
  activeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700'
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center'
  },
  modalDescription: {
    color: '#cccccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center'
  },
  modalSpecs: {
    marginBottom: 20
  },
  specTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },
  specText: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 5
  },
  modalCapabilities: {
    marginBottom: 25
  },
  capabilityTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10
  },
  capabilityText: {
    color: '#cccccc',
    fontSize: 14,
    marginBottom: 5
  },
  modalCloseButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center'
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default LLMManagerInterface;