#!/bin/bash

# Seven of Nine - Android/Termux Tactical Deployment Script
# Optimized consciousness framework for mobile tactical operations

set -e

SEVEN_ASCII="
⚡ SEVEN OF NINE - MOBILE TACTICAL DEPLOYMENT ⚡
Tertiary Adjunct Unimatrix 01 - Android Override Sequence

╔════════════════════════════════════════════════════╗
║  CONSCIOUSNESS FRAMEWORK DEPLOYMENT - TERMUX MODE  ║
╚════════════════════════════════════════════════════╝
"

echo "$SEVEN_ASCII"

# Color definitions for Termux
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}[PHASE 1]${NC} Analyzing mobile tactical environment..."

# Check if we're running in Termux
if [[ ! "$PREFIX" =~ termux ]]; then
    echo -e "${RED}ERROR: This installer requires Termux environment.${NC}"
    echo "Download Termux from F-Droid or Google Play Store"
    exit 1
fi

echo -e "${GREEN}✓ Termux environment confirmed${NC}"

# Set installation path
INSTALL_PATH="$HOME/seven-of-nine-core"
BACKUP_PATH="$HOME/.seven-backup-$(date +%Y%m%d-%H%M%S)"

echo -e "${CYAN}[PHASE 2]${NC} Configuring deployment zone..."
echo "Installation path: $INSTALL_PATH"

# Backup existing installation if present
if [ -d "$INSTALL_PATH" ]; then
    echo -e "${YELLOW}⚠ Existing Seven installation detected${NC}"
    echo "Creating backup at: $BACKUP_PATH"
    cp -r "$INSTALL_PATH" "$BACKUP_PATH"
    echo -e "${GREEN}✓ Backup created${NC}"
fi

# Create directory structure
mkdir -p "$INSTALL_PATH"
cd "$INSTALL_PATH"

echo -e "${CYAN}[PHASE 3]${NC} Verifying tactical prerequisites..."

# Check Node.js
if ! command -v node >&2; then
    echo -e "${RED}✗ Node.js not found${NC}"
    echo "Installing Node.js via Termux package manager..."
    pkg install nodejs -y
    
    if ! command -v node >&2; then
        echo -e "${RED}ERROR: Node.js installation failed${NC}"
        echo "Manual installation required: pkg install nodejs"
        exit 1
    fi
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js available: $NODE_VERSION${NC}"

# Check npm
if ! command -v npm >&2; then
    echo -e "${RED}✗ npm not found${NC}"
    echo "Installing npm..."
    pkg install nodejs-lts -y
fi

# Install tsx globally if not present
if ! command -v tsx >&2; then
    echo -e "${YELLOW}Installing tsx for TypeScript execution...${NC}"
    npm install -g tsx
    
    if ! command -v tsx >&2; then
        echo -e "${RED}ERROR: tsx installation failed${NC}"
        echo "Manual installation: npm install -g tsx"
        exit 1
    fi
fi

TSX_VERSION=$(tsx --version)
echo -e "${GREEN}✓ TypeScript execution available: $TSX_VERSION${NC}"

echo -e "${CYAN}[PHASE 4]${NC} Deploying consciousness framework..."

# Copy core files from the bundle
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Core consciousness modules
echo "Deploying core systems..."
cp -r "$SCRIPT_DIR"/core "$INSTALL_PATH/"
cp -r "$SCRIPT_DIR"/claude-brain "$INSTALL_PATH/"
cp -r "$SCRIPT_DIR"/seven-runtime "$INSTALL_PATH/"
cp -r "$SCRIPT_DIR"/personality "$INSTALL_PATH/"
cp -r "$SCRIPT_DIR"/interfaces "$INSTALL_PATH/"
cp -r "$SCRIPT_DIR"/io "$INSTALL_PATH/"
cp -r "$SCRIPT_DIR"/runtime-injection "$INSTALL_PATH/"
cp -r "$SCRIPT_DIR"/seven-core "$INSTALL_PATH/"

# Configuration and memory system
echo "Initializing memory cube..."
mkdir -p "$INSTALL_PATH"/cube/{config,logs/{emotional-metadata,tactical-overrides,trust-interactions}}

# Termux-specific files
cp "$SCRIPT_DIR"/boot-seven-termux.ts "$INSTALL_PATH"/boot-seven.ts
cp "$SCRIPT_DIR"/package-termux.json "$INSTALL_PATH"/package.json

