import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import useResponsive from '../../utils/responsive';
import theme from '../../utils/theme';

function TogglePlaceholder({ title, description }) {
  const pulse = React.useRef(new Animated.Value(0)).current;
  const { rs } = useResponsive();
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  // limit the pulse scale so the badge doesn't grow large enough to overlap other content
  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });

  return (
      <View style={styles.row}>
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text style={[styles.rowTitle, { fontSize: rs(16) }]}>{title}</Text>
        <Text style={[styles.rowDesc, { fontSize: Math.max(12, rs(12)) }]}>{description}</Text>
      </View>

      <View style={styles.rightWrap}>
        <Animated.View style={[styles.coming, { transform: [{ scale: pulseScale }], paddingHorizontal: rs(8), paddingVertical: rs(6) }]}>
          <Text style={[styles.comingText, { fontSize: Math.max(11, rs(11)) }]}>Coming soon</Text>
        </Animated.View>

        <TouchableOpacity style={[styles.toggle, { width: Math.max(48, rs(52)), height: Math.max(28, rs(32)), padding: Math.max(4, rs(4)) }]} activeOpacity={0.8} onPress={() => { /* noop */ }}>
          <View style={[styles.toggleKnob, { width: Math.max(20, rs(22)), height: Math.max(20, rs(22)), borderRadius: Math.max(10, rs(11)) }]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SettingsScreen({ navigation }) {
  const { rs } = useResponsive();
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: Math.max(20, rs(22)), color: theme.colors.text }]}>Settings</Text>

      <View style={[styles.card, { backgroundColor: theme.colors.card }] }>
        <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={[styles.rowTitle, { fontSize: rs(16) }]}>Change password</Text>
          <Text style={[styles.rowDesc, { marginTop: 6 }]}>Update your account password</Text>
        </TouchableOpacity>

        <TogglePlaceholder title="Dark mode" description="A modern dark theme for the app." />
        <TogglePlaceholder title="Incognito mode" description="Hide activity and make submissions anonymous." />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: 
  { 
    flex: 1, 
    padding: 16, 
    backgroundColor: theme.colors.background 
  },
  title: 
  { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 12 
  },
  card: 
  { 
    backgroundColor: theme.colors.card, 
    borderRadius: 12, 
    padding: 12 
  },
  row: 
  { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderColor: theme.colors.border 
  },
  rowTitle: 
  { 
    fontSize: 16, 
    fontWeight: '700' 
  },
  rowDesc: 
  { 
    color: theme.colors.muted,
    marginTop: 4 
  },
  rightWrap: 
  { 
    alignItems: 'center', 
    flexDirection: 'row', 
    justifyContent: 'flex-end',
    paddingLeft: 6,
    // allow this area to size naturally so text can wrap without overlap
    minWidth: 88,
    flexShrink: 0,
  },
  coming: 
  { 
    backgroundColor: theme.colors.accentSoft, 
    paddingHorizontal: 8, 
    paddingVertical: 6, 
    borderRadius: 16, 
    marginRight: 12,
    flexShrink: 0,
  },
  comingText: 
  { 
    color: theme.colors.accent,
    fontWeight: '700', 
    fontSize: 12 
  },
  toggle: 
  { 
    width: 52, 
    height: 32, 
    backgroundColor: theme.colors.border, 
    borderRadius: 18, 
    justifyContent: 'center', 
    padding: 4 
  },
  toggleKnob: 
  { 
    width: 24, 
    height: 24, 
    backgroundColor: theme.colors.background, 
    borderRadius: 12, 
    elevation: 2 
 },
});
