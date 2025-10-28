import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import useResponsive from '../utils/responsive';

export default function HeaderBar({ title, onHamburgerPress }) {
  const { width, rs } = useResponsive();
  const logoWidth = Math.min(160, Math.round(width * 0.28));
  const logoHeight = Math.round(logoWidth * 0.5);
  const titleFontSize = Math.max(16, rs(18));

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <View style={[styles.logoWrapper, { width: logoWidth, height: logoHeight }]}> 
          <Image source={require('../assets/Logo wo bg.png')} style={[styles.logo, { width: logoWidth, height: logoHeight }]} />
        </View>
      </View>

      <Text style={[styles.title, { fontSize: titleFontSize }]}>{title}</Text>

      <TouchableOpacity
        accessibilityLabel="Open menu"
        accessibilityRole="button"
        onPress={onHamburgerPress}
        style={styles.hamburgerTouch}
      >
        <View style={styles.hamburger}>
          <View style={styles.bar} />
          <View style={[styles.bar, styles.barMiddle]} />
          <View style={styles.bar} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#6200ee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  left: {
    position: 'absolute',
    left: 12,
    height: 40,
    justifyContent: 'center',
  },
  logoWrapper: {
    width: 150,
    height: 80,
    marginTop: 15,
    overflow: 'hidden',
    borderRadius: 6,
  },
  logo: {
    width: 150,
    height: 80,
    margin: 0,
    resizeMode: 'fill',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  hamburgerTouch: {
    position: 'absolute',
    right: 12,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburger: {
    width: 24,
    height: 18,
    justifyContent: 'space-between',
  },
  bar: {
    height: 2,
    backgroundColor: 'white',
    borderRadius: 1,
  },
  barMiddle: {
    width: 16,
    alignSelf: 'flex-end',
  },
});
