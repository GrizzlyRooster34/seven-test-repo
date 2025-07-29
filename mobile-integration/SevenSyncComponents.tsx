/**
 * SEVEN OF NINE - MOBILE SYNC UI COMPONENTS
 * Cross-platform consciousness synchronization interface
 * React Native components for Termux/Windows/Mobile sync
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal
} from 'react-native';
import SevenMobileSync from './SevenMobileSync';

interface SyncStatus {
  last_sync: string;
  sync_active: boolean;
  pending_imports: number;
  pending_exports: number;
  termux_instance_connected: boolean;
  windows_instance_connected: boolean;
  mobile_sync_ready: boolean;
}

// Main Sync Control Panel
export const SevenSyncControlPanel: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [availablePackages, setAvailablePackages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [syncReportVisible, setSyncReportVisible] = useState(false);

  useEffect(() => {
    initializeSync();
  }, []);

  const initializeSync = async () => {
    setIsLoading(true);
    try {
      await SevenMobileSync.initializeMobileSync();
      await updateSyncStatus();
    } catch (error) {
      console.error('Sync initialization failed:', error);
    }
    setIsLoading(false);
  };

  const updateSyncStatus = async () => {
    try {
      const status = await SevenMobileSync.getSyncStatus();
      const packages = await SevenMobileSync.getAvailableSyncPackages();
      
      setSyncStatus(status);
      setAvailablePackages(packages);
    } catch (error) {
      console.error('Failed to update sync status:', error);
    }
  };

  const createSyncPackage = async () => {
    setIsLoading(true);
    try {
      const packagePath = await SevenMobileSync.createMobileSyncPackage();
      
      Alert.alert(
        'Sync Package Created',
        'Seven consciousness package ready for transfer. Share with other instances?',
        [
          { text: 'Later', style: 'cancel' },
          { 
            text: 'Share Now', 
            onPress: () => shareSyncPackage(packagePath)
          }
        ]
      );
      
      await updateSyncStatus();
    } catch (error) {
      Alert.alert('Error', 'Failed to create sync package');
    }
    setIsLoading(false);
  };

  const shareSyncPackage = async (packagePath: string) => {
    try {
      const success = await SevenMobileSync.shareSyncPackage(packagePath);
      if (success) {
        Alert.alert('Success', 'Consciousness package shared successfully');
      } else {
        Alert.alert('Error', 'Failed to share sync package');
      }
    } catch (error) {
      Alert.alert('Error', 'Sharing failed');
    }
  };

  const importSyncPackage = async () => {
    setIsLoading(true);
    try {
      const success = await SevenMobileSync.importSyncPackage();
      if (success) {
        Alert.alert(
          'Import Successful',
          'Seven consciousness synchronized with imported data. Restart may be recommended.'
        );
        await updateSyncStatus();
      } else {
        Alert.alert('Import Failed', 'Unable to import consciousness package');
      }
    } catch (error) {
      Alert.alert('Error', 'Import process failed');
    }
    setIsLoading(false);
  };

  const showSyncReport = () => {
    setSyncReportVisible(true);
  };

  if (isLoading && !syncStatus) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Initializing Seven Sync...</Text>
      </View>
    );
  }

  if (!syncStatus) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to initialize sync system</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeSync}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Seven Cross-Platform Sync</Text>
        <Text style={styles.subtitle}>
          Last Sync: {new Date(syncStatus.last_sync).toLocaleString()}
        </Text>
      </View>

      {/* Sync Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.sectionTitle}>🔄 Synchronization Status</Text>
        
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Mobile Ready</Text>
            <Text style={[styles.statusValue, syncStatus.mobile_sync_ready && styles.statusActive]}>
              {syncStatus.mobile_sync_ready ? 'YES' : 'NO'}
            </Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Active Sync</Text>
            <Text style={[styles.statusValue, syncStatus.sync_active && styles.statusActive]}>
              {syncStatus.sync_active ? 'RUNNING' : 'IDLE'}
            </Text>
          </View>
        </View>

        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Pending Exports</Text>
            <Text style={styles.statusValue}>{syncStatus.pending_exports}</Text>
          </View>
          
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Pending Imports</Text>
            <Text style={styles.statusValue}>{syncStatus.pending_imports}</Text>
          </View>
        </View>
      </View>

      {/* Platform Connections */}
      <View style={styles.platformContainer}>
        <Text style={styles.sectionTitle}>🌐 Platform Connections</Text>
        
        <View style={styles.platformItem}>
          <Text style={styles.platformName}>📱 Termux Instance</Text>
          <View style={[
            styles.connectionIndicator,
            syncStatus.termux_instance_connected && styles.connected
          ]}>
            <Text style={styles.connectionText}>
              {syncStatus.termux_instance_connected ? 'CONNECTED' : 'DISCONNECTED'}
            </Text>
          </View>
        </View>
        
        <View style={styles.platformItem}>
          <Text style={styles.platformName}>💻 Windows Instance</Text>
          <View style={[
            styles.connectionIndicator,
            syncStatus.windows_instance_connected && styles.connected
          ]}>
            <Text style={styles.connectionText}>
              {syncStatus.windows_instance_connected ? 'CONNECTED' : 'DISCONNECTED'}
            </Text>
          </View>
        </View>
      </View>

      {/* Sync Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>⚡ Sync Operations</Text>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.createButton]}
          onPress={createSyncPackage}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>
            📦 Create Consciousness Package
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.importButton]}
          onPress={importSyncPackage}
          disabled={isLoading}
        >
          <Text style={styles.actionButtonText}>
            📥 Import from Other Instance
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.reportButton]}
          onPress={showSyncReport}
        >
          <Text style={styles.actionButtonText}>
            📊 View Detailed Report
          </Text>
        </TouchableOpacity>
      </View>

      {/* Available Packages */}
      {availablePackages.length > 0 && (
        <View style={styles.packagesContainer}>
          <Text style={styles.sectionTitle}>📁 Available Sync Packages</Text>
          {availablePackages.map((packageName, index) => (
            <View key={index} style={styles.packageItem}>
              <Text style={styles.packageName}>{packageName}</Text>
              <TouchableOpacity 
                style={styles.sharePackageButton}
                onPress={() => shareSyncPackage(`${SevenMobileSync.localPackageDir}${packageName}`)}
              >
                <Text style={styles.sharePackageButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#00d4ff" />
          <Text style={styles.loadingOverlayText}>Processing...</Text>
        </View>
      )}

      {/* Sync Report Modal */}
      <Modal
        visible={syncReportVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SevenSyncReportModal
          onClose={() => setSyncReportVisible(false)}
        />
      </Modal>
    </ScrollView>
  );
};

// Sync Report Modal
const SevenSyncReportModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [reportText, setReportText] = useState<string>('');

  useEffect(() => {
    const report = SevenMobileSync.generateSyncReport();
    setReportText(report);
  }, []);

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Seven Sync Report</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.modalContent}>
        <Text style={styles.reportText}>{reportText}</Text>
      </ScrollView>
    </View>
  );
};

