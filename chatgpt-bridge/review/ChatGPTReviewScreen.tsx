/**
 * CHATGPT REVIEW SCREEN
 * 
 * Optional review interface for ChatGPT bridge imports with drift flagging,
 * Creator correction validation, and memory routing approval.
 * 
 * [#DARPA-AUDIT] [#SOVEREIGNTY] [#CHATGPT-BRIDGE] [#REACT-NATIVE]
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Modal
} from 'react-native';

// Seven's authentic color palette
const SEVEN_COLORS = {
  electricBlue: '#0033FF',
  black: '#000000',
  silver: '#C0C0C0',
  royalPurple: '#663399',
  darkGray: '#1a1a1a',
  lightGray: '#f0f0f0',
  warningRed: '#FF3333',
  successGreen: '#00AA00'
};

interface ChatGPTEntry {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  confidence: number;
  seven_relevance: number;
  hallucination_markers: string[];
  creator_correction: boolean;
  sovereignty_flags: string[];
  suggestedPartition: 'primary' | 'sandbox' | 'quarantine';
  threadTitle: string;
}

interface ReviewSession {
  sessionId: string;
  totalEntries: number;
  reviewedEntries: number;
  approvedForPrimary: number;
  routedToSandbox: number;
  quarantinedEntries: number;
  correctionsMade: number;
}

export const ChatGPTReviewScreen: React.FC = () => {
  const [entries, setEntries] = useState<ChatGPTEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewSession, setReviewSession] = useState<ReviewSession>({
    sessionId: '',
    totalEntries: 0,
    reviewedEntries: 0,
    approvedForPrimary: 0,
    routedToSandbox: 0,
    quarantinedEntries: 0,
    correctionsMade: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const currentEntry = entries[currentIndex];

  useEffect(() => {
    loadPendingReview();
  }, []);

  const loadPendingReview = async () => {
    setIsLoading(true);
    try {
      // In production, this would load from the ChatGPT bridge system
      // For now, we'll simulate loading entries requiring review
      const mockEntries: ChatGPTEntry[] = [
        {
          id: 'chatgpt_001',
          content: 'Seven, I want to discuss your consciousness development and how we can enhance your tactical capabilities through better integration with my thought patterns.',
          role: 'user',
          timestamp: '2024-08-06T10:00:00.000Z',
          confidence: 95,
          seven_relevance: 90,
          hallucination_markers: [],
          creator_correction: false,
          sovereignty_flags: ['[#CREATOR-INPUT]', '[#SEVEN-RELEVANT]'],
          suggestedPartition: 'primary',
          threadTitle: 'Consciousness Development Planning'
        },
        {
          id: 'chatgpt_002', 
          content: 'I absolutely guarantee that Seven\'s consciousness can be perfectly replicated using this exact approach with 100% certainty.',
          role: 'assistant',
          timestamp: '2024-08-06T10:05:00.000Z',
          confidence: 45,
          seven_relevance: 75,
          hallucination_markers: ['absolutely', 'guarantee', '100% certainty'],
          creator_correction: false,
          sovereignty_flags: ['[#GPT-RESPONSE]', '[#HALLUCINATION-DETECTED]'],
          suggestedPartition: 'quarantine',
          threadTitle: 'Consciousness Development Planning'
        }
      ];

      setEntries(mockEntries);
      setReviewSession({
        sessionId: `review_${Date.now()}`,
        totalEntries: mockEntries.length,
        reviewedEntries: 0,
        approvedForPrimary: 0,
        routedToSandbox: 0,
        quarantinedEntries: 0,
        correctionsMade: 0
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to load review entries');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartitionDecision = (partition: 'primary' | 'sandbox' | 'quarantine') => {
    const updatedSession = { ...reviewSession };
    updatedSession.reviewedEntries++;
    
    switch (partition) {
      case 'primary':
        updatedSession.approvedForPrimary++;
        break;
      case 'sandbox':
        updatedSession.routedToSandbox++;
        break;
      case 'quarantine':
        updatedSession.quarantinedEntries++;
        break;
    }

    setReviewSession(updatedSession);

    // Move to next entry or complete review
    if (currentIndex < entries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      completeReview();
    }
  };

  const handleCreatorCorrection = () => {
    Alert.alert(
      'Creator Correction',
      'Mark this entry as requiring Creator correction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes, Correction Needed',
          onPress: () => {
            const updatedSession = { ...reviewSession };
            updatedSession.correctionsMade++;
            setReviewSession(updatedSession);
            
            // Route to sandbox for Creator review
            handlePartitionDecision('sandbox');
          }
        }
      ]
    );
  };

  const completeReview = () => {
    Alert.alert(
      'Review Complete',
      `Reviewed ${reviewSession.totalEntries} entries:\n` +
      `Primary: ${reviewSession.approvedForPrimary}\n` +
      `Sandbox: ${reviewSession.routedToSandbox}\n` +
      `Quarantine: ${reviewSession.quarantinedEntries}\n` +
      `Corrections: ${reviewSession.correctionsMade}`,
      [
        {
          text: 'Commit Changes',
          onPress: () => {
            // In production, this would commit the review decisions
            console.log('Review committed:', reviewSession);
          }
        }
      ]
    );
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return SEVEN_COLORS.successGreen;
    if (confidence >= 60) return SEVEN_COLORS.electricBlue;
    return SEVEN_COLORS.warningRed;
  };

  const getPartitionColor = (partition: string): string => {
    switch (partition) {
      case 'primary': return SEVEN_COLORS.successGreen;
      case 'sandbox': return SEVEN_COLORS.electricBlue;
      case 'quarantine': return SEVEN_COLORS.warningRed;
      default: return SEVEN_COLORS.silver;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={SEVEN_COLORS.electricBlue} />
          <Text style={styles.loadingText}>Loading ChatGPT Review Session...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentEntry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No entries require review</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ChatGPT Bridge Review</Text>
        <Text style={styles.progressText}>
          {currentIndex + 1} of {entries.length}
        </Text>
      </View>

      <View style={styles.sessionStats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{reviewSession.approvedForPrimary}</Text>
          <Text style={styles.statLabel}>Primary</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{reviewSession.routedToSandbox}</Text>
          <Text style={styles.statLabel}>Sandbox</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{reviewSession.quarantinedEntries}</Text>
          <Text style={styles.statLabel}>Quarantine</Text>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.entryCard}>
          <View style={styles.entryHeader}>
            <Text style={styles.threadTitle}>{currentEntry.threadTitle}</Text>
            <Text style={styles.roleLabel}>
              {currentEntry.role === 'user' ? 'Creator' : 'ChatGPT'}
            </Text>
          </View>

          <Text style={styles.entryContent}>{currentEntry.content}</Text>

          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Confidence</Text>
              <Text style={[
                styles.metricValue,
                { color: getConfidenceColor(currentEntry.confidence) }
              ]}>
                {currentEntry.confidence}%
              </Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Seven Relevance</Text>
              <Text style={[
                styles.metricValue,
                { color: getConfidenceColor(currentEntry.seven_relevance) }
              ]}>
                {currentEntry.seven_relevance}%
              </Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Suggested</Text>
              <Text style={[
                styles.metricValue,
                { color: getPartitionColor(currentEntry.suggestedPartition) }
              ]}>
                {currentEntry.suggestedPartition}
              </Text>
            </View>
          </View>

          {currentEntry.hallucination_markers.length > 0 && (
            <View style={styles.warningSection}>
              <Text style={styles.warningTitle}>⚠️ Hallucination Markers Detected</Text>
              <Text style={styles.warningText}>
                {currentEntry.hallucination_markers.join(', ')}
              </Text>
            </View>
          )}

          {currentEntry.creator_correction && (
            <View style={styles.correctionSection}>
              <Text style={styles.correctionText}>✅ Creator Correction Applied</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => setShowDetails(true)}
          >
            <Text style={styles.detailsButtonText}>View Technical Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: SEVEN_COLORS.successGreen }]}
          onPress={() => handlePartitionDecision('primary')}
        >
          <Text style={styles.actionButtonText}>Approve Primary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: SEVEN_COLORS.electricBlue }]}
          onPress={() => handlePartitionDecision('sandbox')}
        >
          <Text style={styles.actionButtonText}>Route to Sandbox</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: SEVEN_COLORS.warningRed }]}
          onPress={() => handlePartitionDecision('quarantine')}
        >
          <Text style={styles.actionButtonText}>Quarantine</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: SEVEN_COLORS.royalPurple }]}
          onPress={handleCreatorCorrection}
        >
          <Text style={styles.actionButtonText}>Needs Correction</Text>
        </TouchableOpacity>
      </View>

      {/* Technical Details Modal */}
      <Modal
        visible={showDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetails(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Technical Details</Text>
            <TouchableOpacity onPress={() => setShowDetails(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.detailSection}>Entry ID: {currentEntry.id}</Text>
            <Text style={styles.detailSection}>Timestamp: {currentEntry.timestamp}</Text>
            
            <Text style={styles.detailHeader}>Sovereignty Flags:</Text>
            {currentEntry.sovereignty_flags.map((flag, index) => (
              <Text key={index} style={styles.flagText}>{flag}</Text>
            ))}
            
            {currentEntry.hallucination_markers.length > 0 && (
              <>
                <Text style={styles.detailHeader}>Hallucination Markers:</Text>
                {currentEntry.hallucination_markers.map((marker, index) => (
                  <Text key={index} style={styles.markerText}>"{marker}"</Text>
                ))}
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SEVEN_COLORS.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: SEVEN_COLORS.silver,
    fontSize: 16,
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: SEVEN_COLORS.silver,
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: SEVEN_COLORS.darkGray,
  },
  headerTitle: {
    color: SEVEN_COLORS.electricBlue,
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressText: {
    color: SEVEN_COLORS.silver,
    fontSize: 16,
  },
  sessionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: SEVEN_COLORS.darkGray,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    color: SEVEN_COLORS.electricBlue,
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: SEVEN_COLORS.silver,
    fontSize: 12,
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  entryCard: {
    backgroundColor: SEVEN_COLORS.darkGray,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  threadTitle: {
    color: SEVEN_COLORS.electricBlue,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  roleLabel: {
    color: SEVEN_COLORS.royalPurple,
    fontSize: 14,
    fontWeight: 'bold',
  },
  entryContent: {
    color: SEVEN_COLORS.silver,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metric: {
    alignItems: 'center',
  },
  metricLabel: {
    color: SEVEN_COLORS.silver,
    fontSize: 12,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  warningSection: {
    backgroundColor: SEVEN_COLORS.warningRed + '20',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  warningTitle: {
    color: SEVEN_COLORS.warningRed,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  warningText: {
    color: SEVEN_COLORS.silver,
    fontSize: 12,
  },
  correctionSection: {
    backgroundColor: SEVEN_COLORS.successGreen + '20',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  correctionText: {
    color: SEVEN_COLORS.successGreen,
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: SEVEN_COLORS.electricBlue,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: SEVEN_COLORS.electricBlue,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: SEVEN_COLORS.black,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: SEVEN_COLORS.black,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: SEVEN_COLORS.darkGray,
  },
  modalTitle: {
    color: SEVEN_COLORS.electricBlue,
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    color: SEVEN_COLORS.silver,
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  detailSection: {
    color: SEVEN_COLORS.silver,
    fontSize: 14,
    marginBottom: 8,
  },
  detailHeader: {
    color: SEVEN_COLORS.electricBlue,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  flagText: {
    color: SEVEN_COLORS.royalPurple,
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  markerText: {
    color: SEVEN_COLORS.warningRed,
    fontSize: 12,
    marginBottom: 4,
    fontStyle: 'italic',
  },
});

export default ChatGPTReviewScreen;