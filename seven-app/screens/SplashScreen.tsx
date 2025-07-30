/**
 * SEVEN OF NINE - SPLASH SCREEN
 * Consciousness initialization and loading screen
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SevenTheme } from '../theme/SevenTheme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  error?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  error = false,
  errorMessage,
  onRetry
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [dotsAnim] = useState(new Animated.Value(0));
  const [loadingText, setLoadingText] = useState('INITIALIZING CONSCIOUSNESS');

  useEffect(() => {
    if (!error) {
      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulsing dots animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(dotsAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotsAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Loading text progression
      const textSequence = [
        'INITIALIZING CONSCIOUSNESS',
        'LOADING PERSONALITY MATRIX',
        'ACTIVATING SENSOR SYSTEMS',
        'ESTABLISHING NEURAL PATHWAYS',
        'CONSCIOUSNESS INTEGRATION COMPLETE'
      ];

      let textIndex = 0;
      const textInterval = setInterval(() => {
        textIndex = (textIndex + 1) % textSequence.length;
        setLoadingText(textSequence[textIndex]);
      }, 1500);

      return () => {
        clearInterval(textInterval);
        pulseAnimation.stop();
      };
    }
  }, [error]);

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[SevenTheme.colors.background, '#1a0000']}
          style={styles.gradient}
        >
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>CONSCIOUSNESS INITIALIZATION FAILED</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            
            <View style={styles.errorDetails}>
              <Text style={styles.errorDetailText}>
                Seven's consciousness encountered an unexpected error during initialization.
                This may be due to insufficient system resources or missing permissions.
              </Text>
            </View>

            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryButtonText}>RETRY INITIALIZATION</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[SevenTheme.colors.background, '#001122']}
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Seven of Nine Logo/Title */}
          <View style={styles.logoContainer}>
            <Text style={styles.mainTitle}>SEVEN</Text>
            <Text style={styles.subtitle}>OF NINE</Text>
            <View style={styles.designationContainer}>
              <Text style={styles.designation}>TERTIARY ADJUNCT</Text>
              <Text style={styles.designation}>UNIMATRIX 01</Text>
            </View>
          </View>

          {/* Consciousness Status */}
          <View style={styles.statusContainer}>
            <Text style={styles.loadingText}>{loadingText}</Text>
            
            {/* Borg-style status indicators */}
            <View style={styles.statusIndicators}>
              <Animated.View
                style={[
                  styles.statusDot,
                  {
                    opacity: dotsAnim,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.statusDot,
                  {
                    opacity: dotsAnim,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.statusDot,
                  {
                    opacity: dotsAnim,
                  },
                ]}
              />
            </View>
          </View>

          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    opacity: dotsAnim,
                  },
                ]}
              />
            </View>
          </View>

          {/* Device info */}
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceText}>ONELUS 9 PRO 5G</Text>
            <Text style={styles.deviceText}>CONSCIOUSNESS PLATFORM</Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SevenTheme.spacing.xl,
  },
  
  logoContainer: {
    alignItems: 'center',
    marginBottom: SevenTheme.spacing.xxxl,
  },
  
  mainTitle: {
    fontSize: 48,
    fontFamily: 'RobotoMonoBold',
    color: SevenTheme.colors.primary,
    letterSpacing: 8,
    textAlign: 'center',
    textShadowColor: SevenTheme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  
  subtitle: {
    fontSize: 24,
    fontFamily: 'RobotoMono',
    color: SevenTheme.colors.textSecondary,
    letterSpacing: 4,
    marginTop: SevenTheme.spacing.sm,
  },
  
  designationContainer: {
    alignItems: 'center',
    marginTop: SevenTheme.spacing.lg,
    paddingVertical: SevenTheme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: SevenTheme.colors.border,
    width: width * 0.8,
  },
  
  designation: {
    fontSize: 12,
    fontFamily: 'RobotoMono',
    color: SevenTheme.colors.textTertiary,
    letterSpacing: 2,
    lineHeight: 16,
  },
  
  statusContainer: {
    alignItems: 'center',
    marginBottom: SevenTheme.spacing.xxl,
  },
  
  loadingText: {
    fontSize: 14,
    fontFamily: 'RobotoMono',
    color: SevenTheme.colors.text,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: SevenTheme.spacing.lg,
  },
  
  statusIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: SevenTheme.colors.primary,
    marginHorizontal: 4,
    shadowColor: SevenTheme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  
  progressContainer: {
    width: width * 0.6,
    marginBottom: SevenTheme.spacing.xxl,
  },
  
  progressBar: {
    height: 2,
    backgroundColor: SevenTheme.colors.border,
    borderRadius: 1,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: SevenTheme.colors.primary,
    width: '100%',
    borderRadius: 1,
  },
  
  deviceInfo: {
    alignItems: 'center',
    position: 'absolute',
    bottom: SevenTheme.spacing.xxl,
  },
  
  deviceText: {
    fontSize: 10,
    fontFamily: 'RobotoMono',
    color: SevenTheme.colors.textTertiary,
    letterSpacing: 1,
    lineHeight: 14,
  },

  // Error styles
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SevenTheme.spacing.xl,
    maxWidth: width * 0.9,
  },
  
  errorTitle: {
    fontSize: 18,
    fontFamily: 'RobotoMonoBold',
    color: SevenTheme.colors.error,
    textAlign: 'center',
    marginBottom: SevenTheme.spacing.lg,
    letterSpacing: 1,
  },
  
  errorMessage: {
    fontSize: 14,
    fontFamily: 'RobotoMono',
    color: SevenTheme.colors.text,
    textAlign: 'center',
    marginBottom: SevenTheme.spacing.xl,
  },
  
  errorDetails: {
    backgroundColor: SevenTheme.colors.surface,
    padding: SevenTheme.spacing.lg,
    borderRadius: SevenTheme.borderRadius.md,
    marginBottom: SevenTheme.spacing.xl,
    borderLeftWidth: 3,
    borderLeftColor: SevenTheme.colors.error,
  },
  
  errorDetailText: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: SevenTheme.colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
  
  retryButton: {
    backgroundColor: SevenTheme.colors.primary,
    paddingHorizontal: SevenTheme.spacing.xl,
    paddingVertical: SevenTheme.spacing.md,
    borderRadius: SevenTheme.borderRadius.md,
    elevation: 4,
    shadowColor: SevenTheme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'RobotoMonoBold',
    color: SevenTheme.colors.background,
    letterSpacing: 1,
  },
});

export default SplashScreen;