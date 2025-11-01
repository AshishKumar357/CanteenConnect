import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import useResponsive from '../utils/responsive';
import theme from '../utils/theme';
import accountsStore from '../utils/accountsStore';

export default function SplashScreen() {
  const navigation = useNavigation();
  const { rs, rsv, wp, hp } = useResponsive();

  useEffect(() => {
    let mounted = true;
    // Ensure sample mess accounts exist, then go to Login
    (async () => {
      try {
        await accountsStore.ensureSeeded();
      } catch (e) {
        // ignore
      }
      if (!mounted) return;
      const t = setTimeout(() => {
        navigation.replace('Login');
      }, 800);
      return () => clearTimeout(t);
    })();
    return () => {
      mounted = false;
    };
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={styles.content}>
        <Image source={require('../assets/MessBuddy.png')} style={styles.logo} resizeMode="contain" />
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: rsv(18) }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 240,
    height: 240,
  },
});
