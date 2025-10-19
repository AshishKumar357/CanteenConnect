import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function HeaderBar({ title, onHamburgerPress }) {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <View style={styles.logoWrapper}>
          <Image source={require('../assets/Sims_logo.png')} style={styles.logo} />
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>

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
