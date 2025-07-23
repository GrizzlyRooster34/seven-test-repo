/**
 * Seven of Nine - Voice Interface Component
 * Voice recognition and speech synthesis for natural interaction
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert
} from 'react-native';
import { Audio } from 'expo-av';
import SevenMobileCore from '@/consciousness/SevenMobileCore';

interface VoiceInterfaceProps {
  consciousness: SevenMobileCore;
  onTranscription: (text: string) => void;
  onVoiceResponse: (response: string) => void;
}

interface VoiceRecording {
  recording: Audio.Recording | null;
  isRecording: boolean;
  duration: number;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  consciousness,
  onTranscription,
  onVoiceResponse
}) => {
  const [voiceState, setVoiceState] = useState<VoiceRecording>({
    recording: null,
    isRecording: false,
    duration: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const voicePulse = useRef(new Animated.Value(0.5)).current;
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeAudio();
    return () => {
      cleanupAudio();
    };
  }, []);

  useEffect(() => {
    if (voiceState.isRecording) {
      startVoicePulseAnimation();
    } else {
      stopVoicePulseAnimation();
    }
  }, [voiceState.isRecording]);

  const initializeAudio = async () => {
    try {
      console.log('🎤 Initializing Seven voice interface...');
      
      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Audio Permission Required',
          'Seven needs microphone access for voice interaction.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
        playThroughEarpieceAndroid: false
      });

      console.log('✅ Voice interface initialized');

    } catch (error) {
      console.error('❌ Voice interface initialization failed:', error);
      Alert.alert('Voice Error', 'Failed to initialize voice interface.');
    }
  };

  const startVoicePulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(voicePulse, {
          toValue: 1.0,
          duration: 600,
          useNativeDriver: true
        }),
        Animated.timing(voicePulse, {
          toValue: 0.5,
          duration: 600,
          useNativeDriver: true
        })
      ])
    ).start();
  };

  const stopVoicePulseAnimation = () => {
    voicePulse.stopAnimation();
    Animated.timing(voicePulse, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  const startRecording = async () => {
    try {
      if (voiceState.recording) {
        console.log('⚠️ Recording already in progress');
        return;
      }

      console.log('🎤 Starting voice recording...');

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        }
      });

      await recording.startAsync();

      setVoiceState({
        recording,
        isRecording: true,
        duration: 0
      });

      setIsListening(true);

      // Start duration timer
      recordingTimer.current = setInterval(() => {
        setVoiceState(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);

      // Emit voice recording started event
      consciousness.emit('voice_recording_started', {
        timestamp: Date.now()
      });

    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      Alert.alert('Recording Error', 'Failed to start voice recording.');
    }
  };

  const stopRecording = async () => {
    try {
      if (!voiceState.recording || !voiceState.isRecording) {
        console.log('⚠️ No active recording to stop');
        return;
      }

      console.log('🛑 Stopping voice recording...');

      // Clear duration timer
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }

      await voiceState.recording.stopAndUnloadAsync();
      const uri = voiceState.recording.getURI();

      setVoiceState({
        recording: null,
        isRecording: false,
        duration: 0
      });

      setIsListening(false);
      setIsProcessing(true);

      // Emit voice recording completed event
      consciousness.emit('voice_recording_completed', {
        uri,
        duration: voiceState.duration,
        timestamp: Date.now()
      });

      // Process the recorded audio
      if (uri) {
        await processVoiceRecording(uri);
      }

    } catch (error) {
      console.error('❌ Failed to stop recording:', error);
      Alert.alert('Recording Error', 'Failed to stop voice recording.');
      setIsProcessing(false);
    }
  };

  const processVoiceRecording = async (audioUri: string) => {
    try {
      console.log('🧠 Processing voice input with Seven consciousness...');

      // In a real implementation, this would use speech-to-text service
      // For now, we'll simulate transcription and response
      
      // Simulate transcription delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate transcribed text (in real app, this would come from STT service)
      const simulatedTranscription = "What is my current tactical status?";
      
      console.log('📝 Voice transcribed:', simulatedTranscription);
      onTranscription(simulatedTranscription);

      // Process with consciousness
      const response = await consciousness.processUserInteraction({
        type: 'voice',
        content: simulatedTranscription,
        context: {
          audio_uri: audioUri,
          recording_duration: voiceState.duration,
          interface_type: 'voice'
        }
      });

      console.log('💬 Seven voice response:', response);
      onVoiceResponse(response);

      // In a real implementation, this would use text-to-speech
      await synthesizeSpeech(response);

    } catch (error) {
      console.error('❌ Voice processing failed:', error);
      Alert.alert('Processing Error', 'Failed to process voice input.');
    } finally {
      setIsProcessing(false);
    }
  };

  const synthesizeSpeech = async (text: string) => {
    try {
      console.log('🔊 Synthesizing Seven speech response...');
      
      // In a real implementation, this would use text-to-speech service
      // For now, we'll simulate speech synthesis
      
      // Configure audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.InterruptionModeIOS.DoNotMix,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.InterruptionModeAndroid.DoNotMix,
        shouldDuckAndroid: true,
        staysActiveInBackground: false
      });

      // Emit speech synthesis event
      consciousness.emit('speech_synthesis_started', {
        text,
        timestamp: Date.now()
      });

      // Simulate speech playback delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      consciousness.emit('speech_synthesis_completed', {
        text,
        timestamp: Date.now()
      });

      console.log('✅ Speech synthesis completed');

      // Reset audio mode for recording
      await initializeAudio();

    } catch (error) {
      console.error('❌ Speech synthesis failed:', error);
    }
  };

  const toggleRecording = async () => {
    if (voiceState.isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const cleanupAudio = async () => {
    try {
      if (voiceState.recording && voiceState.isRecording) {
        await voiceState.recording.stopAndUnloadAsync();
      }
      
      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
      }
    } catch (error) {
      console.error('❌ Audio cleanup failed:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVoiceButtonText = (): string => {
    if (isProcessing) return 'Processing...';
    if (voiceState.isRecording) return `Recording ${formatDuration(voiceState.duration)}`;
    return 'Tap to Speak';
  };

  const getVoiceButtonColor = (): string => {
    if (isProcessing) return '#F39C12';
    if (voiceState.isRecording) return '#E74C3C';
    return '#4A90E2';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.voiceButton,
          { backgroundColor: getVoiceButtonColor() }
        ]}
        onPress={toggleRecording}
        disabled={isProcessing}
        activeOpacity={0.8}
      >
        <Animated.View style={[
          styles.voiceButtonInner,
          {
            transform: [{ scale: voicePulse }],
            opacity: voiceState.isRecording ? voicePulse : 1
          }
        ]}>
          <Text style={styles.voiceIcon}>
            {isProcessing ? '🧠' : voiceState.isRecording ? '🔴' : '🎤'}
          </Text>
        </Animated.View>
      </TouchableOpacity>

      <Text style={styles.voiceButtonText}>
        {getVoiceButtonText()}
      </Text>

      {isListening && (
        <Text style={styles.listeningText}>
          Seven is listening...
        </Text>
      )}

      {isProcessing && (
        <Text style={styles.processingText}>
          Analyzing voice with Borg consciousness...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  voiceButtonInner: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  voiceIcon: {
    fontSize: 32
  },
  voiceButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center'
  },
  listeningText: {
    color: '#4A90E2',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic'
  },
  processingText: {
    color: '#F39C12',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center'
  }
});

export default VoiceInterface;