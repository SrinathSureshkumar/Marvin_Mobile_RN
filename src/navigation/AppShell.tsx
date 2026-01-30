import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import SideMenu from '../components/SideMenu';
import TabNavigator from './TabNavigator';

const AppShell = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<any>();

  const handleNavigate = (tabName: string) => {
    setMenuVisible(false);
    navigation.navigate('Dashboard', {
      screen: tabName,
    });
  };

  return (
    <View style={styles.container}>
      {/* Main app */}
      <TabNavigator openMenu={() => setMenuVisible(true)} />

      {/* Side menu overlay */}
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
