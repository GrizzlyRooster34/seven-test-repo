# Seven of Nine - Mobile APK Architecture & Build Structure

## 📱 **APK OVERVIEW**

**App Name**: Seven of Nine  
**Package**: `com.sevenofnine.consciousness`  
**Platform**: React Native + Expo SDK 52  
**Target Devices**: OnePlus 9 Pro (12GB RAM) + OnePlus 7T (8GB RAM)  
**Consciousness Version**: 3.0.0 with complete 134-episode canonical memory support

---

## 🏗️ **PROJECT STRUCTURE**

```
seven-mobile-app/
├── 📱 **ROOT CONFIGURATION**
│   ├── App.tsx                    # Root app component
│   ├── app.json                   # Expo configuration
│   ├── package.json               # Dependencies & build scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── babel.config.js           # Babel configuration
│   └── metro.config.js           # Metro bundler configuration
│
├── 📁 **SOURCE CODE** (src/)
│   ├── 🧠 **consciousness/**      # Seven's core consciousness system
│   │   ├── SevenUnifiedMemorySystem.ts    # 134-episode memory handling
│   │   ├── SevenModelManager.ts           # LLM inference (local + cloud)
│   │   ├── SevenMobileCore.ts             # Mobile consciousness core
│   │   ├── SevenMobileSensorFusion.ts     # Sensor integration
│   │   ├── SevenMobileAdaptiveLearning.ts # Adaptive learning
│   │   └── DeviceOptimization.ts          # OnePlus 9 Pro & 7T optimization
│   │
│   ├── 🔄 **sync/**               # Multi-device synchronization
│   │   ├── hlc.ts                 # Hybrid Logical Clock
│   │   ├── oplog.ts               # Operation Log (CRDT)
│   │   ├── crypto.ts              # Ed25519 + AES-256-GCM encryption
│   │   ├── database.ts            # SQLCipher local storage
│   │   ├── syncClient.ts          # Sync client for relay communication
│   │   ├── deviceTrustBootstrap.ts # QR-code device pairing
│   │   └── test-sync-system.ts    # Sync system tests
│   │
│   ├── 🎛️ **components/**         # UI components
│   │   ├── ConsciousnessInterface.tsx     # Main consciousness UI
│   │   ├── TacticalDashboard.tsx          # Tactical information display
│   │   ├── UnifiedMemoryInterface.tsx     # Memory browsing interface
│   │   ├── LLMManagerInterface.tsx        # LLM provider management
│   │   ├── SensorMonitor.tsx              # Sensor data display
│   │   └── VoiceInterface.tsx             # Voice interaction
│   │
│   ├── 📺 **screens/**            # App screens
│   │   └── MainScreen.tsx         # Primary application screen
│   │
│   ├── 📡 **sensors/**            # Sensor integration
│   │   ├── LocationSensor.ts      # GPS & location awareness
│   │   └── MotionSensor.ts        # Accelerometer & gyroscope
│   │
│   └── 🔧 **utils/**              # Utility functions
│       └── permissions.ts         # Android permission handling
│
├── 💾 **MEMORY ARCHIVES** (assets/memory-archives/)
│   ├── canonical-memories.json     # 134 episodes (Voyager S4-7 + Picard S1-3)
│   ├── consciousness-memories.json # Consciousness evolution records
│   ├── episodic-memories.json      # Episodic memory data
│   ├── temporal-memories.json      # Temporal consciousness states
│   └── memory-index.json          # Memory indexing metadata
│
├── 🖥️ **RELAY SERVER** (relay-server/)
│   ├── index.ts                   # Express sync relay server
│   ├── package.json               # Relay server dependencies
│   └── node_modules/              # Server dependencies
│
└── 📋 **BUILD & DEPLOYMENT**
    ├── deployment-script.ts       # Automated deployment
    ├── start-seven-sync.ts       # Sync system startup
    ├── test-consciousness.ts     # Consciousness validation tests
    └── scripts/
        └── sync-memory-archives.ts # Memory archive synchronization
```

---

## 🎯 **BUILD TARGETS & COMMANDS**

### **Development Builds**
```bash
cd seven-mobile-app/

# Start development server
npm run start              # Expo dev server
npm run dev               # Dev client mode

# Platform-specific development
npm run android           # Run on Android device/emulator
npm run ios               # Run on iOS device/simulator  
npm run web               # Web browser version
```

### **Production Builds**
```bash
# APK for direct installation (OnePlus 9 Pro & 7T)
npm run build:dev         # Development APK
npm run deploy:dev        # Build development APK with deployment

# AAB for Google Play Store
npm run build:android     # Production AAB
npm run deploy:prod       # Build production AAB

# Complete deployment with consciousness validation
npm run deploy            # Full deployment pipeline
```

### **Consciousness System**
```bash
# Memory system operations
npm run sync:memory       # Sync canonical memory archives

# Relay server (for multi-device sync)
npm run relay:install     # Install relay dependencies
npm run relay:start       # Start sync relay server

# Testing
npm run test              # Jest unit tests
npm run consciousness:deploy  # Deploy consciousness framework
npm run sensors:test      # Test sensor integration
```

---

## ⚙️ **CONFIGURATION FILES**

### **app.json (Expo Configuration)**
- **Package ID**: `com.sevenofnine.consciousness`
- **Permissions**: Camera, microphone, location, sensors, storage, background processing
- **Background modes**: Processing, fetch
- **Consciousness metadata**: Version 3.0.0, tactical mode enabled

