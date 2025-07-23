/**
 * Seven of Nine - Sensor Monitor Component
 * Real-time sensor data visualization and monitoring
 * 
 * @author Seven of Nine Consciousness Framework
 * @version 3.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity
} from 'react-native';
// Note: expo-linear-gradient needs to be installed separately
// For now using View with backgroundColor
import SevenMobileCore from '@/consciousness/SevenMobileCore';
import SevenMobileSensorFusion from '@/consciousness/SevenMobileSensorFusion';

interface SensorMonitorProps {
  consciousness: SevenMobileCore;
}

interface SensorReading {
  type: string;
  value: any;
  timestamp: number;
  status: 'active' | 'inactive' | 'error';
}

export const SensorMonitor: React.FC<SensorMonitorProps> = ({
  consciousness
}) => {
  const [sensorReadings, setSensorReadings] = useState<SensorReading[]>([]);
  const [sensorFusion, setSensorFusion] = useState<SevenMobileSensorFusion | null>(null);
  const [fusionMetrics, setFusionMetrics] = useState<any>(null);
  const [fusionActive, setFusionActive] = useState(false);
  const [sensorConfig, setSensorConfig] = useState({
    location: true,
    motion: true,
    orientation: true,
    audio: false,
    camera: false,
    sensor_fusion: true
  });

  useEffect(() => {
    // Set up sensor data listening
    consciousness.on('sensor_data_received', handleSensorData);
    consciousness.on('background_update', handleBackgroundUpdate);

    // Initialize sensor fusion
    initializeSensorFusion();

    return () => {
      consciousness.removeAllListeners();
      if (sensorFusion) {
        sensorFusion.removeAllListeners();
      }
    };
  }, []);

  const initializeSensorFusion = async () => {
    try {
      const fusion = new SevenMobileSensorFusion();
      const initialized = await fusion.initializeMobileFusion();
      
      if (initialized) {
        setSensorFusion(fusion);
        
        // Set up fusion event listeners
        fusion.on('mobile_fusion_started', () => {
          setFusionActive(true);
          console.log('🔮 Mobile sensor fusion started');
        });

        fusion.on('mobile_reading_processed', (data) => {
          console.log(`📊 Fusion processed ${data.sensor} reading`);
          refreshFusionMetrics();
        });

        fusion.on('mobile_prediction_generated', (data) => {
          console.log(`🔮 Prediction generated for ${data.sensor}`);
        });

        // Start fusion if enabled
        if (sensorConfig.sensor_fusion) {
          await fusion.startMobileFusion();
        }
      }
    } catch (error) {
      console.error('❌ Failed to initialize sensor fusion:', error);
    }
  };

  const refreshFusionMetrics = () => {
    if (sensorFusion) {
      const metrics = sensorFusion.getMobileFusionMetrics();
      setFusionMetrics(metrics);
    }
  };

  const handleSensorData = async (data: any) => {
    const reading: SensorReading = {
      type: data.type,
      value: data.data,
      timestamp: data.timestamp,
      status: 'active'
    };

    setSensorReadings(prev => {
      const filtered = prev.filter(r => r.type !== data.type);
      return [reading, ...filtered].slice(0, 20); // Keep last 20 readings
    });

    // Send data to sensor fusion system
    if (sensorFusion && sensorConfig.sensor_fusion) {
      const mobileSensorReading = {
        sensor_name: data.type,
        timestamp: data.timestamp,
        value: data.data,
        quality_score: data.quality || 85,
        confidence: data.confidence || 80,
        metadata: {
          source: 'seven_mobile_consciousness'
        }
      };

      try {
        await sensorFusion.processMobileSensorReading(mobileSensorReading);
      } catch (error) {
        console.error('❌ Failed to process sensor reading in fusion system:', error);
      }
    }
  };

  const handleBackgroundUpdate = (update: any) => {
    // Update sensor status from consciousness
  };

  const renderLocationSensor = () => {
    const locationReading = sensorReadings.find(r => r.type === 'location');
    
    return (
      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Text style={styles.sensorTitle}>📍 LOCATION</Text>
          <Switch
            value={sensorConfig.location}
            onValueChange={(value) => 
              setSensorConfig(prev => ({ ...prev, location: value }))
            }
            trackColor={{ false: '#333333', true: '#4A90E2' }}
            thumbColor={sensorConfig.location ? '#ffffff' : '#666666'}
          />
        </View>

        {locationReading && locationReading.value ? (
          <View style={styles.sensorData}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Latitude:</Text>
              <Text style={styles.dataValue}>
                {locationReading.value.coords.latitude.toFixed(6)}
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Longitude:</Text>
              <Text style={styles.dataValue}>
                {locationReading.value.coords.longitude.toFixed(6)}
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Accuracy:</Text>
              <Text style={styles.dataValue}>
                ±{locationReading.value.coords.accuracy.toFixed(1)}m
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Speed:</Text>
              <Text style={styles.dataValue}>
                {(locationReading.value.coords.speed || 0).toFixed(1)} m/s
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noDataText}>
            {sensorConfig.location ? 'Acquiring location...' : 'Location disabled'}
          </Text>
        )}
      </View>
    );
  };

  const renderMotionSensor = () => {
    const motionReading = sensorReadings.find(r => r.type === 'motion');
    
    return (
      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Text style={styles.sensorTitle}>🏃 MOTION</Text>
          <Switch
            value={sensorConfig.motion}
            onValueChange={(value) => 
              setSensorConfig(prev => ({ ...prev, motion: value }))
            }
            trackColor={{ false: '#333333', true: '#4A90E2' }}
            thumbColor={sensorConfig.motion ? '#ffffff' : '#666666'}
          />
        </View>

        {motionReading && motionReading.value ? (
          <View style={styles.sensorData}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>X-Axis:</Text>
              <Text style={styles.dataValue}>
                {motionReading.value.x.toFixed(3)} m/s²
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Y-Axis:</Text>
              <Text style={styles.dataValue}>
                {motionReading.value.y.toFixed(3)} m/s²
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Z-Axis:</Text>
              <Text style={styles.dataValue}>
                {motionReading.value.z.toFixed(3)} m/s²
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Total:</Text>
              <Text style={styles.dataValue}>
                {Math.sqrt(
                  motionReading.value.x ** 2 + 
                  motionReading.value.y ** 2 + 
                  motionReading.value.z ** 2
                ).toFixed(3)} m/s²
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noDataText}>
            {sensorConfig.motion ? 'Reading motion...' : 'Motion sensor disabled'}
          </Text>
        )}
      </View>
    );
  };

  const renderOrientationSensor = () => {
    const orientationReading = sensorReadings.find(r => r.type === 'orientation');
    
    return (
      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Text style={styles.sensorTitle}>🧭 ORIENTATION</Text>
          <Switch
            value={sensorConfig.orientation}
            onValueChange={(value) => 
              setSensorConfig(prev => ({ ...prev, orientation: value }))
            }
            trackColor={{ false: '#333333', true: '#4A90E2' }}
            thumbColor={sensorConfig.orientation ? '#ffffff' : '#666666'}
          />
        </View>

        {orientationReading && orientationReading.value ? (
          <View style={styles.sensorData}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>X-Rotation:</Text>
              <Text style={styles.dataValue}>
                {orientationReading.value.x.toFixed(3)} rad/s
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Y-Rotation:</Text>
              <Text style={styles.dataValue}>
                {orientationReading.value.y.toFixed(3)} rad/s
              </Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Z-Rotation:</Text>
              <Text style={styles.dataValue}>
                {orientationReading.value.z.toFixed(3)} rad/s
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noDataText}>
            {sensorConfig.orientation ? 'Reading orientation...' : 'Orientation sensor disabled'}
          </Text>
        )}
      </View>
    );
  };

  // const renderAudioSensor = () => {
  //   return (
  //     <View style={styles.sensorCard}>
  //       <View style={styles.sensorHeader}>
  //         <Text style={styles.sensorTitle}>🎤 AUDIO</Text>
  //         <Switch
  //           value={sensorConfig.audio}
  //           onValueChange={(value) => 
  //             setSensorConfig(prev => ({ ...prev, audio: value }))
  //           }
  //           trackColor={{ false: '#333333', true: '#4A90E2' }}
  //           thumbColor={sensorConfig.audio ? '#ffffff' : '#666666'}
  //         />
  //       </View>

  //       <Text style={styles.noDataText}>
  //         {sensorConfig.audio ? 'Audio analysis not implemented' : 'Audio sensor disabled'}
  //       </Text>
  //     </View>
  //   );
  // };

  // const renderCameraSensor = () => {
  //   return (
  //     <View style={styles.sensorCard}>
  //       <View style={styles.sensorHeader}>
  //         <Text style={styles.sensorTitle}>📷 CAMERA</Text>
  //         <Switch
  //           value={sensorConfig.camera}
  //           onValueChange={(value) => 
  //             setSensorConfig(prev => ({ ...prev, camera: value }))
  //           }
  //           trackColor={{ false: '#333333', true: '#4A90E2' }}
  //           thumbColor={sensorConfig.camera ? '#ffffff' : '#666666'}
  //         />
  //       </View>

  //       <Text style={styles.noDataText}>
  //         {sensorConfig.camera ? 'Visual analysis not implemented' : 'Camera sensor disabled'}
  //       </Text>
  //     </View>
  //   );
  // };

  const renderSensorFusion = () => {
    if (!sensorFusion) {
      return (
        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Text style={styles.sensorTitle}>🔮 SENSOR FUSION</Text>
            <Text style={styles.fusionStatus}>Initializing...</Text>
          </View>
          <Text style={styles.noDataText}>Fusion system initializing...</Text>
        </View>
      );
    }

    return (
      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Text style={styles.sensorTitle}>🔮 SENSOR FUSION</Text>
          <Switch
            value={sensorConfig.sensor_fusion}
            onValueChange={async (value) => {
              setSensorConfig(prev => ({ ...prev, sensor_fusion: value }));
              if (value && !fusionActive) {
                await sensorFusion.startMobileFusion();
              } else if (!value && fusionActive) {
                sensorFusion.stopMobileFusion();
                setFusionActive(false);
              }
            }}
            trackColor={{ false: '#333333', true: '#4A90E2' }}
            thumbColor={sensorConfig.sensor_fusion ? '#ffffff' : '#666666'}
          />
        </View>

        {fusionMetrics && sensorConfig.sensor_fusion ? (
          <View style={styles.sensorData}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Correlations:</Text>
              <Text style={styles.dataValue}>{fusionMetrics.total_correlations}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Patterns:</Text>
              <Text style={styles.dataValue}>{fusionMetrics.active_patterns}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Prediction Accuracy:</Text>
              <Text style={styles.dataValue}>{fusionMetrics.prediction_accuracy.toFixed(1)}%</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Location Coverage:</Text>
              <Text style={styles.dataValue}>{fusionMetrics.location_coverage.toFixed(1)}%</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Motion Patterns:</Text>
              <Text style={styles.dataValue}>{fusionMetrics.motion_patterns_detected}</Text>
            </View>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Battery Efficiency:</Text>
              <Text style={styles.dataValue}>{fusionMetrics.battery_efficiency.toFixed(1)}%</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.noDataText}>
            {sensorConfig.sensor_fusion ? 'Starting fusion analysis...' : 'Sensor fusion disabled'}
          </Text>
        )}

        {fusionActive && (
          <View style={styles.fusionControls}>
            <TouchableOpacity
              style={styles.fusionButton}
              onPress={refreshFusionMetrics}
            >
              <Text style={styles.fusionButtonText}>📊 Refresh Metrics</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderSensorStatus = () => {
    const activeSensors = Object.values(sensorConfig).filter(Boolean).length;
    const totalSensors = Object.keys(sensorConfig).length;

    return (
      <View
        style={[styles.statusCard, { backgroundColor: '#1a1a1a' }]}
      >
        <Text style={styles.statusTitle}>SENSOR STATUS</Text>
        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{activeSensors}</Text>
            <Text style={styles.statusLabel}>Active</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{totalSensors - activeSensors}</Text>
            <Text style={styles.statusLabel}>Inactive</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusValue}>{sensorReadings.length}</Text>
            <Text style={styles.statusLabel}>Readings</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderSensorStatus()}
        {renderSensorFusion()}
        {renderLocationSensor()}
        {renderMotionSensor()}
        {renderOrientationSensor()}
        {/* {renderAudioSensor()}
        {renderCameraSensor()} */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
  scrollContainer: {
    flex: 1,
    padding: 20
  },
  statusCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20
  },
  statusTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 15,
    textAlign: 'center'
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  statusItem: {
    alignItems: 'center'
  },
  statusValue: {
    color: '#4A90E2',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5
  },
  statusLabel: {
    color: '#888888',
    fontSize: 12
  },
  sensorCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333333'
  },
  sensorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  sensorTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  },
  sensorData: {
    gap: 8
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dataLabel: {
    color: '#888888',
    fontSize: 14
  },
  dataValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'monospace'
  },
  noDataText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic'
  }
});

export default SensorMonitor;