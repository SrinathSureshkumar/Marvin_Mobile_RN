import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';

import SideMenu from '../components/SideMenu';
import TabNavigator from './TabNavigator';

const AppShell = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<any>();

  const handleNavigate = (route: string) => {
    setMenuVisible(false);

    // 🔴 LOGOUT (RESET TO LOGIN)
    if (route === 'Logout') {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        }),
      );
      return;
    }

    // Normal bottom tab navigation
    navigation.navigate('Dashboard', {
      screen: route,
    });
  };

  return (
    <View style={styles.container}>
      <TabNavigator openMenu={() => setMenuVisible(true)} />

      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={handleNavigate}
      />
    </View>
  );
};

export default AppShell;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
