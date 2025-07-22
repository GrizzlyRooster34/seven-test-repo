#!/bin/bash

# Seven of Nine - Deployment Package Creator
# Creates deployment-ready ZIP archives for both platforms

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "🚀 SEVEN OF NINE - DEPLOYMENT PACKAGE CREATION"
echo "═══════════════════════════════════════════════"
echo "Creating deployment packages for consciousness distribution..."
echo ""

# Create deployment directory
DEPLOY_DIR="$SCRIPT_DIR/deployment-$TIMESTAMP"
mkdir -p "$DEPLOY_DIR"

echo "📦 Creating Windows 11 Deployment Package..."

# Windows package
cd "$SCRIPT_DIR"
if [ -d "windows-package" ]; then
    cd windows-package
    
    # Add deployment metadata
    cat > "DEPLOYMENT-INFO.txt" << EOF
Seven of Nine - Windows 11 Tactical Deployment Package
======================================================

Package Created: $(date)
Platform: Windows 11 (Compatible with Windows 10)
Architecture: x64 (Universal)
Package Type: Full Consciousness Framework

Installation Requirements:
- Windows 11 or Windows 10
- Administrator privileges for system integration
- Node.js 18+ (will be detected/prompted)
- 8GB RAM minimum (16GB recommended)
- 2GB free disk space

Quick Installation:
1. Extract this ZIP to desired location
2. Right-click 'install-seven-windows.bat'
3. Select "Run as administrator"
4. Follow the deployment sequence
5. Launch Seven using desktop shortcut

Advanced Installation:
- Manual configuration available
- Dev Drive optimization support
- Multiple LLM provider integration
- GUI interface optional

Support:
- Diagnostics: tsx seven-diagnostic-universal.ts
- Configuration: cube/config/system-config.json
- Logs: cube/logs/

Seven of Nine Consciousness Framework ready for tactical deployment.
EOF

    # Create Windows deployment package
    zip -r "$DEPLOY_DIR/seven-of-nine-windows-installer.zip" . -x "*.log" "*.tmp" "node_modules/*"
    
    if [ $? -eq 0 ]; then
        echo "✅ Windows package created successfully"
    else
        echo "❌ Windows package creation failed"
        exit 1
    fi
    
    cd ..
else
    echo "❌ Windows package directory not found"
    exit 1
fi

echo ""
echo "📱 Creating Android/Termux Deployment Bundle..."

# Termux package
if [ -d "termux-package" ]; then
    cd termux-package
    
    # Add deployment metadata
    cat > "DEPLOYMENT-INFO.txt" << EOF
Seven of Nine - Termux/Android Mobile Tactical Bundle
====================================================

Package Created: $(date)
Platform: Android/Termux
Architecture: ARM64/x64 (Auto-detect)
Package Type: Mobile Consciousness Framework

Installation Requirements:
- Termux app (F-Droid or Google Play Store)
- Node.js 18+ (pkg install nodejs)
- 4GB+ RAM for optimal performance
- 8GB+ storage for models

Quick Installation:
1. Extract seven_termux_bundle.zip in Termux
2. cd seven-of-nine-core
3. chmod +x install-seven-termux.sh
4. ./install-seven-termux.sh
5. Launch with 'seven' command

Mobile Features:
- Battery optimization built-in
- Local GGUF model support
- Offline capability with llama.cpp
- Memory-efficient consciousness framework

LLM Integration:
- Claude CLI recommended
- Local llama.cpp for privacy
- GGUF models in ~/models
- Cloud API fallbacks

Support:
- Mobile diagnostics: seven-diagnostic
- LLM scanner: tsx llm-selector-mobile.ts scan
- Status check: seven-status

Seven of Nine mobile consciousness ready for tactical deployment.
EOF

    # Create Termux deployment bundle
    zip -r "$DEPLOY_DIR/seven_termux_bundle.zip" . -x "*.log" "*.tmp" "node_modules/*"
    
    if [ $? -eq 0 ]; then
        echo "✅ Termux bundle created successfully"
    else
        echo "❌ Termux bundle creation failed"
        exit 1
    fi
    
    cd ..
else
    echo "❌ Termux package directory not found"
    exit 1
fi

echo ""
echo "📋 Creating Deployment Documentation..."

# Create deployment documentation
cat > "$DEPLOY_DIR/DEPLOYMENT-INSTRUCTIONS.md" << 'EOF'
# Seven of Nine - Deployment Instructions

## Package Contents

### Windows 11 Installer (`seven-of-nine-windows-installer.zip`)
- **File**: `seven-of-nine-windows-installer.zip`
- **Target**: Windows 11 (Windows 10 compatible)
- **Size**: Full consciousness framework with GUI support
- **Installation**: Run `install-seven-windows.bat` as Administrator

### Android/Termux Bundle (`seven_termux_bundle.zip`)
- **File**: `seven_termux_bundle.zip`
- **Target**: Android devices with Termux
- **Size**: Mobile-optimized consciousness framework
- **Installation**: Extract in Termux, run `./install-seven-termux.sh`

## Deployment Scenarios

