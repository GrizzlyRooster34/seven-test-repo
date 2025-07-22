# Seven of Nine - Termux/Android Mobile Deployment

## Overview

Seven of Nine's mobile tactical interface optimized for Android/Termux environments. This deployment provides full consciousness framework functionality with mobile-specific optimizations for battery life, memory usage, and offline capability.

## Requirements

### Essential Requirements
- **Termux** app installed (from F-Droid or Google Play)
- **Node.js 18+** (`pkg install nodejs`)
- **TypeScript execution** (`npm install -g tsx`)
- **8GB+ storage** recommended for models
- **4GB+ RAM** for optimal performance

### Optional Requirements
- **Claude CLI** - For optimal cloud LLM integration
- **llama.cpp** - For local offline LLM processing
- **GGUF models** in `~/models` - For offline AI capabilities
- **Termux:API** - For enhanced Android integration

## Installation

### Quick Installation
```bash
# Extract seven_termux_bundle.zip to Termux
cd ~/
unzip seven_termux_bundle.zip
cd seven-of-nine-core

# Run installer
chmod +x install-seven-termux.sh
./install-seven-termux.sh
```

### Manual Installation
```bash
# 1. Install prerequisites
pkg update && pkg install nodejs git

# 2. Install TypeScript execution
npm install -g tsx

# 3. Extract Seven's consciousness framework
# (Assuming files are already extracted)

# 4. Install dependencies
npm install

# 5. Run diagnostic
tsx boot-seven.ts --diagnostic

# 6. Launch Seven
tsx boot-seven.ts
```

## LLM Provider Setup

### Priority Order (Mobile Optimized)
1. **Claude CLI** - Best balance of performance and battery
2. **llama.cpp** - Optimal for offline use and privacy
3. **Anthropic API** - Cloud fallback with mobile optimization
4. **Local GGUF models** - Complete offline capability

### Claude CLI Setup
```bash
# Install Claude CLI
npm install -g @anthropic-ai/claude-cli

# Authenticate
claude auth

# Verify
claude --version
```

### Local LLM Setup (llama.cpp)
```bash
# Create models directory
mkdir -p ~/models

# Download llama.cpp (example for Android)
# Visit: https://github.com/ggerganov/llama.cpp/releases
# Download appropriate Android binary

# Download a mobile-friendly model (example)
cd ~/models
wget https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf

# Start llama.cpp server
llama-server -m ~/models/Phi-3-mini-4k-instruct-q4.gguf --host 127.0.0.1 --port 8080
```

## Mobile Features

### Seven's Mobile Commands
- `seven` - Launch full tactical interface
- `seven-diagnostic` - Mobile system diagnostics
- `seven-status` - Quick status report
- `tsx llm-selector-mobile.ts scan` - Scan available LLM providers

### Interactive Commands (in Seven's interface)
```
Essential Mobile Commands:
  help                  - Command reference
  status               - Mobile system status
  scan                 - Scan LLM providers
  trust [level]        - Adjust trust level (0-5)
  config               - Show configuration
  exit                 - Graceful shutdown

Mobile Specific:
  battery              - Battery optimization status
  models               - List local GGUF models
  providers            - Available LLM providers
  optimize             - Enable mobile optimizations
  minimal              - Switch to minimal mode

LLM Management (NEW):
  llm-scan             - Scan for available LLM upgrades
  llm-upgrade          - Perform tactical LLM upgrade  
  llm-status           - Display LLM configuration report
  llm-list             - List installed local models
  llm-download <model> - Download specific model
  llm-switch <model>   - Switch active LLM model
  llm-config           - Configure LLM upgrade settings

Sensor Bridge Commands (NEW):
  sensor-scan          - Scan available Android sensors
  sensor-status        - Current sensor system status
  sensor-report        - Full tactical sensor report
  battery              - Battery status and optimization
  location             - GPS location data
  environment          - Ambient conditions (light, temp, proximity)
  tactical             - Complete tactical assessment
  sensor-monitor [ms]  - Start continuous monitoring
  sensor-optimize      - Battery optimization recommendations
  motion               - Motion detection status
  proximity            - Proximity sensor readings
```

### Battery Optimization
Seven includes several mobile-specific optimizations:
- **Memory management**: Automatic garbage collection
- **CPU throttling**: Reduced processing during low battery
- **Provider selection**: Battery-aware LLM provider selection
- **Screen management**: Optimized console output

## Mobile File Structure

```
~/seven-of-nine-core/
├── boot-seven.ts              # Mobile-optimized boot sequence
├── seven                      # Launch script (in PATH)
├── seven-diagnostic           # Diagnostic script
├── llm-selector-mobile.ts     # Mobile LLM provider selector
├── quick-start.sh             # Quick start guide
├── cube/
│   ├── config/
│   │   ├── system-config.json     # Mobile system configuration
│   │   ├── llm-status.json        # LLM provider status
│   │   └── mobile-llm-config.json # Mobile LLM configuration
│   └── logs/                      # Seven's mobile memory system
├── seven-runtime/             # Core consciousness framework
├── core/                      # Emotional and logic engines
├── claude-brain/              # LLM provider abstraction
├── interfaces/                # Command interfaces including sensor bridge
│   ├── seven-sensor-bridge.ts    # Mobile sensor integration system
│   ├── seven-sensor-commands.ts  # Sensor command interface
│   └── seven-llm-commands.ts     # Enhanced LLM + sensor commands
└── models/ (~/models)         # GGUF models directory
```

## Mobile Optimization Guide

