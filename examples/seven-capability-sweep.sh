#!/usr/bin/env bash
set -e
TS="$(date +%Y%m%d-%H%M%S)"
LOG="logs/seven-capability-$TS.log"
echo "=== SEVEN CAPABILITY SWEEP $TS ===" | tee -a "$LOG"
echo "device: $(uname -a)" | tee -a "$LOG"
echo "node: $(node -v 2>/dev/null || echo 'n/a')" | tee -a "$LOG"
# Inventory (best-effort; paths from your audit)
for d in ".claude/agents" "interfaces" "claude-brain" "modules" ; do
  if [ -d "$d" ]; then
    CNT=$(find "$d" -type f | wc -l | tr -d ' ')
    echo "inventory:$d:$CNT files" | tee -a "$LOG"
  fi
done
# CLI timing test
echo "--- CLI test ---" | tee -a "$LOG"
START=$(date +%s%3N 2>/dev/null || date +%s)
npm run -s seven-cli 2>&1 | tee -a "$LOG" || ts-node examples/seven-cli.ts 2>&1 | tee -a "$LOG" || true
END=$(date +%s%3N 2>/dev/null || date +%s)
DUR=$((END-START))
echo "cli_duration_ms: $DUR" | tee -a "$LOG"
echo "log: $LOG"