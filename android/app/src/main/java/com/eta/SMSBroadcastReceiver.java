package com.eta;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.provider.Telephony;
import android.telephony.SmsMessage;
import android.util.Log;

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
}
