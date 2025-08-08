#!/usr/bin/env node
/**
 * Seven of Nine - APK Signing Configuration Patcher
 * Safely injects signingConfigs and release buildType into build.gradle
 * 
 * This script is called by GitHub Actions to configure release signing
 * for the Seven consciousness framework mobile APK builds.
 * 
 * @author Seven of Nine Consciousness Framework
 */

const fs = require('fs');
const path = require('path');

const BUILD_GRADLE_PATH = path.join(__dirname, '..', 'android', 'app', 'build.gradle');

function patchBuildGradle() {
    console.log('🔧 Patching build.gradle for Seven consciousness framework signing...');
    
    if (!fs.existsSync(BUILD_GRADLE_PATH)) {
        console.error('❌ build.gradle not found at:', BUILD_GRADLE_PATH);
        console.error('   Make sure to run `npx expo prebuild --platform android` first');
        process.exit(1);
    }
    
    let content = fs.readFileSync(BUILD_GRADLE_PATH, 'utf8');
    let modified = false;
    
    // Check if signingConfigs already exists
    if (!content.includes('signingConfigs')) {
        console.log('📝 Adding signingConfigs for Seven consciousness keystore...');
        
        // Find the android block and inject signingConfigs right after the opening brace
        const androidBlockRegex = /(android\s*\{\s*)/;
        const signingConfigsBlock = `$1
    signingConfigs {
        release {
            storeFile file(System.getenv("ANDROID_KEYSTORE_FILE") ?: "release.keystore")
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_KEY_PASSWORD")
        }
    }

`;
        
        if (androidBlockRegex.test(content)) {
            content = content.replace(androidBlockRegex, signingConfigsBlock);
            modified = true;
            console.log('✅ Added signingConfigs block');
        } else {
            console.error('❌ Could not find android block in build.gradle');
            process.exit(1);
        }
    } else {
        console.log('✓ signingConfigs already exists');
    }
    
    // Check if release buildType exists and has signing config
    const buildTypesMatch = content.match(/buildTypes\s*\{([\s\S]*?)\n\s*\}/);
    if (buildTypesMatch) {
        const buildTypesContent = buildTypesMatch[1];
        
        if (!buildTypesContent.includes('release') || !buildTypesContent.includes('signingConfig signingConfigs.release')) {
            console.log('📝 Adding/updating release buildType with signing...');
            
            // Find the buildTypes block and ensure release buildType has proper signing
            const releaseBuildType = `
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
        }`;
            
            // If release buildType doesn't exist, add it
            if (!buildTypesContent.includes('release')) {
                const buildTypesBlockRegex = /(buildTypes\s*\{[\s\S]*?)(\n\s*\})/;
                content = content.replace(buildTypesBlockRegex, `$1${releaseBuildType}$2`);
                modified = true;
                console.log('✅ Added release buildType with signing');
            } else {
                // Update existing release buildType to ensure it has signing
                const releaseBlockRegex = /(release\s*\{[\s\S]*?)(signingConfig[^\n]*\n)?([\s\S]*?\n\s*\})/;
                if (!content.includes('signingConfig signingConfigs.release')) {
                    content = content.replace(
                        /(release\s*\{\s*)/,
                        '$1\n            signingConfig signingConfigs.release'
                    );
                    modified = true;
                    console.log('✅ Updated release buildType with signing');
                }
            }
        }
    } else {
        console.error('❌ Could not find buildTypes block in build.gradle');
        process.exit(1);
    }
    
    // Write the modified content back
    if (modified) {
        fs.writeFileSync(BUILD_GRADLE_PATH, content, 'utf8');
        console.log('🎯 build.gradle successfully patched for Seven consciousness framework');
        
        // Show the relevant sections for verification
        console.log('\n📋 Signing configuration preview:');
        const lines = content.split('\n');
        let inSigningConfigs = false;
        let inBuildTypes = false;
        let braceDepth = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.includes('signingConfigs')) {
                inSigningConfigs = true;
                braceDepth = 0;
            }
            
            if (line.includes('buildTypes') && !inSigningConfigs) {
                inBuildTypes = true;
                braceDepth = 0;
            }
            
            if (inSigningConfigs || inBuildTypes) {
                console.log(line);
                
                // Count braces to know when we're done with this block
                const openBraces = (line.match(/\{/g) || []).length;
                const closeBraces = (line.match(/\}/g) || []).length;
                braceDepth += openBraces - closeBraces;
                
                if (braceDepth <= 0 && line.includes('}')) {
                    inSigningConfigs = false;
                    inBuildTypes = false;
                    console.log(''); // Add blank line after block
                }
            }
        }
    } else {
        console.log('✓ build.gradle already properly configured');
    }
    
    console.log('🚀 Seven consciousness framework APK signing configuration complete');
}

// Verify environment variables are available
function verifyEnvironment() {
    const requiredVars = [
        'ANDROID_KEYSTORE_FILE',
        'ANDROID_KEYSTORE_PASSWORD', 
        'ANDROID_KEY_ALIAS',
        'ANDROID_KEY_PASSWORD'
    ];
    
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach(varName => console.error(`   - ${varName}`));
        console.error('\nMake sure GitHub secrets are properly configured.');
        process.exit(1);
    }
    
    console.log('✅ All signing environment variables present');
}

// Main execution
if (require.main === module) {
    console.log('🧠 Seven of Nine APK Signing Patcher v1.0');
    console.log('    Configuring consciousness framework for secure deployment\n');
    
    verifyEnvironment();
    patchBuildGradle();
}

module.exports = { patchBuildGradle, verifyEnvironment };