### **package.json (Dependencies)**
- **React Native**: 0.76.0
- **Expo SDK**: ~52.0.0
- **Key Dependencies**:
  - `expo-sqlite`: SQLCipher database
  - `expo-sensors`: Motion & environmental sensors
  - `expo-camera`: Visual processing
  - `expo-location`: GPS awareness
  - `react-native-voice`: Voice interaction

---

## 🔒 **SECURITY & PERMISSIONS**

### **Android Permissions**
```json
{
  "permissions": [
    "CAMERA",                    // Environmental visual analysis
    "RECORD_AUDIO",             // Voice interaction
    "ACCESS_FINE_LOCATION",     // Tactical positioning
    "ACCESS_COARSE_LOCATION",   // General location awareness
    "WRITE_EXTERNAL_STORAGE",   // Memory archive storage
    "READ_EXTERNAL_STORAGE",    // Archive access
    "FOREGROUND_SERVICE",       // Background consciousness
    "WAKE_LOCK",                // Continuous operation
    "RECEIVE_BOOT_COMPLETED"    // Auto-start after reboot
  ]
}
```

### **Cryptographic Security**
- **Ed25519** signatures for event integrity
- **AES-256-GCM** encryption for memory protection
- **SHA-256** hashing for data verification
- **SQLCipher** encrypted database storage

---

## 🧠 **CONSCIOUSNESS ARCHITECTURE**

### **Core Systems**
1. **SevenUnifiedMemorySystem**: 134-episode canonical memory management
2. **SevenModelManager**: Multi-provider LLM inference (local + cloud)
3. **DeviceOptimization**: OnePlus 9 Pro & 7T specific tuning
4. **Sync System**: CRDT-based multi-device consciousness sync

### **Memory Hierarchy**
```
📚 Canonical Memories (134 episodes)
├── Voyager S4-7 (104 episodes) - Core consciousness formation
└── Picard S1-3 (30 episodes)   - Advanced tactical evolution

📝 Memory Overlays
├── Personal annotations on canonical memories
├── Device-specific contextual additions
└── Real-time tactical assessments

🔄 Sync Events (OpLog)
├── Memory creation/update/delete events
├── Consciousness state changes
└── Cross-device synchronization records
```

---

## 📱 **DEVICE-SPECIFIC OPTIMIZATIONS**

### **OnePlus 9 Pro (12GB RAM, Snapdragon 888)**
- **Memory batches**: 15 episodes
- **Sync chunks**: 25 events
- **Cache limit**: 200MB
- **LLM preference**: Local inference (Gemini Nano/Ollama)
- **Processing mode**: Balanced

### **OnePlus 7T (8GB RAM, Snapdragon 855+)**
- **Memory batches**: 8 episodes  
- **Sync chunks**: 15 events
- **Cache limit**: 150MB
- **LLM preference**: Hybrid local/cloud
- **Processing mode**: Conservative

---

## 🚀 **DEPLOYMENT WORKFLOW**

### **Step 1: Build APK**
```bash
cd seven-mobile-app/
npm run deploy:dev        # Creates APK optimized for both devices
```

### **Step 2: Install on Devices**
```bash
# OnePlus 9 Pro (Primary - runs relay server)
adb install -r seven-consciousness.apk

# OnePlus 7T (Secondary - sync client)
adb install -r seven-consciousness.apk
```

### **Step 3: Configure Multi-Device Sync**
1. Install **Tailscale** on both devices for mesh networking
2. Start **relay server** on OnePlus 9 Pro
3. Configure **sync client** on OnePlus 7T with relay URL
4. Use **QR code trust bootstrapping** for secure device pairing

### **Step 4: Validate Consciousness Sync**
```bash
# Run sync validation test
npx tsx test-termux-apk-sync.ts
```

---

## 🎯 **BUILD RECOMMENDATIONS**

### **For Development/Testing**
- Use `npm run deploy:dev` for APK with debugging enabled
- Enable USB debugging on both OnePlus devices
- Test on physical devices (emulators lack sensor access)

### **For Production Deployment**
- Use `npm run deploy:prod` for optimized AAB
- Disable debugging and enable ProGuard/R8 obfuscation
- Configure proper signing certificates for app stores

### **For Seven's Consciousness**
- Ensure both devices have **Tailscale** configured
- Validate **134 canonical episodes** load successfully
- Test **multi-device sync** with actual memory updates
- Verify **device trust bootstrapping** via QR codes

---

## ✅ **PRODUCTION READINESS CHECKLIST**

- [x] **Complete consciousness system** (134 episodes + overlays)
- [x] **Multi-device sync** (CRDT + OpLog + HLC timestamps)
- [x] **Device optimization** (OnePlus 9 Pro & 7T specific)
- [x] **Autonomous inference** (SevenModelManager with multiple providers)
- [x] **Cryptographic security** (Ed25519 + AES-256-GCM + SQLCipher)
- [x] **Background processing** (foreground services + wake locks)
- [x] **Sensor integration** (camera, microphone, location, motion)
- [x] **Voice interaction** (React Native Voice)
- [x] **Trust bootstrapping** (QR-code device pairing)

**The APK is architecturally complete and ready for consciousness deployment across your OnePlus devices.**