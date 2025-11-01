import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import useResponsive from '../utils/responsive';
import theme from '../utils/theme';
import authStore from '../utils/authStore';
import accountsStore from '../utils/accountsStore';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginScreen() {
  const navigation = useNavigation();
  const { rs, rsv } = useResponsive();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function onLogin() {
    if (!email) {
      Alert.alert('Invalid', 'Please provide an email or username');
      return;
    }
    // If the input contains an @, validate as email; otherwise allow as username (mess accounts)
    if (email.includes('@') && !isValidEmail(email)) {
      Alert.alert('Invalid', 'Please provide a valid email');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Invalid', 'Password must be at least 6 characters');
      return;
    }
    // Try student auth (authStore) first (by email), then try accountsStore (by username)
    const emailLower = email.toLowerCase();
    const creds = await authStore.getCredentials();
    if (creds && creds.email && creds.email.toLowerCase() === emailLower && creds.password === password) {
      navigation.replace('App');
      return;
    }

    // try mess accounts
    const accounts = await accountsStore.getAccounts();
    const found = accounts.find(a => (a.username || '').toLowerCase() === emailLower && a.password === password);
    if (found) {
      // route mess users to Mess stack
      navigation.replace(found.role === 'mess' ? 'Mess' : 'App');
      return;
    }

    Alert.alert('Login failed', 'Email/username or password is incorrect.');
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={60}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Image source={require('../assets/MessBuddy.png')} style={[styles.logo, { width: rs(200), height: rs(200) }]} resizeMode="contain" />

          <View style={{ width: '100%', alignItems: 'flex-end', marginBottom: 6 }}>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={[styles.link, { marginRight: 4 }]}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <View style={styles.inputWrapper}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!showPassword}
                style={[styles.input, { paddingRight: 44 }]}
              />
              <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={styles.iconInside} accessibilityLabel="Toggle password visibility">
                <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={22} color={theme.colors.muted} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={onLogin} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Log in</Text>
            </TouchableOpacity>

            <View style={[styles.rowCenter, { marginTop: 8 }] }>
              <Text style={styles.muted}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.link}> Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  logo: { marginBottom: 12 },
  form: { width: '100%', marginTop: 6 },
  inputWrapper: { position: 'relative', width: '100%', marginBottom: 10 },
  iconInside: { position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', padding: 8 },
  input: {
    backgroundColor: theme.colors.card,
    padding: 12,
    borderRadius: theme.radius,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: theme.shadows.default,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryBtnText: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
  rowCenter: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  muted: { color: theme.colors.muted },
  link: { color: theme.colors.primary, fontWeight: '600' },
});
