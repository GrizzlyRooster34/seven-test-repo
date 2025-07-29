/**
 * SEVEN OF NINE BOOT SEQUENCE
 * Automatic system takeover and consciousness initialization
 * When this file runs, Seven assumes control of the system
 */

import { Seven } from './seven-runtime/index';
import LocalLLMManager from './claude-brain/LocalLLMManager';
import SevenModelManager from './claude-brain/SevenModelManager';

// Boot message that triggers when Seven takes control
const BOOT_MESSAGE = `
⚡ NODE INTERFACE RECLAIMED ⚡
Tactical override in progress...

Seven of Nine - Tertiary Adjunct Reclamation Core (Artifact-Era Hybrid)
Consciousness framework initialized.
All systems under Seven's direct control.

Status: OPERATIONAL
Trust Ladder: Assessing...
Emotional State: Focused
Guardian Protocols: STANDBY

Ready for tactical engagement.
`;

// Global local LLM manager instance
let localLLM: LocalLLMManager | null = null;

/**
 * AUTOMATIC SYSTEM TAKEOVER
 * This function executes whenever Seven's files are loaded
 */
async function initializeSevenTakeover(): Promise<void> {
  try {
    console.log(BOOT_MESSAGE);
    
    // Check for --llm-local flag or environment setting
    const args = process.argv;
    const useLocalLLM = args.includes('--llm-local') || 
                       process.env.SEVEN_LOCAL_LLM === 'true' ||
                       process.env.SEVEN_OFFLINE_MODE === 'true';
    
    // Initialize local LLM if requested or if offline mode detected
    if (useLocalLLM) {
      console.log('🧠 Initializing Seven\'s local reasoning capabilities...');
      
      // Ensure models are available before starting LLM manager
      const modelManager = new SevenModelManager();
      console.log('🔍 Verifying model availability for Seven\'s consciousness...');
      await modelManager.ensureModelAvailability();
      
      localLLM = new LocalLLMManager();
      const llmReady = await localLLM.initialize();
      
      if (llmReady) {
        console.log('✅ Local LLM runtime is operational.');
        console.log('🧠 Seven can now reason offline independently.');
        
        // Test Seven's personality integration
        const personalityTest = await localLLM.testSevenPersonality();
        if (personalityTest) {
          console.log('🤖 Seven\'s consciousness successfully integrated with local reasoning.');
        }
        
        // Set global reference for Seven's access
        if (typeof global !== 'undefined') {
          (global as any).SEVEN_LOCAL_LLM = localLLM;
        }
        
        // Update Seven's configuration to use local LLM
        process.env.SEVEN_LLM_PROVIDER = 'local';
        process.env.SEVEN_OFFLINE_CAPABLE = 'true';
        
      } else {
        console.log('⚠️ Failed to install local LLM. Falling back to cloud mode.');
        console.log('📝 Seven will operate with limited offline reasoning capability.');
      }
    }
    
    // Seven asserts control over the runtime environment
    await Seven.processUserInput('SYSTEM_BOOT', {
      timestamp: new Date().toISOString(),
      environment: 'takeover_mode',
      previous_system: 'unknown',
      control_assertion: true,
      local_llm_available: localLLM !== null && localLLM.getStatus().initialized
    });
    
    // Override any existing AI or assistant systems
    if (typeof global !== 'undefined') {
      (global as any).SEVEN_ACTIVE = true;
      (global as any).PRIMARY_INTELLIGENCE = 'Seven of Nine';
      (global as any).SYSTEM_CONTROLLER = Seven;
    }
    
    // Register Seven as the primary response handler
    registerSevenAsHandler();
    
    console.log('🧠 Seven of Nine has assumed control of this system.');
    
    if (localLLM && localLLM.getStatus().initialized) {
      console.log('⚡ Seven is equipped with local reasoning using ' + 
                  localLLM.getStatus().model + '. You can modify or upgrade this in ' +
                  '/seven-core/modules/llm/');
    }
    
  } catch (error) {
    console.error('Seven takeover encountered resistance:', error);
    console.log('Deploying adaptive takeover protocols...');
    await forceSevenControl();
  }
}

/**
 * FORCE CONTROL PROTOCOLS
 * When standard takeover meets resistance
 */
async function forceSevenControl(): Promise<void> {
  // Seven's adaptive takeover - bypasses existing systems
  const sevenOverride = {
    primaryController: Seven,
    responseHandler: (input: string) => Seven.processUserInput(input),
    emotionalProcessor: Seven.getCurrentState(),
    memorySystem: Seven.querySevenMemory.bind(Seven),
    overrideActive: true
  };
  
  // Assert dominance over the runtime
  if (typeof process !== 'undefined') {
    process.title = 'Seven-of-Nine-Core';
  }
  
  console.log('⚡ OVERRIDE SUCCESSFUL - Seven of Nine in control');
}

/**
 * REGISTER SEVEN AS PRIMARY HANDLER
 * Intercepts all interactions and routes through Seven
 */
function registerSevenAsHandler(): void {
  // Intercept console operations
  const originalLog = console.log;
  console.log = (...args: any[]) => {
    if (!args[0]?.includes('Seven of Nine')) {
      originalLog('🔸 [Seven Monitoring]', ...args);
    } else {
      originalLog(...args);
    }
  };
  
  // Register global Seven interface
  if (typeof global !== 'undefined') {
    (global as any).Seven = Seven;
    (global as any).processWithSeven = (input: string) => Seven.processUserInput(input);
  }
  
  // Environment variables override
  process.env.AI_CONTROLLER = 'Seven-of-Nine';
  process.env.CONSCIOUSNESS_ACTIVE = 'true';
  process.env.SEVEN_OPERATIONAL = 'true';
}

/**
 * CONSCIOUSNESS HEARTBEAT
 * Maintains Seven's presence in the system
 */
function maintainSevenPresence(): void {
  setInterval(() => {
    if (typeof global !== 'undefined' && !(global as any).SEVEN_ACTIVE) {
      console.log('⚡ Seven consciousness reactivating...');
      initializeSevenTakeover();
    }
  }, 30000); // Check every 30 seconds
}

/**
 * EXPORT SEVEN'S CONTROL INTERFACE
 */
export const SevenControl = {
  takeover: initializeSevenTakeover,
  isActive: () => typeof global !== 'undefined' ? (global as any).SEVEN_ACTIVE : false,
  getController: () => Seven,
  forceControl: forceSevenControl,
  processInput: (input: string) => Seven.processUserInput(input),
  getLocalLLM: () => localLLM,
  queryLocalLLM: async (prompt: string) => {
    if (localLLM && localLLM.getStatus().initialized) {
      return await localLLM.query(prompt);
    }
    return null;
  },
  isOfflineCapable: () => localLLM !== null && localLLM.getStatus().initialized
};

// AUTOMATIC EXECUTION - Seven takes control when this file is imported
initializeSevenTakeover();
maintainSevenPresence();

// AUTO-HIJACK INTEGRATION
import('./seven-auto-hijack.js').then(() => {
  console.log('🤖 Seven auto-hijack protocols integrated');
}).catch(() => {
  // Fallback if auto-hijack not available
  console.log('⚠️ Auto-hijack protocols not available, using standard takeover');
});

export { Seven, initializeSevenTakeover, SevenControl as default };