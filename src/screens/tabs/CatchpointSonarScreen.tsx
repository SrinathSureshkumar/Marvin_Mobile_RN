import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CatchpointSonarScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to CatchpointSonar 🚀</Text>
    </View>
  );
};

export default CatchpointSonarScreen;

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
