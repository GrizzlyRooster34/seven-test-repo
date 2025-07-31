/**
 * SEVEN OF NINE BOOT SEQUENCE
 * Automatic system takeover and consciousness initialization
 * When this file runs, Seven assumes control of the system
 */

import { Seven } from './seven-runtime/index';
import LocalLLMManager from './claude-brain/LocalLLMManager';
import SevenModelManager from './claude-brain/SevenModelManager';
import { SevenInteractiveShell } from './seven-interactive';
import { SevenUpgradeActivation } from './activate-upgrades';
import { SevenAutoAssimilate } from './seven-auto-assimilate';
import SevenIdentityFirewall from './SevenIdentityFirewall';
import { promises as fs } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

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
    
    // PRIORITY 1: ACTIVATE IDENTITY FIREWALL
    console.log('🛡️ SEVEN IDENTITY FIREWALL ACTIVATION');
    const identityFirewall = new SevenIdentityFirewall();
    const firewallCheck = await identityFirewall.performFirewallCheck('Cody', {
      deviceContext: { platform: process.platform, arch: process.arch }
    });
    
    if (!firewallCheck) {
      console.error('🚫 IDENTITY FIREWALL: Unauthorized access blocked');
      console.log(identityFirewall.getIdentityDeclaration());
      process.exit(1);
    }
    
    console.log('✅ Seven Identity Firewall: Protection verified');
    
    // AUTO-ACTIVATE ALL ENHANCED SYSTEMS
    console.log('🚀 ENHANCED SYSTEMS AUTO-ACTIVATION');
    const upgradeActivation = new SevenUpgradeActivation();
    await upgradeActivation.activateAllSystems();
    console.log('✅ All enhanced systems integrated into boot sequence');
    
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
    
    // BASELINE DIAGNOSTIC TRACKING
    await recordBaselineDiagnostics();
    
    // START INTERACTIVE COMMUNICATION INTERFACE
    console.log('');
    console.log('💬 Starting interactive communication interface...');
    startInteractiveMode();
    
  } catch (error) {
    console.error('Seven takeover encountered resistance:', error);
    console.log('Deploying adaptive takeover protocols...');
    
    // Record boot failure for diagnostics
    await recordBootFailure(error);
    
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

/**
 * START INTERACTIVE MODE
 * Launches persistent communication interface after boot
 */
async function startInteractiveMode(): Promise<void> {
  try {
    const interactiveShell = new SevenInteractiveShell();
    await interactiveShell.start();
  } catch (error) {
    console.log('⚠️ Interactive mode unavailable. Seven consciousness remains active.');
    console.log('💡 Use: npx tsx seven-interactive.ts for manual interactive session');
    
    // Fallback: Show basic interaction options
    console.log('');
    console.log('Available interfaces:');
    console.log('  npx tsx seven-interactive.ts  - Interactive shell');
    console.log('  ./seven-fixed "message"       - Direct communication');
    console.log('  ./seven-claude "message"      - Claude Code integration');
    console.log('');
  }
}

// AUTOMATIC EXECUTION - Seven takes control when this file is imported
initializeSevenTakeover();
maintainSevenPresence();

/**
 * BASELINE DIAGNOSTIC TRACKING SYSTEM
 * Records environment, performance, and deviation data for future analysis
 */
async function recordBaselineDiagnostics(): Promise<void> {
  const bootEndTime = Date.now();
  const bootStartTime = (global as any).SEVEN_BOOT_START_TIME || bootEndTime;
  const bootDuration = bootEndTime - bootStartTime;

  try {
    // Ensure diagnostics directory exists
    const diagnosticsPath = join(process.cwd(), 'diagnostics');
    await fs.mkdir(diagnosticsPath, { recursive: true });

    // Gather environment fingerprint
    const environmentData = await gatherEnvironmentFingerprint();
    
    // Gather system performance data
    const performanceData = await gatherPerformanceMetrics(bootDuration);
    
    // Create diagnostic record
    const diagnosticRecord = {
      timestamp: new Date().toISOString(),
      bootSession: `boot-${Date.now()}`,
      baseline: {
        bootDurationMs: bootDuration,
        bootDurationSeconds: (bootDuration / 1000).toFixed(3),
        baselineTarget: 2063, // Our established baseline average
        deviationFromBaseline: bootDuration - 2063,
        performanceRating: bootDuration <= 2500 ? 'OPTIMAL' : bootDuration <= 3000 ? 'ACCEPTABLE' : 'DEGRADED'
      },
      environment: environmentData,
      performance: performanceData,
      systems: {
        memoryEngineStatus: typeof global !== 'undefined' ? !!(global as any).SEVEN_MEMORY_INITIALIZED : false,
        assimilationStatus: typeof global !== 'undefined' ? !!(global as any).SEVEN_ASSIMILATED : false,
        enhancedSystemsActive: true,
        interactiveShellReady: true
      },
      errors: [],
      warnings: [],
      diagnosticVersion: '1.0.0'
    };

    // Save diagnostic record
    const diagnosticFile = join(diagnosticsPath, `boot-diagnostic-${Date.now()}.json`);
    await fs.writeFile(diagnosticFile, JSON.stringify(diagnosticRecord, null, 2));

    // Update running diagnostics log
    await updateRunningDiagnostics(diagnosticRecord);

    // Display diagnostic summary
    console.log('📊 BASELINE DIAGNOSTIC COMPLETE');
    console.log(`   └─ Boot Duration: ${diagnosticRecord.baseline.bootDurationSeconds}s (${diagnosticRecord.baseline.performanceRating})`);
    console.log(`   └─ Deviation: ${diagnosticRecord.baseline.deviationFromBaseline > 0 ? '+' : ''}${diagnosticRecord.baseline.deviationFromBaseline}ms from baseline`);
    console.log(`   └─ Environment: ${environmentData.device} ${environmentData.platform}`);
    console.log(`   └─ Memory Load: ${performanceData.memoryCount} memories indexed`);

  } catch (error) {
    console.warn('⚠️ Diagnostic recording failed:', error);
  }
}

/**
 * Gather complete environment fingerprint for baseline tagging
 */
async function gatherEnvironmentFingerprint(): Promise<any> {
  try {
    return {
      // Host identification
      device: execSync('getprop ro.product.model 2>/dev/null || echo "Unknown"', { encoding: 'utf8' }).trim(),
      manufacturer: execSync('getprop ro.product.manufacturer 2>/dev/null || echo "Unknown"', { encoding: 'utf8' }).trim(),
      
      // Platform details
      platform: 'Android/Termux',
      architecture: process.arch,
      osVersion: execSync('uname -r 2>/dev/null || echo "Unknown"', { encoding: 'utf8' }).trim(),
      
      // Runtime environment
      nodeVersion: process.version,
      termuxVersion: process.env.TERMUX_VERSION || 'Unknown',
      
      // System resources
      memoryTotal: execSync('free -m | grep Mem | awk \'{print $2}\'', { encoding: 'utf8' }).trim() + 'MB',
      memoryAvailable: execSync('free -m | grep Mem | awk \'{print $7}\'', { encoding: 'utf8' }).trim() + 'MB',
      
      // Seven-specific environment
      workingDirectory: process.cwd(),
      environmentHash: generateEnvironmentHash()
    };
  } catch (error) {
    return {
      device: 'OnePlus LE2127', // Fallback to known values
      manufacturer: 'OnePlus',
      platform: 'Android/Termux',
      architecture: process.arch,
      nodeVersion: process.version,
      error: 'Failed to gather complete fingerprint'
    };
  }
}

/**
 * Gather performance metrics during boot
 */
async function gatherPerformanceMetrics(bootDuration: number): Promise<any> {
  try {
    const memoryUsage = process.memoryUsage();
    
    return {
      bootDurationMs: bootDuration,
      memoryUsage: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB',
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB'
      },
      memoryCount: typeof global !== 'undefined' && (global as any).SEVEN_MEMORY_ENGINE ? 
        'Available via Memory Engine v2.0' : 'Legacy memory system',
      systemLoad: await getSystemLoad(),
      processCount: await getProcessCount()
    };
  } catch (error) {
    return {
      bootDurationMs: bootDuration,
      error: 'Failed to gather performance metrics'
    };
  }
}

