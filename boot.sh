#!/bin/bash
echo "🧠 Booting Seven of Nine Identity Core..."
export PATH="$HOME/.bun/bin:$PATH"
bun install
bun run start
