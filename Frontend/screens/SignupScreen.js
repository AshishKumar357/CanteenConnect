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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignupScreen() {
  const navigation = useNavigation();
  const { rs } = useResponsive();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [division, setDivision] = useState('');
  const [roll, setRoll] = useState('');
  const [prn, setPrn] = useState('');
  const [batch, setBatch] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  async function onSignup() {
    // name: letters and spaces only
    if (!name || !/^[A-Za-z ]+$/.test(name.trim())) {
      Alert.alert('Invalid name', 'Name must contain letters and spaces only.');
      return;
    }
    if (!email || !isValidEmail(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email.');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    // division: single char A-G
    const div = (division || '').toUpperCase().trim();
    if (!/^[A-G]$/.test(div)) {
      Alert.alert('Invalid division', 'Division must be a single letter A to G.');
      return;
    }

    // roll: integer 1-100
    const rollNum = parseInt(roll, 10);
    if (!roll || isNaN(rollNum) || rollNum < 1 || rollNum > 100) {
      Alert.alert('Invalid roll number', 'Roll must be a number between 1 and 100.');
      return;
    }

    // PRN: numeric string length 14
    if (!/^[0-9]{14}$/.test(prn || '')) {
      Alert.alert('Invalid PRN', 'PRN must be a 14-digit number.');
      return;
    }

    // batch: year 2000-2100
    const batchNum = parseInt(batch, 10);
    if (!batch || isNaN(batchNum) || batchNum < 2000 || batchNum > 2100) {
      Alert.alert('Invalid batch', 'Batch must be a valid year (e.g. 2026).');
      return;
    }

    const existing = await authStore.getCredentials();
    if (existing && existing.email && existing.email.toLowerCase() === email.toLowerCase()) {
      Alert.alert('Account exists', 'An account with this email already exists. Please log in.');
      return;
    }

    await authStore.saveCredentials({ name: name.trim(), email: email.toLowerCase().trim(), password, division: div, roll: rollNum, prn, batch: batchNum });
    navigation.replace('App');
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={60}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Image source={require('../assets/MessBuddy.png')} style={[styles.logo, { width: rs(200), height: rs(200) }]} resizeMode="contain" />

          <View style={styles.form}>
            <TextInput value={name} onChangeText={setName} placeholder="Full name" style={styles.input} />
            <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
            <View style={styles.inputWrapper}>
              <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry={!showPassword} style={[styles.input, { paddingRight: 44 }]} />
              <TouchableOpacity onPress={() => setShowPassword(s => !s)} style={styles.iconInside} accessibilityLabel="Toggle password visibility">
                <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={22} color={theme.colors.muted} />
              </TouchableOpacity>
            </View>

            <TextInput value={division} onChangeText={(v) => setDivision(v)} placeholder="Division (A-G)" maxLength={1} style={styles.input} autoCapitalize="characters" />
            <TextInput value={roll} onChangeText={(v) => setRoll(v.replace(/[^0-9]/g, ''))} placeholder="Roll number (1-100)" keyboardType="number-pad" style={styles.input} />
            <TextInput value={prn} onChangeText={(v) => setPrn(v.replace(/[^0-9]/g, ''))} placeholder="PRN (14 digits)" keyboardType="number-pad" maxLength={14} style={styles.input} />
            <TextInput value={batch} onChangeText={(v) => setBatch(v.replace(/[^0-9]/g, ''))} placeholder="Batch (year, e.g. 2026)" keyboardType="number-pad" maxLength={4} style={styles.input} />

            <TouchableOpacity style={styles.primaryBtn} onPress={onSignup} activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>Create account</Text>
            </TouchableOpacity>

            <View style={styles.rowCenter}>
              <Text style={styles.muted}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}> Log in</Text>
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
  passwordRow: { flexDirection: 'row', alignItems: 'center' },
  passwordToggle: { justifyContent: 'center', alignItems: 'center', padding: 6 },
  input: {
    backgroundColor: theme.colors.card,
    padding: 12,
    borderRadius: theme.radius,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  },
  inputWrapper: { position: 'relative', width: '100%', marginBottom: 10 },
  iconInside: { position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', padding: 8 },
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
