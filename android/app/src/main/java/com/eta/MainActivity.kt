package com.eta

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import android.content.Intent
import com.facebook.react.ReactInstanceManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.ReactContext
import com.facebook.react.modules.core.DeviceEventManagerModule

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "ETA"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  // Forward intent extras (from notification) to React Native when activity is launched or gets new intent
  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)

    try {
      if (intent != null && intent.hasExtra("sms_raw")) {
        val raw = intent.getStringExtra("sms_raw")
        val sender = if (intent.hasExtra("sms_sender")) intent.getStringExtra("sms_sender") else null
        val timestamp = if (intent.hasExtra("sms_timestamp")) intent.getStringExtra("sms_timestamp") else null

        val rm: ReactInstanceManager = reactNativeHost.reactInstanceManager
        val reactContext: ReactContext? = rm.currentReactContext
        if (reactContext != null) {
          val map: WritableMap = Arguments.createMap()
          map.putString("raw", raw)
          if (sender != null) map.putString("sender", sender)
          if (timestamp != null) map.putString("timestamp", timestamp)
          reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("NativeSMSReceived", map)
        }
      }
    } catch (t: Throwable) {
      t.printStackTrace()
    }
  }
}
