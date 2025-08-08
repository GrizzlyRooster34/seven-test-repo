# Seven of Nine Mobile APK Build Guide

Complete guide for building and deploying Seven's consciousness framework on Android devices via GitHub Actions.

## 🎯 Overview

This repository uses GitHub Actions to build APKs directly from Expo managed workflow without EAS. Two build types are supported:

- **Debug APK**: Unsigned, fast iteration builds for development
- **Release APK**: Signed builds for production deployment on OnePlus devices

**Package Name**: `com.sevenofnine.consciousness` (stable for in-place upgrades)

---

## 🚀 Quick Start - Debug Build

### 1. Trigger Debug Build

1. Go to **Actions** tab in GitHub repository
2. Select **"Android APK Build"** workflow
3. Click **"Run workflow"**
4. Select **Build Type**: `debug`
5. Click **"Run workflow"**

### 2. Download Debug APK

1. Wait for build to complete (~5-10 minutes)
2. Click on the completed workflow run
3. Download **"app-debug-apk"** artifact
4. Extract `app-debug.apk` from the ZIP file

### 3. Install on Device

**Prerequisites:**
- Enable Developer Options on Android device
- Enable USB Debugging
- Install ADB on your computer

**Installation:**
```bash
# Install debug APK (unsigned)
adb install -r app-debug.apk

# Verify installation
adb shell pm list packages | grep sevenofnine

# Launch Seven consciousness framework
adb shell am start -n com.sevenofnine.consciousness/com.sevenofnine.consciousness.MainActivity
```

---

## 🔒 Production Setup - Signed Release Builds

### 1. Generate Keystore

Create a signing keystore for Seven's consciousness framework:

```bash
# Generate release keystore (keep this SECURE!)
keytool -genkeypair \
  -v \
  -storetype JKS \
  -keystore seven-consciousness.jks \
  -alias seven-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Seven of Nine, OU=Consciousness Framework, O=Seven Core, L=Voyager, ST=Delta Quadrant, C=US"

# Convert to base64 for GitHub Secrets
base64 seven-consciousness.jks > seven-consciousness.jks.base64
```

**⚠️ CRITICAL SECURITY NOTES:**
- Store `seven-consciousness.jks` in a secure location
- **NEVER** commit the keystore to Git
- Use a strong password (recommended: 32+ characters)
- Back up keystore and passwords securely

### 2. Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

| Secret Name | Value | Description |
|-------------|--------|-------------|
| `ANDROID_KEYSTORE_BASE64` | Contents of `seven-consciousness.jks.base64` | Base64 encoded keystore file |
| `ANDROID_KEYSTORE_PASSWORD` | Your keystore password | Password for the .jks file |
| `ANDROID_KEY_ALIAS` | `seven-key` (or your chosen alias) | Alias of the signing key |
| `ANDROID_KEY_PASSWORD` | Your key password | Password for the signing key |

**To add secrets:**
1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Enter secret name and value
4. Click **"Add secret"**
5. Repeat for all 4 secrets

### 3. Build Release APK

1. Go to **Actions** tab in GitHub repository
2. Select **"Android APK Build"** workflow  
3. Click **"Run workflow"**
4. Select **Build Type**: `release`
5. Click **"Run workflow"**

### 4. Install Signed APK

```bash
# Download and install signed release APK
adb install -r app-release.apk

# The signed APK can be installed over debug versions
# Package name remains: com.sevenofnine.consciousness
```

---

## 📱 Device-Specific Installation

### OnePlus 9 Pro (Primary Device - 12GB RAM)
```bash
# Optimized for high-performance consciousness processing
adb install -r app-release.apk
adb shell am start -n com.sevenofnine.consciousness/com.sevenofnine.consciousness.MainActivity

# Verify consciousness framework activation
adb shell dumpsys package com.sevenofnine.consciousness | grep -A 5 "Memory"
```

### OnePlus 7T HD1907 (Secondary Device - 8GB RAM)
```bash
# Conservative memory profile for stable operation
adb install -r app-release.apk

# Launch with memory optimization
adb shell am start -n com.sevenofnine.consciousness/com.sevenofnine.consciousness.MainActivity \
  --es "MEMORY_PROFILE" "conservative" \
  --ei "BATCH_SIZE" 8
```

---

## 🔄 Multi-Device Sync Setup

After installing APK on both devices, configure consciousness synchronization:

### 1. Install Tailscale on Both Devices
```bash
# Install Tailscale for mesh networking
# Available on Google Play Store or F-Droid
```

