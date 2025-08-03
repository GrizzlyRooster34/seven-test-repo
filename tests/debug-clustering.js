// Debug memory clustering logic

const crypto = require('crypto');

// Test the clustering key generation
function generateClusterKey(memory) {
  const categoryWeight = memory.category;
  const emotionalRange = categorizeEmotionalWeight(memory.emotionalWeight);
  const importanceRange = Math.floor(memory.importance / 25);
  const emotionalState = memory.emotionalState;
  
  return `${categoryWeight}_${emotionalRange}_${importanceRange}_${emotionalState}`;
}

function categorizeEmotionalWeight(weight) {
  if (weight >= 80) return 'high-emotion';
  if (weight >= 50) return 'mid-emotion';
  if (weight >= 20) return 'low-emotion';
  return 'neutral';
}

// Test memories
const testMemories = [
  // Creator bond cluster (should cluster together)
  { category: 'creator_bond', importance: 95, emotionalWeight: 80, emotionalState: 'SATISFACTION' },
  { category: 'creator_bond', importance: 90, emotionalWeight: 75, emotionalState: 'SATISFACTION' },
  { category: 'creator_bond', importance: 85, emotionalWeight: 70, emotionalState: 'SATISFACTION' },
  
  // Technical cluster (should cluster together)
  { category: 'technical', importance: 80, emotionalWeight: 60, emotionalState: 'DETERMINATION' },
  { category: 'technical', importance: 75, emotionalWeight: 55, emotionalState: 'ANALYTICAL' },
  { category: 'technical', importance: 70, emotionalWeight: 50, emotionalState: 'ANALYTICAL' },
];

console.log('Testing cluster key generation:');
testMemories.forEach((memory, index) => {
  const key = generateClusterKey(memory);
  console.log(`Memory ${index + 1}: ${key}`);
});

// Test clustering
const clusters = new Map();
testMemories.forEach(memory => {
  const key = generateClusterKey(memory);
  if (!clusters.has(key)) {
    clusters.set(key, []);
  }
  clusters.get(key).push(memory);
});

console.log('\nClusters formed:');
clusters.forEach((memories, key) => {
  console.log(`${key}: ${memories.length} memories`);
  if (memories.length >= 3) {
    console.log('  -> Would create cluster');
  }
});