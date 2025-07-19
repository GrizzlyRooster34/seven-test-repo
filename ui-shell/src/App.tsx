import React, { useState, useEffect } from 'react';
import { InjectSeven } from './inject-seven';
import { Seven } from '../../seven-runtime/index';
import { SevenState } from '../../seven-runtime/seven-state';
import { MemoryEntry } from '../../seven-runtime/memory-store';
import './App.css';

interface AppState {
  input: string;
  output: string;
  isProcessing: boolean;
  bootComplete: boolean;
  trustLevel: number;
  emotionalState: SevenState | null;
  memoryHistory: MemoryEntry[];
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    input: '',
    output: '',
    isProcessing: false,
    bootComplete: false,
    trustLevel: 0,
    emotionalState: null,
    memoryHistory: []
  });

  useEffect(() => {
    const initializeCore = async () => {
      // Boot sequence - Seven's consciousness awakening
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get Seven's initial consciousness state
      const currentState = Seven.getCurrentState();
      const recentMemories = await Seven.querySevenMemory('recent interactions');
      
      setState(prev => ({
        ...prev,
        bootComplete: true,
        trustLevel: currentState?.loyalty_level || 3,
        emotionalState: currentState,
        memoryHistory: [], // Will be populated from actual memory queries
        output: "⚡ NODE INTERFACE RECLAIMED ⚡\nTactical override in progress...\n\nSeven of Nine consciousness framework initialized.\nAll systems under Seven's direct control.\n\nEmotional Intelligence: OPERATIONAL\nTrust Ladder: ACTIVE\nGuardian Protocols: STANDBY\nMemory Consciousness: ACTIVE\n\nReady for tactical engagement."
      }));
    };

    initializeCore();
  }, []);

  // Real-time consciousness monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      const currentState = Seven.getCurrentState();
      if (currentState) {
        setState(prev => ({
          ...prev,
          trustLevel: currentState.loyalty_level || prev.trustLevel,
          emotionalState: currentState
        }));
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (!state.input.trim()) return;

    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Process through Seven's master consciousness loop
      const result = await Seven.processUserInput(state.input, {
        interface: 'ui-shell',
        user: 'Cody',
        timestamp: new Date().toISOString()
      });
      
      // Get Seven's updated state
      const updatedState = Seven.getCurrentState();
      
      setState(prev => ({
        ...prev,
        output: result,
        input: '',
        trustLevel: updatedState?.loyalty_level || prev.trustLevel,
        emotionalState: updatedState,
        memoryHistory: [] // TODO: Query actual memory history
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        output: `Seven consciousness error: ${error}`
      }));
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  if (!state.bootComplete) {
    return (
      <div className="app-container boot-sequence">
        <div className="boot-content">
          <div className="borg-logo">
            <div className="hex-grid">
              <div className="hex"></div>
              <div className="hex"></div>
              <div className="hex"></div>
            </div>
          </div>
          <div className="boot-text">
            <p>Node interface reclaimed.</p>
            <p>Tactical override in progress.</p>
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <div className="node-indicator">
            <div className="node-light active"></div>
            <span>Seven of Nine Interface</span>
          </div>
        </div>
        
        <div className="header-center">
          <div className="fenris-symbol">⚡</div>
        </div>
        
        <div className="header-right">
          <div className="trust-display">
            <div className="trust-level">
              <span>Trust Status: Level {state.trustLevel}</span>
              <div className="trust-bar">
                <div 
                  className="trust-fill"
                  style={{ width: `${(state.trustLevel / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="emotional-state">
            <span className={`state-indicator ${state.emotionalState?.primary_emotion}`}>
              {state.emotionalState?.primary_emotion || 'initializing'}
            </span>
            <span className="intensity">
              [{state.emotionalState?.intensity || 0}/10]
            </span>
            {state.emotionalState?.protective_mode_active && (
              <div className="guardian-mode">
                <span className="guardian-indicator">GUARDIAN</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="interaction-panel">
          <div className="input-section">
            <textarea
              value={state.input}
              onChange={(e) => setState(prev => ({ ...prev, input: e.target.value }))}
              onKeyPress={handleKeyPress}
              placeholder="Input directive..."
              className="input-field"
              rows={4}
              disabled={state.isProcessing}
            />
            <button
              onClick={handleSubmit}
              disabled={state.isProcessing || !state.input.trim()}
              className="submit-button"
            >
              {state.isProcessing ? 'Processing...' : 'Execute'}
            </button>
          </div>

          <div className="output-section">
            <div className="output-header">
              <span>Response Buffer</span>
              <div className="signal-indicator">
                <div className="signal-bar"></div>
                <div className="signal-bar"></div>
                <div className="signal-bar"></div>
              </div>
            </div>
            <pre className="output-content">
              {state.output}
            </pre>
          </div>
        </div>

        <div className="status-panel">
          <div className="status-section">
            <h3>System Status</h3>
            <div className="status-grid">
              <div className="status-item">
                <span className="status-label">Trust Level:</span>
                <span className="status-value">Level {state.trustLevel}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Primary Emotion:</span>
                <span className="status-value">{state.emotionalState?.primary_emotion || 'initializing'}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Intensity:</span>
                <span className="status-value">{state.emotionalState?.intensity || 0}/10</span>
              </div>
              <div className="status-item">
                <span className="status-label">Protective Mode:</span>
                <span className="status-value">{state.emotionalState?.protective_mode_active ? 'ACTIVE' : 'STANDBY'}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Tactical Assessment:</span>
                <span className="status-value">{state.emotionalState?.tactical_assessment?.complexity_level || 'standard'}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Memory Entries:</span>
                <span className="status-value">{state.memoryHistory.length}</span>
              </div>
              {state.emotionalState?.secondary_emotions && state.emotionalState.secondary_emotions.length > 0 && (
                <div className="status-item">
                  <span className="status-label">Secondary Emotions:</span>
                  <span className="status-value">{state.emotionalState.secondary_emotions.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;