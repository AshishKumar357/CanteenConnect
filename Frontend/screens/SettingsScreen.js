import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

function TogglePlaceholder({ title, description }) {
  const pulse = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  const pulseScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4] });

  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDesc}>{description}</Text>
      </View>

      <View style={styles.rightWrap}>
        <Animated.View style={[styles.coming, { transform: [{ scale: pulseScale }] }]}>
          <Text style={styles.comingText}>Coming soon</Text>
        </Animated.View>

        <TouchableOpacity style={styles.toggle} activeOpacity={0.8} onPress={() => { /* noop */ }}>
          <View style={styles.toggleKnob} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.card}>
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
    backgroundColor: '#fff' 
  },
  title: 
  { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 12 
  },
  card: 
  { 
    backgroundColor: '#f7f7fb', 
    borderRadius: 12, 
    padding: 12 
  },
  row: 
  { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderBottomWidth: 1, 
    borderColor: '#eee' 
  },
  rowTitle: 
  { 
    fontSize: 16, 
    fontWeight: '700' 
  },
  rowDesc: 
  { 
    color: '#666', 
    marginTop: 4 
  },
  rightWrap: 
  { 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 120, 
    flexDirection: 'row', 
    justifyContent: 'flex-end' 
  },
  coming: 
  { 
    backgroundColor: '#e9defe', 
    paddingHorizontal: 8, 
    paddingVertical: 6, 
    borderRadius: 16, 
    marginRight: 40
  },
  comingText: 
  { 
    color: '#6b21a8',
    fontWeight: '700', 
    fontSize: 12 
  },
  toggle: 
  { 
    width: 52, 
    height: 32, 
    backgroundColor: '#ddd', 
    borderRadius: 18, 
    justifyContent: 'center', 
    padding: 4 
  },
  toggleKnob: 
  { 
    width: 24, 
    height: 24, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    elevation: 2 
 },
});