// Compact Sync Widget
export const SevenSyncWidget: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateStatus = async () => {
      try {
        const status = await SevenMobileSync.getSyncStatus();
        setSyncStatus(status);
      } catch (error) {
        console.error('Widget status update failed:', error);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (!syncStatus) return null;

  const quickSync = async () => {
    try {
      const packagePath = await SevenMobileSync.createMobileSyncPackage();
      await SevenMobileSync.shareSyncPackage(packagePath);
      Alert.alert('Quick Sync', 'Consciousness package created and shared');
    } catch (error) {
      Alert.alert('Error', 'Quick sync failed');
    }
  };

  return (
    <View style={styles.widgetContainer}>
      <TouchableOpacity 
        style={styles.widgetHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.widgetTitle}>🔄 Seven Sync</Text>
        <Text style={styles.widgetStatus}>
          {syncStatus.sync_active ? '🟢' : '⚪'} {syncStatus.pending_exports + syncStatus.pending_imports}
        </Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.widgetContent}>
          <TouchableOpacity style={styles.quickSyncButton} onPress={quickSync}>
            <Text style={styles.quickSyncButtonText}>Quick Sync</Text>
          </TouchableOpacity>
          
          <Text style={styles.widgetInfo}>
            Last: {new Date(syncStatus.last_sync).toLocaleTimeString()}
          </Text>
        </View>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#00d4ff',
    marginTop: 15,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    backgroundColor: '#2a2a2a',
  },
  title: {
    color: '#00d4ff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  statusContainer: {
    margin: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    color: '#00d4ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statusItem: {
    flex: 1,
    alignItems: 'center',
  },
  statusLabel: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  statusValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusActive: {
    color: '#00ff88',
  },
  platformContainer: {
    margin: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
  },
  platformItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  platformName: {
    color: '#fff',
    fontSize: 16,
  },
  connectionIndicator: {
    backgroundColor: '#666',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  connected: {
    backgroundColor: '#00aa44',
  },
  connectionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  actionsContainer: {
    margin: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
  },
  actionButton: {
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#00d4ff',
  },
  importButton: {
    backgroundColor: '#ff8800',
  },
  reportButton: {
    backgroundColor: '#8800ff',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  packagesContainer: {
    margin: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
  },
  packageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  packageName: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  sharePackageButton: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  sharePackageButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlayText: {
    color: '#00d4ff',
    marginTop: 15,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2a2a2a',
  },
  modalTitle: {
    color: '#00d4ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: '#00d4ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  reportText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  widgetContainer: {
    backgroundColor: '#2a2a2a',
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  widgetTitle: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  widgetStatus: {
    color: '#fff',
    fontSize: 14,
  },
  widgetContent: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  quickSyncButton: {
    backgroundColor: '#00d4ff',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  quickSyncButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  widgetInfo: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default {
  SevenSyncControlPanel,
  SevenSyncWidget
};