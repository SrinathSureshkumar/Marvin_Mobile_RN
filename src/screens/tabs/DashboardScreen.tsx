import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';

/* SVGs */
import SideMenuIcon from '../../assets/sidemenu.svg';
import SapLogo from '../../assets/logo_sap.svg';
import CartImg from '../../assets/dashboard_cart_img.svg';
import FilterImg from '../../assets/dashboard_filter_img.svg';

type Props = {
  openMenu: () => void;
};

/* Dummy card data */
const DATA = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
  { id: '4' },
];

/* Filter options */
const PRODUCT_TYPES = ['C4C', 'SSP', 'CXAI', 'CCV20', 'SCV2', 'All'];

const DashboardScreen = ({ openMenu }: Props) => {
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('CCV20');

  const onSelectProduct = (value: string) => {
    setSelectedProduct(value);
    setFilterVisible(false);
  };

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
        <Text>Product Type: <Text style={styles.bold}>{selectedProduct}</Text></Text>
        <Text>Tenant Count: 4</Text>
      </View>

      {/* CARDS */}
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={() => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconCircle}>
                <CartImg width={18} height={18} />
              </View>

              <View>
                <Text style={styles.storeTitle}>Sample Store</Text>
                <Text style={styles.storeSub}>emea12</Text>
              </View>
            </View>

            <View style={styles.cardRow}>
              <Text>Storefront risk score</Text>
              <Text>10%</Text>
            </View>

            <View style={styles.cardRow}>
              <Text>Backoffice risk score</Text>
              <Text>65%</Text>
            </View>
          </View>
        )}
      />

      {/* FILTER MODAL */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        {/* BACKDROP */}
        <Pressable
          style={styles.backdrop}
          onPress={() => setFilterVisible(false)}
        />

        {/* POPUP */}
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

/* ---------- STYLES ---------- */
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
    alignItems: 'center',
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

  /* MODAL */
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
