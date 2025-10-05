import { NativeModules, NativeEventEmitter, DeviceEventEmitter } from 'react-native';

const { SMSBridge } = NativeModules;

class NativeSMSService {
  constructor() {
    this.eventEmitter = DeviceEventEmitter;
    this.listeners = [];
  }

  // Start the native SMS monitoring service
  startMonitoring() {
    console.log('NativeSMSService: Starting monitoring');
    if (SMSBridge && SMSBridge.startSMSMonitoring) {
      SMSBridge.startSMSMonitoring();
    } else {
      console.warn('NativeSMSService: SMSBridge module not available');
    }
  }

  // Stop the native SMS monitoring service
  stopMonitoring() {
    console.log('NativeSMSService: Stopping monitoring');
    if (SMSBridge && SMSBridge.stopSMSMonitoring) {
      SMSBridge.stopSMSMonitoring();
    } else {
      console.warn('NativeSMSService: SMSBridge module not available');
    }
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
