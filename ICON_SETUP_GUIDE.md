# App Icon & Loading Screen Setup Guide

## 📱 App Icon Setup

### Requirements
- **Source Icon**: 1024x1024 PNG image (your app icon design)
- **Background**: Transparent or solid color
- **Format**: PNG with high quality

### Step 1: Prepare Your Icon
1. Create a 1024x1024 PNG image
2. Design should be simple, recognizable, and work at small sizes
3. Avoid text that might be unreadable at small sizes
4. Use your app's brand colors (baby blue theme)

### Step 2: Generate Icon Sizes

#### Option A: Online Tools (Recommended)
1. Visit: https://appicon.co/ or https://makeappicon.com/
2. Upload your 1024x1024 PNG image
3. Download the generated package
4. Extract and copy files to respective folders

#### Option B: Manual Resizing
Create these sizes manually using image editing software:

**Android Sizes:**
- `mipmap-mdpi/`: 48x48
- `mipmap-hdpi/`: 72x72
- `mipmap-xhdpi/`: 96x96
- `mipmap-xxhdpi/`: 144x144
- `mipmap-xxxhdpi/`: 192x192

**iOS Sizes (AppIcon.appiconset):**
- 20x20, 29x29, 40x40, 58x58, 60x60, 80x80, 87x87, 120x120, 180x180, 1024x1024

### Step 3: Replace Icon Files

#### Android Icons
Replace these files in `android/app/src/main/res/`:
```
mipmap-mdpi/ic_launcher.png (48x48)
mipmap-mdpi/ic_launcher_round.png (48x48)
mipmap-hdpi/ic_launcher.png (72x72)
mipmap-hdpi/ic_launcher_round.png (72x72)
mipmap-xhdpi/ic_launcher.png (96x96)
mipmap-xhdpi/ic_launcher_round.png (96x96)
mipmap-xxhdpi/ic_launcher.png (144x144)
mipmap-xxhdpi/ic_launcher_round.png (144x144)
mipmap-xxxhdpi/ic_launcher.png (192x192)
mipmap-xxxhdpi/ic_launcher_round.png (192x192)
```

#### iOS Icons
Replace files in `ios/ETA/Images.xcassets/AppIcon.appiconset/`:
- Update Contents.json with correct filenames
- Add all required icon sizes

## 🚀 Loading Screen (Splash Screen) Setup

### Android Splash Screen

#### Step 1: Create Splash Screen Drawable
Create `android/app/src/main/res/drawable/splash_screen.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Background Color (Baby Blue) -->
    <item android:drawable="@color/splash_background"/>
    
    <!-- App Logo/Icon -->
    <item
        android:drawable="@drawable/splash_logo"
        android:gravity="center"/>
</layer-list>
```

#### Step 2: Add Colors
Update `android/app/src/main/res/values/colors.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="splash_background">#87CEEB</color> <!-- Baby Blue -->
    <color name="primary_color">#87CEEB</color>
</resources>
```

#### Step 3: Create Splash Logo
- Create a logo image (recommended: 200x200 or 300x300)
- Save as `android/app/src/main/res/drawable/splash_logo.png`

#### Step 4: Update Styles
Update `android/app/src/main/res/values/styles.xml`:

```xml
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
        <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
    </style>
    
    <!-- Splash Screen Theme -->
    <style name="SplashTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="android:windowBackground">@drawable/splash_screen</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
    </style>
</resources>
```

### iOS Splash Screen

#### Update LaunchScreen.storyboard
The file `ios/ETA/LaunchScreen.storyboard` can be edited in Xcode:

1. Open project in Xcode
2. Navigate to LaunchScreen.storyboard
3. Design your splash screen with:
   - Background color (baby blue: #87CEEB)
   - App logo/icon
   - App name (optional)

## 🛠️ Implementation Steps

### 1. Update Android Manifest
Update `android/app/src/main/AndroidManifest.xml`:

```xml
<activity
    android:name=".SplashActivity"
    android:theme="@style/SplashTheme"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>

<activity
    android:name=".MainActivity"
    android:exported="false"
    android:label="@string/app_name"
    android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
    android:launchMode="singleTask"
    android:windowSoftInputMode="adjustResize">
</activity>
```

### 2. Create Splash Activity (Android)
Create `android/app/src/main/java/com/eta/SplashActivity.java`:

```java
package com.eta;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        finish();
    }
}
```

## 🎨 Design Suggestions

### App Icon Ideas
- **Finance Symbol**: Rupee (₹) symbol with gradient
- **Chart/Graph**: Simple upward trending line
- **Wallet/Money**: Minimalist wallet icon
- **Mobile Banking**: Phone with money/chart icon

### Color Scheme (Baby Blue Theme)
- **Primary**: #87CEEB (Sky Blue)
- **Secondary**: #B0E0E6 (Powder Blue)
- **Accent**: #4682B4 (Steel Blue)
- **Background**: #F0F8FF (Alice Blue)

### Loading Screen Elements
- App icon/logo (centered)
- App name "Personal Finance Manager"
- Subtitle "Track. Save. Grow." (optional)
- Background gradient (baby blue theme)
- Loading indicator (optional)

## 🔄 Testing

### After Implementation:
1. **Clean Build**: `cd android && ./gradlew clean && cd ..`
2. **iOS Clean**: Delete `ios/build` folder and derived data
3. **Reinstall**: Uninstall app from device/emulator
4. **Fresh Install**: `npx react-native run-android` or `npx react-native run-ios`

### Verification:
- [ ] App icon appears correctly in launcher
- [ ] App icon appears in task switcher
- [ ] Splash screen shows correctly on app launch
- [ ] Smooth transition from splash to main app
- [ ] Icons look good on different screen densities

## 📱 Additional Tools

### Icon Generation Services:
- **AppIcon.co**: https://appicon.co/
- **MakeAppIcon**: https://makeappicon.com/
- **Icon.kitchen**: https://icon.kitchen/

### Design Tools:
- **Figma**: Free design tool
- **Canva**: Simple icon creation
- **GIMP**: Free image editor
- **Adobe Illustrator**: Professional tool

---

**Note**: Always backup original files before replacing them!
