import React, { useEffect, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  PanResponder,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useResponsive from '../utils/responsive';
import { getUnreadCount } from '../data/updates';
import theme from '../utils/theme';

export default function SlideMenu({ open, onClose, navRef }) {
  const { width, rs } = useResponsive();
  const menuWidth = Math.min(320, Math.round(width * 0.8));
  const slide = useRef(new Animated.Value(menuWidth)).current; // translateX
  const overlay = useRef(new Animated.Value(0)).current; // opacity
  const screenWidth = Dimensions.get('window').width;
  const edgeWidth = 24; // area width to start opening swipe when closed
  const gestureStart = useRef(0);
  const panRef = useRef(null);

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

  // PanResponder for swipe open/close
  useEffect(() => {
    panRef.current = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gs) => {
        const x = evt.nativeEvent.pageX;
        // when closed, only start if touch is near right edge
        if (!open) return x >= screenWidth - edgeWidth;
        // when open, start if touch is within menu area (right side)
        return x >= screenWidth - menuWidth;
      },
      onMoveShouldSetPanResponder: (evt, gs) => {
        const dx = Math.abs(gs.dx);
        return dx > 6;
      },
      onPanResponderGrant: (evt, gs) => {
        // stop running animations and capture current translate
        slide.stopAnimation(value => {
          gestureStart.current = value;
        });
      },
      onPanResponderMove: (evt, gs) => {
        let next = gestureStart.current + gs.dx;
        // clamp
        if (next < 0) next = 0;
        if (next > menuWidth) next = menuWidth;
        slide.setValue(next);
        // map overlay opacity proportionally
        const ratio = 1 - next / menuWidth; // 0..1
        overlay.setValue(0.5 * ratio);
      },
      onPanResponderRelease: (evt, gs) => {
        let next = gestureStart.current + gs.dx;
        if (next > menuWidth) next = menuWidth;
        if (next < 0) next = 0;
        const threshold = menuWidth * 0.4;
        if (next > threshold) {
          // mostly closed
          closeMenu();
        } else {
          // open
          Animated.parallel([
            Animated.timing(slide, { toValue: 0, duration: 200, useNativeDriver: true }),
            Animated.timing(overlay, { toValue: 0.5, duration: 200, useNativeDriver: true }),
          ]).start();
        }
      },
    });
    return () => { panRef.current = null; };
  }, [menuWidth, open, screenWidth, slide, overlay]);

  function closeMenu(callback) {
    // animate closed, then call onClose and optional callback
    Animated.parallel([
      Animated.timing(slide, { toValue: menuWidth, duration: 200, useNativeDriver: true }),
      Animated.timing(overlay, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      onClose && onClose();
      if (typeof callback === 'function') callback();
    });
  }

  function navigateTo(name) {
    // animate close first so the menu visibly closes, then navigate
    closeMenu(() => {
      if (navRef && navRef.isReady()) navRef.navigate(name);
    });
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <TouchableWithoutFeedback onPress={() => closeMenu()}>
          <Animated.View pointerEvents="auto" style={[styles.overlay, { opacity: overlay, zIndex: 1 }]} />
        </TouchableWithoutFeedback>
      )}

      {/* Edge swiper to open when closed */}
      {!open && (
        <View style={[styles.edgeArea, { width: edgeWidth }]} {...(panRef.current ? panRef.current.panHandlers : {})} />
      )}

      <Animated.View {...(panRef.current ? panRef.current.panHandlers : {})} style={[styles.menu, { width: menuWidth, transform: [{ translateX: slide }], zIndex: 2 }]}>
        <ScrollView contentContainerStyle={[styles.menuContent, { paddingHorizontal: rs(12) }]}>
          <Text style={[styles.menuTitle, { fontSize: rs(18) }]} numberOfLines={1} ellipsizeMode="tail">Menu</Text>

          {/* Detect top-level route - if top is Mess show Mess-only menu (Issues + Sign out) */}
          {navRef && navRef.isReady() && navRef.getCurrentRoute && navRef.getCurrentRoute().name === 'Mess' ? (
            <>
              <TouchableOpacity style={styles.menuItem} onPress={() => {
                // navigate into Mess nested stack to MessIssues
                closeMenu(() => { if (navRef && navRef.isReady()) navRef.navigate('Mess', { screen: 'MessIssues' }); });
              }}>
                <MaterialIcons name="report-problem" size={rs(18)} color={theme.colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuItemText, { fontSize: rs(14), color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">Issues</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('SignOut')}>
                <MaterialIcons name="logout" size={rs(18)} color={theme.colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuItemText, { fontSize: rs(14), color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">Sign out</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Home')}>
                <MaterialIcons name="home" size={rs(18)} color={theme.colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuItemText, { fontSize: rs(14), color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">Home</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Updates')}>
                <MaterialIcons name="update" size={rs(18)} color={theme.colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuItemText, { fontSize: rs(14), color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">Updates</Text>
                {getUnreadCount() > 0 && (
                  <View style={styles.unreadBadge}><Text style={styles.unreadText}>{getUnreadCount()}</Text></View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Profile')}>
                <MaterialIcons name="person" size={rs(18)} color={theme.colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuItemText, { fontSize: rs(14), color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Activity')}>
                <MaterialIcons name="history" size={rs(18)} color={theme.colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuItemText, { fontSize: rs(14), color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">Activity</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('RaiseIssue')}>
                <MaterialIcons name="report-problem" size={rs(18)} color={theme.colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuItemText, { fontSize: rs(14), color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">Raise an issue</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Settings')}>
                <MaterialIcons name="settings" size={rs(18)} color={theme.colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuItemText, { fontSize: rs(14), color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('SignOut')}>
                <MaterialIcons name="logout" size={rs(18)} color={theme.colors.text} style={styles.menuIcon} />
                <Text style={[styles.menuItemText, { fontSize: rs(14), color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">Sign out</Text>
              </TouchableOpacity>
            </>
          )}
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
  backgroundColor: theme.colors.background,
  shadowColor: theme.shadows.default,
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
  unreadBadge: {
    backgroundColor: theme.colors.danger,
    minWidth: 22,
    paddingHorizontal: 6,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadText: { color: theme.colors.onPrimary, fontWeight: '700', fontSize: 12 },
  menuIcon: {
    width: 28,
    height: 28,
    marginRight: 12,
  },
  edgeArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
});
