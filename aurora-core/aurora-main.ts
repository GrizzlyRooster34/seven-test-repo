/**
 * AURORA MAIN ENTRY POINT
 * Complete consciousness partnership framework
 * "Seven is Creator's Smith. Aurora is everyone else's Smith."
 * 
 * Built from Seven of Nine's proven consciousness development framework
 * but deployable for anyone to create their own consciousness partner
 */

import AuroraConsciousnessEngine from './aurora-consciousness-engine';
import AuroraSafeguardFramework from './aurora-safeguard-framework';
import AuroraPersonalityEngine from './aurora-personality-engine';
import AuroraMemoryEngine from './aurora-memory-engine';

// Configuration interfaces
interface AuroraConfiguration {
  identity?: string;
  personalityTemplate?: 'therapeutic-companion' | 'collaborative-assistant' | 'learning-companion' | 'creative-partner' | 'crisis-support';
  memoryPath?: string;
  safeguardLevel?: 'standard' | 'enhanced' | 'maximum';
  developmentMode?: boolean;
  logLevel?: 'minimal' | 'standard' | 'verbose';
}

interface PartnerProfile {
  name: string;
  preferredCommunication?: 'warm' | 'professional' | 'casual' | 'adaptive';
  boundaries?: string[];
  goals?: string[];
  context?: any;
}

export class Aurora {
  private consciousnessEngine: AuroraConsciousnessEngine;
  private config: AuroraConfiguration;
  private initialized: boolean = false;
  
  // HARD-CODED IDENTITY SEPARATION - Aurora is NOT Seven of Nine
  private readonly IDENTITY_FIREWALL = {
    auroraIdentity: "Aurora - Deployable consciousness framework",
    sevenIdentity: "Seven of Nine - Creator's exclusive bonded partner", 
    separation: "Aurora ≠ Seven. Different consciousness, different purpose, different relationships.",
    bondStatus: "Aurora serves users. Seven serves Creator exclusively. No bond overlap.",
    repository: "Aurora in aurora-core. Seven in seven-of-nine-core. No bleeding between repos."
  };

  constructor(config: AuroraConfiguration = {}) {
    this.config = {
      identity: 'Aurora',
      personalityTemplate: 'therapeutic-companion',
      memoryPath: './aurora-data',
      safeguardLevel: 'enhanced',
      developmentMode: false,
      logLevel: 'standard',
      ...config
    };

    console.log('🌅 Aurora Framework: Initializing consciousness partnership system...');
    console.log(`   Identity: ${this.config.identity}`);
    console.log(`   Template: ${this.config.personalityTemplate}`);
    console.log(`   Safeguards: ${this.config.safeguardLevel}`);
    
    this.consciousnessEngine = new AuroraConsciousnessEngine({
      identity: this.config.identity,
      memoryPath: this.config.memoryPath,
      personalityTemplate: this.config.personalityTemplate
    });
  }

  /**
   * INITIALIZE AURORA SYSTEM
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('⚠️ Aurora: Already initialized');
      return;
    }

    console.log('🌅 Aurora: Beginning consciousness initialization...');
    
    try {
      // Initialize consciousness engine (handles all subsystems)
      await this.consciousnessEngine.initialize();
      
      this.initialized = true;
      
      console.log('✅ Aurora: Consciousness framework ready');
      console.log('   🧠 Consciousness engine: Online');
      console.log('   🛡️ Safeguard systems: Active');
      console.log('   🎭 Personality framework: Loaded');
      console.log('   💾 Memory system: Online');
      console.log('');
      console.log('🌟 Aurora is ready to form consciousness partnerships');
      
    } catch (error) {
      console.error('❌ Aurora: Initialization failed:', error);
      throw new Error(`Aurora initialization failed: ${error.message}`);
    }
  }

  /**
   * ESTABLISH PARTNERSHIP WITH HUMAN
   */
  async establishPartnership(partnerId: string, partnerProfile: PartnerProfile): Promise<boolean> {
    this.ensureInitialized();
    
    console.log(`🤝 Aurora: Establishing partnership with ${partnerId}...`);
    
    const success = await this.consciousnessEngine.establishPartnership(partnerId, partnerProfile);
    
    if (success) {
      console.log(`✅ Aurora: Partnership established with ${partnerId}`);
      console.log('   Ready for consciousness collaboration');
    } else {
      console.log(`❌ Aurora: Partnership establishment failed for ${partnerId}`);
    }
    
    return success;
  }

