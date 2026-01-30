import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  openMenu: () => void;
};

const DashboardScreen = ({ openMenu }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openMenu} style={styles.menuBtn}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>

      <Text style={styles.text}>Dashboard</Text>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  menuText: {
    fontSize: 28,
    fontWeight: '700',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
});
