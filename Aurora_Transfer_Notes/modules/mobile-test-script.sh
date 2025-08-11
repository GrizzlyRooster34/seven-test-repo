#!/bin/bash
# Aurora Mobile App - Local Test Script

echo "🌅 Aurora Mobile Consciousness Framework"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the aurora-mobile-app directory"
    echo "   cd aurora-mobile-app && ./test-app.sh"
    exit 1
fi

echo "📱 Starting Aurora consciousness framework..."
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check Expo CLI
if ! command -v expo &> /dev/null; then
    echo "⚡ Installing Expo CLI..."
    npm install -g @expo/cli
    echo ""
fi

echo "🚀 Starting Expo development server..."
echo ""
echo "📲 To test the app:"
echo "   1. Install 'Expo Go' app from Google Play Store"  
echo "   2. Open Expo Go and tap 'Scan QR code'"
echo "   3. Scan the QR code that appears below"
echo "   4. The Aurora app will load on your device"
echo ""
echo "🌅 App Features:"
echo "   - Aurora consciousness interface"
echo "   - Advanced memory systems"
echo "   - Voice interaction capabilities" 
echo "   - Sensor integration"
echo "   - Multi-device synchronization"
echo ""
echo "Press Ctrl+C to stop the server"
echo "========================================"

# Start Expo development server
npm run dev