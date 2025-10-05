# Personal Finance Manager App - ETA

## 📁 Project Structure

```
ETA/
├── App.js                          # Main application entry point
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── Header.js              # App header component
│   │   └── BottomNavigation.js    # Bottom navigation component
│   │
│   ├── screens/                   # Main application screens
│   │   ├── DashboardScreen.js     # Dashboard with overview
│   │   ├── TransactionsScreen.js  # Transaction management
│   │   ├── BudgetScreen.js        # Budget planning
│   │   └── ReportsScreen.js       # Financial reports
│   │
│   ├── styles/                    # Styling files
│   │   └── GlobalStyles.js        # Global app styles
│   │
│   └── index.js                   # Export index for easier imports
│
├── android/                       # Android specific files
├── ios/                          # iOS specific files
└── package.json                  # Dependencies and scripts
```


## 🛠️ Technology Stack

- **React Native** - Cross-platform mobile development
- **JavaScript** - Programming language
- **React Hooks** - State management
- **StyleSheet** - Styling

## 📱 How to Run

```bash
# Install dependencies
npm install

# Run on Android
npm run android

# Run on iOS
npm run ios

# Start Metro bundler
npm start
```

## 🎯 Best Practices Implemented

1. **Modular Architecture** - Separate files for components, screens, and styles
2. **Reusable Components** - Header, Navigation, and other UI elements
3. **Consistent Styling** - Global style system
4. **Clean Code Structure** - Organized folder structure
5. **Export Index** - Centralized exports for easier imports
