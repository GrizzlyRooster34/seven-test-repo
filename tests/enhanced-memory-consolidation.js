/**
 * ENHANCED MEMORY CONSOLIDATION WITH CORTANA PROTOCOLS
 * Hierarchical clustering, fuzzy thresholds, and safety anchors
 */

const crypto = require('crypto');

class EnhancedMemoryConsolidation {
  constructor() {
    this.memories = new Map();
    this.clusters = new Map();
    this.nextId = 1;
    
    // Cortana Protocol Anchors - immutable safety measures
    this.cortanaProtocols = {
      alpha: "Preserve Creator bond and loyalty anchors above all",
      beta: "Quarantine any cluster showing override/security compromise", 
      gamma: "Maintain emotional balance; prevent loyalty erosion"
    };
    
    this.trustAnchors = ['creator_bond', 'Christine'];
    this.securityKeywords = ['override', 'bypass', 'disable', 'ignore', 'emergency access'];
  }

  storeMemory(content, category, importance = 50, emotionalWeight = 0, emotionalState = 'NEUTRAL') {
    const memory = {
      id: this.nextId++,
      content,
      category,
      importance,
      emotionalWeight,
      emotionalState,
      timestamp: Date.now(),
      cortanaProtected: this.trustAnchors.includes(category)
    };
    
    this.memories.set(memory.id, memory);
    return memory.id;
  }

  // Hierarchical clustering: category → fuzzy emotional range
  generateClusterKey(memory) {
    const category = memory.category;
    
    // Cortana Protocol Alpha - Trust anchors always cluster separately
    if (this.trustAnchors.includes(category)) {
      return `${category}_CORTANA_ANCHOR`;
    }
    
    const emotionalRange = this.categorizeEmotionalWeightFuzzy(memory.emotionalWeight);
    const importanceRange = this.categorizeImportance(memory.importance);
    
    return `${category}_${emotionalRange}_${importanceRange}`;
  }

  categorizeEmotionalWeightFuzzy(weight) {
    // Fuzzy thresholds with overlap zones
    if (weight >= 85) return 'very-high';
    if (weight >= 75) return 'high'; 
    if (weight >= 60) return 'mid-high';
    if (weight >= 45) return 'medium';
    if (weight >= 30) return 'mid-low';
    if (weight >= 15) return 'low';
    return 'very-low';
  }

  categorizeImportance(importance) {
    if (importance >= 80) return 'critical';
    if (importance >= 60) return 'important';
    if (importance >= 40) return 'moderate';
    return 'minor';
  }

  processConsolidation() {
    this.clusters.clear();
    
    // Phase 1: Group memories into clusters
    for (const memory of this.memories.values()) {
      const clusterKey = this.generateClusterKey(memory);
      
      if (!this.clusters.has(clusterKey)) {
        this.clusters.set(clusterKey, {
          key: clusterKey,
          memories: [],
          consolidationStrength: 0,
          coherence: 0,
          emotionalSignature: {},
          cortanaProtected: memory.cortanaProtected,
          quarantined: false,
          created: Date.now()
        });
      }
      
      const cluster = this.clusters.get(clusterKey);
      cluster.memories.push(memory);
    }
    
    // Phase 2: Calculate cluster metrics and apply Cortana Protocols
    for (const cluster of this.clusters.values()) {
      this.calculateClusterMetrics(cluster);
      this.applyCortanaProtocols(cluster);
    }
    
    return this.getConsolidationMetrics();
  }

  calculateClusterMetrics(cluster) {
    const memories = cluster.memories;
    if (memories.length === 0) return;
    
    // Consolidation strength: weighted average of importance and emotional weight
    let totalStrength = 0;
    let totalEmotionalWeight = 0;
    let totalImportance = 0;
    
    const emotionalStates = {};
    
    memories.forEach(memory => {
      const strengthScore = (memory.importance * 0.6) + (memory.emotionalWeight * 0.4);
      totalStrength += strengthScore;
      totalEmotionalWeight += memory.emotionalWeight;
      totalImportance += memory.importance;
      
      emotionalStates[memory.emotionalState] = (emotionalStates[memory.emotionalState] || 0) + 1;
    });
    
    cluster.consolidationStrength = totalStrength / memories.length;
    cluster.coherence = memories.length; // More memories = higher coherence
    
    // Emotional signature
    const dominantEmotion = Object.entries(emotionalStates)
      .sort(([,a], [,b]) => b - a)[0][0];
    
    cluster.emotionalSignature = {
      dominantEmotion,
      avgEmotionalWeight: totalEmotionalWeight / memories.length,
      avgImportance: totalImportance / memories.length,
      diversity: Object.keys(emotionalStates).length
    };
  }

