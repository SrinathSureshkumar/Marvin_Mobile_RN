import React, { useEffect, useRef, useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';

import { fetchCatchpointSonar, SonarType } from '../../api/marvinApi';
import { CatchpointIncident } from '../../models/CatchpointSonarModels';

/* SVGs */
import SideMenuIcon from '../../assets/sidemenu.svg';
import SapLogo from '../../assets/logo_sap.svg';
import ChevronUp from '../../assets/chevron_up.svg';
import ChevronDown from '../../assets/chevron_down.svg';

const { width } = Dimensions.get('window');

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  openMenu: () => void;
};

const CatchpointSonarScreen = ({ openMenu }: Props) => {
  const pagerRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ispData, setIspData] = useState<CatchpointIncident[]>([]);
  const [serviceData, setServiceData] = useState<CatchpointIncident[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const isp = await fetchCatchpointSonar('ISP');
      const service = await fetchCatchpointSonar('SERVICE');

      setIspData(isp.responseBody.responseBody ?? []);
      setServiceData(service.responseBody.responseBody ?? []);
    } catch (e) {
      console.log('❌ Sonar API failed', e);
    } finally {
      setLoading(false);
    }
  };

  const onTabPress = (index: number) => {
    setActiveTab(index);
    pagerRef.current?.scrollTo({ x: index * width, animated: true });
  };

  const renderIncident = (item: CatchpointIncident) => {
    const open = expanded === item.asnName;
  
    return (
      <View key={item.asnName} style={styles.card}>
        {/* HEADER */}
        <TouchableOpacity
          style={styles.cardHeader}
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setExpanded(open ? null : item.asnName);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.cardTitle}>{item.asnName}</Text>
          {open ? <ChevronUp /> : <ChevronDown />}
        </TouchableOpacity>
  
        {/* CONTENT */}
        {open && (
          <View style={styles.cardContent}>
            <Text style={styles.sectionLabel}>Address list</Text>
            <Text style={styles.valueBold}>ASN: {item.asnName}</Text>
  
            <Text style={styles.muted}>
              No error types available
            </Text>
  
            <View style={styles.row}>
              <Text style={styles.label}>Regions</Text>
              <Text style={styles.valueRight}>
                {item.regions.map(r => r.name).join(', ') || '—'}
              </Text>
            </View>
  
            <View style={styles.row}>
              <Text style={styles.label}>Locations</Text>
              <Text style={styles.valueRight}>
                {item.locations.length
                  ? item.locations.join(', ')
                  : '—'}
              </Text>
            </View>
  
            <View style={styles.row}>
              <Text style={styles.label}>Severity Score</Text>
              <Text style={styles.valueRight}>
                {item.severityScore}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };
  

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const data = activeTab === 0 ? ispData : serviceData;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={openMenu}>
          <SideMenuIcon width={28} height={28} />
        </TouchableOpacity>
        <SapLogo width={90} height={48} />
      </View>

      <Text style={styles.title}>Catchpoint Sonar</Text>

      {/* TABS */}
      <View style={styles.tabRow}>
        {['ISP Incidents', 'Service Incidents'].map((t, i) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabButton, activeTab === i && styles.activeTab]}
            onPress={() => onTabPress(i)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === i && styles.activeTabText,
              ]}
            >
              {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView ref={pagerRef} horizontal pagingEnabled scrollEnabled={false}>
        <View style={styles.page}>{data.map(renderIncident)}</View>
        <View style={styles.page}>{data.map(renderIncident)}</View>
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

  value: {
    fontSize: 14,
    fontWeight: '600',
  },

  sectionLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  
  valueBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  
  valueRight: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'right',
    maxWidth: '60%',
  },
  
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  
  cardHeader: {
    backgroundColor: '#EEF6FF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  
  cardContent: {
    padding: 16,
    marginVertical: 10
  },
  
  label: {
    fontSize: 13,
    color: '#6B7280',
  },
  
  muted: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 10,
  },
  
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  
});
