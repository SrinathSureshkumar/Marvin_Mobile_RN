import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MetricsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Metrics 🚀</Text>
    </View>
  );
};

export default MetricsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
  },
});
