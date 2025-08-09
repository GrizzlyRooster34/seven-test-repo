#!/usr/bin/env bash
set -euo pipefail
CMD="${1:-status}"
MODEL="${2:-llama3.2:1b}"   # tiny demo model if available
PROMPT="${3:-Hello from Seven}"
have_ollama(){ command -v ollama >/dev/null 2>&1; }
case "$CMD" in
  status)
    echo "sevenctl: status"; echo "time: $(date -Is)"; echo "device: $(uname -a)"
    if have_ollama; then echo "ollama: available"; ollama list || true; else echo "ollama: not installed"; fi;;
  start)
    if have_ollama; then (pgrep -f "ollama serve" >/dev/null || (ollama serve >/dev/null 2>&1 &)); echo "ollama: serve attempted"; else echo "ollama not installed"; fi;;
  stop)
    if pgrep -f "ollama serve" >/dev/null 2>&1; then pkill -f "ollama serve" || true; echo "ollama: stopped"; else echo "ollama: not running"; fi;;
  pull)
    if have_ollama; then echo "Pulling $MODEL"; ollama pull "$MODEL" || true; else echo "ollama not installed"; fi;;
  prompt)
    if have_ollama; then echo "Prompting $MODEL"; echo "$PROMPT" | ollama run "$MODEL" || true; else echo "ollama not installed"; fi;;
  *) echo "Usage: $0 {status|start|stop|pull|prompt} [model] [prompt]"; exit 2;;
esac