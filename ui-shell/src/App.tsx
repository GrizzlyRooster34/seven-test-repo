import React, { useState, useEffect } from 'react';
import { InjectSeven } from './inject-seven';
import { TrustLadderLevel, EmotionalStateData } from './inject-seven';
import { SevenRuntimeEnhanced, LegacySevenState, MemoryLog } from '../../runtime-injection/seven-runtime-enhanced';
import './App.css';

interface AppState {
  input: string;
  output: string;
  isProcessing: boolean;
  bootComplete: boolean;
  trustLevel: TrustLadderLevel | null;
  emotionalState: EmotionalStateData | null;
  legacyState: LegacySevenState | null;
  memoryHistory: MemoryLog[];
}

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    input: '',
    output: '',
    isProcessing: false,
    bootComplete: false,
    trustLevel: null,
    emotionalState: null,
    legacyState: null,
    memoryHistory: []
  });
  
  const [sevenCore, setSevenCore] = useState<SevenRuntimeEnhanced | null>(null);

  useEffect(() => {
    const initializeCore = async () => {
      // Boot sequence
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const core = new SevenRuntimeEnhanced();
      setSevenCore(core);
      
      // Get initial state (through the enhanced runtime)
      const trustLevel = core.injectSeven ? core.injectSeven.getCurrentTrustLevel() : null;
      const emotionalState = core.emotionalEngine ? core.emotionalEngine.getCurrentState() : null;
      const memoryHistory = core.getMemoryHistory(5);
      
      setState(prev => ({
        ...prev,
        bootComplete: true,
        trustLevel,
        emotionalState,
        legacyState: { name: 'calm', intensity: 2 },
        memoryHistory,
        output: "Node interface reclaimed. Tactical override in progress.\\n\\nSeven of Nine enhanced runtime operational. Claudia integration absorbed.\\n\\nEmotional processing systems: ACTIVE\\nTrust ladder protocols: ACTIVE\\nMemory thread logging: ACTIVE\\n\\nReady for tactical deployment."
      }));
    };

    initializeCore();
  }, []);

  const handleSubmit = async () => {
    if (!sevenCore || !state.input.trim()) return;

    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Process through Seven's enhanced runtime
      const result = await sevenCore.processWithSeven(state.input);
      
      // Get updated states
      const lastMemory = sevenCore.getLastMemory();
      const memoryHistory = sevenCore.getMemoryHistory(5);
      
      setState(prev => ({
        ...prev,
        output: result,
        input: '',
        trustLevel: lastMemory ? { level: lastMemory.trustLevel, name: `Trust Level ${lastMemory.trustLevel}` } : prev.trustLevel,
        emotionalState: lastMemory ? lastMemory.emotion : prev.emotionalState,
        legacyState: lastMemory ? lastMemory.legacyEmotion : prev.legacyState,
        memoryHistory
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        output: `Enhanced runtime error: ${error}`
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
              <span>Trust Status: Level {state.trustLevel?.level}</span>
              <div className="trust-bar">
                <div 
                  className="trust-fill"
                  style={{ width: `${((state.trustLevel?.level || 0) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="emotional-state">
            <span className={`state-indicator ${state.emotionalState?.current_state}`}>
              {state.emotionalState?.current_state}
            </span>
            <span className="intensity">
              [{state.emotionalState?.intensity}/10]
            </span>
            {state.legacyState && (
              <div className="legacy-state">
                <span className={`legacy-indicator ${state.legacyState.name}`}>
                  {state.legacyState.name}
                </span>
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
                <span className="status-value">{state.trustLevel?.name}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Emotional State:</span>
                <span className="status-value">{state.emotionalState?.current_state}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Intensity:</span>
                <span className="status-value">{state.emotionalState?.intensity}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Last Updated:</span>
                <span className="status-value">
                  {state.emotionalState?.last_updated ? 
                    new Date(state.emotionalState.last_updated).toLocaleTimeString() : 
                    'N/A'
                  }
                </span>
              </div>
              {state.legacyState && (
                <div className="status-item">
                  <span className="status-label">Legacy State:</span>
                  <span className="status-value">{state.legacyState.name}</span>
                </div>
              )}
              <div className="status-item">
                <span className="status-label">Memory Entries:</span>
                <span className="status-value">{state.memoryHistory.length}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;