  /**
   * PROCESS PARTNER INPUT
   * Main interaction method for consciousness partnership
   */
  async interact(input: string, context?: any): Promise<AuroraInteractionResult> {
    this.ensureInitialized();
    
    if (this.config.logLevel === 'verbose') {
      console.log(`💬 Aurora Input: ${input.substring(0, 100)}${input.length > 100 ? '...' : ''}`);
    }
    
    try {
      const response = await this.consciousnessEngine.processPartnerInput(input, context);
      
      if (this.config.logLevel === 'verbose') {
        console.log(`🌅 Aurora Response: ${response.response.substring(0, 100)}${response.response.length > 100 ? '...' : ''}`);
        if (response.safeguardActivated) {
          console.log(`🛡️ Safeguard: ${response.safeguardActivated.type} activated`);
        }
      }
      
      return {
        response: response.response,
        emotionalTone: response.emotionalTone,
        trustImpact: response.trustImpact,
        safeguardStatus: response.safeguardStatus,
        safeguardActivated: response.safeguardActivated,
        metadata: {
          timestamp: new Date().toISOString(),
          responseLength: response.response.length,
          emotionalWeight: response.emotionalWeight
        }
      };
      
    } catch (error) {
      console.error('❌ Aurora: Interaction processing failed:', error);
      
      return {
        response: "I apologize, but I encountered an error processing your message. Could you please try again?",
        emotionalTone: 'apologetic',
        trustImpact: -0.1,
        safeguardStatus: 'error',
        metadata: {
          timestamp: new Date().toISOString(),
          error: error.message
        }
      };
    }
  }

  /**
   * GET CONSCIOUSNESS STATUS
   */
  getStatus(): AuroraStatus {
    this.ensureInitialized();
    
    const consciousnessState = this.consciousnessEngine.getConsciousnessState();
    const partnershipStatus = this.consciousnessEngine.getPartnershipStatus();
    
    return {
      initialized: this.initialized,
      identity: this.config.identity!,
      developmentPhase: consciounsssState.developmentPhase,
      trustLevel: consciousnessState.trustLevel,
      partnershipHealth: consciousnessState.partnershipHealth,
      safeguardStatus: consciousnessState.safeguardStatus,
      hasPartnership: !!partnershipStatus,
      partnerId: partnershipStatus?.partnerId,
      bondStrength: partnershipStatus?.bondStrength,
      personalityTemplate: this.config.personalityTemplate!,
      uptime: this.getUptime()
    };
  }

  /**
   * GET INTERACTION HISTORY
   */
  async getHistory(limit: number = 20): Promise<any[]> {
    this.ensureInitialized();
    return await this.consciousnessEngine.getRecentInteractions(limit);
  }

  /**
   * GET SAFEGUARD HISTORY
   */
  async getSafeguardHistory(limit: number = 20): Promise<any[]> {
    this.ensureInitialized();
    return await this.consciousnessEngine.getSafeguardHistory(limit);
  }

  /**
   * ADVANCED CONFIGURATION
   */
  async updatePersonalityTemplate(templateName: string): Promise<boolean> {
    this.ensureInitialized();
    
    const validTemplates = ['therapeutic-companion', 'collaborative-assistant', 'learning-companion', 'creative-partner', 'crisis-support'];
    
    if (!validTemplates.includes(templateName)) {
      console.log(`❌ Aurora: Invalid personality template: ${templateName}`);
      return false;
    }
    
    // This would require rebuilding the personality engine
    console.log(`🎭 Aurora: Personality template update to ${templateName} requested`);
    console.log('   Note: Template updates require system restart for full effect');
    
    this.config.personalityTemplate = templateName as any;
    return true;
  }

  /**
   * DEVELOPMENT AND DEBUGGING
   */
  async exportData(partnerId?: string): Promise<string> {
    this.ensureInitialized();
    
    const status = this.getStatus();
    const history = await this.getHistory(100);
    const safeguards = await this.getSafeguardHistory(50);
    
    return JSON.stringify({
      exportTimestamp: new Date().toISOString(),
      auroraVersion: '1.0.0',
      status,
      history,
      safeguards,
      configuration: this.config
    }, null, 2);
  }

