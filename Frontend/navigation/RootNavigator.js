import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HeaderBar from '../components/HeaderBar';
import SlideMenu from '../components/SlideMenu';

import HomeScreen from '../screens/student/HomeScreen';
import ProfileScreen from '../screens/student/ProfileScreen';
import SettingsScreen from '../screens/student/SettingsScreen';
import SignOutScreen from '../screens/student/SignOutScreen';
import RaiseIssueScreen from '../screens/student/RaiseIssueScreen';
import ActivityScreen from '../screens/student/ActivityScreen';
import UpdatesScreen from '../screens/student/UpdatesScreen';
import IssueDetailScreen from '../screens/mess/IssueDetailScreen';
import MessOverviewScreen from '../screens/mess/MessOverviewScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ChangePasswordScreen from '../screens/student/ChangePasswordScreen';

export default function RootNavigator() {
  const Stack = createNativeStackNavigator();
  const navRef = createNavigationContainerRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('Home');

  return (
    <NavigationContainer
      ref={navRef}
      onStateChange={(state) => {
        try {
          const routeName = state.routes[state.index]?.name || 'Home';
          setCurrentRoute(routeName);
        } catch (e) {
          // ignore
        }
      }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        {/* show the app header for student and mess stacks */}
        {(currentRoute === 'App' || currentRoute === 'Mess') && (
          <HeaderBar onHamburgerPress={() => setMenuOpen(m => !m)} />
        )}
        <View style={{ flex: 1 }}>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            {/* Auth / boot */}
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />

            {/* Student app as a nested stack */}
            <Stack.Screen name="App" component={() => {
              const S = createNativeStackNavigator();
              return (
                <S.Navigator screenOptions={{ headerShown: false }}>
                  <S.Screen name="Home" component={HomeScreen} />
                  <S.Screen name="Profile" component={ProfileScreen} />
                  <S.Screen name="Settings" component={SettingsScreen} />
                  <S.Screen name="SignOut" component={SignOutScreen} />
                  <S.Screen name="RaiseIssue" component={RaiseIssueScreen} />
                  <S.Screen name="Activity" component={ActivityScreen} />
                  <S.Screen name="IssueDetail" component={IssueDetailScreen} />
                  <S.Screen name="Updates" component={UpdatesScreen} />
                </S.Navigator>
              );
            }} />

            {/* Mess app as a separate nested stack */}
            <Stack.Screen name="Mess" component={() => {
              const M = createNativeStackNavigator();
              return (
                <M.Navigator screenOptions={{ headerShown: false }}>
                  <M.Screen name="MessOverview" component={MessOverviewScreen} />
                  <M.Screen name="MessIssues" component={require('../screens/mess/MessIssuesScreen').default} />
                  <M.Screen name="IssueDetail" component={require('../screens/mess/IssueDetailScreen').default} />
                </M.Navigator>
              );
            }} />
          </Stack.Navigator>
        </View>

        <SlideMenu open={menuOpen} onClose={() => setMenuOpen(false)} navRef={navRef} />
      </SafeAreaView>
    </NavigationContainer>
  );
}
