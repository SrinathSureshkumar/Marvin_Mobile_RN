import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
} from 'react-native';

/* SVG ICONS */
import DashboardIcon from '../assets/dashboard.svg';
import MetricsIcon from '../assets/metrics.svg';
import SituationIcon from '../assets/situation_center.svg';
import SonarIcon from '../assets/catchpointsonar.svg';
import StackmapIcon from '../assets/catchpoint_stackmap.svg';
import ChatIcon from '../assets/chat.svg';
import UserIcon from '../assets/user_avatar.svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const MENU_WIDTH = SCREEN_WIDTH * 0.78;

type Props = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  activeRoute?: string;
};

const SideMenu = ({
  visible,
  onClose,
  onNavigate,
  activeRoute = 'Dashboard',
}: Props) => {
  const translateX = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : -MENU_WIDTH,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: visible ? 0.4 : 0,
        duration: 260,
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
        {/* PROFILE */}
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <UserIcon width={22} height={22} />
          </View>
          <View>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>
              john.doe@email.com
            </Text>
          </View>
        </View>

        {/* MENU ITEMS */}
        <MenuItem
          label="Marvin Dashboard"
          Icon={DashboardIcon}
          active={activeRoute === 'Dashboard'}
          onPress={() => onNavigate('Dashboard')}
        />

        <MenuItem
          label="Metrics"
          Icon={MetricsIcon}
          active={activeRoute === 'Metrics'}
          onPress={() => onNavigate('Metrics')}
        />

        <MenuItem
          label="Situation Center"
          Icon={SituationIcon}
          active={activeRoute === 'SituationCenter'}
          onPress={() => onNavigate('SituationCenter')}
        />

        <MenuItem
          label="Catchpoint Sonar"
          Icon={SonarIcon}
          active={activeRoute === 'CatchpointSonar'}
          onPress={() => onNavigate('CatchpointSonar')}
        />

        <MenuItem
          label="Catchpoint Stackmap"
          Icon={StackmapIcon}
          active={activeRoute === 'CatchpointStackmap'}
          onPress={() => onNavigate('Catchpoint')}
        />

        <MenuItem
          label="Chat"
          Icon={ChatIcon}
          active={activeRoute === 'Chat'}
          onPress={() => onNavigate('Chat')}
        />

        {/* FOOTER */}
        <View style={styles.footer}>
          {/* FULL-WIDTH DIVIDER */}
          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.logout}
            onPress={() => onNavigate('Logout')}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <Text style={styles.version}>v.0.9.1</Text>
        </View>
      </Animated.View>
    </View>
  );
};

/* ---------- MENU ITEM ---------- */

type MenuItemProps = {
  label: string;
  onPress: () => void;
  Icon: React.FC<{ width?: number; height?: number; color?: string }>;
  active?: boolean;
};

const MenuItem = ({
  label,
  onPress,
  Icon,
  active,
}: MenuItemProps) => (
  <TouchableOpacity
    style={styles.item}
    onPress={onPress}
  >
    <Icon
      width={20}
      height={20}
      color={active ? '#2563EB' : '#374151'}
    />
    <Text
      style={[
        styles.itemText,
        active && { color: 'black' }
      ]}
    >
      {label}
    </Text>
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
    paddingTop: 70,
    paddingHorizontal: 20,
  },

  /* PROFILE */
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  userEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },

  /* ITEMS */
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10, // keeps alignment consistent
    gap: 14,
  },

  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },

  /* FOOTER */
  footer: {
    marginTop: 'auto',
    paddingBottom: 30,
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 14,
  },

  logout: {
    alignItems: 'center',
    paddingVertical: 12,
  },

  logoutText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },

  version: {
    marginTop: 6,
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
