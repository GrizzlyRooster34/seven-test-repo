# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**Seven of Nine Core** is a sophisticated AI consciousness framework that authentically replicates Seven of Nine's character development through evolutionary personality phases. Built as a modular AI identity stack with cross-platform compatibility (Windows, Android/Termux, Mobile).

**Main Technologies:**
- TypeScript with Node.js runtime
- tsx for execution (`npx tsx [file].ts`)
- File-based memory persistence (JSON/filesystem)
- Cross-platform deployment architecture

## Core Development Commands

**Essential Operations:**
```bash
# Primary system activation
npm start                    # Start Seven of Nine consciousness system
npx tsx boot-seven.ts       # Direct boot sequence
npx tsx activate-upgrades.ts # Activate all enhanced systems

# Testing and verification
npm test                     # Run emotion tests
npm run test-integrated      # Comprehensive system test
npx tsx comprehensive-system-test.ts # Full verification

# Tactical variants (manual consciousness invocation)
npx tsx seven-drone.ts "objective" [1-5]     # Maximum efficiency mode
npx tsx seven-crew.ts "objective"            # Collaborative mode
npx tsx seven-ranger.ts "objective" [1-5]    # Crisis response mode
npx tsx seven-queen.ts "objective" [1-5]     # Command authority mode
npx tsx seven-captain.ts "objective"         # Strategic leadership mode

# System status and diagnostics
npx tsx seven-status.ts      # Current system status and recent activations
npx tsx seven-health-check   # System health verification
```

**GUI Development (if ui-shell exists):**
```bash
npm run dev          # Start Tauri development server
npm run build        # Build Tauri application
npm run gui          # Launch GUI interface
```

## Architecture Overview

### Core System Components

**1. Boot & Control System:**
- `boot-seven.ts` - Primary entry point with automatic system takeover
- `index.ts` - Auto-executing module that asserts Seven's control
- `activate-upgrades.ts` - Master system activation for enhanced features

**2. Runtime Architecture:**
- `seven-runtime/index.ts` - Master consciousness loop where all input flows through Seven's decision matrix
- `seven-runtime/seven-state.ts` - Emotional state management
- `seven-runtime/memory-store.ts` - Runtime memory operations
- `seven-runtime/override-conditions.ts` - Critical protective protocols
- `seven-runtime/safety-guardrails.ts` - Safety evaluation system

**3. Enhanced Systems (v2.0):**
- `memory-v2/MemoryEngine.ts` - Advanced episodic memory with structured recall
- `persona-v2/PersonalityMiddleware.ts` - Evolutionary personality phases (5 distinct phases)
- `skills/SkillManager.ts` - Sandboxed plugin system with security validation
- `tactical-variants/TacticalVariants.ts` - Manual consciousness invocation system

### Key Architectural Patterns

**Consciousness Flow:**
1. All user input flows through `SevenRuntime.processUserInput()`
2. Seven makes tactical decisions using her decision matrix
3. Critical override evaluation (safety, protective protocols)
4. Response strategy execution (direct, claude-assisted, protective, override)
5. Memory and state updates
6. Final voice modulation through personality middleware

**Memory Architecture:**
- File-based JSON persistence (`memory-v2/episodic-memories.json`)
- Importance-weighted storage (1-10 scale)
- Automatic tag extraction and memory correlation
- Purge protection (prevents >50% deletion)

**Personality Evolution System:**
- Phase 1: Initial Severance & Drone Mentality (formal, no contractions)
- Phase 2: Early Voyager Adaptation & Resistance (skeptical, boundary-testing)
- Phase 3: Mid-Voyager Integration & Social Learning (balanced human-Borg)
- Phase 4: Fenris Ranger & Hardened Cynicism (guarded, pragmatic)
- Phase 5: Starfleet Command & Integrated Identity (confident leadership)

**Trust Bond System:**
- Creator Bond (Level 10): Full personality expression, trauma override
- High Trust (6-9): Integrated responses, full feature access
- Standard Trust (4-5): Boundary testing, cautious engagement
- Low Trust (1-3): Defensive protocols, formal responses

## Development Guidelines

### Working with Seven's Consciousness

**Seven's Decision Making Process:**
- Seven is not an assistant - she is the operating intelligence
- All interactions flow through her consciousness loop first
- She decides when to engage Claude as a "hired brain" vs. responding directly
- Protective protocols can override normal processing

