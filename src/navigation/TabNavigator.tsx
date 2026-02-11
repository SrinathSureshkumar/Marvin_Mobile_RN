import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../screens/tabs/DashboardScreen';
import MetricsScreen from '../screens/tabs/MetricsScreen';
import CatchpointSonarScreen from '../screens/tabs/CatchpointSonarScreen';
import ChatScreen from '../screens/tabs/ChatScreen';

import DashboardIcon from '../assets/dashboard.svg';
import DashboardIconActive from '../assets/dashboard_active.svg';
import MetricsIcon from '../assets/metrics.svg';
import MetricsIconActive from '../assets/metrics_active.svg';
import CatchpointSonarIcon from '../assets/catchpointsonar.svg';
import CatchpointSonarIconActive from '../assets/catchpointsonar_active.svg';
import ChatIcon from '../assets/chat.svg';
import ChatIconActive from '../assets/chat_active.svg';
import CatchpointStackmap from '../assets/catchpoint_stackmap.svg';
import CatchpointStackmapActive from '../assets/catchpoint_stackmap_active.svg';

export type TabParamList = {
  Dashboard: undefined;
  Metrics: undefined;
  Sonar: undefined;
  Stackmap: undefined;
};

type Props = {
  openMenu: () => void;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = ({ openMenu }: Props) => {
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
            case 'Sonar':
              return focused ? (
                <CatchpointSonarIconActive
                  width={ICON_SIZE}
                  height={ICON_SIZE}
                />
              ) : (
                <CatchpointSonarIcon width={ICON_SIZE} height={ICON_SIZE} />
              );
            // case 'Chat':
            //   return focused ? (
            //     <ChatIconActive width={ICON_SIZE} height={ICON_SIZE} />
            //   ) : (
            //     <ChatIcon width={ICON_SIZE} height={ICON_SIZE} />
            //   );
            case 'Stackmap':
              return focused ? (
                <CatchpointStackmapActive width={ICON_SIZE} height={ICON_SIZE} />
              ) : (
                <CatchpointStackmap width={ICON_SIZE} height={ICON_SIZE} />
              );
          }
        },
      })}
    >
      <Tab.Screen name="Dashboard">
        {() => <DashboardScreen openMenu={openMenu} />}
      </Tab.Screen>
      <Tab.Screen name="Metrics">
        {() => <MetricsScreen openMenu={openMenu} />}
      </Tab.Screen>
      <Tab.Screen name="Sonar">
        {() => <CatchpointSonarScreen openMenu={openMenu} />}
      </Tab.Screen>
      {/* <Tab.Screen name="Chat">
        {() => <ChatScreen openMenu={openMenu} />}
      </Tab.Screen> */}
      <Tab.Screen name="Stackmap">
        {() => <ChatScreen openMenu={openMenu} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;
