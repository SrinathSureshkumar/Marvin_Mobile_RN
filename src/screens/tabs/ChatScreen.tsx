import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ChatScreen = ({ openMenu }: { openMenu: () => void }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.menuBtn} onPress={openMenu}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity>

      <Text style={styles.text}>Chat Screen</Text>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  menuBtn: { position: 'absolute', top: 50, left: 20 },
  menuText: { fontSize: 28, fontWeight: '700' },
  text: { fontSize: 24, fontWeight: '600' },
});
