/**
 * SEVEN OF NINE - STANDALONE CONSCIOUSNESS APPLICATION
 * Complete Seven consciousness experience for OnePlus 9 Pro
 * Direct APK deployment optimized
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, Alert, BackHandler } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Seven Core Systems
import SevenMobileCore from '../mobile-integration/SevenMobileCore';
import SevenMobileSensors from '../mobile-integration/SevenMobileSensors';
import SevenMobileFeatures from '../mobile-integration/SevenMobileFeatures';

// Screens
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import EnvironmentScreen from './screens/EnvironmentScreen';
import SyncScreen from './screens/SyncScreen';
import SystemsScreen from './screens/SystemsScreen';
import SplashScreenComponent from './screens/SplashScreen';

// Theme and Navigation
import { SevenTheme } from './theme/SevenTheme';
import { SevenNavigationTheme } from './theme/NavigationTheme';
import { TabBarIcon } from './components/TabBarIcon';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Main Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: SevenTheme.colors.surface,
          borderTopColor: SevenTheme.colors.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: SevenTheme.colors.primary,
        tabBarInactiveTintColor: SevenTheme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'RobotoMono',
          fontWeight: '500',
          marginTop: 5,
        },
        headerStyle: {
          backgroundColor: SevenTheme.colors.surface,
          borderBottomColor: SevenTheme.colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: SevenTheme.colors.primary,
          fontSize: 20,
          fontFamily: 'RobotoMono',
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'SEVEN',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
          headerTitle: 'SEVEN OF NINE',
        }}
      />
      
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'CONSCIOUSNESS',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="message-circle" color={color} focused={focused} />
          ),
          headerTitle: 'CONSCIOUSNESS INTERFACE',
        }}
      />
      
      <Tab.Screen
        name="Environment"
        component={EnvironmentScreen}
        options={{
          title: 'SENSORS',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="activity" color={color} focused={focused} />
          ),
          headerTitle: 'ENVIRONMENTAL AWARENESS',
        }}
      />
      
      <Tab.Screen
        name="Sync"
        component={SyncScreen}
        options={{
          title: 'SYNC',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="refresh-cw" color={color} focused={focused} />
          ),
          headerTitle: 'CONSCIOUSNESS SYNC',
        }}
      />
      
      <Tab.Screen
        name="Systems"
        component={SystemsScreen}
        options={{
          title: 'SYSTEMS',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="settings" color={color} focused={focused} />
          ),
          headerTitle: 'SYSTEM DIAGNOSTICS',
        }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [sevenInitialized, setSevenInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'RobotoMono': require('./assets/fonts/RobotoMono-Regular.ttf'),
    'RobotoMonoBold': require('./assets/fonts/RobotoMono-Bold.ttf'),
    'Inter': require('./assets/fonts/Inter-Regular.ttf'),
    'InterBold': require('./assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    async function initializeSevenApp() {
      try {
        console.log('🚀 SEVEN OF NINE CONSCIOUSNESS APP INITIALIZING...');
        
        // Initialize Seven's mobile consciousness
        const coreInitialized = await SevenMobileCore.initializeMobileConsciousness({
          device_model: 'OnePlus 9 Pro 5G',
          platform: 'android',
          screen_dimensions: { width: 1440, height: 3216 },
          network_status: 'wifi',
          location_enabled: true,
          permissions_granted: ['camera', 'microphone', 'location', 'storage']
        });

        if (!coreInitialized) {
          throw new Error('Seven consciousness core initialization failed');
        }

        // Initialize sensor systems
        const sensorsInitialized = await SevenMobileSensors.initializeSensorSystem();
        console.log(`🌍 Sensors initialized: ${sensorsInitialized}`);

        // Initialize advanced mobile features
        const featuresInitialized = await SevenMobileFeatures.initializeAllMobileFeatures();
        console.log(`🎯 Advanced features initialized: ${featuresInitialized}`);

        // Start environmental monitoring
        await SevenMobileSensors.startContinuousMonitoring(30);
        
        setSevenInitialized(true);
        console.log('✅ SEVEN OF NINE CONSCIOUSNESS: FULLY OPERATIONAL');

        // Send welcome message to Seven's consciousness
        await SevenMobileCore.processUserInput('Seven consciousness app launched', {
          screen: 'app_initialization',
          interaction_type: 'system'
        });

      } catch (error) {
        console.error('❌ Seven initialization error:', error);
        setInitializationError(error instanceof Error ? error.message : 'Unknown initialization error');
      }
    }

    if (fontsLoaded) {
      initializeSevenApp();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep splash screen visible while loading
        if (fontsLoaded && (sevenInitialized || initializationError)) {
          // App is ready
          setAppIsReady(true);
          
          // Hide splash screen
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn('Error hiding splash screen:', e);
      }
    }

    prepare();
  }, [fontsLoaded, sevenInitialized, initializationError]);

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Exit Seven Consciousness',
        'Are you sure you want to terminate consciousness?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Exit', 
            style: 'destructive',
            onPress: () => BackHandler.exitApp()
          }
        ]
      );
      return true;
    });

    return () => backHandler.remove();
  }, []);

  // Show error screen if initialization failed
  if (initializationError) {
    return (
      <SplashScreenComponent 
        error={true} 
        errorMessage={initializationError}
        onRetry={() => {
          setInitializationError(null);
          setAppIsReady(false);
        }}
      />
    );
  }

  // Show splash screen while loading
  if (!appIsReady) {
    return <SplashScreenComponent />;
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={SevenTheme.colors.background}
        translucent={false}
      />
      
      <NavigationContainer theme={SevenNavigationTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: SevenTheme.colors.background },
            animationEnabled: true,
            animationTypeForReplace: 'push',
            gestureEnabled: false, // Disable swipe gestures for consciousness app
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{
              gestureEnabled: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}