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

import { fetchCatchpointSonar } from '../../api/marvinApi';
import { CatchpointIncident } from '../../models/CatchpointSonarModels';

/* SVGs */
import SideMenuIcon from '../../assets/sidemenu.svg';
import SapLogo from '../../assets/logo_sap.svg';
import ChevronUp from '../../assets/chevron_up.svg';
import ChevronDown from '../../assets/chevron_down.svg';

const { width } = Dimensions.get('window');

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
  const [loading, setLoading] = useState(true);
  const [ispData, setIspData] = useState<CatchpointIncident[]>([]);
  const [serviceData, setServiceData] = useState<CatchpointIncident[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  /* ---------------- LOAD DATA ---------------- */
  const loadData = async () => {
    setLoading(true);

    try {
      const isp = await fetchCatchpointSonar('ISP');
      setIspData(
        Array.isArray(isp?.responseBody?.responseBody)
          ? isp.responseBody.responseBody
          : []
      );
    } catch {
      setIspData([]);
    }

    try {
      const service = await fetchCatchpointSonar('SERVICE');
      setServiceData(
        Array.isArray(service?.responseBody?.responseBody)
          ? service.responseBody.responseBody
          : []
      );
    } catch {
      setServiceData([]);
    }

    setLoading(false);
  };

  const onTabPress = (index: number) => {
    setActiveTab(index);
    pagerRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
  };

  /* ---------------- CARD ---------------- */
  const renderIncident = (item: CatchpointIncident) => {
    const id = `${item.asn}-${item.startDate}`;
    const open = expandedId === id;

    return (
      <View key={id} style={styles.card}>
        {/* CARD HEADER */}
        <TouchableOpacity
          style={styles.cardHeader}
          activeOpacity={0.8}
          onPress={() => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setExpandedId(open ? null : id);
          }}
        >
          <Text style={styles.cardTitle}>{item.asnName}</Text>
          {open ? <ChevronUp /> : <ChevronDown />}
        </TouchableOpacity>

        {/* CARD BODY */}
        {open && (
          <View style={styles.cardBody}>
            <Text style={styles.sectionLabel}>Address list</Text>

            <Text style={styles.valueBold}>
              ASN: {item.asnName}
            </Text>

            <Text style={styles.muted}>
              No error types available
            </Text>

            {/* Regions */}
            {item.regions?.length > 0 && (
              <View style={styles.row}>
                <Text style={styles.label}>Regions</Text>
                <Text style={styles.valueRight}>
                  {item.regions.map(r => r.name).join(', ')}
                </Text>
              </View>
            )}

            {/* Locations */}
            {item.locations?.length > 0 && (
              <View style={styles.row}>
                <Text style={styles.label}>Locations</Text>
                <Text style={styles.valueRight}>
                  {item.locations.join(', ')}
                </Text>
              </View>
            )}

            {/* Severity */}
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
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={openMenu}>
          <SideMenuIcon width={26} height={26} />
        </TouchableOpacity>
        <SapLogo width={90} height={48} />
      </View>

      <Text style={styles.title}>Catchpoint Sonar</Text>

      {/* TABS */}
      <View style={styles.tabs}>
        {['ISP Incidents', 'Service Incidents'].map(
          (label, index) => (
            <TouchableOpacity
              key={label}
              style={[
                styles.tab,
                activeTab === index && styles.tabActive,
              ]}
              onPress={() => onTabPress(index)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === index &&
                    styles.tabTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* PAGES */}
      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
      >
        <View style={styles.page}>
          {ispData.map(renderIncident)}
        </View>

        <View style={styles.page}>
          {serviceData.map(renderIncident)}
        </View>
      </ScrollView>
    </View>
  );
};

export default CatchpointSonarScreen;

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 24,
    marginLeft: 20,
    color: '#111827',
  },

  /* TABS */
  tabs: {
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: 20,
    gap: 12,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },

  tabActive: {
    borderColor: '#3B82F6',
  },

  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },

  tabTextActive: {
    color: '#1D4ED8',
  },

  /* PAGES */
  page: {
    width,
    padding: 20,
  },

  /* CARD */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    overflow: 'hidden',
  },

  cardHeader: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },

  valueBold: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
    color: '#111827',
  },

  muted: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'flex-start',
  },

  label: {
    fontSize: 13,
    color: '#6B7280',
  },

  valueRight: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'right',
    maxWidth: '60%',
  },
});