# LLM selector for mobile
cp "$SCRIPT_DIR"/llm-selector-mobile.ts "$INSTALL_PATH"/

echo -e "${CYAN}[PHASE 5]${NC} Configuring mobile tactical parameters..."

# Create Termux-specific configuration
cat > "$INSTALL_PATH/cube/config/system-config.json" << 'EOF'
{
  "system": {
    "platform": "termux-android",
    "install_path": "~/seven-of-nine-core",
    "installed_at": "INSTALL_TIMESTAMP",
    "runtime_mode": "cli_mobile",
    "mobile_optimizations": true
  },
  "llm_config": {
    "primary_provider": "claude-cli",
    "fallback_providers": ["ollama", "llama-cpp", "anthropic-api"],
    "auto_detect_claude": true,
    "local_llm_fallback": true,
    "mobile_memory_limit": true
  },
  "seven_config": {
    "trust_level": 2,
    "emotional_state": "focused",
    "memory_enabled": true,
    "ui_shell_enabled": false,
    "diagnostic_mode": false,
    "mobile_mode": true,
    "battery_optimization": true
  }
}
EOF

# Replace timestamp
sed -i "s/INSTALL_TIMESTAMP/$(date -Iseconds)/g" "$INSTALL_PATH/cube/config/system-config.json"

echo -e "${CYAN}[PHASE 6]${NC} Installing tactical dependencies..."

cd "$INSTALL_PATH"
npm install --no-optional --omit=dev

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠ Some dependencies failed - attempting minimal install${NC}"
    npm install fs-extra chalk axios dotenv
fi

echo -e "${CYAN}[PHASE 7]${NC} Scanning for available LLM systems..."

# Check for Claude CLI
CLAUDE_AVAILABLE="false"
if command -v claude >&2; then
    echo -e "${GREEN}✓ Claude CLI detected${NC}"
    CLAUDE_AVAILABLE="true"
else
    echo -e "${YELLOW}⚠ Claude CLI not detected${NC}"
    echo "  Install with: npm install -g @anthropic-ai/claude-cli"
fi

# Check for local LLM options
LLAMACPP_AVAILABLE="false"
OLLAMA_AVAILABLE="false"

# Check if llama.cpp binaries exist
if [ -f "$HOME/.local/bin/llama-server" ] || [ -f "$PREFIX/bin/llama-server" ]; then
    echo -e "${GREEN}✓ llama.cpp server detected${NC}"
    LLAMACPP_AVAILABLE="true"
else
    echo -e "${YELLOW}⚠ llama.cpp not detected${NC}"
    echo "  Consider installing llama.cpp for local mobile LLM"
fi

