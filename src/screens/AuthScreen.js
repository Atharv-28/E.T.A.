import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import FirebaseService from '../services/FirebaseService';
import { bootstrapApp } from '../store/bootstrap';
import { setAuthUser } from '../store/slices/accountsSlice';
import {
  AppButton,
  AppCard,
  AppChipTabs,
  AppIcon,
  AppInput,
  AppScreenLayout,
  AppText,
  AppView,
  palette,
  sizing,
  spacing,
} from '../ui';
import { styles } from './AuthScreen.styles';

export default function AuthScreen() {
  const dispatch = useDispatch();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = async () => {
    if (!email.trim()) return Alert.alert('Error', 'Please enter your email address.');
    if (!/\S+@\S+\.\S+/.test(email.trim())) return Alert.alert('Error', 'Please enter a valid email.');
    if (password.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters.');
    if (!isLogin && password !== confirmPassword)
      return Alert.alert('Error', 'Passwords do not match.');

    setLoading(true);
    try {
      let uid;
      if (isLogin) {
        uid = await FirebaseService.signIn(email, password);
      } else {
        uid = await FirebaseService.signUp(email, password);
      }

      dispatch(setAuthUser({ uid, email: email.trim() }));
      dispatch(bootstrapApp(uid));
    } catch (error) {
      console.error('Auth error:', error);
      let message = 'Something went wrong. Please try again.';
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        message = 'Incorrect email or password.';
      } else if (error.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists. Try logging in.';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'No internet connection. Please check your network.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please try again later.';
      }
      Alert.alert(isLogin ? 'Login Failed' : 'Sign Up Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AppScreenLayout>
          {/* Hero Brand Header */}
          <AppView style={styles.hero}>
            <AppView style={styles.heroIcon}>
              <AppIcon
                name="account-balance-wallet"
                size={sizing.avatar.xl - spacing.sm}
                color={palette.primary}
              />
            </AppView>
            <AppText variant="h2" style={styles.heroTitle}>
              E.T.A.
            </AppText>
            <AppText
              variant="body"
              color={palette.textSecondary}
              style={styles.heroSubtitle}
            >
              Expense Track & Analyse
            </AppText>
          </AppView>

          {/* Mode Switcher Tabs */}
          <AppChipTabs
            value={mode}
            onChange={setMode}
            tabs={[
              { value: 'login', label: 'Log In' },
              { value: 'signup', label: 'Sign Up' },
            ]}
            style={styles.tabsSpacing}
          />

          {/* Main Form Card */}
          <AppCard style={styles.formCard}>
            <AppText variant="h3">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </AppText>

            <AppInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              leftIcon="email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AppInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 6 characters"
              leftIcon="lock"
              secureTextEntry={!showPassword}
              style={styles.inputSpacing}
              rightIcon={showPassword ? 'visibility-off' : 'visibility'}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            {!isLogin && (
              <AppInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat your password"
                leftIcon="lock-outline"
                secureTextEntry={!showPassword}
                style={styles.inputSpacing}
              />
            )}

            <AppButton
              title={isLogin ? 'Log In' : 'Create Account'}
              onPress={handleSubmit}
              disabled={loading}
              style={styles.submitButton}
            />
          </AppCard>

          {/* Mode Switch Link using built-in ghost AppButton */}
          <AppButton
            variant="ghost"
            title={
              isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Log In'
            }
            onPress={() => setMode(isLogin ? 'signup' : 'login')}
            style={styles.switchButton}
          />

        </AppScreenLayout>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
