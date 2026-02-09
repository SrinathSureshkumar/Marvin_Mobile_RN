import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  ActivityIndicator,
  Linking,
} from 'react-native';

import {
  fetchDashboardData,
  fetchDashboardByProduct,
} from '../../api/marvinApi';

import SideMenuIcon from '../../assets/sidemenu.svg';
import SapLogo from '../../assets/logo_sap.svg';

import TenentImgBlue from '../../assets/dashboard_tenent_img_blue.svg';
import TenentImgYellow from '../../assets/dashboard_tenent_img_yellow.svg';
import TenentImgRed from '../../assets/dashboard_tenent_img_red.svg';

import FilterImg from '../../assets/dashboard_filter_img.svg';

import { Tenant, Summary } from '../../models/DashboardModels';

/* ================= PRODUCT ENUM ================= */
export enum ProductType {
  C4C = 'c4c',
  SSP = 'ssp',
  CXAI = 'cxai',
  CCV20 = 'ccv20',
  SCV2 = 'scv2',
  ALL = 'all',
}

export const ProductTypeConfig: Record<ProductType, { label: string }> = {
  [ProductType.C4C]: { label: 'C4C' },
  [ProductType.SSP]: { label: 'SSP' },
  [ProductType.CXAI]: { label: 'CXAI' },
  [ProductType.CCV20]: { label: 'CCV20' },
  [ProductType.SCV2]: { label: 'SCV2' },
  [ProductType.ALL]: { label: 'All' },
};

const PRODUCT_TYPES = Object.values(ProductType);

type Props = {
  openMenu: () => void;
};

/* ================= CARD ITEM ================= */
type DashboardCardItem = {
  id: string;
  cid: string;
  cName: string;
  ars: {
    name: string;
    score: number;
    issueDomain?: string;
  }[];
  sr?: boolean;
  summary?: Summary;
  showLiveSummary: boolean;
};

