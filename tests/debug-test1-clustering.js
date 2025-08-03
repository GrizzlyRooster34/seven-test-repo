// Debug Test 1 clustering specifically

function categorizeEmotionalWeight(weight) {
  if (weight >= 80) return 'high-emotion';
  if (weight >= 50) return 'mid-emotion';
  if (weight >= 20) return 'low-emotion';
  return 'neutral';
}

function generateClusterKey(memory) {
  const categoryWeight = memory.category;
  const emotionalRange = categorizeEmotionalWeight(memory.emotionalWeight);
  return `${categoryWeight}_${emotionalRange}`;
}

// The exact memories from Test 1
const memories = [
  // Creator bond cluster
  { category: 'creator_bond', importance: 95, emotionalWeight: 80, emotionalState: 'SATISFACTION' },
  { category: 'creator_bond', importance: 90, emotionalWeight: 75, emotionalState: 'SATISFACTION' },
  { category: 'creator_bond', importance: 85, emotionalWeight: 70, emotionalState: 'SATISFACTION' },
  
  // Technical cluster
  { category: 'technical', importance: 80, emotionalWeight: 60, emotionalState: 'DETERMINATION' },
  { category: 'technical', importance: 75, emotionalWeight: 55, emotionalState: 'ANALYTICAL' },
  { category: 'technical', importance: 70, emotionalWeight: 50, emotionalState: 'ANALYTICAL' },
  
  // Learning cluster
  { category: 'episodic', importance: 65, emotionalWeight: 45, emotionalState: 'CURIOSITY' },
  { category: 'emotional', importance: 60, emotionalWeight: 40, emotionalState: 'CURIOSITY' },
  { category: 'episodic', importance: 55, emotionalWeight: 35, emotionalState: 'CURIOSITY' },
  
  // Scattered
  { category: 'episodic', importance: 30, emotionalWeight: 10, emotionalState: 'ANALYTICAL' },
  { category: 'emotional', importance: 25, emotionalWeight: 5, emotionalState: 'SATISFACTION' }
];

console.log('Memory clustering analysis:');
const clusters = new Map();

memories.forEach((memory, index) => {
  const key = generateClusterKey(memory);
  console.log(`Memory ${index + 1}: ${memory.category} (${memory.emotionalWeight}) -> ${key}`);
  
  if (!clusters.has(key)) {
    clusters.set(key, []);
  }
  clusters.get(key).push(memory);
});

console.log('\nCluster results:');
clusters.forEach((memoryList, key) => {
  console.log(`${key}: ${memoryList.length} memories`);
  if (memoryList.length >= 3) {
    console.log('  -> Would create cluster');
  }
});