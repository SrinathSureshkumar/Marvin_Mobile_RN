import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native';

/* 🔹 SVG ICONS */
import DashboardIcon from '../assets/dashboard.svg';
import MetricsIcon from '../assets/metrics.svg';
import SonarIcon from '../assets/catchpointsonar.svg';
import StackmapIcon from '../assets/catchpoint_stackmap.svg';
import LogoutIcon from '../assets/chat.svg';

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
      {/* BACKDROP */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>

      {/* MENU */}
      <Animated.View
        style={[styles.menu, { transform: [{ translateX }] }]}
      >
        <Text style={styles.title}>Marvin Mobile</Text>

        <MenuItem
          label="Dashboard"
          Icon={DashboardIcon}
          onPress={() => onNavigate('Dashboard')}
        />

        <MenuItem
          label="Metrics"
          Icon={MetricsIcon}
          onPress={() => onNavigate('Metrics')}
        />

        <MenuItem
          label="Catchpoint Sonar"
          Icon={SonarIcon}
          onPress={() => onNavigate('CatchpointSonar')}
        />

        <MenuItem
          label="Catchpoint Stackmap"
          Icon={StackmapIcon}
          onPress={() => onNavigate('Catchpoint')}
        />

        <View style={styles.divider} />

        <MenuItem
          label="Logout"
          Icon={LogoutIcon}
          onPress={() => onNavigate('Logout')}
        />
      </Animated.View>
    </View>
  );
};

/* ---------- MENU ITEM ---------- */

type MenuItemProps = {
  label: string;
  onPress: () => void;
  Icon: React.FC<{ width?: number; height?: number }>;
};

const MenuItem = ({ label, onPress, Icon }: MenuItemProps) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.itemRow}>
      <Icon width={20} height={20} />
      <Text style={styles.itemText}>{label}</Text>
    </View>
  </TouchableOpacity>
);

export default SideMenu;

/* ---------- STYLES ---------- */

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
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // RN 0.71+
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
