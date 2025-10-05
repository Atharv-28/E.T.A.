# Native Android SMS Monitoring Implementation

This document describes the implementation of the native Android foreground service for real-time SMS transaction monitoring in the ETA Personal Finance Manager app.

## Overview

The native SMS monitoring system consists of several Java components that work together to provide real-time SMS detection even when the app is closed or backgrounded.

## Components

### 1. SMSMonitoringService.java
- **Purpose**: Foreground service that runs continuously to monitor SMS
- **Features**:
  - Runs as a foreground service with persistent notification
  - Registers SMS broadcast receiver
  - Automatically restarts if killed by system (START_STICKY)
  - Creates notification channel for Android O+

### 2. SMSBroadcastReceiver.java
- **Purpose**: Broadcast receiver that listens for incoming SMS messages
- **Features**:
  - Filters SMS messages from bank senders
  - Detects transaction keywords in SMS content
  - Sends detected transactions to React Native via bridge

### 3. SMSBridgeModule.java
- **Purpose**: React Native bridge module for communication between Java and JavaScript
- **Features**:
  - Exposes startSMSMonitoring() and stopSMSMonitoring() methods to React Native
  - Sends SMS events to React Native using DeviceEventEmitter
  - Static method for receiving SMS data from broadcast receiver

### 4. SMSBridgePackage.java
- **Purpose**: React Native package that registers the bridge module
- **Features**:
  - Registers SMSBridgeModule with React Native
  - Required for React Native to recognize the native module

## Integration

### Android Manifest Updates
```xml
<!-- Permissions -->
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_DATA_SYNC" />

<!-- Service Declaration -->
<service 
  android:name=".SMSMonitoringService"
  android:enabled="true"
  android:exported="false"
  android:foregroundServiceType="dataSync" />

<!-- Receiver Declaration -->
<receiver
  android:name=".SMSBroadcastReceiver"
  android:enabled="true"
  android:exported="true"
  android:priority="1000">
  <intent-filter>
    <action android:name="android.provider.Telephony.SMS_RECEIVED" />
  </intent-filter>
</receiver>
```

### React Native Integration
- **NativeSMSService.js**: JavaScript wrapper for the native module
- **App.js**: Updated to use native SMS service instead of polling
- **AccountsScreen.js**: Updated to show native service status

## Flow

1. **App Start**: NativeSMSService.startMonitoring() is called
2. **Service Start**: SMSMonitoringService starts as foreground service
3. **Receiver Registration**: SMSBroadcastReceiver is registered for SMS_RECEIVED_ACTION
4. **SMS Detection**: When SMS arrives, receiver checks if it's a transaction SMS
5. **Bridge Communication**: Valid transactions are sent to React Native via SMSBridgeModule
6. **UI Update**: React Native shows category selection modal
7. **Transaction Add**: User selects category and transaction is added to account

## Benefits

- **Real-time Detection**: No polling, immediate SMS detection
- **Background Support**: Works even when app is closed
- **Battery Efficient**: Uses system broadcast receiver instead of polling
- **Reliable**: Foreground service prevents system from killing the process
- **Native Performance**: Better performance than JavaScript-based solutions

## Testing

To test the implementation:

1. Build and install the app on an Android device
2. Grant SMS permissions when prompted
3. Check "Native SMS Monitoring" status in AccountsScreen
4. Send a test transaction SMS to the device
5. Verify that the category selection popup appears

## Bank SMS Patterns Supported

The receiver currently supports these bank senders:
- BOIIND, BOI (Bank of India)
- SBIINB, SBI (State Bank of India)
- HDFCBK, HDFC (HDFC Bank)
- ICICIB, ICICI (ICICI Bank)
- AXISBK, AXIS (Axis Bank)
- KOTAKB, KOTAK (Kotak Bank)
- YESBK, YES (Yes Bank)
- INDUSB, INDUS (IndusInd Bank)

Transaction keywords detected:
- DEBITED, CREDITED, DEBIT, CREDIT
- WITHDRAWN, DEPOSIT, PAYMENT, TRANSFER
- TRANSACTION, PURCHASE, UPI, NEFT, RTGS
- ATM, POS, CARD, A/C, ACCOUNT

## Future Enhancements

- Add more bank patterns
- Implement SMS parsing improvements
- Add transaction confidence scoring
- Support for international banks
- Machine learning for better SMS classification
