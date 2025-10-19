import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SlideMenu({ open, onClose, navRef }) {
  const menuWidth = Math.min(320, SCREEN_WIDTH * 0.8);
  const slide = useRef(new Animated.Value(menuWidth)).current; // translateX
  const overlay = useRef(new Animated.Value(0)).current; // opacity

  useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(slide, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(overlay, { toValue: 0.5, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slide, { toValue: menuWidth, duration: 250, useNativeDriver: true }),
        Animated.timing(overlay, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [open, menuWidth, overlay, slide]);

  function navigateTo(name) {
    onClose && onClose();
    if (navRef && navRef.isReady()) navRef.navigate(name);
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.overlay, { opacity: overlay }]} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.menu, { width: menuWidth, transform: [{ translateX: slide }] }]}>
        <ScrollView contentContainerStyle={styles.menuContent}>
          <Text style={styles.menuTitle}>Menu</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Home')}>
            <MaterialIcons name="home" size={28} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Profile')}>
            <MaterialIcons name="person" size={28} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('RaiseIssue')}>
            <MaterialIcons name="report-problem" size={28} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Raise an issue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Activity')}>
            <MaterialIcons name="history" size={28} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Activity</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Settings')}>
            <MaterialIcons name="settings" size={28} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('SignOut')}>
            <MaterialIcons name="logout" size={28} color="#333" style={styles.menuIcon} />
            <Text style={styles.menuItemText}>Sign out</Text>
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
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
  },
  menuIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
});
