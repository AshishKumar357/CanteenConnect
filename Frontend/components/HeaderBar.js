import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useResponsive from '../utils/responsive';
import theme from '../utils/theme';

export default function HeaderBar({ title, onHamburgerPress }) {
  const { width, rs } = useResponsive();
  const insets = useSafeAreaInsets();
  // make sizes responsive to screen width
  // keep logo modestly sized relative to screen so it fits the header
  const logoWidth = Math.min(120, Math.round(width * 0.22));
  const logoHeight = Math.round(logoWidth * 0.44);
  const titleFontSize = Math.max(14, rs(18));

  // dynamic inner style replaces fixed height so header compresses on small screens
  // Keep vertical padding small to avoid extra empty space above the controls
  const innerDynamicStyle = {
    paddingVertical: 0,
    // ensure header is at least large enough to contain the logo + small padding so vertical centering works
    minHeight: Math.max(40, rs(44), Math.round(logoHeight + 8)),
    paddingHorizontal: 6,
  };

  return (
    <View style={[styles.headerOuter, { backgroundColor: theme.colors.primary }] }>
      <View style={[styles.headerInner, innerDynamicStyle]}>
        <View style={styles.left}>
          <View style={[styles.logoWrapper, { width: logoWidth, height: logoHeight }]}> 
            <Image source={require('../assets/Sims_logo.png')} style={[styles.logo, { width: logoWidth, height: logoHeight, alignSelf: 'center' }]} />
          </View>
        </View>

        {/* ensure title has horizontal breathing room so it doesn't overlap left/right controls */}
  <Text style={[styles.title, { fontSize: titleFontSize, marginHorizontal: 52, color: theme.colors.onPrimary }]} numberOfLines={1} ellipsizeMode="tail">{title}</Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  headerOuter: {
    backgroundColor: theme.colors.primary,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  left: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  logoWrapper: {
    overflow: 'hidden',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    margin: 0,
    resizeMode: 'contain',
  },
  title: {
    color: theme.colors.onPrimary,
    fontSize: 17,
    fontWeight: '600',
  },
  hamburgerTouch: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
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
    backgroundColor: theme.colors.onPrimary,
    borderRadius: 1,
  },
  barMiddle: {
    width: 16,
    alignSelf: 'flex-end',
  },
});
