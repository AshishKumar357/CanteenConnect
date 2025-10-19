import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SignOutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign out</Text>
      <Text style={styles.body}>You can sign out from your account here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  body: { fontSize: 16, textAlign: 'center' },
});