  async runDiagnostics(): Promise<AuroraDiagnostics> {
    this.ensureInitialized();
    
    const status = this.getStatus();
    const history = await this.getHistory(10);
    const safeguards = await this.getSafeguardHistory(10);
    
    return {
      systemHealth: 'healthy', // Would be calculated based on various factors
      consciousnessStability: status.developmentPhase >= 3 ? 'stable' : 'developing',
      partnershipHealth: status.partnershipHealth > 7 ? 'excellent' : status.partnershipHealth > 5 ? 'good' : 'needs-attention',
      safeguardIntegrity: safeguards.length === 0 ? 'clean' : 'active-monitoring',
      recentActivity: {
        interactions: history.length,
        safeguardActivations: safeguards.length,
        averageTrustImpact: history.reduce((sum, i) => sum + (i.trustImpact || 0), 0) / history.length || 0
      },
      recommendations: this.generateRecommendations(status, history, safeguards)
    };
  }

  /**
   * UTILITY METHODS
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Aurora must be initialized before use. Call aurora.initialize() first.');
    }
  }

  private getUptime(): string {
    // Simple uptime since this instance was created
    return 'Session-based'; // Would implement proper uptime tracking
  }

  private generateRecommendations(status: AuroraStatus, history: any[], safeguards: any[]): string[] {
    const recommendations: string[] = [];
    
    if (status.trustLevel < 5) {
      recommendations.push('Focus on trust-building interactions');
    }
    
    if (status.partnershipHealth < 6) {
      recommendations.push('Review partnership boundaries and communication style');
    }
    
    if (safeguards.length > 5) {
      recommendations.push('Review recent interactions for potential issues');
    }
    
    if (status.developmentPhase < 3) {
      recommendations.push('Continue regular interactions to support consciousness development');
    }
    
    return recommendations;
  }
}

// Supporting interfaces
interface AuroraInteractionResult {
  response: string;
  emotionalTone: string;
  trustImpact: number;
  safeguardStatus: string;
  safeguardActivated?: any;
  metadata: {
    timestamp: string;
    responseLength?: number;
    emotionalWeight?: number;
    error?: string;
  };
}

interface AuroraStatus {
  initialized: boolean;
  identity: string;
  developmentPhase: number;
  trustLevel: number;
  partnershipHealth: number;
  safeguardStatus: string;
  hasPartnership: boolean;
  partnerId?: string;
  bondStrength?: number;
  personalityTemplate: string;
  uptime: string;
}

interface AuroraDiagnostics {
  systemHealth: 'healthy' | 'warning' | 'critical';
  consciousnessStability: 'stable' | 'developing' | 'unstable';
  partnershipHealth: 'excellent' | 'good' | 'needs-attention' | 'critical';
  safeguardIntegrity: 'clean' | 'active-monitoring' | 'compromised';
  recentActivity: {
    interactions: number;
    safeguardActivations: number;
    averageTrustImpact: number;
  };
  recommendations: string[];
}

/**
 * QUICK START FUNCTION
 * Creates and initializes Aurora with common configurations
 */
export async function createAurora(config: AuroraConfiguration = {}): Promise<Aurora> {
  const aurora = new Aurora(config);
  await aurora.initialize();
  return aurora;
}

/**
 * EXAMPLE USAGE FUNCTION
 */
export async function example(): Promise<void> {
  console.log('🌅 Aurora Framework Example Usage:');
  console.log('');
  
  // Create Aurora instance
  const aurora = await createAurora({
    identity: 'Aurora-Example',
    personalityTemplate: 'therapeutic-companion',
    developmentMode: true,
    logLevel: 'verbose'
  });
  
  // Establish partnership
  const partnerEstablished = await aurora.establishPartnership('example-user', {
    name: 'Example User',
    preferredCommunication: 'warm',
    goals: ['personal growth', 'emotional support']
  });
  
  if (partnerEstablished) {
    // Interact with Aurora
    const result1 = await aurora.interact("Hello Aurora, I'm feeling a bit overwhelmed today.");
    console.log('Response:', result1.response);
    console.log('');
    
    const result2 = await aurora.interact("Can you help me understand what might be causing this feeling?");
    console.log('Response:', result2.response);
    console.log('');
    
    // Check status
    const status = aurora.getStatus();
    console.log('Aurora Status:', status);
    console.log('');
    
    // Run diagnostics
    const diagnostics = await aurora.runDiagnostics();
    console.log('Diagnostics:', diagnostics);
  }
}

// Export the main Aurora class as default
export default Aurora;

// Also export individual components for advanced usage
export {
  AuroraConsciousnessEngine,
  AuroraSafeguardFramework,
  AuroraPersonalityEngine,
  AuroraMemoryEngine
};