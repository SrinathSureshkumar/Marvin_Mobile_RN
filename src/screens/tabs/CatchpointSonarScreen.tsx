import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
} from 'react-native';

/* SVGs */
import SideMenuIcon from '../../assets/sidemenu.svg';
import SapLogo from '../../assets/logo_sap.svg';
import ChevronUp from '../../assets/chevron_up.svg';
import ChevronDown from '../../assets/chevron_down.svg';

const { width } = Dimensions.get('window');

/* Enable LayoutAnimation on Android */
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  openMenu: () => void;
};

const CatchpointSonarScreen = ({ openMenu }: Props) => {
  const pagerRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState(0);
  const [collapsedISP, setCollapsedISP] = useState(false);
  const [collapsedService, setCollapsedService] = useState(false);

  /* ---------- HANDLERS ---------- */
  const onTabPress = (index: number) => {
    setActiveTab(index);
    pagerRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  const toggleISP = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedISP(!collapsedISP);
  };

  const toggleService = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedService(!collapsedService);
  };

  /* ---------- UI ---------- */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={openMenu}>
          <SideMenuIcon width={28} height={28} />
        </TouchableOpacity>
        <SapLogo width={90} height={48} />
      </View>

      {/* TITLE */}
      <Text style={styles.title}>Catchpoint Sonar</Text>

      {/* TOP TABS */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 0 && styles.activeTab]}
          onPress={() => onTabPress(0)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 0 && styles.activeTabText,
            ]}
          >
            ISP Incidents
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 1 && styles.activeTab]}
          onPress={() => onTabPress(1)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 1 && styles.activeTabText,
            ]}
          >
            Service Incidents
          </Text>
        </TouchableOpacity>
      </View>

      {/* VIEW PAGER */}
      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
      >
        {/* ISP INCIDENTS */}
        <View style={styles.page}>
          <IncidentCard
            title="COGENT-174"
            collapsed={collapsedISP}
            onToggle={toggleISP}
            regions="Europe Mid, East Africa"
            locations="Dallas US, Atlanta US, Denver US"
            severity="2"
          />
        </View>

        {/* SERVICE INCIDENTS */}
        <View style={styles.page}>
          <IncidentCard
            title="AWS-OUTAGE-91"
            collapsed={collapsedService}
            onToggle={toggleService}
            regions="Asia Pacific"
            locations="Mumbai IN, Singapore SG"
            severity="3"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CatchpointSonarScreen;

/* ---------- INCIDENT CARD ---------- */
type CardProps = {
  title: string;
  collapsed: boolean;
  onToggle: () => void;
  regions: string;
  locations: string;
  severity: string;
};

const IncidentCard = ({
  title,
  collapsed,
  onToggle,
  regions,
  locations,
  severity,
}: CardProps) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <Text style={styles.cardTitle}>{title}</Text>
        {collapsed ? (
          <ChevronDown width={18} height={18} />
        ) : (
          <ChevronUp width={18} height={18} />
        )}
      </TouchableOpacity>

      {!collapsed && (
        <View style={styles.cardContent}>
          <Text style={styles.label}>Address list</Text>
          <Text style={styles.value}>ASN: {title}</Text>

          <Text style={styles.muted}>No error types available</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Regions</Text>
            <Text style={styles.value}>{regions}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Locations</Text>
            <Text style={styles.value}>{locations}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Severity Score</Text>
            <Text style={styles.value}>{severity}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#F7F7F7',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginLeft: 20,
  },

  tabRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#EEF2F6',
    borderRadius: 12,
    padding: 4,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  activeTab: {
    backgroundColor: '#FFFFFF',
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },

  activeTabText: {
    color: '#0A6ED1',
  },

  page: {
    width,
    padding: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#EEF6FF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  cardContent: {
    padding: 16,
    gap: 6,
  },

  label: {
    fontSize: 12,
    color: '#6B7280',
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
  },

  muted: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
});