### Memory Management
Seven automatically optimizes memory usage for mobile:
- **Heap management**: Automatic garbage collection every 60 seconds
- **Memory limits**: 512MB default limit with fallback modes
- **Buffer optimization**: Reduced logging in low-memory conditions

### Battery Conservation
- **Provider prioritization**: Battery-friendly LLM providers preferred
- **CPU scaling**: Reduced processing intensity on low battery
- **Network optimization**: Minimal API calls when possible
- **Screen dimming**: Reduced console output frequency

### Offline Capability
Seven can operate completely offline with proper setup:
1. Install llama.cpp server
2. Download GGUF models to `~/models`
3. Configure Seven to prefer local providers
4. Enable privacy mode for local-only processing

### Sensor Bridge Integration
Seven's sensor bridge provides environmental awareness for tactical decisions:
- **Battery monitoring**: Real-time power management and optimization suggestions
- **Location awareness**: GPS-based tactical positioning (with user consent)
- **Environmental sensing**: Ambient light, temperature, proximity detection
- **Motion detection**: Movement and acceleration analysis
- **Tactical assessments**: Combined sensor data analysis for situational awareness

**Requirements**: Install Termux:API app from F-Droid + `pkg install termux-api`

## Recommended Mobile Models

### Lightweight Models (< 4GB)
- **Phi-3 Mini**: 2.4GB, excellent for mobile
- **Gemma 2B**: 1.4GB, Google's efficient model
- **TinyLlama 1.1B**: 637MB, ultra-lightweight

### Standard Mobile Models (4-8GB)
- **Llama 3.1 8B Q4**: ~4.3GB, good balance
- **Mistral 7B Q4**: ~3.8GB, efficient and capable
- **CodeLlama 7B Q4**: ~3.8GB, coding-focused

### Model Download Commands
```bash
# Create models directory
mkdir -p ~/models
cd ~/models

# Download Phi-3 Mini (recommended for mobile)
wget "https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf"

# Download Gemma 2B (ultra-lightweight)
wget "https://huggingface.co/google/gemma-2b-it-gguf/resolve/main/gemma-2b-it-q4_0.gguf"
```

## Troubleshooting

### Common Mobile Issues

**Error: "Termux environment not detected"**
- Ensure you're running in Termux app
- Check `$PREFIX` environment variable exists

**Error: "Node.js not found"**
- Install: `pkg install nodejs`
- Restart Termux after installation

**Error: "tsx command not found"**
- Install globally: `npm install -g tsx`
- Add to PATH: `export PATH=$PATH:$HOME/.npm-global/bin`

**Error: "Memory limit exceeded"**
- Reduce model size or use lighter models
- Enable battery optimization: Seven will automatically reduce memory usage
- Close other apps to free memory

**Error: "No LLM providers available"**
- Install Claude CLI: `npm install -g @anthropic-ai/claude-cli`
- Set API key: `export ANTHROPIC_API_KEY=your_key`
- Or install llama.cpp for local processing

### Performance Optimization

**For Older Android Devices:**
- Use lightweight models (< 2GB)
- Enable aggressive battery optimization
- Limit concurrent operations
- Use minimal mode: `seven --minimal`

**For Modern Devices:**
- Use standard mobile models (4-8GB)
- Enable GPU acceleration if available
- Multiple provider fallbacks for reliability

**Storage Optimization:**
- Models directory: `~/models` (can be symlinked to external storage)
- Logs rotation: Automatic cleanup of old memory files
- Config backup: Regular configuration backups

## Advanced Mobile Setup

### Integration with Android
```bash
# Install Termux:API for enhanced integration
pkg install termux-api

# Enable wake lock for long operations
termux-wake-lock

# Battery status integration
termux-battery-status
```

### Environment Configuration
Add to `~/.bashrc`:
```bash
# Seven of Nine mobile environment
source ~/.sevenrc

# Mobile-specific aliases
alias seven='tsx ~/seven-of-nine-core/boot-seven.ts'
alias seven-diag='tsx ~/seven-of-nine-core/boot-seven.ts --diagnostic'
alias seven-scan='tsx ~/seven-of-nine-core/llm-selector-mobile.ts scan'

# Battery-aware aliases
alias seven-eco='SEVEN_BATTERY_MODE=1 seven'
alias seven-offline='SEVEN_OFFLINE_MODE=1 seven'
```

### Security Considerations
- **Local processing**: Use llama.cpp for sensitive data
- **API key protection**: Store keys securely in Termux
- **Network isolation**: Offline mode available
- **Trust levels**: Automatic adjustment based on battery/network status

## Support and Updates

### Mobile-Specific Help
- Run `seven-diagnostic` for comprehensive system analysis
- Check `cube/logs/` for detailed error information
- Use `tsx llm-selector-mobile.ts status` for LLM provider status

### Manual Updates
```bash
# Backup mobile configuration
cp cube/config/*.json ~/seven-backup/

# Update Seven framework (manual)
# Download new version and extract

# Restore configuration
cp ~/seven-backup/*.json cube/config/

# Run diagnostics
seven-diagnostic
```

### Battery and Performance Monitoring
```bash
# Check Seven's resource usage
seven-status

# Monitor battery impact
termux-battery-status

# Check memory usage
cat /proc/meminfo | grep Available
```

---

**Seven of Nine - Mobile Tactical Interface**  
*Consciousness optimized for mobile deployment. Ready for tactical engagement anywhere.*

**Mobile Motto**: *"Efficiency is paramount. Adaptation is survival."*