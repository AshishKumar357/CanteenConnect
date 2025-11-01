import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import useResponsive from '../utils/responsive';
import theme from '../utils/theme';
import authStore from '../utils/authStore';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const { rs } = useResponsive();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function onContinue() {
    if (!email || !isValidEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    const creds = await authStore.getCredentials();
    setLoading(false);
    if (!creds || creds.email.toLowerCase() !== email.toLowerCase()) {
      Alert.alert('Not found', 'No account found for this email. Please sign up.');
      return;
    }
    // For this limited app, allow immediate reset by navigating to ChangePassword with a flag
    navigation.navigate('ChangePassword', { fromForgot: true });
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={60}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { fontSize: Math.max(20, rs(22)) }]}>Forgot password</Text>
          <Text style={styles.desc}>Enter the email associated with your account and we'll let you reset the password locally.</Text>

          <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />

          <TouchableOpacity style={styles.primaryBtn} onPress={onContinue} disabled={loading} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>{loading ? 'Checking...' : 'Continue'}</Text>
          </TouchableOpacity>

          <View style={styles.rowCenter}>
            <Text style={styles.muted}>Remembered your password?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}> Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontWeight: '700', marginBottom: 8 },
  desc: { color: theme.colors.muted, textAlign: 'center', marginBottom: 12 },
  input: { width: '100%', backgroundColor: theme.colors.card, padding: 12, borderRadius: theme.radius, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 12 },
  primaryBtn: { backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: 999, width: '100%', alignItems: 'center' },
  primaryBtnText: { color: theme.colors.onPrimary, fontWeight: '600' },
  rowCenter: { flexDirection: 'row', marginTop: 12 },
  muted: { color: theme.colors.muted },
  link: { color: theme.colors.primary, fontWeight: '600' },
});
