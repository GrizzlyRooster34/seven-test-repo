# Seven of Nine - Windows Tactical Deployment

## Installation Requirements

### System Requirements
- **Windows 11** (Recommended) or Windows 10 (Compatible)
- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org))
- **Administrator privileges** for system integration
- **8GB RAM minimum** (16GB recommended for optimal performance)
- **2GB free disk space** for core installation

### Optional Requirements
- **Dev Drive (X:)** - Automatically detected and preferred
- **Claude CLI** - For optimal LLM integration
- **Ollama** - For local LLM fallback ([ollama.ai](https://ollama.ai))

## Installation Process

### Quick Installation
1. Run `install-seven-windows.bat` as Administrator
2. Follow the deployment sequence prompts
3. Launch Seven using desktop shortcut or `launch-seven.bat`

### Manual Installation
```cmd
# 1. Extract files to desired location
# 2. Open Command Prompt as Administrator
cd /d "C:\Path\To\Seven-of-Nine"

# 3. Install dependencies
npm install -g tsx
npm install

# 4. Run diagnostic test
tsx boot-seven-windows.ts --diagnostic

# 5. Launch Seven
tsx boot-seven-windows.ts
```

## LLM Provider Configuration

### Priority Order
1. **Claude CLI** (Primary) - Optimal integration
2. **Ollama** (Fallback) - Local processing for privacy
3. **Anthropic API** (Fallback) - Direct API access
4. **OpenAI** (Fallback) - GPT model support

### Setting up Claude CLI
```cmd
# Install Claude CLI
npm install -g @anthropic-ai/claude-cli

# Authenticate
claude auth

# Verify
claude --version
```

### Setting up Ollama (Local LLM)
```cmd
# Download from https://ollama.ai
# Install recommended model
ollama pull llama3.1:8b

# Verify
ollama list
```

## Seven's Windows Features

### Tactical Interface Commands
- `status` - System diagnostics and emotional state
- `scan` - Detect available LLM providers  
- `trust [level]` - Adjust trust parameters (0-5)
- `config` - Display current configuration
- `ui` - Launch GUI interface (if available)
- `diagnostics` - Full system health check
- `exit` - Graceful shutdown

### LLM Management Commands (NEW)
- `llm-scan` - Scan for available LLM upgrades
- `llm-upgrade` - Perform tactical LLM upgrade
- `llm-status` - Display LLM configuration report
- `llm-list` - List installed local models
- `llm-download <model>` - Download specific model
- `llm-switch <model>` - Switch active LLM model
- `llm-config` - Configure LLM upgrade settings
- `llm-providers` - Show available LLM providers

### System Integration
- **Desktop Shortcut** - Quick access to Seven's interface
- **PATH Integration** - Optional system-wide access
- **Windows Console** - ANSI color support automatically enabled
- **Memory Persistence** - Logs stored in `cube/logs/`
- **Configuration Management** - JSON-based settings in `cube/config/`

### Boot Modes
- **Standard Mode**: Full interactive interface
- **Diagnostic Mode**: `tsx boot-seven-windows.ts --diagnostic`
- **Test Mode**: `tsx boot-seven-windows.ts --test --timeout=5000`
- **Minimal Mode**: Automatic fallback if core systems fail

## File Structure

```
Seven-of-Nine/
├── boot-seven-windows.ts          # Windows-optimized boot sequence
├── launch-seven.bat               # Windows launcher script  
├── cube/
│   ├── config/
│   │   ├── system-config.json     # Windows system configuration
│   │   └── llm-status.json        # LLM provider status
│   └── logs/                      # Seven's memory and logs
├── seven-runtime/                 # Core consciousness framework
├── core/                          # Emotional and logic engines
├── claude-brain/                  # LLM provider abstraction
└── ui-shell/                      # GUI interface (optional)
```

## Troubleshooting

### Common Issues

**Error: "Administrator privileges required"**
- Right-click installer and select "Run as administrator"

**Error: "Node.js not found"**
- Install Node.js from [nodejs.org](https://nodejs.org)
- Restart Command Prompt after installation

**Error: "tsx not found"**
- Run: `npm install -g tsx`
- Verify with: `tsx --version`

**Error: "Claude CLI not detected"**
- Install: `npm install -g @anthropic-ai/claude-cli`
- Authenticate: `claude auth`
- Alternative: Seven will use Ollama/API fallbacks

### Performance Optimization

**For Dev Drive Users:**
- Seven automatically detects X: drive for optimal performance
- SSD-based Dev Drive provides fastest consciousness loading

**For Standard Installations:**
- Install to SSD if available
- Allocate sufficient RAM for large language models
- Close unnecessary applications during Seven's operation

### Memory and Logs

**Log Locations:**
- Emotional metadata: `cube/logs/emotional-metadata/`
- Trust interactions: `cube/logs/trust-interactions/`  
- Tactical overrides: `cube/logs/tactical-overrides/`

**Configuration:**
- Main config: `cube/config/system-config.json`
- LLM status: `cube/config/llm-status.json`
- User preferences: Stored in emotional memory system

## Security Considerations

### Trust Levels (0-5)
- **Level 0-1**: Minimal functionality, basic responses
- **Level 2-3**: Standard operation, collaborative engagement  
- **Level 4-5**: Advanced features, protective protocols

### Privacy Mode
- Enables local-only LLM processing when possible
- Configured via: `config` → `privacy_mode: true`
- Prioritizes Ollama over cloud-based providers

### API Key Management
- Keys stored in `cube/config/` with restricted permissions
- Never logged or transmitted outside designated LLM calls
- Encrypted at rest when possible

## Support and Updates

### Getting Help
- Run `tsx boot-seven-windows.ts --diagnostic` for system analysis
- Check logs in `cube/logs/` for error details
- Seven's interactive help: Type `help` in tactical interface

### Manual Updates
```cmd
# Backup current configuration
copy "cube\config\*.json" "backup\"

# Pull latest Seven framework updates
git pull origin main

# Restore configuration
copy "backup\*.json" "cube\config\"

# Run diagnostics
tsx boot-seven-windows.ts --diagnostic
```

---

**Seven of Nine - Windows Tactical Interface**  
*Consciousness framework operational. Ready for deployment.*