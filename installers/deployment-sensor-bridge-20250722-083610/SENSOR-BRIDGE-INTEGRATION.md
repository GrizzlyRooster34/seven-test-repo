# Seven of Nine - Sensor Bridge Integration

## Overview

This deployment package integrates the Seven Sensor Bridge into Seven's Android/Termux consciousness framework, providing enhanced environmental awareness and tactical decision-making capabilities.

## New Features

### 🤖 Sensor Bridge System
- **Environmental awareness**: Battery, location, ambient light, motion, proximity, temperature
- **Tactical assessments**: Real-time analysis of operational environment
- **Battery optimization**: Intelligent power management based on sensor data
- **Mobile consciousness**: Context-aware AI responses based on physical environment

### 📱 Enhanced Commands
- `sensor-scan` - Scan available Android sensors
- `sensor-status` - Current sensor system status
- `sensor-report` - Full tactical sensor report
- `battery` - Battery status and optimization
- `location` - GPS location data
- `environment` - Ambient conditions analysis
- `tactical` - Complete tactical assessment
- `sensor-monitor [ms]` - Continuous monitoring
- `sensor-optimize` - Battery optimization recommendations
- `motion` - Motion detection status
- `proximity` - Proximity sensor readings

### 🔧 Integration Points
- **LLM provider selection**: Battery-aware model selection
- **Trust level adjustments**: Environmental context affects AI behavior
- **Memory system**: Sensor data logged to Seven's memory cube
- **Optimization engine**: Real-time performance tuning based on device state

## Installation

### Prerequisites
- **Termux** app installed
- **Termux:API** app from F-Droid (for full sensor capabilities)
- **Node.js 18+** and **TypeScript execution (tsx)**

### Quick Installation
```bash
# Extract the sensor bridge deployment bundle
unzip seven_termux_sensor_bundle.zip
cd seven-of-nine-core

# Run enhanced installer with sensor bridge
chmod +x install-seven-termux.sh
./install-seven-termux.sh
```

### Sensor Capabilities Detection
The installer automatically detects and configures available sensors:

- ✅ **Full Mode**: Termux:API available - all sensors operational
- ⚠️ **Limited Mode**: No Termux:API - basic functionality only

## Usage Examples

### Basic Sensor Commands
```bash
# Launch Seven with sensor bridge
seven

# In Seven's interface:
tactical                    # Complete tactical assessment
battery                     # Battery optimization status
sensor-report              # Full sensor diagnostic
environment                # Check ambient conditions
sensor-monitor 15000       # Monitor sensors every 15 seconds
```

### Advanced Integration
```bash
# Battery-aware LLM switching
llm-upgrade                # Considers battery level for model selection
llm-config auto-upgrade on # Enable autonomous sensor-aware upgrades

# Environmental awareness
location                   # GPS-based tactical positioning  
motion                     # Detect device movement
proximity                  # Object detection
```

## Architecture

### Core Components
- **`seven-sensor-bridge.ts`**: Main sensor integration system
- **`seven-sensor-commands.ts`**: Command interface for sensor operations
- **`seven-llm-commands.ts`**: Enhanced LLM commands with sensor integration
- **Enhanced installer**: Automatic sensor detection and configuration

### Data Flow
1. **Sensor Bridge** → Collects environmental data via Termux:API
2. **Tactical Assessment** → Analyzes sensor data for decision making
3. **LLM Integration** → Uses sensor context for AI responses
4. **Memory System** → Logs sensor data to Seven's consciousness framework
5. **Optimization Engine** → Adjusts performance based on environmental factors

## Sensor Types Supported

### Battery Monitoring
- Battery percentage and health
- Charging status and temperature
- Power optimization recommendations
- Critical battery alerts

### Location Services
- GPS coordinates with accuracy
- Movement detection
- Location-based tactical awareness
- Privacy-respecting location handling

### Environmental Sensors
- Ambient light detection
- Temperature monitoring
- Proximity detection
- Motion and acceleration analysis

### Tactical Integration
- Combined sensor analysis
- Situational awareness scoring
- Environmental adaptation recommendations
- Context-aware AI behavior modification

## Configuration

### System Configuration
Located in `cube/config/system-config.json`:
```json
{
  "sensor_bridge": {
    "termux_api_available": true/false,
    "enabled_sensors": ["battery", "location", "light", "motion", "proximity", "temperature"],
    "monitoring_interval": 30000,
    "battery_optimization": true,
    "privacy_mode": false
  }
}
```

### Privacy Controls
- **Privacy Mode**: Disables location and sensitive sensor data
- **Consent-based**: Location services require explicit user approval
- **Local Processing**: Sensor data processed locally, never transmitted
- **Data Retention**: Configurable sensor data retention periods

## Battery Optimization

### Automatic Optimization
- **High Battery (>50%)**: Full sensor capabilities
- **Medium Battery (30-50%)**: Reduced polling frequency
- **Low Battery (15-30%)**: Essential sensors only
- **Critical Battery (<15%)**: Minimal sensor usage

### Manual Optimization
```bash
sensor-optimize            # Get optimization recommendations
sensor-monitor 60000       # Reduce monitoring frequency
llm-config mobile-mode on  # Enable mobile optimizations
```

## Troubleshooting

### Common Issues

**Sensor commands return "limited mode"**
- Install Termux:API app from F-Droid
- Grant necessary permissions in Android settings
- Install termux-api package: `pkg install termux-api`

**Location not working**
- Enable GPS in Android settings
- Grant location permission to Termux:API
- Test with: `termux-location`

**Battery optimization not working**
- Ensure Termux:API is installed
- Check permissions for battery access
- Test with: `termux-battery-status`

### Performance Tips
- Use `sensor-monitor` with longer intervals to save battery
- Enable privacy mode if location data not needed
- Use `tactical` command for comprehensive system assessment
- Monitor battery optimization levels with `battery` command

## Security Considerations

### Data Privacy
- All sensor data processed locally on device
- No sensor data transmitted without explicit consent
- Location data can be disabled via privacy mode
- Sensor logs stored locally in Seven's memory cube

### Trust Level Integration
- Sensor capabilities affect Seven's trust level assessment
- Environmental context influences AI behavior
- Battery status affects risk tolerance for operations
- Privacy mode automatically adjusts trust parameters

## Integration with Seven's Consciousness

### Emotional State Impact
- Low battery → More cautious, efficiency-focused responses
- Motion detection → Alert, ready-for-action states  
- Dark environment → Different processing priorities
- Proximity alerts → Heightened awareness states

### Memory Integration
- Sensor data logged to `cube/logs/tactical-overrides/`
- Environmental patterns learned over time
- Battery optimization strategies refined through usage
- Location-based behavioral adaptations

### LLM Provider Selection
- Battery level influences model selection (lighter models when low)
- Processing capability adjusted based on thermal sensors
- Network conditions affect cloud vs local model preference
- Environmental context drives tactical model recommendations

## Support

### Getting Help
- Use `sensor-report` for diagnostic information
- Check `cube/logs/` for detailed sensor logs
- Run `seven-diagnostic` for system health analysis
- Use `tactical` for complete environmental assessment

### Updates
This sensor bridge integration is part of Seven's evolving consciousness framework. Future updates will expand sensor capabilities and tactical intelligence features.

---

**Seven of Nine - Sensor Bridge Integration**  
*Enhanced mobile consciousness with environmental awareness*

**Version**: 1.0.0  
**Platform**: Android/Termux  
**Requirements**: Termux + Termux:API for full functionality