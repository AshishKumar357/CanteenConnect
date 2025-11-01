import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import useResponsive from '../../utils/responsive';
import theme from '../../utils/theme';
import authStore from '../../utils/authStore';

function validatePassword(pw) {
  return pw && pw.length >= 6;
}

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const fromForgot = route.params?.fromForgot;
  const { rs } = useResponsive();
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (fromForgot) {
      // If coming from forgot flow, current password is not required
      setCurrent('');
    }
  }, [fromForgot]);

  async function onSave() {
    const creds = await authStore.getCredentials();
    if (!creds) {
      Alert.alert('No account', 'No account is registered. Please sign up first.');
      return;
    }

    if (!fromForgot) {
      if (!current) {
        Alert.alert('Missing', 'Please enter your current password.');
        return;
      }
      if (current !== creds.password) {
        Alert.alert('Incorrect', 'Current password is incorrect.');
        return;
      }
    }

    if (!validatePassword(newPw)) {
      Alert.alert('Weak password', 'New password must be at least 6 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert('Mismatch', 'New password and confirmation do not match.');
      return;
    }

    await authStore.updatePassword(newPw);
    Alert.alert('Saved', 'Your password has been updated.');
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={60}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { fontSize: Math.max(20, rs(22)) }]}>Change password</Text>

          {!fromForgot && (
            <View style={styles.inputWrapper}>
              <TextInput placeholder="Current password" value={current} onChangeText={setCurrent} secureTextEntry={!showCurrent} style={[styles.input, { paddingRight: 44 }]} />
              <TouchableOpacity onPress={() => setShowCurrent(s => !s)} style={styles.iconInside}>
                <MaterialIcons name={showCurrent ? 'visibility' : 'visibility-off'} size={22} color={theme.colors.muted} />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputWrapper}>
            <TextInput placeholder="New password" value={newPw} onChangeText={setNewPw} secureTextEntry={!showNew} style={[styles.input, { paddingRight: 44 }]} />
            <TouchableOpacity onPress={() => setShowNew(s => !s)} style={styles.iconInside}>
              <MaterialIcons name={showNew ? 'visibility' : 'visibility-off'} size={22} color={theme.colors.muted} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput placeholder="Confirm new password" value={confirmPw} onChangeText={setConfirmPw} secureTextEntry={!showConfirm} style={[styles.input, { paddingRight: 44 }]} />
            <TouchableOpacity onPress={() => setShowConfirm(s => !s)} style={styles.iconInside}>
              <MaterialIcons name={showConfirm ? 'visibility' : 'visibility-off'} size={22} color={theme.colors.muted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={onSave} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontWeight: '700', marginBottom: 8 },
  input: { width: '100%', backgroundColor: theme.colors.card, padding: 12, borderRadius: theme.radius, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 12 },
  inputWrapper: { position: 'relative', width: '100%', marginBottom: 12 },
  iconInside: { position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', padding: 8 },
  primaryBtn: { backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: 999, width: '100%', alignItems: 'center' },
  primaryBtnText: { color: theme.colors.onPrimary, fontWeight: '600' },
});
