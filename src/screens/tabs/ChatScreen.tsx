import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/* SVGs */
import SideMenuIcon from '../../assets/sidemenu.svg';
import SapLogo from '../../assets/logo_sap.svg';

type Props = {
  openMenu: () => void;
};

const ChatScreen = ({ openMenu }: Props) => {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={openMenu}>
          <SideMenuIcon width={28} height={28} />
        </TouchableOpacity>

        <SapLogo width={90} height={48} />
      </View>

      {/* CONTENT */}
      <Text style={styles.text}>Chat</Text>
    </View>
  );
};

export default ChatScreen;

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerRow: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  text: {
    marginTop: 120,
    fontSize: 24,
    fontWeight: '600',
  },
});
