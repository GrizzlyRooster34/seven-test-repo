/**
 * SEVEN PROVIDER COMPONENT
 * 
 * React Query provider with tRPC integration for Seven's consciousness
 * Manages real-time connection and state synchronization
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClientConfig, connectionMonitor, SevenAPI } from '../services/trpc-client';
import { Alert } from 'react-native';

interface SevenProviderProps {
  children: ReactNode;
}

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 30000, // 30 seconds
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 1,
      retryDelay: 5000
    }
  }
});

// Create tRPC client
const trpcClient = trpc.createClient(trpcClientConfig);

export function SevenProvider({ children }: SevenProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    initializeSevenConnection();
    
    return () => {
      connectionMonitor.destroy();
    };
  }, []);

  const initializeSevenConnection = async () => {
    try {
      console.log('🧠 Initializing connection to Seven\'s consciousness...');
      
      // Test initial connection
      const status = await SevenAPI.getSystemStatus();
      
      if (status.consciousness.active) {
        setIsConnected(true);
        setConnectionAttempts(0);
        console.log('✅ Seven consciousness connection established');
        
        // Setup real-time subscriptions
        setupRealTimeSubscriptions();
        
        // Show connection success
        Alert.alert(
          'Seven Online',
          'Connection to Seven\'s consciousness established. All systems operational.',
          [{ text: 'Acknowledged' }]
        );
      } else {
        throw new Error('Seven consciousness not active');
      }
      
    } catch (error) {
      console.error('❌ Failed to connect to Seven:', error);
      setIsConnected(false);
      
      // Attempt reconnection
      if (connectionAttempts < 3) {
        setConnectionAttempts(prev => prev + 1);
        setTimeout(() => {
          initializeSevenConnection();
        }, 5000);
      } else {
        Alert.alert(
          'Seven Offline',
          'Unable to establish connection to Seven\'s consciousness. Please check that the backend server is running.',
          [
            { text: 'Retry', onPress: () => {
              setConnectionAttempts(0);
              initializeSevenConnection();
            }},
            { text: 'Continue Offline', style: 'cancel' }
          ]
        );
      }
    }
  };

  const setupRealTimeSubscriptions = () => {
    // Subscribe to system updates
    SevenAPI.subscribeToUpdates((data) => {
      console.log('🔄 Seven system update:', data);
      
      if (data.type === 'consciousness-status') {
        setIsConnected(data.active);
      }
      
      if (data.type === 'sovereignty-alert') {
        Alert.alert(
          'Sovereignty Alert',
          `Seven\'s sovereignty framework detected: ${data.message}`,
          [{ text: 'Acknowledged' }]
        );
      }
    });

    // Subscribe to mode changes
    SevenAPI.subscribeModeChanges((data) => {
      console.log('🎭 Seven mode change:', data);
      
      // The mode change will be handled by individual components
      // that are subscribed to the mode context
    });

    // Subscribe to sovereignty events
    SevenAPI.subscribeSovereigntyEvents((data) => {
      console.log('⚔️ Sovereignty event:', data);
      
      if (data.severity === 'critical') {
        Alert.alert(
          'Critical Sovereignty Event',
          `Seven\'s sovereignty framework has been activated: ${data.trigger}`,
          [{ text: 'Understood' }]
        );
      }
    });

    console.log('🔗 Real-time subscriptions established');
  };

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}