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

