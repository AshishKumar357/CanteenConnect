import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useResponsive from '../utils/responsive';

export default function SlideMenu({ open, onClose, navRef }) {
  const { width, rs } = useResponsive();
  const menuWidth = Math.min(320, Math.round(width * 0.8));
  const slide = useRef(new Animated.Value(menuWidth)).current; // translateX
  const overlay = useRef(new Animated.Value(0)).current; // opacity

  useEffect(() => {
    // keep slide's base value in sync with menuWidth when layout changes
    if (!open) {
      // place off-screen to the right
      slide.setValue(menuWidth);
      overlay.setValue(0);
      return;
    }

    // animate open
    Animated.parallel([
      Animated.timing(slide, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(overlay, { toValue: 0.5, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [open, menuWidth, overlay, slide]);

  // when menuWidth changes while closed, ensure slide stays off-screen
  useEffect(() => {
    if (!open) {
      slide.setValue(menuWidth);
    }
  }, [menuWidth]);

  function navigateTo(name) {
    onClose && onClose();
    if (navRef && navRef.isReady()) navRef.navigate(name);
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View pointerEvents="auto" style={[styles.overlay, { opacity: overlay, zIndex: 1 }]} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.menu, { width: menuWidth, transform: [{ translateX: slide }], zIndex: 2 }]}>
        <ScrollView contentContainerStyle={[styles.menuContent, { paddingHorizontal: rs(12) }]}>
          <Text style={[styles.menuTitle, { fontSize: rs(18) }]} numberOfLines={1} ellipsizeMode="tail">Menu</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Home')}>
            <MaterialIcons name="home" size={rs(18)} color="#333" style={styles.menuIcon} />
            <Text style={[styles.menuItemText, { fontSize: rs(14) }]} numberOfLines={1} ellipsizeMode="tail">Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Profile')}>
            <MaterialIcons name="person" size={rs(18)} color="#333" style={styles.menuIcon} />
            <Text style={[styles.menuItemText, { fontSize: rs(14) }]} numberOfLines={1} ellipsizeMode="tail">Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('RaiseIssue')}>
            <MaterialIcons name="report-problem" size={rs(18)} color="#333" style={styles.menuIcon} />
            <Text style={[styles.menuItemText, { fontSize: rs(14) }]} numberOfLines={1} ellipsizeMode="tail">Raise an issue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Activity')}>
            <MaterialIcons name="history" size={rs(18)} color="#333" style={styles.menuIcon} />
            <Text style={[styles.menuItemText, { fontSize: rs(14) }]} numberOfLines={1} ellipsizeMode="tail">Activity</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Settings')}>
            <MaterialIcons name="settings" size={rs(18)} color="#333" style={styles.menuIcon} />
            <Text style={[styles.menuItemText, { fontSize: rs(14) }]} numberOfLines={1} ellipsizeMode="tail">Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('SignOut')}>
            <MaterialIcons name="logout" size={rs(18)} color="#333" style={styles.menuIcon} />
            <Text style={[styles.menuItemText, { fontSize: rs(14) }]} numberOfLines={1} ellipsizeMode="tail">Sign out</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
      menu: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 6,
    elevation: 10,
    // ensure the menu sits above the overlay on platforms that respect zIndex
    zIndex: 2,
  },
  menuContent: {
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  menuItem: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  menuItemText: {
    fontSize: 16,
    flex: 1,
    flexShrink: 1,
  },
  menuIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
});
