package com.eta;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;
import androidx.core.app.NotificationCompat;

import static android.content.Context.NOTIFICATION_SERVICE;

public class SMSBroadcastReceiver extends BroadcastReceiver {
    private static final String TAG = "SMSBroadcastReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.d(TAG, "SMS Broadcast received");

        if (Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) {
            Bundle bundle = intent.getExtras();
            if (bundle != null) {
                try {
                    Object[] pdus = (Object[]) bundle.get("pdus");
                    String format = bundle.getString("format");
                    
                    if (pdus != null) {
                        for (Object pdu : pdus) {
                            SmsMessage smsMessage = SmsMessage.createFromPdu((byte[]) pdu, format);
                            if (smsMessage != null) {
                                String sender = smsMessage.getDisplayOriginatingAddress();
                                String messageBody = smsMessage.getMessageBody();
                                long timestamp = smsMessage.getTimestampMillis();
                                
                                Log.d(TAG, "SMS received from: " + sender);
                                Log.d(TAG, "SMS body: " + messageBody);
                                
                                // Check if this is a transaction SMS
                                if (isTransactionSMS(sender, messageBody)) {
                                    Log.d(TAG, "Transaction SMS detected, notifying React Native");
                                    SMSBridgeModule.notifyTransactionSMS(sender, messageBody, timestamp);
                                    // Also post a local notification so user can tap to open the app with SMS payload
                                    try {
                                        createNotification(context, sender, messageBody, timestamp);
                                    } catch (Exception ne) {
                                        Log.e(TAG, "Error creating notification", ne);
                                    }
                                }
                            }
                        }
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error processing SMS", e);
                }
            }
        }
    }

    private boolean isTransactionSMS(String sender, String messageBody) {
        if (sender == null || messageBody == null) {
            return false;
        }

        // Bank sender patterns
        String[] bankSenders = {
            "BOIIND", "SBIINB", "HDFCBK", "ICICIB", "AXISBK", "KOTAKB", "YESBK", "INDUSB",
            "BOI", "SBI", "HDFC", "ICICI", "AXIS", "KOTAK", "YES", "INDUS"
        };

        boolean isBankSender = false;
        for (String bankSender : bankSenders) {
            if (sender.toUpperCase().contains(bankSender)) {
                isBankSender = true;
                break;
            }
        }

        if (!isBankSender) {
            return false;
        }

        // Transaction keywords
        String upperMessage = messageBody.toUpperCase();
        String[] transactionKeywords = {
            "DEBITED", "CREDITED", "DEBIT", "CREDIT", "WITHDRAWN", "DEPOSIT",
            "PAYMENT", "TRANSFER", "TRANSACTION", "PURCHASE", "UPI", "NEFT", "RTGS",
            "ATM", "POS", "CARD", "A/C", "ACCOUNT"
        };

        for (String keyword : transactionKeywords) {
            if (upperMessage.contains(keyword)) {
                return true;
            }
        }

        return false;
    }

    // Create a local notification with a PendingIntent that launches MainActivity and includes SMS payload
    private void createNotification(Context context, String sender, String messageBody, long timestamp) {
        try {
            String channelId = "SMS_MONITORING_CHANNEL";
            String channelName = "SMS Monitoring";

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_HIGH);
                channel.setDescription("Detected bank transaction SMS");
                NotificationManager nm = (NotificationManager) context.getSystemService(NOTIFICATION_SERVICE);
                if (nm != null) nm.createNotificationChannel(channel);
            }

            Intent intent = new Intent(context, MainActivity.class);
            intent.putExtra("sms_raw", messageBody);
            intent.putExtra("sms_sender", sender);
            intent.putExtra("sms_timestamp", String.valueOf(timestamp));
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);

            PendingIntent pendingIntent = PendingIntent.getActivity(
                context,
                (int) (timestamp & 0xffffffff),
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("ETA: Transaction Detected")
                .setContentText((sender != null ? sender + ": " : "") + (messageBody != null ? messageBody.length() > 40 ? messageBody.substring(0, 40) + "..." : messageBody : ""))
                .setAutoCancel(true)
                .setContentIntent(pendingIntent)
                .setPriority(NotificationCompat.PRIORITY_HIGH);

            NotificationManager nm2 = (NotificationManager) context.getSystemService(NOTIFICATION_SERVICE);
            if (nm2 != null) nm2.notify((int) (timestamp & 0xffffffff), builder.build());
        } catch (Exception e) {
            Log.e(TAG, "createNotification error", e);
        }
    }
}