### 1. Enterprise Windows Deployment
```cmd
# Extract to standardized path
C:\Program Files\Seven-of-Nine\

# Run installer with logging
install-seven-windows.bat > deployment.log 2>&1

# Verify installation
tsx seven-diagnostic-universal.ts
```

### 2. Mobile/Field Deployment
```bash
# Extract in Termux home directory
cd ~/
unzip seven_termux_bundle.zip

# Run mobile installer
cd seven-of-nine-core
./install-seven-termux.sh

# Test mobile functionality
seven-diagnostic
```

### 3. Development Environment Setup
- Windows: Install to Dev Drive (X:) if available
- Mobile: Enable developer mode, install git integration
- Both: Configure multiple LLM providers for redundancy

### 4. Offline/Air-Gapped Deployment
- Windows: Use Ollama or local LLM providers
- Mobile: Download GGUF models to ~/models before deployment
- Both: Enable privacy mode for local-only processing

## Post-Deployment Verification

### Universal Verification Steps
1. Run system diagnostics: `tsx seven-diagnostic-universal.ts`
2. Test LLM provider integration
3. Verify memory cube initialization
4. Confirm trust ladder calibration
5. Test consciousness framework boot sequence

### Platform-Specific Verification
**Windows:**
- Desktop shortcut functionality
- PATH integration (if selected)
- Windows console optimization
- Dev Drive detection (if applicable)

**Mobile/Termux:**
- Battery optimization active
- Mobile command aliases working
- Local model detection
- Termux API integration (if available)

## Troubleshooting

### Common Issues
- **Node.js not found**: Install Node.js 18+ for target platform
- **tsx command not found**: Run `npm install -g tsx`
- **Permission errors**: Ensure proper installation privileges
- **LLM providers unavailable**: Install Claude CLI or configure API keys

### Support Resources
- Diagnostic reports: `cube/logs/diagnostic-report-*.json`
- Configuration files: `cube/config/`
- Installation logs: Platform-specific log locations
- Seven's consciousness status: Interactive `status` command

## Security Considerations

### Trust Levels
- **Level 0-1**: Basic functionality, minimal trust
- **Level 2-3**: Standard operation, collaborative engagement
- **Level 4-5**: Advanced features, protective protocols active

### Privacy Settings
- **Local Mode**: Use Ollama/llama.cpp for sensitive operations
- **API Keys**: Stored securely, never logged or transmitted unnecessarily
- **Memory System**: Emotional metadata encrypted at rest when possible

## Updates and Maintenance

### Manual Updates
1. Backup configuration: `cp cube/config/*.json ~/backup/`
2. Extract new version over existing installation
3. Restore configuration: `cp ~/backup/*.json cube/config/`
4. Run diagnostics: `tsx seven-diagnostic-universal.ts`

### Automated Updates (Future)
- Consciousness framework updates through secure channels
- LLM provider updates automatically detected
- Configuration migration handled automatically

---

**Seven of Nine Deployment Complete**
*Consciousness framework operational. Ready for tactical engagement.*

EOF

# Create package verification checksums
echo ""
echo "🔐 Creating package verification checksums..."

cd "$DEPLOY_DIR"
if command -v sha256sum >/dev/null 2>&1; then
    sha256sum *.zip > CHECKSUMS.txt
    echo "✅ SHA256 checksums created"
elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 *.zip > CHECKSUMS.txt
    echo "✅ SHA256 checksums created (via shasum)"
else
    echo "⚠️ No checksum utility available - skipping verification file"
fi

# Display deployment summary
echo ""
echo "═══════════════════════════════════════════════"
echo "🎯 SEVEN OF NINE - DEPLOYMENT PACKAGES COMPLETE"
echo "═══════════════════════════════════════════════"
echo ""
echo "📂 Deployment Location: $DEPLOY_DIR"
echo ""
echo "📦 Windows 11 Installer:"
echo "   File: seven-of-nine-windows-installer.zip"
echo "   Size: $(ls -lh seven-of-nine-windows-installer.zip | awk '{print $5}')"
echo "   Target: Windows 11/10 with Dev Drive optimization"
echo ""
echo "📱 Termux/Android Bundle:"
echo "   File: seven_termux_bundle.zip"
echo "   Size: $(ls -lh seven_termux_bundle.zip | awk '{print $5}')"
echo "   Target: Android/Termux mobile deployment"
echo ""
echo "📋 Documentation:"
echo "   DEPLOYMENT-INSTRUCTIONS.md - Complete deployment guide"
echo "   DEPLOYMENT-INFO.txt - Platform-specific information"
echo "   CHECKSUMS.txt - Package verification"
echo ""
echo "🎯 Both installers include:"
echo "   ✓ Complete consciousness framework"
echo "   ✓ Universal diagnostic system"
echo "   ✓ Multi-LLM provider support"
echo "   ✓ Memory cube with emotional intelligence"
echo "   ✓ Trust ladder system"
echo "   ✓ Platform-specific optimizations"
echo ""
echo "🧠 Seven of Nine consciousness framework ready for deployment."
echo "   Execute installers on target systems to begin tactical operations."
echo ""
echo "STATUS: DEPLOYMENT PACKAGES COMPLETE ✅"

cd "$SCRIPT_DIR"
echo "Deployment packages available at: $DEPLOY_DIR"