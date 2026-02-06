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
} from 'react-native';

import { fetchDashboardData } from '../../api/marvinApi';
import SideMenuIcon from '../../assets/sidemenu.svg';
import SapLogo from '../../assets/logo_sap.svg';
import CartImg from '../../assets/dashboard_cart_img.svg';
import FilterImg from '../../assets/dashboard_filter_img.svg';

import { Tenant, Summary } from '../../models/DashboardModels';

type Props = {
  openMenu: () => void;
};

const PRODUCT_TYPES = ['C4C', 'SSP', 'CXAI', 'CCV20', 'SCV2', 'All'];

type DashboardCardItem = {
  id: string;
  cid: string;
  tid: string;

  storefrontScore: number;
  backofficeScore: number;

  summary?: Summary;
  briefExists: boolean;
  hasAssignee: boolean;
  hasIncident: boolean;
};

const DashboardScreen = ({ openMenu }: Props) => {
  const [data, setData] = useState<DashboardCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('All');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const json = await fetchDashboardData();
      const tenants: Tenant[] =
        json?.responseBody?.flatMap(p => p.responseBody) ?? [];

      const normalized: DashboardCardItem[] = tenants.map(
        (item, index) => {
          const storefront =
            item.ars?.find(a => a.name === 'storefront')?.score ?? 0;
          const backoffice =
            item.ars?.find(a => a.name === 'backoffice')?.score ?? 0;

          return {
            id: `${item.tid}-${index}`,
            cid: item.cid,
            tid: item.tid,

            storefrontScore: storefront,
            backofficeScore: backoffice,

            // 🔑 LOGIC FLAGS (THIS IS THE FIX)
            summary: item.summary,
            briefExists: Boolean(item.brief?.length),
            hasAssignee: Boolean(item.assignee?.length),
            hasIncident: Boolean(item.snowInfo),
          };
        }
      );

      setData(normalized);
    } catch (e) {
      console.log('Dashboard load error', e);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: DashboardCardItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconCircle}>
          <CartImg width={18} height={18} />
        </View>

        <View>
          <Text style={styles.storeTitle}>{item.cid}</Text>
          <Text style={styles.storeSub}>{item.tid}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <Text>Storefront risk score</Text>
        <Text>{item.storefrontScore}%</Text>
      </View>

      <View style={styles.cardRow}>
        <Text>Backoffice risk score</Text>
        <Text>{item.backofficeScore}%</Text>
      </View>

      {/* ✅ LIVE SUMMARY → ONLY IF summary EXISTS */}
      {item.summary && (
        <TouchableOpacity style={styles.liveButton}>
          <Text style={styles.liveText}>Live Summary</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={openMenu}>
          <SideMenuIcon width={28} height={28} />
        </TouchableOpacity>
        <SapLogo width={90} height={48} />
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title}>Marvin Dashboard</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <FilterImg width={24} height={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text>
          Product Type: <Text style={styles.bold}>{selectedProduct}</Text>
        </Text>
        <Text>Tenant Count: {data.length}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
      )}

      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setFilterVisible(false)}
        />
      </Modal>
    </View>
  );
};

export default DashboardScreen;

/* STYLES — UNCHANGED */
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 120, paddingHorizontal: 16 },
  headerRow: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 32,
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
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    backgroundColor: '#E6F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  storeTitle: { fontSize: 16, fontWeight: '600' },
  storeSub: { color: '#6B7280' },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  liveButton: {
    marginTop: 10,
    backgroundColor: '#0A6ED1',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  liveText: { color: '#FFF', fontWeight: '600' },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
