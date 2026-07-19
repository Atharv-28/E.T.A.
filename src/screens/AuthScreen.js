/**
 * AuthScreen.js
 * Firebase Email/Password Authentication screen for ETA Finance App.
 * Handles both Sign In and Sign Up with smooth toggle animation.
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { AppIcon } from '../ui';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { signIn, signUp, resetPassword } = useAuth();

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Animated value for the card flip / mode switch
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const switchMode = (newMode) => {
    setError('');
    setSuccessMsg('');
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(() => {
      setMode(newMode);
      setPassword('');
      setConfirmPassword('');
    }, 150);
  };

  const handleSubmit = async () => {
    setError('');
    setSuccessMsg('');

    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (mode === 'forgot') {
      setIsLoading(true);
      try {
        await resetPassword(email.trim());
        setSuccessMsg('Password reset email sent! Check your inbox.');
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!password) { setError('Please enter your password.'); return; }
    if (mode === 'signup') {
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    }

    setIsLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password);
      }
      // Auth state change in AuthContext will update `user` and re-render App.js automatically
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const titles = {
    signin: { heading: 'Welcome Back', sub: 'Sign in to your ETA account', btn: 'Sign In' },
    signup: { heading: 'Create Account', sub: 'Start tracking your finances today', btn: 'Create Account' },
    forgot: { heading: 'Reset Password', sub: "Enter your email and we'll send a reset link", btn: 'Send Reset Link' },
  };

  const t = titles[mode];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0E1A" />
      <LinearGradient
        colors={['#0A0E1A', '#111827', '#0A0E1A']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── Logo / Brand ── */}
            <View style={styles.brandSection}>
              <LinearGradient
                colors={['#6C63FF', '#4A90D9']}
                style={styles.logoRing}
              >
                <Text style={styles.logoEmoji}>💸</Text>
              </LinearGradient>
              <Text style={styles.appName}>E.T.A</Text>
              <Text style={styles.appTagline}>Expense · Track · Analyse</Text>
            </View>

            {/* ── Mode Switcher ── */}
            {mode !== 'forgot' && (
              <View style={styles.modeSwitcher}>
                <TouchableOpacity
                  style={[styles.modeTab, mode === 'signin' && styles.modeTabActive]}
                  onPress={() => switchMode('signin')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modeTabText, mode === 'signin' && styles.modeTabTextActive]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeTab, mode === 'signup' && styles.modeTabActive]}
                  onPress={() => switchMode('signup')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modeTabText, mode === 'signup' && styles.modeTabTextActive]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ── Auth Card ── */}
            <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
              <Text style={styles.cardHeading}>{t.heading}</Text>
              <Text style={styles.cardSub}>{t.sub}</Text>

              {/* Email Field */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email</Text>
                <View style={styles.inputRow}>
                  <AppIcon name="email" size={18} color="#6C63FF" />
                  <TextInput
                    style={styles.textInput}
                    placeholder="you@example.com"
                    placeholderTextColor="#4B5563"
                    value={email}
                    onChangeText={(t) => { setEmail(t); setError(''); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType={mode === 'forgot' ? 'send' : 'next'}
                  />
                </View>
              </View>

              {/* Password Field */}
              {mode !== 'forgot' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <View style={styles.inputRow}>
                    <AppIcon name="lock" size={18} color="#6C63FF" />
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••"
                      placeholderTextColor="#4B5563"
                      value={password}
                      onChangeText={(t) => { setPassword(t); setError(''); }}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      returnKeyType={mode === 'signup' ? 'next' : 'done'}
                      onSubmitEditing={mode === 'signin' ? handleSubmit : undefined}
                    />
                    <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <AppIcon name={showPassword ? 'visibility-off' : 'visibility'} size={18} color="#4B5563" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Confirm Password */}
              {mode === 'signup' && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Confirm Password</Text>
                  <View style={styles.inputRow}>
                    <AppIcon name="lock-outline" size={18} color="#6C63FF" />
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••"
                      placeholderTextColor="#4B5563"
                      value={confirmPassword}
                      onChangeText={(t) => { setConfirmPassword(t); setError(''); }}
                      secureTextEntry={!showConfirm}
                      autoCapitalize="none"
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                    />
                    <TouchableOpacity onPress={() => setShowConfirm((v) => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <AppIcon name={showConfirm ? 'visibility-off' : 'visibility'} size={18} color="#4B5563" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Forgot Password link (only on signin) */}
              {mode === 'signin' && (
                <TouchableOpacity style={styles.forgotLink} onPress={() => switchMode('forgot')}>
                  <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
              )}

              {/* Error / Success Message */}
              {!!error && (
                <View style={styles.errorBox}>
                  <AppIcon name="error-outline" size={16} color="#F87171" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              {!!successMsg && (
                <View style={styles.successBox}>
                  <AppIcon name="check-circle" size={16} color="#34D399" />
                  <Text style={styles.successText}>{successMsg}</Text>
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={isLoading ? ['#4B5563', '#4B5563'] : ['#6C63FF', '#4A90D9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitBtnGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.submitBtnText}>{t.btn}</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Back from forgot */}
              {mode === 'forgot' && (
                <TouchableOpacity style={styles.backLink} onPress={() => switchMode('signin')}>
                  <AppIcon name="arrow-back" size={16} color="#6C63FF" />
                  <Text style={styles.backLinkText}>Back to Sign In</Text>
                </TouchableOpacity>
              )}
            </Animated.View>

            {/* ── Security note ── */}
            <View style={styles.securityNote}>
              <AppIcon name="shield" size={14} color="#6C63FF" />
              <Text style={styles.securityNoteText}>
                Your data is encrypted and secured by Firebase
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0E1A',
  },
  gradient: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },

  // Brand
  brandSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
  },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  logoEmoji: {
    fontSize: 34,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#F9FAFB',
    letterSpacing: 3,
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 12,
    color: '#6B7280',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Mode switcher
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    width: '100%',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  modeTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },

  // Card
  card: {
    width: '100%',
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  cardHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 6,
  },
  cardSub: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
  },

  // Fields
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#374151',
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#F9FAFB',
    paddingVertical: 0,
  },

  // Forgot
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 13,
    color: '#6C63FF',
    fontWeight: '600',
  },

  // Error / Success
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1010',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#7F1D1D',
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#F87171',
    lineHeight: 18,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#052E16',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#065F46',
    gap: 8,
  },
  successText: {
    flex: 1,
    fontSize: 13,
    color: '#34D399',
    lineHeight: 18,
  },

  // Submit
  submitBtn: {
    marginTop: 4,
    borderRadius: 14,
    overflow: 'hidden',
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },

  // Back link
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  backLinkText: {
    fontSize: 14,
    color: '#6C63FF',
    fontWeight: '600',
  },

  // Security note
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securityNoteText: {
    fontSize: 11,
    color: '#4B5563',
  },
});
