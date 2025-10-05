# Expense Track & Analyse - E.T.A. 💰

A modern, feature-rich React Native app for managing personal finances with automatic SMS transaction detection, multi-account support, and beautiful analytics.

## 🌟 Features

### 💳 Multi-Account Support
- Create and manage multiple bank accounts
- Switch between accounts seamlessly
- Account-specific transaction tracking
- Different account types (Personal, Business, Joint, Savings)

### 📱 SMS Transaction Detection
- **Native SMS Monitoring**: Real-time SMS parsing even when app is closed
- **Automatic Categorization**: Smart detection of bank transaction messages
- **Background Service**: Continues monitoring in background
- **Bank Support**: Currently supports Bank of India (BOI) SMS patterns

### 💰 Transaction Management
- Add income and expense transactions manually
- Automatic transaction detection from SMS
- Category-based organization (Food, Transport, Shopping, etc.)
- Transaction filtering and search
- Edit and delete transactions

### 📊 Analytics & Reports
- Monthly/yearly financial summaries
- Category-wise spending breakdown
- Income vs Expense charts
- Savings rate calculation
- Visual spending insights

### 🎨 Modern UI/UX
- **Baby Blue Theme**: Soothing color palette
- **Animations**: Smooth transitions and micro-interactions
- **Responsive Design**: Works on all screen sizes
- **Gradient Cards**: Beautiful visual elements
- **Icon System**: Comprehensive icon support

### 💾 Data Management
- **Local Storage**: AsyncStorage for data persistence
- **Export Options**: JSON backup and CSV export
- **Account-specific exports**: Export data per account
- **Data Privacy**: All data stays on your device

## 🚀 Getting Started

### Prerequisites
- React Native development environment
- Android Studio (for Android)
- Xcode (for iOS development)
- Node.js and npm/yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ETA
```

2. **Install dependencies**
```bash
npm install
# OR
yarn install
```

3. **Install iOS dependencies** (iOS only)
```bash
cd ios && pod install && cd ..
```

4. **Start Metro bundler**
```bash
npm start
# OR
yarn start
```

5. **Run the app**

For Android:
```bash
npm run android
# OR
yarn android
```

For iOS:
```bash
npm run ios
# OR
yarn ios
```

## 📱 App Structure

### Main Screens
- **Dashboard**: Overview of finances, recent transactions
- **Transactions**: View and manage all transactions
- **Accounts**: Multi-account management and settings
- **Reports**: Analytics and financial insights

### Core Components
- **TransactionCategoryModal**: Smart category selection for SMS transactions
- **AddTransactionModal**: Manual transaction entry
- **AnimatedComponents**: Reusable UI components with animations
- **Header & Navigation**: Consistent navigation experience

## 🔧 Technical Features

### Native SMS Integration
- **Java Service**: `SMSMonitoringService` for background SMS monitoring
- **Broadcast Receiver**: `SMSBroadcastReceiver` for SMS event handling
- **React Native Bridge**: Seamless communication between native and JS
- **Permissions**: Runtime SMS permission handling

### Data Management
- **Context API**: Centralized state management
- **AsyncStorage**: Persistent local data storage
- **Export Services**: JSON and CSV export functionality

### UI/UX
- **Gradient Components**: Beautiful gradient cards and buttons
- **Animations**: Fade, slide, and scale animations
- **Icons**: Custom icon system with fallbacks
- **Responsive**: Adaptive layouts for different screen sizes

## 🎨 Design System

### Color Palette (Baby Blue Theme)
- **Primary**: Sky Blue (#87CEEB)
- **Secondary**: Powder Blue (#B0E0E6)
- **Success**: Turquoise (#40E0D0)
- **Danger**: Light Coral (#F08080)
- **Warning**: Khaki (#F0E68C)

### Typography
- Clean, readable fonts
- Consistent sizing hierarchy
- Proper contrast ratios

## 📱 SMS Features

### Supported Banks
- **Bank of India (BOI)**: Full SMS pattern support
- Easily extensible for other banks

### SMS Patterns
- Debit transactions
- Credit transactions
- Account balance updates
- Transaction descriptions and amounts

### Privacy & Security
- SMS data processed locally only
- No data sent to external servers
- User consent required for SMS access

## 🔒 Permissions

### Required Permissions
- **READ_SMS**: Read bank transaction SMS
- **RECEIVE_SMS**: Receive incoming SMS messages
- **FOREGROUND_SERVICE**: Background SMS monitoring

### Privacy Policy
- All data stays on device
- SMS content is processed locally
- No external data transmission

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Main app screens
├── context/            # State management
├── services/           # Business logic services
├── styles/             # Global styles and themes
├── utils/              # Utility functions
└── assets/             # Images and static assets

android/
├── app/src/main/java/com/eta/  # Native Android code
│   ├── SMSMonitoringService.java
│   ├── SMSBroadcastReceiver.java
│   └── SMSBridgeModule.java
```

## 🛠️ Development

### Adding New Banks
1. Add SMS patterns in `utils/smsParser.js`
2. Test patterns with sample SMS messages
3. Update bank list in configuration

### Extending Categories
1. Update `CATEGORIES` in `context/TransactionContext.js`
2. Add corresponding icons
3. Test category assignment

### Custom Themes
1. Update color palette in `styles/GlobalStyles.js`
2. Adjust gradient combinations
3. Test across all components

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

## 🚨 Known Issues & Limitations

### Current Limitations
- SMS parsing currently supports Bank of India (BOI) only
- Android-only SMS monitoring (iOS has SMS restrictions)
- Local data storage only (no cloud sync)

### Development Mode
- SMS simulation buttons are for testing only
- Use real SMS messages for production testing

## 🧪 Testing

### SMS Testing
1. Use the "Simulate Transaction" button for initial testing
2. Send real bank SMS messages for full testing
3. Check permissions are granted in device settings

### Manual Testing
1. Add transactions manually
2. Switch between accounts
3. Test export functionality
4. Verify data persistence

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Submit a pull request

### Code Standards
- Follow React Native best practices
- Use consistent naming conventions
- Add comments for complex logic
- Test on both Android and iOS

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Personal Finance Manager - ETA**
- Modern React Native app for financial management
- Built with React Native, Java (Android)

## 🙏 Acknowledgments

- React Native community for excellent documentation
- react-native-vector-icons for icon system
- React Native team for the amazing framework
- Contributors and testers

---

**Made with ❤️ for better financial management**
