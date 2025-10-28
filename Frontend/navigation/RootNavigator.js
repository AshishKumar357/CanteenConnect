import React, { useRef, useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HeaderBar from '../components/HeaderBar';
import SlideMenu from '../components/SlideMenu';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SignOutScreen from '../screens/SignOutScreen';
import RaiseIssueScreen from '../screens/RaiseIssueScreen';
import ActivityScreen from '../screens/ActivityScreen';

export default function RootNavigator() {
  const Stack = createNativeStackNavigator();
  const navRef = createNavigationContainerRef();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <NavigationContainer ref={navRef}>
      <SafeAreaView style={{ flex: 1 }}>
  <HeaderBar title="CanteenConnect" onHamburgerPress={() => setMenuOpen(m => !m)} />

        <View style={{ flex: 1 }}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="SignOut" component={SignOutScreen} />
            <Stack.Screen name="RaiseIssue" component={RaiseIssueScreen} />
            <Stack.Screen name="Activity" component={ActivityScreen} />
          </Stack.Navigator>
        </View>

        <SlideMenu open={menuOpen} onClose={() => setMenuOpen(false)} navRef={navRef} />
      </SafeAreaView>
    </NavigationContainer>
  );
}
