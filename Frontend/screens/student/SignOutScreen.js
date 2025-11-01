import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useResponsive from '../../utils/responsive';

export default function SignOutScreen() {
  const { rs } = useResponsive();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: Math.max(20, rs(22)) }]}>Sign out</Text>
      <Text style={[styles.body, { fontSize: Math.max(13, rs(14)) }]}>You can sign out from your account here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  body: { fontSize: 16, textAlign: 'center' },
});
