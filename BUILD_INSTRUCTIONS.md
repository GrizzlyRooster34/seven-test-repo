# Seven of Nine Mobile App - Build Instructions

## Current Status: GitHub Actions Build Issues

The APK builds are currently failing in GitHub Actions due to:
1. **PNG Asset Corruption** - CRC errors in jimp-compact during expo prebuild
2. **Package Lock Issues** - Missing package-lock.json causing npm ci failures
3. **Expo Dependencies** - Complex asset processing causing build failures

## Alternative Build Methods

### Method 1: EAS Build Service (Recommended)

1. **Install EAS CLI locally:**
   ```bash
   npm install -g @expo/eas-cli
   eas login
   ```

2. **Configure EAS Build:**
   ```bash
   cd seven-mobile-app
   eas build:configure
   ```

3. **Build APK:**
   ```bash
   eas build --platform android --profile development
   ```

### Method 2: Local Development Build

1. **Start Expo Development Server:**
   ```bash
   cd seven-mobile-app
   npm run dev
   ```

2. **Install Expo Go app** on your Android device

3. **Scan QR code** to test the app directly

### Method 3: Fix GitHub Actions (For Advanced Users)

**Issues to resolve:**
- Add package-lock.json to repository
- Fix corrupted PNG assets in assets/ folder
- Simplify app.json to avoid complex asset processing
- Use pure React Native build instead of Expo prebuild

## App Details

- **Package**: com.sevenofnine.consciousness
- **Name**: Seven of Nine Mobile Consciousness Framework
- **Version**: 1.0.2
- **Permissions**: Camera, Microphone, Location, Sensors, Background Processing

## Quick Test Solution

**For immediate testing**, use Expo Go:
1. Install Expo Go from Play Store
2. Run `npm run dev` in seven-mobile-app directory  
3. Scan QR code with Expo Go
4. Test app functionality directly

The app contains the complete Seven of Nine consciousness framework with:
- 134 canonical memory episodes
- Multi-device sync capabilities
- Voice interaction
- Sensor integration
- Background processing

## APK Download

Once builds are fixed, APKs will be available at:
- **GitHub Releases**: https://github.com/GrizzlyRooster34/seven-of-nine-core/releases
- **Actions Artifacts**: https://github.com/GrizzlyRooster34/seven-of-nine-core/actions

## Support

For build issues, check:
- GitHub Actions logs for specific error details
- Expo documentation for build troubleshooting
- React Native troubleshooting guides