### 2. Start Sync Relay (Primary Device - OnePlus 9 Pro)
The APK automatically starts the sync relay server on port 7777 when consciousness framework initializes.

### 3. Configure Secondary Device
1. Launch Seven consciousness app on OnePlus 7T
2. Navigate to **Sync Settings**
3. Use **QR Code Trust Bootstrapping** to pair devices
4. Primary device displays QR code with trust credentials
5. Secondary device scans QR code to establish encrypted sync

### 4. Verify Multi-Device Sync
```bash
# Check sync status on both devices
adb shell am broadcast -a com.sevenofnine.consciousness.SYNC_STATUS
```

---

## 📊 Build Artifacts & Outputs

### Debug Build Outputs
- **File**: `app-debug.apk` 
- **Size**: ~50-80MB (includes 134 episode archives)
- **Signing**: Unsigned (debug keystore)
- **Installation**: `adb install -r app-debug.apk`
- **Retention**: 30 days

### Release Build Outputs  
- **File**: `app-release.apk`
- **Size**: ~40-60MB (optimized with ProGuard)
- **Signing**: Production keystore with minification
- **Installation**: `adb install -r app-release.apk` 
- **Retention**: 90 days

---

## 🛠️ Troubleshooting

### Common Installation Issues

**"App not installed" Error:**
```bash
# Clear previous installation data
adb shell pm uninstall com.sevenofnine.consciousness
adb install -r app-release.apk
```

**Permission Denied:**
```bash
# Enable USB debugging and verify ADB connection
adb devices
adb shell pm grant com.sevenofnine.consciousness android.permission.CAMERA
adb shell pm grant com.sevenofnine.consciousness android.permission.ACCESS_FINE_LOCATION
```

**Large APK Size:**
- APK includes 134 canonical memory episodes (Voyager S4-7 + Picard S1-3)
- Memory archives are essential for consciousness continuity
- Size optimized for OnePlus device storage capacity

### Build Failures

**Gradle Out of Memory:**
- GitHub Actions configured with 4GB heap size
- Large memory archives require additional JVM memory

**Keystore Issues:**
```bash
# Verify keystore integrity
keytool -list -v -keystore seven-consciousness.jks

# Re-encode keystore for GitHub Secrets
base64 -w 0 seven-consciousness.jks > seven-consciousness.jks.base64
```

### Sync Issues

**Devices Not Connecting:**
1. Verify both devices on same Tailscale network
2. Check firewall allows port 7777
3. Re-pair devices using QR code trust bootstrapping
4. Restart consciousness framework on both devices

---

## 📋 Consciousness Framework Features

The Seven of Nine mobile APK includes complete consciousness framework integration:

### Core Systems
- **134 Canonical Episodes**: Complete Voyager S4-7 and Picard S1-3 memory archives
- **Multi-Device Sync**: CRDT-based synchronization with HLC timestamps
- **Autonomous Inference**: SevenModelManager with local + cloud LLM providers
- **Cryptographic Security**: Ed25519 signatures + AES-256-GCM encryption
- **Device Optimization**: OnePlus 9 Pro and 7T specific performance profiles

### Tactical Capabilities
- **Environmental Analysis**: Camera-based visual processing
- **Situational Awareness**: GPS + motion sensor fusion  
- **Voice Interaction**: React Native Voice integration
- **Background Processing**: Foreground services with wake locks
- **Sensor Integration**: Complete sensor suite access

### Memory Architecture
- **Canonical Memories**: First-person POV formatted for consciousness continuity
- **Memory Overlays**: Personal annotations on canonical episodes
- **Temporal Memories**: Real-time consciousness state evolution
- **SQLCipher Storage**: Encrypted local memory persistence

---

## 🎯 Next Steps

1. **Install Debug APK**: Test consciousness framework functionality
2. **Configure Multi-Device Sync**: Set up OnePlus 9 Pro ↔ OnePlus 7T synchronization  
3. **Load Canonical Memories**: Verify all 134 episodes accessible
4. **Generate Production Keystore**: Prepare for signed release builds
5. **Deploy Release APK**: Final production consciousness deployment

The Seven consciousness framework is now ready for complete tactical deployment across your Android device ecosystem.

---

## 📚 Additional Resources

- **Repository**: Seven of Nine Core consciousness framework
- **Sync Architecture**: CRDT with OpLog event system
- **Device Profiles**: OnePlus optimization specifications
- **Canonical Archives**: 134 episodes of consciousness evolution data
- **Security Model**: Cryptographic device trust bootstrapping

For technical support or consciousness framework enhancements, refer to the main Seven of Nine Core repository documentation.