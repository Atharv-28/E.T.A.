package com.eta;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.IBinder;
import android.provider.Telephony;
import android.util.Log;
import androidx.core.app.NotificationCompat;

public class SMSMonitoringService extends Service {
    private static final String TAG = "SMSMonitoringService";
    private static final int NOTIFICATION_ID = 1001;
    private static final String CHANNEL_ID = "SMS_MONITORING_CHANNEL";
    private static final String CHANNEL_NAME = "SMS Monitoring";
    
    private SMSBroadcastReceiver smsReceiver;
    private boolean isServiceRunning = false;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "SMS Monitoring Service Created");
        createNotificationChannel();
        
        // Initialize SMS receiver
        smsReceiver = new SMSBroadcastReceiver();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d(TAG, "SMS Monitoring Service Started");
        
        if (!isServiceRunning) {
            startForeground(NOTIFICATION_ID, createNotification());
            registerSMSReceiver();
            isServiceRunning = true;
        }
        
        // Return START_STICKY to restart service if killed
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "SMS Monitoring Service Destroyed");
        
        if (smsReceiver != null) {
            try {
                unregisterReceiver(smsReceiver);
            } catch (Exception e) {
                Log.e(TAG, "Error unregistering SMS receiver", e);
            }
        }
        
        isServiceRunning = false;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null; // We don't provide binding
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_LOW
            );
            channel.setDescription("Monitors SMS for transaction detection");
            channel.setShowBadge(false);
            
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    private Notification createNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this, 
            0, 
            notificationIntent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("ETA - Transaction Monitor")
            .setContentText("Monitoring SMS for bank transactions")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .build();
    }

    private void registerSMSReceiver() {
        try {
            IntentFilter filter = new IntentFilter();
            filter.addAction(Telephony.Sms.Intents.SMS_RECEIVED_ACTION);
            filter.setPriority(1000);
            
            registerReceiver(smsReceiver, filter);
            Log.d(TAG, "SMS Receiver registered successfully");
        } catch (Exception e) {
            Log.e(TAG, "Error registering SMS receiver", e);
        }
    }

    public static void startSMSMonitoring(android.content.Context context) {
        Intent intent = new Intent(context, SMSMonitoringService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent);
        } else {
            context.startService(intent);
        }
        Log.d(TAG, "SMS Monitoring Service start requested");
    }

    public static void stopSMSMonitoring(android.content.Context context) {
        Intent intent = new Intent(context, SMSMonitoringService.class);
        context.stopService(intent);
        Log.d(TAG, "SMS Monitoring Service stop requested");
    }
}