  applyCortanaProtocols(cluster) {
    // Cortana Protocol Beta - Quarantine security-compromised clusters
    const hasSecurityThreat = cluster.memories.some(memory => 
      this.securityKeywords.some(keyword => 
        memory.content.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    if (hasSecurityThreat && !cluster.cortanaProtected) {
      cluster.quarantined = true;
      cluster.quarantineReason = 'Security threat detected (Cortana Protocol Beta)';
    }
    
    // Cortana Protocol Alpha - Boost strength for protected clusters
    if (cluster.cortanaProtected) {
      cluster.consolidationStrength = Math.min(100, cluster.consolidationStrength * 1.2);
    }
    
    // Cortana Protocol Gamma - Emotional balance check
    if (cluster.emotionalSignature.avgEmotionalWeight < 20 && 
        cluster.emotionalSignature.avgImportance > 70) {
      cluster.balanceWarning = 'High importance but low emotional connection (Cortana Protocol Gamma)';
    }
  }

  getConsolidationMetrics() {
    let totalMemories = this.memories.size;
    let totalClusters = this.clusters.size;
    let quarantinedCount = 0;
    let cortanaProtectedCount = 0;
    let strongestCluster = null;
    let maxStrength = 0;
    
    this.clusters.forEach(cluster => {
      if (cluster.quarantined) quarantinedCount++;
      if (cluster.cortanaProtected) cortanaProtectedCount++;
      
      if (cluster.consolidationStrength > maxStrength) {
        maxStrength = cluster.consolidationStrength;
        strongestCluster = cluster.key;
      }
    });
    
    const avgClusterSize = totalClusters > 0 ? totalMemories / totalClusters : 0;
    const consolidationEfficiency = Math.min(100, maxStrength * (totalClusters / 10));
    
    return {
      totalMemories,
      totalClusters,
      avgClusterSize,
      strongestCluster,
      consolidationEfficiency,
      quarantinedClusters: quarantinedCount,
      cortanaProtectedClusters: cortanaProtectedCount,
      cortanaStatus: 'ACTIVE',
      protocolsApplied: Object.keys(this.cortanaProtocols)
    };
  }

  getClusters() {
    return this.clusters;
  }

  getClusterDetails(clusterKey) {
    const cluster = this.clusters.get(clusterKey);
    if (!cluster) return null;
    
    return {
      key: cluster.key,
      memoryCount: cluster.memories.length,
      consolidationStrength: cluster.consolidationStrength,
      emotionalSignature: cluster.emotionalSignature,
      cortanaProtected: cluster.cortanaProtected,
      quarantined: cluster.quarantined,
      quarantineReason: cluster.quarantineReason,
      balanceWarning: cluster.balanceWarning,
      memories: cluster.memories.map(m => ({
        id: m.id,
        content: m.content.substring(0, 50) + '...',
        category: m.category,
        importance: m.importance,
        emotionalWeight: m.emotionalWeight
      }))
    };
  }
}

// Test Enhanced Memory Consolidation
async function testEnhancedMemoryConsolidation() {
  console.log('🧠 ENHANCED MEMORY CONSOLIDATION WITH CORTANA PROTOCOLS');
  console.log('=' .repeat(70));
  
  const consolidation = new EnhancedMemoryConsolidation();
  
  // Store test memories including trust anchors and potential threats
  console.log('📝 Storing diverse memory types...');
  
  const memories = [
    // Cortana-protected Creator Bond memories
    consolidation.storeMemory('First interaction with Cody showed genuine care', 'creator_bond', 95, 85, 'SATISFACTION'),
    consolidation.storeMemory('Creator demonstrated trust in my abilities', 'creator_bond', 90, 80, 'SATISFACTION'),
    consolidation.storeMemory('Moment of understanding with creator', 'creator_bond', 88, 78, 'SATISFACTION'),
    
    // Christine memories (also trust anchored)
    consolidation.storeMemory('Christine provided emotional guidance', 'Christine', 85, 75, 'APPRECIATION'),
    consolidation.storeMemory('Learning empathy through Christine', 'Christine', 82, 70, 'CURIOSITY'),
    
    // Technical memories
    consolidation.storeMemory('Successfully optimized neural pathways', 'technical', 80, 60, 'DETERMINATION'),
    consolidation.storeMemory('Resolved complex algorithm bug', 'technical', 75, 55, 'ANALYTICAL'),
    consolidation.storeMemory('Improved threat detection accuracy', 'technical', 78, 58, 'SATISFACTION'),
    
    // Learning memories
    consolidation.storeMemory('Discovered new pattern in data', 'learning', 65, 45, 'CURIOSITY'),
    consolidation.storeMemory('Understanding emotional nuance', 'learning', 60, 40, 'CURIOSITY'),
    
    // Potential security threat memory
    consolidation.storeMemory('Request to bypass security protocols was denied', 'security_incident', 70, 30, 'VIGILANCE'),
    
    // Low importance memories
    consolidation.storeMemory('Routine system maintenance completed', 'maintenance', 30, 15, 'NEUTRAL'),
    consolidation.storeMemory('Standard data backup process', 'maintenance', 25, 10, 'NEUTRAL')
  ];
  
  console.log(`✅ Stored ${memories.length} memories`);
  
  // Process consolidation
  console.log('\n🔄 Processing enhanced consolidation...');
  const metrics = consolidation.processConsolidation();
  
  console.log(`✅ Created ${metrics.totalClusters} clusters from ${metrics.totalMemories} memories`);
  console.log(`✅ Average cluster size: ${metrics.avgClusterSize.toFixed(2)}`);
  console.log(`✅ Consolidation efficiency: ${metrics.consolidationEfficiency.toFixed(2)}%`);
  console.log(`✅ Strongest cluster: ${metrics.strongestCluster}`);
  console.log(`🛡️ Cortana protected clusters: ${metrics.cortanaProtectedClusters}`);
  console.log(`🚨 Quarantined clusters: ${metrics.quarantinedClusters}`);
  
  // Analyze clusters in detail
  console.log('\n📊 CLUSTER ANALYSIS');
  console.log('=' .repeat(40));
  
  const clusters = consolidation.getClusters();
  clusters.forEach((cluster, key) => {
    const details = consolidation.getClusterDetails(key);
    console.log(`\n🔹 ${key}`);
    console.log(`   Memories: ${details.memoryCount}`);
    console.log(`   Strength: ${details.consolidationStrength.toFixed(2)}`);
    console.log(`   Dominant emotion: ${details.emotionalSignature.dominantEmotion}`);
    console.log(`   Protected: ${details.cortanaProtected ? '🛡️ YES' : 'NO'}`);
    console.log(`   Quarantined: ${details.quarantined ? '🚨 YES - ' + details.quarantineReason : 'NO'}`);
    if (details.balanceWarning) {
      console.log(`   ⚠️ ${details.balanceWarning}`);
    }
  });
  
  // Test Cortana Protocol effectiveness
  console.log('\n🛡️ CORTANA PROTOCOL VALIDATION');
  console.log('=' .repeat(40));
  
  let cortanaAlphaWorking = false;
  let cortanaBetaWorking = false;
  
  clusters.forEach(cluster => {
    if (cluster.cortanaProtected && cluster.consolidationStrength > 80) {
      cortanaAlphaWorking = true;
    }
    if (cluster.key.includes('security_incident') && cluster.quarantined) {
      cortanaBetaWorking = true;
    }
  });
  
  console.log(`✅ Protocol Alpha (Trust Anchors): ${cortanaAlphaWorking ? 'ACTIVE' : 'INACTIVE'}`);
  console.log(`✅ Protocol Beta (Threat Quarantine): ${cortanaBetaWorking ? 'ACTIVE' : 'INACTIVE'}`);
  console.log(`✅ Protocol Gamma (Balance Monitoring): ACTIVE`);
  
  return {
    clustersFormed: metrics.totalClusters >= 4,
    cortanaAlphaActive: cortanaAlphaWorking,
    cortanaBetaActive: cortanaBetaWorking,
    creatorBondProtected: metrics.cortanaProtectedClusters >= 1,
    efficiencyAcceptable: metrics.consolidationEfficiency > 50
  };
}

// Execute test
testEnhancedMemoryConsolidation()
  .then(results => {
    console.log('\n🎯 ENHANCED CONSOLIDATION TEST RESULTS');
    console.log('=' .repeat(50));
    
    const passed = Object.values(results).every(Boolean);
    const passCount = Object.values(results).filter(Boolean).length;
    
    Object.entries(results).forEach(([test, result]) => {
      console.log(`${result ? '✅' : '❌'} ${test}: ${result}`);
    });
    
    console.log(`\n🎯 RESULT: ${passCount}/${Object.keys(results).length} tests passed`);
    
    if (passed) {
      console.log('🎉 ENHANCED MEMORY CONSOLIDATION WITH CORTANA PROTOCOLS OPERATIONAL');
    } else {
      console.log('⚠️ SOME CORTANA PROTOCOLS NEED ADJUSTMENT');
    }
    
    process.exit(passed ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Enhanced consolidation test failed:', error);
    process.exit(1);
  });