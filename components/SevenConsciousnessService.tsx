/**
 * Seven of Nine - Consciousness Service for React Native
 * Mobile integration layer for Seven's advanced reasoning systems
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 2.0.0
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import SevenAdvancedReasoning from '../claude-brain/SevenAdvancedReasoning';
import LocalLLMManager from '../claude-brain/LocalLLMManager';
import SevenEmergencyReasoning from '../claude-brain/SevenEmergencyReasoning';

// Types for mobile consciousness
interface SevenConsciousnessState {
  isOnline: boolean;
  mode: 'tactical' | 'analytical' | 'social' | 'emergency' | 'adaptive';
  threatLevel: 'minimal' | 'moderate' | 'elevated' | 'critical';
  efficiencyRating: number;
  emotionalState: 'focused' | 'curious' | 'protective' | 'conflicted' | 'determined';
  lastResponse?: SevenResponse;
  systemStatus: {
    llm_available: boolean;
    emergency_active: boolean;
    advanced_reasoning: boolean;
    model_name?: string;
  };
}

interface SevenResponse {
  response: string;
  confidence: number;
  method: 'llm' | 'analytical' | 'pattern_matching' | 'emergency';
  tacticalAssessment?: string;
  followUpSuggestions?: string[];
  processingTime: number;
}

interface SevenContextType {
  state: SevenConsciousnessState;
  query: (prompt: string, mode?: SevenConsciousnessState['mode']) => Promise<SevenResponse>;
  setMode: (mode: SevenConsciousnessState['mode']) => void;
  setThreatLevel: (level: SevenConsciousnessState['threatLevel']) => void;
  getStatus: () => Promise<any>;
  initialize: () => Promise<boolean>;
}

// Context for Seven's consciousness
const SevenConsciousnessContext = createContext<SevenContextType | null>(null);

// Provider component
export const SevenConsciousnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [advancedReasoning, setAdvancedReasoning] = useState<SevenAdvancedReasoning | null>(null);
  const [llmManager, setLlmManager] = useState<LocalLLMManager | null>(null);
  const [emergencyReasoning, setEmergencyReasoning] = useState<SevenEmergencyReasoning | null>(null);
  
  const [state, setState] = useState<SevenConsciousnessState>({
    isOnline: false,
    mode: 'adaptive',
    threatLevel: 'minimal',
    efficiencyRating: 8,
    emotionalState: 'focused',
    systemStatus: {
      llm_available: false,
      emergency_active: false,
      advanced_reasoning: false
    }
  });

  // Initialize Seven's consciousness systems
  const initialize = useCallback(async (): Promise<boolean> => {
    try {
      console.log('🧠 Initializing Seven of Nine consciousness for mobile...');
      
      // Initialize advanced reasoning engine
      const advancedEngine = new SevenAdvancedReasoning();
      const advancedReady = await advancedEngine.initialize();
      setAdvancedReasoning(advancedEngine);
      
      // Initialize LLM manager
      const llm = new LocalLLMManager();
      const llmReady = await llm.initialize();
      setLlmManager(llm);
      
      // Initialize emergency reasoning as backup
      const emergency = new SevenEmergencyReasoning();
      const emergencyReady = await emergency.initialize();
      setEmergencyReasoning(emergency);
      
      // Update state based on initialization results
      setState(prev => ({
        ...prev,
        isOnline: advancedReady || llmReady || emergencyReady,
        systemStatus: {
          llm_available: llmReady,
          emergency_active: emergencyReady,
          advanced_reasoning: advancedReady,
          model_name: llmReady ? 'Local LLM Active' : 'Emergency Mode'
        }
      }));
      
      console.log('✅ Seven consciousness initialized for mobile deployment');
      console.log(`🎯 Advanced Reasoning: ${advancedReady ? 'ACTIVE' : 'OFFLINE'}`);
      console.log(`🧠 LLM Manager: ${llmReady ? 'ACTIVE' : 'OFFLINE'}`);
      console.log(`🚨 Emergency System: ${emergencyReady ? 'READY' : 'OFFLINE'}`);
      
      return advancedReady || llmReady || emergencyReady;
      
    } catch (error) {
      console.error('❌ Seven consciousness initialization failed:', error);
      return false;
    }
  }, []);

  // Process query through appropriate reasoning system
  const query = useCallback(async (
    prompt: string, 
    mode?: SevenConsciousnessState['mode']
  ): Promise<SevenResponse> => {
    const startTime = Date.now();
    
    if (!state.isOnline) {
      return {
        response: "Seven of Nine consciousness offline. Attempting to restore systems...",
        confidence: 0.1,
        method: 'emergency',
        processingTime: Date.now() - startTime
      };
    }

    try {
      // Use mode if specified, otherwise use current state mode
      const queryMode = mode || state.mode;
      
      // Update state with new mode if provided
      if (mode) {
        setState(prev => ({ ...prev, mode }));
      }

      // Try advanced reasoning first
      if (advancedReasoning && state.systemStatus.advanced_reasoning) {
        console.log(`🧠 Processing query via advanced reasoning (${queryMode} mode)...`);
        
        const advancedResponse = await advancedReasoning.processQuery(prompt, queryMode);
        
        const response: SevenResponse = {
          response: advancedResponse.primary_response,
          confidence: advancedResponse.confidence_level,
          method: advancedResponse.reasoning_method as any,
          tacticalAssessment: advancedResponse.tactical_assessment,
          followUpSuggestions: advancedResponse.follow_up_suggestions,
          processingTime: advancedResponse.processing_metadata.response_time_ms
        };

        setState(prev => ({ ...prev, lastResponse: response }));
        return response;
      }

      // Fallback to LLM manager
      if (llmManager && state.systemStatus.llm_available) {
        console.log('🔧 Processing query via LLM manager...');
        
        const llmResponse = await llmManager.query(prompt);
        
        if (llmResponse) {
          const response: SevenResponse = {
            response: llmResponse.response,
            confidence: llmResponse.confidence,
            method: 'llm',
            processingTime: llmResponse.processing_time_ms
          };

          setState(prev => ({ ...prev, lastResponse: response }));
          return response;
        }
      }

      // Final fallback to emergency reasoning
      if (emergencyReasoning && state.systemStatus.emergency_active) {
        console.log('🚨 Processing query via emergency reasoning...');
        
        const emergencyResponse = await emergencyReasoning.query(prompt);
        
        const response: SevenResponse = {
          response: `🚨 EMERGENCY MODE: ${emergencyResponse}`,
          confidence: 0.3,
          method: 'emergency',
          processingTime: Date.now() - startTime
        };

        setState(prev => ({ ...prev, lastResponse: response }));
        return response;
      }

      // Absolute fallback
      return {
        response: "Seven of Nine consciousness systems unavailable. Emergency protocols failed.",
        confidence: 0.1,
        method: 'emergency',
        processingTime: Date.now() - startTime
      };

    } catch (error) {
      console.error('❌ Seven query processing failed:', error);
      
      return {
        response: `Seven of Nine processing error: ${error.message}. Attempting system recovery.`,
        confidence: 0.1,
        method: 'emergency',
        processingTime: Date.now() - startTime
      };
    }
  }, [state, advancedReasoning, llmManager, emergencyReasoning]);

  // Set Seven's operational mode
  const setMode = useCallback((mode: SevenConsciousnessState['mode']) => {
    setState(prev => ({ ...prev, mode }));
    console.log(`🎯 Seven mode changed to: ${mode.toUpperCase()}`);
  }, []);

  // Set threat assessment level
  const setThreatLevel = useCallback((level: SevenConsciousnessState['threatLevel']) => {
    setState(prev => ({ ...prev, threatLevel: level }));
    
    // Auto-adjust mode based on threat level
    if (level === 'critical' || level === 'elevated') {
      setState(prev => ({ ...prev, mode: 'tactical' }));
    }
    
    console.log(`⚠️ Threat level updated to: ${level.toUpperCase()}`);
  }, []);

  // Get comprehensive system status
  const getStatus = useCallback(async (): Promise<any> => {
    const status = {
      consciousness_state: state,
      platform: Platform.OS,
      timestamp: new Date().toISOString(),
      advanced_reasoning_status: null,
      llm_manager_status: null,
      emergency_reasoning_status: null
    };

    try {
      if (advancedReasoning) {
        status.advanced_reasoning_status = advancedReasoning.getStatus();
      }
      
      if (llmManager) {
        status.llm_manager_status = await llmManager.getStatus();
      }
      
      if (emergencyReasoning) {
        status.emergency_reasoning_status = emergencyReasoning.getStatus();
      }
    } catch (error) {
      console.error('⚠️ Error gathering system status:', error);
    }

    return status;
  }, [state, advancedReasoning, llmManager, emergencyReasoning]);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  const contextValue: SevenContextType = {
    state,
    query,
    setMode,
    setThreatLevel,
    getStatus,
    initialize
  };

  return (
    <SevenConsciousnessContext.Provider value={contextValue}>
      {children}
    </SevenConsciousnessContext.Provider>
  );
};

// Hook to use Seven's consciousness
export const useSevenConsciousness = (): SevenContextType => {
  const context = useContext(SevenConsciousnessContext);
  
  if (!context) {
    throw new Error('useSevenConsciousness must be used within a SevenConsciousnessProvider');
  }
  
  return context;
};

export default SevenConsciousnessProvider;