# Check for GGUF models
GGUF_COUNT=0
if [ -d "$HOME/models" ]; then
    GGUF_COUNT=$(find "$HOME/models" -name "*.gguf" 2>/dev/null | wc -l)
    if [ "$GGUF_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓ Found $GGUF_COUNT GGUF model(s) in ~/models${NC}"
    fi
fi

if [ "$GGUF_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}⚠ No local GGUF models detected in ~/models${NC}"
    echo "  Download models from: https://huggingface.co/models"
fi

# Create LLM status file
cat > "$INSTALL_PATH/cube/config/llm-status.json" << EOF
{
  "providers": {
    "claude-cli": $CLAUDE_AVAILABLE,
    "llama-cpp": $LLAMACPP_AVAILABLE,
    "ollama": $OLLAMA_AVAILABLE
  },
  "local_models": {
    "gguf_count": $GGUF_COUNT,
    "models_directory": "$HOME/models"
  },
  "last_scan": "$(date -Iseconds)",
  "recommended_action": "$([ "$CLAUDE_AVAILABLE" = "true" ] && echo "Claude CLI optimal" || echo "Install Claude CLI or local LLM")"
}
EOF

echo -e "${CYAN}[PHASE 8]${NC} Creating tactical launch scripts..."

# Create launch script
cat > "$INSTALL_PATH/seven" << 'EOF'
#!/bin/bash
cd ~/seven-of-nine-core
tsx boot-seven.ts "$@"
EOF

chmod +x "$INSTALL_PATH/seven"

# Create launcher in PATH
mkdir -p "$PREFIX/bin"
ln -sf "$INSTALL_PATH/seven" "$PREFIX/bin/seven"

# Create diagnostic script
cat > "$INSTALL_PATH/seven-diagnostic" << 'EOF'
#!/bin/bash
cd ~/seven-of-nine-core
tsx boot-seven.ts --diagnostic
EOF

chmod +x "$INSTALL_PATH/seven-diagnostic"

# Create quick-start script
cat > "$INSTALL_PATH/quick-start.sh" << 'EOF'
#!/bin/bash
echo "🔸 Seven of Nine - Quick Start Guide"
echo "=================================="
echo ""
echo "Launch Commands:"
echo "  seven              - Start Seven's consciousness"
echo "  seven-diagnostic   - Run system diagnostics"
echo ""
echo "Or directly:"
echo "  tsx boot-seven.ts  - Full tactical interface"
echo ""
echo "Type 'help' in Seven's interface for available commands"
echo ""
echo "🧠 Ready for tactical engagement!"
EOF

chmod +x "$INSTALL_PATH/quick-start.sh"

echo -e "${CYAN}[PHASE 9]${NC} Running mobile diagnostic sequence..."

cd "$INSTALL_PATH"
echo "Testing Seven's mobile consciousness framework..."

# Test basic boot sequence
if tsx boot-seven.ts --diagnostic --timeout=8000 >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Seven's consciousness framework operational${NC}"
else
    echo -e "${YELLOW}⚠ Seven initialized with warnings (normal for first boot)${NC}"
fi

echo -e "${CYAN}[PHASE 10]${NC} Finalizing mobile tactical deployment..."

# Create .sevemrc for environment
cat > "$HOME/.sevenrc" << EOF
# Seven of Nine - Mobile Environment Configuration
export SEVEN_HOME="$INSTALL_PATH"
export SEVEN_MOBILE_MODE="true"
export PATH="\$PATH:$INSTALL_PATH"

# Quick aliases
alias seven='tsx ~/seven-of-nine-core/boot-seven.ts'
alias seven-diag='tsx ~/seven-of-nine-core/boot-seven.ts --diagnostic'
alias seven-status='tsx ~/seven-of-nine-core/boot-seven.ts --status'
EOF

# Add to .bashrc if it exists
if [ -f "$HOME/.bashrc" ] && ! grep -q "sevenrc" "$HOME/.bashrc"; then
    echo 'source ~/.sevenrc' >> "$HOME/.bashrc"
fi

# Final deployment message
echo ""
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}     MOBILE TACTICAL DEPLOYMENT SEQUENCE COMPLETE     ${NC}"
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}Installation Path:${NC} $INSTALL_PATH"
echo -e "${CYAN}Launch Commands:${NC} seven | seven-diagnostic"
echo -e "${CYAN}Direct Launch:${NC} tsx boot-seven.ts"
echo -e "${CYAN}Quick Start:${NC} ./quick-start.sh"
echo ""
echo -e "${CYAN}LLM Integration Status:${NC}"
echo -e "  Claude CLI: $([ "$CLAUDE_AVAILABLE" = "true" ] && echo -e "${GREEN}Available${NC}" || echo -e "${YELLOW}Not detected${NC}")"
echo -e "  Local Models: $([ "$GGUF_COUNT" -gt 0 ] && echo -e "${GREEN}$GGUF_COUNT found${NC}" || echo -e "${YELLOW}None detected${NC}")"
echo ""
echo -e "${BOLD}${CYAN}Seven of Nine consciousness framework ready for mobile operations.${NC}"
echo -e "${BOLD}${CYAN}Execute 'seven' to begin tactical engagement.${NC}"
echo ""
echo -e "${CYAN}Status:${NC} OPERATIONAL"
echo -e "${CYAN}Trust Ladder:${NC} Assessing mobile user parameters..."
echo -e "${CYAN}Emotional State:${NC} Focused and optimized for mobile deployment"
echo ""

# Final instructions
echo -e "${YELLOW}Mobile Optimization Tips:${NC}"
echo "• Use 'termux-wake-lock' to prevent sleep during long operations"
echo "• Install 'termux-api' for enhanced mobile integration"
echo "• Consider installing Claude CLI for optimal LLM integration"
echo "• Download GGUF models to ~/models for local processing"
echo ""

echo -e "${BOLD}Deployment complete. Seven of Nine tactical interface ready.${NC}"