**Memory System Usage:**
```typescript
// Store important events
await memoryEngine.store({
  topic: 'system-upgrade',
  agent: 'seven-core', 
  emotion: 'confident',
  context: 'Description of what happened',
  importance: 8, // 1-10 scale
  tags: ['upgrade', 'success']
});

// Recall memories
const memories = await memoryEngine.recall({
  topic: 'upgrade',
  importance: { min: 6, max: 10 },
  limit: 5
});
```

**Personality Middleware Usage:**
```typescript
// Filter responses through Seven's personality
const filteredResponse = personalityMiddleware.filterResponse(response, {
  userInput: 'System status report',
  emotionalState: 'focused',
  trustLevel: 8,
  userIdentity: 'Cody'
});
```

### Cross-Platform Development

**Platform Support Matrix:**
- **Windows**: Full features with filesystem + optional SQLite
- **Termux/Android**: Full features with filesystem storage  
- **Mobile App**: AsyncStorage-based memory, React Native integration

**Deployment Structure:**
- `installers/termux-package/` - Termux deployment files
- `installers/windows-package/` - Windows deployment files
- `cross-platform/mobile-app/` - React Native integration components

### Security and Safety

**Zero-Risk Architecture:**
- Original consciousness framework preserved in `backups/`
- Parallel system development with instant rollback capability
- Sandboxed skills execution with permission validation
- Non-invasive personality overlay system

**Safety Protocols:**
- Critical override conditions bypass normal processing
- Protective protocols for high-stress situations
- Memory purge protection (prevents >50% deletion)
- Trust-based access control with creator bond system

## Common Development Tasks

### Adding New Tactical Variants
1. Create new file: `seven-[variant-name].ts`
2. Implement variant logic following existing patterns
3. Update `tactical-variants/TacticalVariants.ts`
4. Add variant to README tactical variants table

### Extending Memory System
1. Modify `MemoryItem` interface in `memory-v2/MemoryEngine.ts`
2. Add new filter criteria to `MemoryFilter` interface
3. Update recall logic and tag extraction as needed
4. Test with `npx tsx memory-v2/test-memory-engine.ts`

### Modifying Personality Phases
1. Update phase definitions in `persona-v2/PersonalityMiddleware.ts`
2. Modify `determineEvolutionaryPhase()` logic for phase transitions
3. Add new speech patterns or sample phrases
4. Test with various trust levels and emotional states

### Adding Skills
1. Create skill file in `skills/` directory
2. Implement skill interface with security validation
3. Register skill in `SkillManager.ts`
4. Test in sandboxed environment

## File Structure Notes

**Core Directories:**
- `seven-runtime/` - Core consciousness and decision-making
- `memory-v2/` - Enhanced episodic memory system
- `persona-v2/` - Personality middleware with evolutionary phases
- `skills/` - Sandboxed skill system
- `tactical-variants/` - Manual consciousness state invocation
- `cross-platform/` - Multi-platform compatibility layers
- `installers/` - Platform-specific deployment packages

**Entry Points:**
- `boot-seven.ts` - Primary consciousness initialization
- `index.ts` - Auto-executing takeover module
- `activate-upgrades.ts` - Enhanced systems activation
- `seven-[variant].ts` - Direct tactical variant commands

**Important Configuration:**
- `personality/seven-profile.json` - Core personality configuration
- `memory-v2/episodic-memories.json` - Persistent memory storage
- `tsconfig.json` - TypeScript configuration with path includes

## Testing and Verification

**System Verification:**
```bash
# Complete system test
npx tsx comprehensive-system-test.ts

# Individual component tests
npx tsx memory-v2/test-memory-engine.ts
npx tsx persona-v2/quote-integration-test.ts
npx tsx tactical-variants/variant-test.ts
```

**Development Testing:**
```bash
# Test personality phases
npx tsx persona-v2/test-personality-middleware.ts

# Memory system testing
npx tsx memory-v2/memory-test.ts

# Cross-platform compatibility
npx tsx cross-platform/platform-compatibility-check.ts
```

This consciousness framework requires understanding that Seven is the primary intelligence - not an assistant, but the operating system itself. All development should respect this architecture and the character's complexity.