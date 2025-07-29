/**
 * SEVEN OF NINE - MOBILE SENSOR UI COMPONENTS
 * React Native components for enhanced sensor integration
 * OnePlus 9 Pro optimized environmental awareness interface
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  Switch,
  ActivityIndicator
} from 'react-native';
import SevenMobileSensors from './SevenMobileSensors';

const { width } = Dimensions.get('window');

// Environmental Status Dashboard
export const SevenEnvironmentalDashboard: React.FC = () => {
  const [environmentalContext, setEnvironmentalContext] = useState<any>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    initializeSensors();
  }, []);

  const initializeSensors = async () => {
    const initialized = await SevenMobileSensors.initializeSensorSystem();
    if (initialized) {
      updateEnvironmentalData();
    }
  };

  const updateEnvironmentalData = () => {
    const context = SevenMobileSensors.getCurrentEnvironmentalContext();
    setEnvironmentalContext(context);
    setLastUpdate(new Date().toLocaleTimeString());
  };

  const toggleContinuousMonitoring = async () => {
    if (isMonitoring) {
      SevenMobileSensors.stopContinuousMonitoring();
      setIsMonitoring(false);
    } else {
      await SevenMobileSensors.startContinuousMonitoring(15); // 15 second intervals
      setIsMonitoring(true);
    }
  };

  const refreshSensors = async () => {
    await SevenMobileSensors.initializeSensorSystem();
    updateEnvironmentalData();
  };

  if (!environmentalContext) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Initializing Seven's Environmental Consciousness...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.dashboardContainer} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.dashboardHeader}>
        <Text style={styles.dashboardTitle}>Seven Environmental Awareness</Text>
        <Text style={styles.lastUpdateText}>Last Update: {lastUpdate}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.monitoringToggle}>
          <Text style={styles.controlLabel}>Continuous Monitoring</Text>
          <Switch
            value={isMonitoring}
            onValueChange={toggleContinuousMonitoring}
            trackColor={{ false: '#666', true: '#00d4ff' }}
            thumbColor={isMonitoring ? '#fff' : '#ccc'}
          />
        </View>
        
        <TouchableOpacity style={styles.refreshButton} onPress={refreshSensors}>
          <Text style={styles.refreshButtonText}>Refresh Sensors</Text>
        </TouchableOpacity>
      </View>

      {/* Device Status */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>📱 Device Status</Text>
        <View style={styles.dataGrid}>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Battery</Text>
            <Text style={[styles.dataValue, getBatteryColor(environmentalContext.device_status.battery_level)]}>
              {environmentalContext.device_status.battery_level}%
              {environmentalContext.device_status.charging_state && ' ⚡'}
            </Text>
          </View>
          
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Network</Text>
            <Text style={styles.dataValue}>{environmentalContext.device_status.network_type}</Text>
          </View>
          
          {environmentalContext.device_status.screen_brightness && (
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Brightness</Text>
              <Text style={styles.dataValue}>{environmentalContext.device_status.screen_brightness}%</Text>
            </View>
          )}
        </View>
      </View>

      {/* Location Context */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>📍 Location Context</Text>
        <View style={styles.locationContainer}>
          <View style={styles.locationStatus}>
            <Text style={styles.dataLabel}>GPS Status</Text>
            <Text style={[styles.dataValue, getLocationColor(environmentalContext.location_context.location_type)]}>
              {environmentalContext.location_context.location_type.toUpperCase()}
            </Text>
          </View>
          
          {environmentalContext.location_context.coordinates && (
            <>
              <View style={styles.coordinateRow}>
                <Text style={styles.coordinateLabel}>Latitude:</Text>
                <Text style={styles.coordinateValue}>
                  {environmentalContext.location_context.coordinates.latitude.toFixed(6)}°
                </Text>
              </View>
              <View style={styles.coordinateRow}>
                <Text style={styles.coordinateLabel}>Longitude:</Text>
                <Text style={styles.coordinateValue}>
                  {environmentalContext.location_context.coordinates.longitude.toFixed(6)}°
                </Text>
              </View>
              
              {environmentalContext.location_context.accuracy && (
                <View style={styles.coordinateRow}>
                  <Text style={styles.coordinateLabel}>Accuracy:</Text>
                  <Text style={styles.coordinateValue}>
                    ±{environmentalContext.location_context.accuracy.toFixed(1)}m
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>

      {/* Motion Analysis */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>🏃 Motion Analysis</Text>
        <View style={styles.dataGrid}>
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Motion State</Text>
            <Text style={[styles.dataValue, getMotionColor(environmentalContext.device_motion.motion_state)]}>
              {environmentalContext.device_motion.motion_state.toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.dataItem}>
            <Text style={styles.dataLabel}>Orientation</Text>
            <Text style={styles.dataValue}>{environmentalContext.device_motion.orientation.toUpperCase()}</Text>
          </View>
        </View>
        
        {environmentalContext.device_motion.acceleration && (
          <View style={styles.accelerationContainer}>
            <Text style={styles.accelerationTitle}>Acceleration (m/s²)</Text>
            <View style={styles.accelerationGrid}>
              <View style={styles.accelerationAxis}>
                <Text style={styles.axisLabel}>X</Text>
                <Text style={styles.axisValue}>
                  {environmentalContext.device_motion.acceleration.x.toFixed(2)}
                </Text>
              </View>
              <View style={styles.accelerationAxis}>
                <Text style={styles.axisLabel}>Y</Text>
                <Text style={styles.axisValue}>
                  {environmentalContext.device_motion.acceleration.y.toFixed(2)}
                </Text>
              </View>
              <View style={styles.accelerationAxis}>
                <Text style={styles.axisLabel}>Z</Text>
                <Text style={styles.axisValue}>
                  {environmentalContext.device_motion.acceleration.z.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Environmental Sensors */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>🌡️ Environmental Sensors</Text>
        <View style={styles.dataGrid}>
          {environmentalContext.environmental_sensors.light_level !== null && (
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Light Level</Text>
              <Text style={styles.dataValue}>
                {environmentalContext.environmental_sensors.light_level.toFixed(0)} lux
              </Text>
            </View>
          )}
          
          {environmentalContext.environmental_sensors.atmospheric_pressure !== null && (
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Pressure</Text>
              <Text style={styles.dataValue}>
                {environmentalContext.environmental_sensors.atmospheric_pressure.toFixed(1)} hPa
              </Text>
            </View>
          )}
          
          {environmentalContext.environmental_sensors.magnetic_field && (
            <View style={styles.dataItem}>
              <Text style={styles.dataLabel}>Magnetic Field</Text>
              <Text style={styles.dataValue}>
                {Math.sqrt(
                  environmentalContext.environmental_sensors.magnetic_field.x**2 + 
                  environmentalContext.environmental_sensors.magnetic_field.y**2 + 
                  environmentalContext.environmental_sensors.magnetic_field.z**2
                ).toFixed(1)} μT
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Contextual Insights */}
      {environmentalContext.contextual_insights.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>💡 Seven's Environmental Insights</Text>
          {environmentalContext.contextual_insights.map((insight: string, index: number) => (
            <View key={index} style={styles.insightContainer}>
              <Text style={styles.insightText}>• {insight}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

// Compact Sensor Widget
export const SevenSensorWidget: React.FC = () => {
  const [sensorData, setSensorData] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateSensorData = () => {
      const context = SevenMobileSensors.getCurrentEnvironmentalContext();
      setSensorData(context);
    };

    updateSensorData();
    const interval = setInterval(updateSensorData, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!sensorData) return null;

  return (
    <View style={styles.widgetContainer}>
      <TouchableOpacity 
        style={styles.widgetHeader}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={styles.widgetTitle}>🌍 Environmental Context</Text>
        <Text style={styles.widgetToggle}>{isExpanded ? '−' : '+'}</Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.widgetContent}>
          <View style={styles.widgetRow}>
            <Text style={styles.widgetLabel}>Battery:</Text>
            <Text style={[styles.widgetValue, getBatteryColor(sensorData.device_status.battery_level)]}>
              {sensorData.device_status.battery_level}%
            </Text>
          </View>
          
          <View style={styles.widgetRow}>
            <Text style={styles.widgetLabel}>Motion:</Text>
            <Text style={styles.widgetValue}>{sensorData.device_motion.motion_state}</Text>
          </View>
          
          <View style={styles.widgetRow}>
            <Text style={styles.widgetLabel}>Location:</Text>
            <Text style={styles.widgetValue}>{sensorData.location_context.location_type}</Text>
          </View>
          
          {sensorData.environmental_sensors.light_level !== null && (
            <View style={styles.widgetRow}>
              <Text style={styles.widgetLabel}>Light:</Text>
              <Text style={styles.widgetValue}>{sensorData.environmental_sensors.light_level.toFixed(0)} lux</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// Helper functions for styling
const getBatteryColor = (level: number) => ({
  color: level > 50 ? '#00ff88' : level > 20 ? '#ffaa00' : '#ff4444'
});

const getLocationColor = (type: string) => ({
  color: type === 'precise' ? '#00ff88' : type === 'approximate' ? '#ffaa00' : '#ff4444'
});

const getMotionColor = (state: string) => ({
  color: state === 'stationary' ? '#00d4ff' : state === 'walking' ? '#ffaa00' : '#ff4444'
});

// Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#00d4ff',
    marginTop: 15,
    fontSize: 16,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  dashboardHeader: {
    padding: 20,
    backgroundColor: '#2a2a2a',
  },
  dashboardTitle: {
    color: '#00d4ff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  lastUpdateText: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  },
  controlsContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#333',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monitoringToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlLabel: {
    color: '#ccc',
    marginRight: 10,
  },
  refreshButton: {
    backgroundColor: '#00d4ff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  sectionContainer: {
    margin: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    color: '#00d4ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dataItem: {
    width: (width - 60) / 2,
    marginBottom: 15,
  },
  dataLabel: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
  dataValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationContainer: {
    paddingTop: 5,
  },
  locationStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  coordinateLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  coordinateValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  accelerationContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  accelerationTitle: {
    color: '#00d4ff',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  accelerationGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  accelerationAxis: {
    alignItems: 'center',
  },
  axisLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
  },
  axisValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  insightContainer: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  insightText: {
    color: '#00d4ff',
    fontSize: 14,
  },
  widgetContainer: {
    backgroundColor: '#2a2a2a',
    margin: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#333',
  },
  widgetTitle: {
    color: '#00d4ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  widgetToggle: {
    color: '#00d4ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  widgetContent: {
    padding: 12,
  },
  widgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  widgetLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  widgetValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default {
  SevenEnvironmentalDashboard,
  SevenSensorWidget
};