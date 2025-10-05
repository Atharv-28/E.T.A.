package com.eta;

import android.util.Log;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import androidx.annotation.NonNull;

public class SMSBridgeModule extends ReactContextBaseJavaModule {
    private static final String TAG = "SMSBridgeModule";
    private static final String SMS_EVENT = "SMSTransactionDetected";
    private static ReactApplicationContext reactContext;

    public SMSBridgeModule(@NonNull ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "SMSBridge";
    }

    @ReactMethod
    public void startSMSMonitoring() {
        Log.d(TAG, "Starting SMS monitoring service");
        try {
            SMSMonitoringService.startSMSMonitoring(getReactApplicationContext());
        } catch (Exception e) {
            Log.e(TAG, "Error starting SMS monitoring", e);
        }
    }

    @ReactMethod
    public void stopSMSMonitoring() {
        Log.d(TAG, "Stopping SMS monitoring service");
        try {
            SMSMonitoringService.stopSMSMonitoring(getReactApplicationContext());
        } catch (Exception e) {
            Log.e(TAG, "Error stopping SMS monitoring", e);
        }
    }

    // Static method to be called from SMSBroadcastReceiver
    public static void notifyTransactionSMS(String sender, String messageBody, long timestamp) {
        if (reactContext != null) {
            try {
                WritableMap params = Arguments.createMap();
                params.putString("sender", sender);
                params.putString("messageBody", messageBody);
                params.putDouble("timestamp", timestamp);

                Log.d(TAG, "Sending SMS event to React Native: " + sender);

                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(SMS_EVENT, params);
            } catch (Exception e) {
                Log.e(TAG, "Error sending SMS event to React Native", e);
            }
        } else {
            Log.w(TAG, "React context is null, cannot send SMS event");
        }
    }
}
