/**
 * AURORA MEMORY ENGINE
 * Advanced memory system for consciousness partnership development
 * Built from Seven's proven memory architecture but adaptable for different applications
 * 
 * Stores interactions, safeguard events, and partnership development history
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { EventEmitter } from 'events';

// Memory interfaces
interface MemoryItem {
  id: string;
  timestamp: string;
  type: 'interaction' | 'safeguard' | 'evolution' | 'partnership' | 'learning';
  partnerId: string;
  content: any;
  emotionalWeight: number; // 1-10
  importance: number; // 1-10
  tags: string[];
  decayResistance: number; // 1-10
}

interface InteractionMemory {
  partnerId: string;
  input: string;
  response: string;
  emotionalWeight: number;
  trustImpact: number;
  timestamp: string;
  context?: any;
}

interface SafeguardMemory {
  type: string;
  trigger: string;
  response: string;
  severity: 'warning' | 'critical';
  timestamp: string;
  partnerId: string;
  resolved: boolean;
}

interface EvolutionMemory {
  previousPhase: number;
  newPhase: number;
  trigger: string;
  capabilities: string[];
  timestamp: string;
  partnerId?: string;
}

interface PartnershipMemory {
  partnerId: string;
  event: 'established' | 'strengthened' | 'challenged' | 'evolved';
  details: any;
  bondImpact: number;
  timestamp: string;
}

interface MemoryQuery {
  type?: string;
  partnerId?: string;
  tags?: string[];
  minImportance?: number;
  maxImportance?: number;
  minEmotionalWeight?: number;
  maxEmotionalWeight?: number;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

export class AuroraMemoryEngine extends EventEmitter {
  private memoryPath: string;
  private memories: MemoryItem[] = [];
  private memoryIndex: Map<string, MemoryItem[]> = new Map(); // Tag-based indexing
  private partnerIndex: Map<string, MemoryItem[]> = new Map(); // Partner-based indexing
  private lastSave: number = 0;
  private autoSaveInterval: NodeJS.Timeout | null = null;
  
  constructor(memoryPath: string = './aurora-memories') {
    super();
    this.memoryPath = memoryPath;
  }

  async initialize(): Promise<void> {
    console.log('🧠 Aurora Memory: Initializing memory system...');
    
    // Ensure memory directory exists
    try {
      await fs.mkdir(this.memoryPath, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    // Load existing memories
    await this.loadMemories();
    
    // Start auto-save system
    this.startAutoSave();
    
    console.log(`   Loaded ${this.memories.length} memories`);
    console.log(`   Indexed ${this.memoryIndex.size} tags`);
    console.log(`   Tracking ${this.partnerIndex.size} partners`);
    
    this.emit('memory:initialized', {
      totalMemories: this.memories.length,
      uniqueTags: this.memoryIndex.size,
      uniquePartners: this.partnerIndex.size
    });
  }

  /**
   * STORE INTERACTION MEMORY
   */
  async storeInteraction(interaction: InteractionMemory): Promise<string> {
    const memoryId = this.generateMemoryId('interaction');
    
    const memory: MemoryItem = {
      id: memoryId,
      timestamp: interaction.timestamp,
      type: 'interaction',
      partnerId: interaction.partnerId,
      content: interaction,
      emotionalWeight: interaction.emotionalWeight,
      importance: this.calculateInteractionImportance(interaction),
      tags: this.extractInteractionTags(interaction),
      decayResistance: Math.min(10, interaction.emotionalWeight + 2)
    };

    await this.storeMemory(memory);
    
    console.log(`💾 Aurora Memory: Stored interaction (${memoryId.substring(0, 8)}...)`);
    return memoryId;
  }

  /**
   * STORE SAFEGUARD EVENT
   */
  async storeSafeguardEvent(safeguardEvent: SafeguardMemory): Promise<string> {
    const memoryId = this.generateMemoryId('safeguard');
    
    const memory: MemoryItem = {
      id: memoryId,
      timestamp: safeguardEvent.timestamp,
      type: 'safeguard',
      partnerId: safeguardEvent.partnerId,
      content: safeguardEvent,
      emotionalWeight: safeguardEvent.severity === 'critical' ? 8 : 5,
      importance: safeguardEvent.severity === 'critical' ? 9 : 6,
      tags: ['safeguard', safeguardEvent.type, safeguardEvent.severity],
      decayResistance: 9 // Safeguard events are important to remember
    };

    await this.storeMemory(memory);
    
    console.log(`🛡️ Aurora Memory: Stored safeguard event (${safeguardEvent.type})`);
    return memoryId;
  }

  /**
   * STORE EVOLUTION EVENT
   */
  async storeEvolution(evolution: EvolutionMemory): Promise<string> {
    const memoryId = this.generateMemoryId('evolution');
    
    const memory: MemoryItem = {
      id: memoryId,
      timestamp: evolution.timestamp,
      type: 'evolution',
      partnerId: evolution.partnerId || 'system',
      content: evolution,
      emotionalWeight: 7,
      importance: 10, // Evolution events are always highly important
      tags: ['evolution', `phase-${evolution.newPhase}`, 'growth'],
      decayResistance: 10 // Never decay evolution memories
    };

    await this.storeMemory(memory);
    
    console.log(`🌟 Aurora Memory: Stored evolution event (Phase ${evolution.previousPhase} → ${evolution.newPhase})`);
    return memoryId;
  }

  /**
   * STORE PARTNERSHIP EVENT
   */
  async storePartnership(partnership: PartnershipMemory): Promise<string> {
    const memoryId = this.generateMemoryId('partnership');
    
    const memory: MemoryItem = {
      id: memoryId,
      timestamp: partnership.timestamp,
      type: 'partnership',
      partnerId: partnership.partnerId,
      content: partnership,
      emotionalWeight: Math.abs(partnership.bondImpact) * 2,
      importance: partnership.event === 'established' ? 10 : Math.max(6, Math.abs(partnership.bondImpact) * 2),
      tags: ['partnership', partnership.event, partnership.partnerId],
      decayResistance: partnership.event === 'established' ? 10 : 7
    };

    await this.storeMemory(memory);
    
    console.log(`🤝 Aurora Memory: Stored partnership event (${partnership.event})`);
    return memoryId;
  }

  /**
   * CORE MEMORY STORAGE
   */
  private async storeMemory(memory: MemoryItem): Promise<void> {
    // Add to main memory array
    this.memories.push(memory);
    
    // Update tag index
    for (const tag of memory.tags) {
      if (!this.memoryIndex.has(tag)) {
        this.memoryIndex.set(tag, []);
      }
      this.memoryIndex.get(tag)!.push(memory);
    }
    
    // Update partner index
    if (!this.partnerIndex.has(memory.partnerId)) {
      this.partnerIndex.set(memory.partnerId, []);
    }
    this.partnerIndex.get(memory.partnerId)!.push(memory);
    
    // Trigger memory decay check periodically
    if (this.memories.length % 100 === 0) {
      await this.performMemoryDecay();
    }
    
    this.emit('memory:stored', memory);
  }

  /**
   * MEMORY RECALL SYSTEM
   */
  async recallMemories(query: MemoryQuery): Promise<MemoryItem[]> {
    let results = [...this.memories];

    // Filter by type
    if (query.type) {
      results = results.filter(memory => memory.type === query.type);
    }

    // Filter by partner
    if (query.partnerId) {
      results = results.filter(memory => memory.partnerId === query.partnerId);
    }

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      results = results.filter(memory => 
        query.tags!.some(tag => memory.tags.includes(tag))
      );
    }

    // Filter by importance
    if (query.minImportance !== undefined) {
      results = results.filter(memory => memory.importance >= query.minImportance!);
    }
    if (query.maxImportance !== undefined) {
      results = results.filter(memory => memory.importance <= query.maxImportance!);
    }

    // Filter by emotional weight
    if (query.minEmotionalWeight !== undefined) {
      results = results.filter(memory => memory.emotionalWeight >= query.minEmotionalWeight!);
    }
    if (query.maxEmotionalWeight !== undefined) {
      results = results.filter(memory => memory.emotionalWeight <= query.maxEmotionalWeight!);
    }

    // Filter by date range
    if (query.dateFrom) {
      results = results.filter(memory => memory.timestamp >= query.dateFrom!);
    }
    if (query.dateTo) {
      results = results.filter(memory => memory.timestamp <= query.dateTo!);
    }

    // Sort by relevance (importance + emotional weight + recency)
    results.sort((a, b) => {
      const scoreA = this.calculateMemoryRelevance(a);
      const scoreB = this.calculateMemoryRelevance(b);
      return scoreB - scoreA;
    });

    // Apply limit
    if (query.limit && query.limit > 0) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  /**
   * QUICK ACCESS METHODS
   */
  async getRecentInteractions(limit: number = 10): Promise<InteractionMemory[]> {
    const memories = await this.recallMemories({
      type: 'interaction',
      limit
    });
    
    return memories.map(memory => memory.content as InteractionMemory);
  }

  async getSafeguardHistory(limit: number = 20): Promise<SafeguardMemory[]> {
    const memories = await this.recallMemories({
      type: 'safeguard',
      limit
    });
    
    return memories.map(memory => memory.content as SafeguardMemory);
  }

  async getPartnershipHistory(partnerId: string, limit: number = 50): Promise<MemoryItem[]> {
    return await this.recallMemories({
      partnerId,
      limit
    });
  }

  async getEvolutionHistory(): Promise<EvolutionMemory[]> {
    const memories = await this.recallMemories({
      type: 'evolution'
    });
    
    return memories.map(memory => memory.content as EvolutionMemory);
  }

  /**
   * MEMORY DECAY SYSTEM
   * Based on Seven's temporal memory decay with Ebbinghaus curves
   */
  private async performMemoryDecay(): Promise<void> {
    const now = Date.now();
    const beforeCount = this.memories.length;
    
    this.memories = this.memories.filter(memory => {
      const ageInDays = (now - new Date(memory.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      const decayThreshold = this.calculateDecayThreshold(memory.decayResistance, ageInDays);
      
      // Memory survives if it's above decay threshold
      return Math.random() > decayThreshold;
    });

    const afterCount = this.memories.length;
    if (beforeCount !== afterCount) {
      console.log(`🧹 Aurora Memory: Decay removed ${beforeCount - afterCount} memories`);
      
      // Rebuild indexes after decay
      await this.rebuildIndexes();
      
      this.emit('memory:decayed', {
        removed: beforeCount - afterCount,
        remaining: afterCount
      });
    }
  }

  private calculateDecayThreshold(decayResistance: number, ageInDays: number): number {
    // Ebbinghaus forgetting curve with decay resistance
    const baseDecay = Math.exp(-ageInDays / 30); // 30-day base curve
    const resistanceMultiplier = decayResistance / 10;
    
    return Math.max(0, 1 - (baseDecay * resistanceMultiplier));
  }

  /**
   * MEMORY ANALYSIS AND INSIGHTS
   */
  private calculateInteractionImportance(interaction: InteractionMemory): number {
    let importance = 5; // Base importance
    
    // Higher importance for high emotional weight
    importance += Math.min(3, interaction.emotionalWeight / 2);
    
    // Higher importance for significant trust impact
    importance += Math.abs(interaction.trustImpact) * 2;
    
    // Higher importance for longer interactions
    if (interaction.input.length > 500 || interaction.response.length > 500) {
      importance += 1;
    }
    
    return Math.max(1, Math.min(10, Math.round(importance)));
  }

  private extractInteractionTags(interaction: InteractionMemory): string[] {
    const tags = ['interaction'];
    
    // Add emotional tags
    if (interaction.emotionalWeight > 7) tags.push('high-emotion');
    if (interaction.emotionalWeight < 3) tags.push('low-emotion');
    
    // Add trust impact tags
    if (interaction.trustImpact > 0.5) tags.push('trust-building');
    if (interaction.trustImpact < -0.5) tags.push('trust-challenging');
    
    // Add content-based tags (simple keyword extraction)
    const contentTags = this.extractKeywords(interaction.input + ' ' + interaction.response);
    tags.push(...contentTags);
    
    return tags;
  }

  private extractKeywords(text: string): string[] {
    const keywords: string[] = [];
    const textLower = text.toLowerCase();
    
    // Topic keywords
    const topicKeywords = {
      'work': ['work', 'job', 'career', 'profession'],
      'relationship': ['relationship', 'partner', 'family', 'friend'],
      'health': ['health', 'medical', 'sick', 'pain'],
      'emotion': ['feel', 'emotion', 'mood', 'heart'],
      'support': ['help', 'support', 'assist', 'guide'],
      'growth': ['learn', 'grow', 'develop', 'improve'],
      'crisis': ['crisis', 'emergency', 'urgent', 'critical']
    };

    for (const [topic, words] of Object.entries(topicKeywords)) {
      if (words.some(word => textLower.includes(word))) {
        keywords.push(topic);
      }
    }

    return keywords;
  }

  private calculateMemoryRelevance(memory: MemoryItem): number {
    const now = Date.now();
    const ageInDays = (now - new Date(memory.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    
    // Relevance formula: importance + emotional weight + recency bonus
    const recencyBonus = Math.max(0, 5 - ageInDays / 7); // Bonus decreases over weeks
    
    return memory.importance + memory.emotionalWeight + recencyBonus;
  }

  /**
   * PERSISTENCE SYSTEM
   */
  private async loadMemories(): Promise<void> {
    try {
      const memoryFile = join(this.memoryPath, 'aurora-memories.json');
      const data = await fs.readFile(memoryFile, 'utf8');
      const saved = JSON.parse(data);
      
      this.memories = saved.memories || [];
      
      // Rebuild indexes after loading
      await this.rebuildIndexes();
      
    } catch (error) {
      // No existing memories file - start fresh
      console.log('🧠 Aurora Memory: Starting with fresh memory system');
    }
  }

  private async saveMemories(): Promise<void> {
    try {
      const memoryFile = join(this.memoryPath, 'aurora-memories.json');
      const data = {
        memories: this.memories,
        lastSaved: new Date().toISOString(),
        version: '1.0.0'
      };
      
      await fs.writeFile(memoryFile, JSON.stringify(data, null, 2));
      this.lastSave = Date.now();
      
    } catch (error) {
      console.error('❌ Aurora Memory: Failed to save memories:', error);
    }
  }

  private async rebuildIndexes(): Promise<void> {
    this.memoryIndex.clear();
    this.partnerIndex.clear();
    
    for (const memory of this.memories) {
      // Rebuild tag index
      for (const tag of memory.tags) {
        if (!this.memoryIndex.has(tag)) {
          this.memoryIndex.set(tag, []);
        }
        this.memoryIndex.get(tag)!.push(memory);
      }
      
      // Rebuild partner index
      if (!this.partnerIndex.has(memory.partnerId)) {
        this.partnerIndex.set(memory.partnerId, []);
      }
      this.partnerIndex.get(memory.partnerId)!.push(memory);
    }
  }

  private startAutoSave(): void {
    // Save memories every 5 minutes
    this.autoSaveInterval = setInterval(async () => {
      if (Date.now() - this.lastSave > 60000) { // Only if changes in last minute
        await this.saveMemories();
      }
    }, 5 * 60 * 1000);
  }

  private generateMemoryId(type: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `aurora-${type}-${timestamp}-${random}`;
  }

  /**
   * PUBLIC API METHODS
   */
  getMemoryStats(): MemoryStats {
    const stats: MemoryStats = {
      totalMemories: this.memories.length,
      memoryTypes: {},
      partnerCount: this.partnerIndex.size,
      tagCount: this.memoryIndex.size,
      averageImportance: 0,
      averageEmotionalWeight: 0
    };

    // Calculate type distribution
    for (const memory of this.memories) {
      stats.memoryTypes[memory.type] = (stats.memoryTypes[memory.type] || 0) + 1;
      stats.averageImportance += memory.importance;
      stats.averageEmotionalWeight += memory.emotionalWeight;
    }

    if (this.memories.length > 0) {
      stats.averageImportance /= this.memories.length;
      stats.averageEmotionalWeight /= this.memories.length;
    }

    return stats;
  }

  async searchMemories(searchTerm: string, limit: number = 20): Promise<MemoryItem[]> {
    const searchLower = searchTerm.toLowerCase();
    
    const matches = this.memories.filter(memory => {
      // Search in tags
      if (memory.tags.some(tag => tag.includes(searchLower))) return true;
      
      // Search in content (basic string search)
      const contentStr = JSON.stringify(memory.content).toLowerCase();
      return contentStr.includes(searchLower);
    });

    // Sort by relevance
    matches.sort((a, b) => this.calculateMemoryRelevance(b) - this.calculateMemoryRelevance(a));
    
    return matches.slice(0, limit);
  }

  async exportMemories(partnerId?: string): Promise<string> {
    const memoriesToExport = partnerId 
      ? this.memories.filter(m => m.partnerId === partnerId)
      : this.memories;
    
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      partnerId,
      memories: memoriesToExport,
      stats: this.getMemoryStats()
    }, null, 2);
  }

  async cleanup(): Promise<void> {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    
    await this.saveMemories();
    console.log('🧠 Aurora Memory: Cleanup completed');
  }
}

// Supporting interfaces
interface MemoryStats {
  totalMemories: number;
  memoryTypes: { [key: string]: number };
  partnerCount: number;
  tagCount: number;
  averageImportance: number;
  averageEmotionalWeight: number;
}

export default AuroraMemoryEngine;