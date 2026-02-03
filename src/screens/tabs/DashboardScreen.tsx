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

/* API */
import { fetchDashboardData } from '../../api/marvinApi';

/* SVGs */
import SideMenuIcon from '../../assets/sidemenu.svg';
import SapLogo from '../../assets/logo_sap.svg';
import CartImg from '../../assets/dashboard_cart_img.svg';
import FilterImg from '../../assets/dashboard_filter_img.svg';

type Props = {
  openMenu: () => void;
};

/* FILTER OPTIONS */
const PRODUCT_TYPES = ['C4C', 'SSP', 'CXAI', 'CCV20', 'SCV2', 'All'];

const DashboardScreen = ({ openMenu }: Props) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('All');

  /* ---------------- LOAD DASHBOARD ---------------- */
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const json = await fetchDashboardData();

      // ✅ FLATTEN ALL PAYLOADS (NO [0])
      const tenants =
        json?.responseBody?.flatMap(
          payload => payload.responseBody
        ) ?? [];

      const normalized = tenants.map((item: any, index: number) => ({
        tid: item.tid ?? `tid-${index}`,
        cid: item.cid ?? 'Unknown',
        storefrontScore:
          item.ars?.find((a: any) => a.name === 'storefront')?.score ?? 0,
        backofficeScore:
          item.ars?.find((a: any) => a.name === 'backoffice')?.score ?? 0,
      }));

      setData(normalized);
    } catch (error) {
      console.log('❌ Unexpected dashboard error', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const onSelectProduct = (value: string) => {
    setSelectedProduct(value);
    setFilterVisible(false);
    // later → filter or re-fetch
  };

  /* ---------------- RENDER CARD ---------------- */
  const renderItem = ({ item }: { item: any }) => (
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
    </View>
  );

  /* ---------------- UI ---------------- */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={openMenu}>
          <SideMenuIcon width={28} height={28} />
        </TouchableOpacity>
        <SapLogo width={90} height={48} />
      </View>

      {/* TITLE + FILTER */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Marvin Dashboard</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <FilterImg width={24} height={24} />
        </TouchableOpacity>
      </View>

      {/* SUB HEADER */}
      <View style={styles.subHeader}>
        <Text>
          Product Type: <Text style={styles.bold}>{selectedProduct}</Text>
        </Text>
        <Text>Tenant Count: {data.length}</Text>
      </View>

      {/* CONTENT */}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) =>
            item.tid ?? `item-${index}`
          }
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}

      {/* FILTER MODAL */}
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

        <View style={styles.filterPopup}>
          {PRODUCT_TYPES.map(item => (
            <TouchableOpacity
              key={item}
              style={styles.filterItem}
              onPress={() => onSelectProduct(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  item === selectedProduct && styles.selectedText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

export default DashboardScreen;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 16,
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

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
  },

  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  bold: {
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
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

  storeTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  storeSub: {
    color: '#6B7280',
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 5,
  },

  filterItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },

  filterText: {
    fontSize: 16,
  },

  selectedText: {
    fontWeight: '700',
    color: '#0A6ED1',
  },
});
