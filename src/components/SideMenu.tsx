import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MENU_WIDTH = SCREEN_WIDTH * 0.75;

type Props = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
};

const SideMenu = ({ visible, onClose, onNavigate }: Props) => {
  const translateX = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : -MENU_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: visible ? 0.4 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* Menu */}
      <Animated.View
        style={[styles.menu, { transform: [{ translateX }] }]}
      >
        <Text style={styles.title}>Marvin Mobile</Text>

        <MenuItem label="Dashboard" onPress={() => onNavigate('Dashboard')} />
        <MenuItem label="Metrics" onPress={() => onNavigate('Metrics')} />
        <MenuItem
          label="Catchpoint Sonar"
          onPress={() => onNavigate('CatchpointSonar')}
        />
        <MenuItem label="Chat" onPress={() => onNavigate('Chat')} />

        <View style={styles.divider} />

        <MenuItem label="Logout" onPress={() => onNavigate('Logout')} />
      </Animated.View>
    </View>
  );
};

const MenuItem = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <Text style={styles.itemText}>{label}</Text>
  </TouchableOpacity>
);

export default SideMenu;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    elevation: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
  },
  item: {
    paddingVertical: 14,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
});
