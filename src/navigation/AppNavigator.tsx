import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/* ---------- SCREENS ---------- */
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/tabs/DashboardScreen';
import MetricsScreen from '../screens/tabs/MetricsScreen';
import CatchpointSonarScreen from '../screens/tabs/CatchpointSonarScreen';
import ChatScreen from '../screens/tabs/ChatScreen';

/* ---------- SVG ICONS ---------- */
import DashboardIcon from '../assets/dashboard.svg';
import DashboardIconActive from '../assets/dashboard_active.svg';

import MetricsIcon from '../assets/metrics.svg';
import MetricsIconActive from '../assets/metrics_active.svg';

import CatchpointSonarIcon from '../assets/catchpointsonar.svg';
import CatchpointSonarIconActive from '../assets/catchpointsonar_active.svg';

import ChatIcon from '../assets/chat.svg';
import ChatIconActive from '../assets/chat_active.svg';

/* ---------- TYPES ---------- */
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined; // Tab navigator
};

export type TabParamList = {
  Dashboard: undefined;
  Metrics: undefined;
  CatchpointSonar: undefined;
  Chat: undefined;
};

/* ---------- NAVIGATORS ---------- */
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

/* ---------- TAB NAVIGATOR ---------- */
const TabNavigator = () => {
  const ICON_SIZE = 22;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case 'Dashboard':
              return focused ? (
                <DashboardIconActive width={ICON_SIZE} height={ICON_SIZE} />
              ) : (
                <DashboardIcon width={ICON_SIZE} height={ICON_SIZE} />
              );

            case 'Metrics':
              return focused ? (
                <MetricsIconActive width={ICON_SIZE} height={ICON_SIZE} />
              ) : (
                <MetricsIcon width={ICON_SIZE} height={ICON_SIZE} />
              );

            case 'CatchpointSonar':
              return focused ? (
                <CatchpointSonarIconActive
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
              ) : (
                <CatchpointSonarIcon
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
              );

            case 'Chat':
              return focused ? (
                <ChatIconActive width={ICON_SIZE} height={ICON_SIZE} />
              ) : (
                <ChatIcon width={ICON_SIZE} height={ICON_SIZE} />
              );
          }
        },
        tabBarActiveTintColor: '#0A6ED1',
        tabBarInactiveTintColor: '#6B7280',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Metrics" component={MetricsScreen} />
      <Tab.Screen
        name="CatchpointSonar"
        component={CatchpointSonarScreen}
      />
      <Tab.Screen name="Chat" component={ChatScreen} />
    </Tab.Navigator>
  );
};

/* ---------- ROOT NAVIGATOR ---------- */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