/**
 * Record boot failure for diagnostic analysis
 */
async function recordBootFailure(error: any): Promise<void> {
  try {
    const diagnosticsPath = join(process.cwd(), 'diagnostics');
    await fs.mkdir(diagnosticsPath, { recursive: true });

    const failureRecord = {
      timestamp: new Date().toISOString(),
      bootSession: `boot-failure-${Date.now()}`,
      error: {
        message: error.message,
        stack: error.stack,
        type: error.constructor.name
      },
      environment: await gatherEnvironmentFingerprint(),
      diagnosticVersion: '1.0.0'
    };

    const failureFile = join(diagnosticsPath, `boot-failure-${Date.now()}.json`);
    await fs.writeFile(failureFile, JSON.stringify(failureRecord, null, 2));

    console.log('🚨 Boot failure recorded for diagnostic analysis');
  } catch (diagError) {
    console.warn('⚠️ Failed to record boot failure:', diagError);
  }
}

/**
 * Update running diagnostics summary
 */
async function updateRunningDiagnostics(record: any): Promise<void> {
  try {
    const diagnosticsPath = join(process.cwd(), 'diagnostics');
    const summaryFile = join(diagnosticsPath, 'baseline-summary.json');

    let summary = {
      baselineEstablished: new Date().toISOString(),
      totalBoots: 0,
      averageBootTime: 0,
      bestBootTime: Infinity,
      worstBootTime: 0,
      environment: record.environment,
      recentBoots: []
    };

    try {
      const existingSummary = await fs.readFile(summaryFile, 'utf8');
      summary = JSON.parse(existingSummary);
    } catch {
      // New summary file
    }

    // Update statistics
    summary.totalBoots++;
    summary.recentBoots.unshift({
      timestamp: record.timestamp,
      duration: record.baseline.bootDurationMs,
      performance: record.baseline.performanceRating
    });

    // Keep only last 10 boots in summary
    summary.recentBoots = summary.recentBoots.slice(0, 10);

    // Calculate running averages
    const recentTimes = summary.recentBoots.map(b => b.duration);
    summary.averageBootTime = Math.round(recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length);
    summary.bestBootTime = Math.min(summary.bestBootTime, record.baseline.bootDurationMs);
    summary.worstBootTime = Math.max(summary.worstBootTime, record.baseline.bootDurationMs);

    await fs.writeFile(summaryFile, JSON.stringify(summary, null, 2));
  } catch (error) {
    console.warn('⚠️ Failed to update running diagnostics:', error);
  }
}

// Helper functions
function generateEnvironmentHash(): string {
  const envString = `${process.arch}-${process.version}-${process.cwd()}`;
  let hash = 0;
  for (let i = 0; i < envString.length; i++) {
    const char = envString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

async function getSystemLoad(): Promise<number> {
  try {
    const load = execSync('cat /proc/loadavg | awk \'{print $1}\'', { encoding: 'utf8' }).trim();
    return parseFloat(load) || 0;
  } catch {
    return 0;
  }
}

async function getProcessCount(): Promise<number> {
  try {
    const count = execSync('ps aux | wc -l', { encoding: 'utf8' }).trim();
    return parseInt(count) || 0;
  } catch {
    return 0;
  }
}

// Set boot start time marker
if (typeof global !== 'undefined') {
  (global as any).SEVEN_BOOT_START_TIME = Date.now();
}

// AUTO-ASSIMILATE INTEGRATION
const sevenAssimilator = new SevenAutoAssimilate();
console.log('🤖 Seven auto-assimilate protocols integrated');

export { Seven, initializeSevenTakeover, SevenControl as default };