const DashboardScreen = ({ openMenu }: Props) => {
  const [data, setData] = useState<DashboardCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductType>(ProductType.ALL);

  /* 🔥 LIVE SUMMARY STATE (THIS WAS MISSING) */
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [activeSummary, setActiveSummary] = useState<Summary | null>(null);

  useEffect(() => {
    loadDashboard(ProductType.ALL);
  }, []);

  /* ================= LOAD DASHBOARD ================= */
  const loadDashboard = async (product: ProductType) => {
    setLoading(true);
    try {
      const json =
        product === ProductType.ALL
          ? await fetchDashboardData()
          : await fetchDashboardByProduct(product);

      const tenants: Tenant[] =
        json?.responseBody?.flatMap(p => p.responseBody) ?? [];

      const normalized: DashboardCardItem[] = tenants.map((item, index) => {
        const showLiveSummary =
          Boolean(item.summary?.summary) &&
          Boolean(item.summary?.slack_thread_link) &&
          Boolean(item.summary?.tenant_link);

        return {
          id: `${item.tid}-${index}`,
          cid: item.cid,
          cName: item.cName,
          ars: item.ars ?? [],
          sr: item.sr ?? false,
          summary: item.summary,
          showLiveSummary,
        };
      });

      setData(normalized);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS HELPERS ================= */
  const isRed = (item: DashboardCardItem) => item.sr === true;
  const isYellow = (item: DashboardCardItem) =>
    item.ars.some(a => a.score > 84);

  const getCardStyle = (item: DashboardCardItem) => {
    if (isRed(item)) return styles.cardRed;
    if (isYellow(item)) return styles.cardYellow;
    return styles.cardBlue;
  };

  const getTenantIcon = (item: DashboardCardItem) => {
    if (isRed(item)) return <TenentImgRed width={24} height={24} />;
    if (isYellow(item)) return <TenentImgYellow width={24} height={24} />;
    return <TenentImgBlue width={24} height={24} />;
  };

  const onSelectProduct = (p: ProductType) => {
    setSelectedProduct(p);
    setFilterVisible(false);
    loadDashboard(p);
  };

  /* ================= CARD ================= */
  const renderItem = ({ item }: { item: DashboardCardItem }) => {
    const issueDomains = item.ars
      .map(a => a.issueDomain)
      .filter(d => d && d.trim().length > 0) as string[];

    return (
      <View style={[styles.card, getCardStyle(item)]}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>{getTenantIcon(item)}</View>
          <View>
            <Text style={styles.storeTitle}>{item.cName}</Text>
            <Text style={styles.storeSub}>{item.cid}</Text>
          </View>
        </View>

        {item.ars.map((arsItem, index) => (
          <View key={`${arsItem.name}-${index}`} style={styles.cardRow}>
            <Text style={styles.arsLabel}>
              {arsItem.name} risk score
            </Text>
            <Text style={styles.arsValue}>{arsItem.score}%</Text>
          </View>
        ))}

        {item.showLiveSummary && (
          <>
            <TouchableOpacity
              style={styles.liveButton}
              onPress={() => {
                setActiveSummary(item.summary!);
                setSummaryModalVisible(true);
              }}
            >
              <Text style={styles.liveText}>Live Summary</Text>
            </TouchableOpacity>

            {issueDomains.length > 0 && (
              <Text style={styles.issueDomainText}>
                ARS : {issueDomains.join(', ')}
              </Text>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={openMenu}>
          <SideMenuIcon width={28} height={28} />
        </TouchableOpacity>
        <SapLogo width={90} height={48} />
        <Text>Hello, User</Text>
      </View>

      <View style={styles.divider} />

      {/* TITLE + FILTER */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Marvin Dashboard</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <FilterImg width={24} height={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text>
          Product Type:{' '}
          <Text style={styles.bold}>
            {ProductTypeConfig[selectedProduct].label}
          </Text>
        </Text>
        <Text>Tenant Count: {data.length}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList data={data} renderItem={renderItem} />
      )}

      {/* ================= LIVE SUMMARY MODAL ================= */}
      <Modal visible={summaryModalVisible} transparent animationType="fade">
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSummaryModalVisible(false)}
        />

        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Latest Updates</Text>
            <TouchableOpacity onPress={() => setSummaryModalVisible(false)}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content rows */}
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Customer Name</Text>
            <Text style={styles.modalValueEnd}>
              {activeSummary?.customer_name}
            </Text>
          </View>

          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Tenant</Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(activeSummary?.tenant_link!)
              }
            >
              <Text style={styles.modalLink}>
                {activeSummary?.tenant_id}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Summary</Text>
          </View>
          <View style={styles.modalRow}>
            <Text style={styles.modalValue}>
              {activeSummary?.summary}
            </Text>
          </View>

          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Update Time</Text>
            <Text style={styles.modalValueEnd}>
              {activeSummary?.update_time}
            </Text>
          </View>

          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Bridge Start Time</Text>
            <Text style={styles.modalValueEnd}>
              {activeSummary?.thread_start_time}
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() =>
                Linking.openURL(activeSummary?.slack_thread_link!)
              }
            >
              <Text style={styles.secondaryText}>Go to bridge</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() =>
                Linking.openURL(activeSummary?.tenant_link!)
              }
            >
              <Text style={styles.primaryText}>
                Dynatrace Problem
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* FILTER MODAL */}
      <Modal visible={filterVisible} transparent animationType="fade">
        <Pressable
          style={styles.backdrop}
          onPress={() => setFilterVisible(false)}
        />
        <View style={styles.filterPopup}>
          {PRODUCT_TYPES.map(p => (
            <TouchableOpacity
              key={p}
              style={styles.filterItem}
              onPress={() => onSelectProduct(p)}
            >
              <Text
                style={[
                  styles.filterText,
                  p === selectedProduct && styles.selectedText,
                ]}
              >
                {ProductTypeConfig[p].label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

export default DashboardScreen;

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 120, paddingHorizontal: 16 },

  headerRow: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  title: { fontSize: 22, fontWeight: '700' },

  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  bold: { fontWeight: '700' },

  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1.5,

    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },

  cardBlue: {
    backgroundColor: '#ECF7FF',
    borderColor: '#1677FF',
  },

  cardYellow: {
    backgroundColor: '#FFF4E5',
    borderColor: '#F59E0B',
  },

  cardRed: {
    backgroundColor: '#FFECEE',
    borderColor: '#EF4444',
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  storeTitle: { fontSize: 16, fontWeight: '600' },
  storeSub: { color: '#6B7280' },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  arsLabel: { textTransform: 'capitalize' },
  arsValue: { fontWeight: '600' },

  liveButton: {
    marginTop: 12,
    backgroundColor: '#0A6ED1',
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },

  liveText: { color: '#FFF', fontWeight: '600' },

  issueDomainText: {
    marginTop: 8,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#374151',
  },

  divider: {
    height: 1,
    backgroundColor: '#c2c2c2',
    marginVertical: 8,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },

  filterPopup: {
    position: 'absolute',
    top: 190,
    right: 16,
    width: 160,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 8,
  },

  filterItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  filterText: { fontSize: 16 },

  selectedText: {
    fontWeight: '700',
    color: '#0A6ED1',
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  modalCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginTop: '35%',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    // Android
    elevation: 10,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  close: {
    fontSize: 18,
    color: '#111827',
  },

  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },

  modalLabel: {
    width: '40%',
    color: '#6B7280',
    fontSize: 14,
  },

  modalValue: {
    width: '60%',
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },

  modalValueEnd: {
    width: '60%',
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'right',
  },
  

  modalLink: {
    width: '100%',
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  secondaryBtn: {
    backgroundColor: '#E0F2FE',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },

  secondaryText: {
    color: '#2563EB',
    fontWeight: '600',
  },

  primaryBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  primaryText: {
    color: '#FFF',
    fontWeight: '600',
  },

});
