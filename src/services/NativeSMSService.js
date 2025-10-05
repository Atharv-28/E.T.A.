import { NativeModules, NativeEventEmitter, DeviceEventEmitter } from 'react-native';
import { checkSMSPermissions } from '../utils/permissions';

const { SMSBridge } = NativeModules;

class NativeSMSService {
  constructor() {
    this.eventEmitter = DeviceEventEmitter;
    this.listeners = [];
    this.isMonitoring = false;
  }

  // Check if SMS monitoring is available
  async isAvailable() {
    try {
      if (!SMSBridge) {
        console.warn('NativeSMSService: SMSBridge module not available');
        return false;
      }
      
      const hasPermissions = await checkSMSPermissions();
      return hasPermissions;
    } catch (error) {
      console.warn('NativeSMSService: Error checking availability:', error);
      return false;
    }
  }

  // Start the native SMS monitoring service
  async startMonitoring() {
    console.log('NativeSMSService: Starting monitoring');
    
    try {
      // Check permissions first
      const hasPermissions = await checkSMSPermissions();
      if (!hasPermissions) {
        throw new Error('SMS permissions not granted');
      }

      if (SMSBridge && SMSBridge.startSMSMonitoring) {
        SMSBridge.startSMSMonitoring();
        this.isMonitoring = true;
        console.log('NativeSMSService: Monitoring started successfully');
      } else {
        throw new Error('SMSBridge module not available');
      }
    } catch (error) {
      console.warn('NativeSMSService: Failed to start monitoring:', error);
      throw error;
    }
  }

  // Stop the native SMS monitoring service
  stopMonitoring() {
    console.log('NativeSMSService: Stopping monitoring');
    if (SMSBridge && SMSBridge.stopSMSMonitoring) {
      SMSBridge.stopSMSMonitoring();
      this.isMonitoring = false;
      console.log('NativeSMSService: Monitoring stopped');
    } else {
      console.warn('NativeSMSService: SMSBridge module not available');
    }
  }

  // Get monitoring status
  getMonitoringStatus() {
    return {
      isMonitoring: this.isMonitoring,
      isAvailable: SMSBridge ? true : false,
    };
  }

  // Add listener for SMS transaction events
  addTransactionListener(callback) {
    console.log('NativeSMSService: Adding transaction listener');
    const listener = this.eventEmitter.addListener('SMSTransactionDetected', (data) => {
      console.log('NativeSMSService: SMS transaction detected:', data);
      if (callback && typeof callback === 'function') {
        callback(data);
      }
    });
    
    this.listeners.push(listener);
    return listener;
  }

  // Remove specific listener
  removeListener(listener) {
    console.log('NativeSMSService: Removing listener');
    if (listener && listener.remove) {
      listener.remove();
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    }
  }

  // Remove all listeners
  removeAllListeners() {
    console.log('NativeSMSService: Removing all listeners');
    this.listeners.forEach(listener => {
      if (listener && listener.remove) {
        listener.remove();
      }
    });
    this.listeners = [];
    this.eventEmitter.removeAllListeners('SMSTransactionDetected');
  }

  // Check if the native module is available
  isAvailable() {
    return SMSBridge && SMSBridge.startSMSMonitoring && SMSBridge.stopSMSMonitoring;
  }
}

export default new NativeSMSService();
