import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

/* SVGs */
import SideMenuIcon from '../../assets/sidemenu.svg';
import SapLogo from '../../assets/logo_sap.svg';
import FilterIcon from '../../assets/dashboard_filter_img.svg';
import InfoIcon from '../../assets/metrics_info.svg';

type Props = {
  openMenu: () => void;
};

const PRODUCT_TYPES = ['C4C', 'SSP', 'CXAI', 'CCV20', 'SCV2', 'All'];

const MetricsScreen = ({ openMenu }: Props) => {
  const radius = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('CCV20');
  const [infoVisible, setInfoVisible] = useState(false);


  const onSelectProduct = (value: string) => {
    setSelectedProduct(value);
    setFilterVisible(false);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const overlayData = [
    { value: 5, color: '#E8892F', label: 'Service' },
    { value: 15, color: '#6EEB3B', label: 'Application' },
  ];

  let progress = 0;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={openMenu}>
          <SideMenuIcon width={26} height={26} />
        </TouchableOpacity>
        <SapLogo width={90} height={48} />
      </View>

      {/* TITLE ROW (METRICS + FILTER ICON) */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Metrics</Text>

        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <FilterIcon width={22} height={22} />
        </TouchableOpacity>
      </View>

      {/* PRODUCT TYPE ROW (INFO ICON HERE) */}
      <View style={styles.productRow}>
        <Text style={styles.productText}>
          Product Type: <Text style={styles.bold}>{selectedProduct}</Text>
        </Text>

        <TouchableOpacity onPress={() => setInfoVisible(true)}>
          <InfoIcon width={18} height={18} />
        </TouchableOpacity>

      </View>

      {/* DATE CARD */}
      <View style={styles.card}>
        <Text style={styles.date}>{getTodayDate()}</Text>
        <Text style={styles.sub}>Date</Text>

        <View style={styles.divider} />

        <View style={styles.rowBetween}>
          <Text style={styles.sub}>Current Observed Problems</Text>
          <Text style={styles.count}>0</Text>
        </View>
      </View>

      {/* DONUT CARD */}
      <View style={styles.card}>
        <Text style={styles.overview}>Overview</Text>
        <Text style={styles.sub}>Impact Type</Text>

        <View style={styles.chartContainer}>
          <Svg width={180} height={180}>
            {/* FULL BLUE BASE */}
            <Circle
              cx="90"
              cy="90"
              r={radius}
              stroke="#2F6FED"
              strokeWidth={strokeWidth}
              fill="none"
              rotation="-90"
              origin="90, 90"
            />

            {/* OVERLAYS */}
            {overlayData.map((item, index) => {
              const arcLength =
                (item.value / 100) * circumference;

              const strokeDasharray = `${arcLength} ${circumference}`;
              const strokeDashoffset =
                circumference - progress;

              progress += arcLength;

              return (
                <Circle
                  key={index}
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="none"
                  rotation="-90"
                  origin="90, 90"
                />
              );
            })}
          </Svg>
        </View>

        {/* LEGEND */}
        <View style={styles.legendRow}>
          {[
            { color: '#2F6FED', label: 'Infrastructure' },
            { color: '#E8892F', label: 'Service' },
            { color: '#6EEB3B', label: 'Application' },
          ].map(item => (
            <View key={item.label} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: item.color }]}
              />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* INFO TOOLTIP POPUP */}
      <Modal
        visible={infoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoVisible(false)}
      >
        {/* Close on outside tap */}
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setInfoVisible(false)}
        />

        {/* Tooltip */}
        <View style={styles.infoPopup}>
          <Text style={styles.infoText}>
            Statistics are calculated from the LIVE data
          </Text>
        </View>
      </Modal>


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

export default MetricsScreen;

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#F6F6F6',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 24,
  },
  titleRow: {
    marginTop: 24,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  productRow: {
    marginTop: 12,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productText: {
    fontSize: 14,
    color: '#374151',
  },
  bold: {
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    padding: 16,
    elevation: 3,
  },
  date: {
    fontSize: 18,
    fontWeight: '700',
  },
  sub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  count: {
    fontSize: 24,
    fontWeight: '700',
  },
  overview: {
    fontSize: 16,
    fontWeight: '700',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 13,
    color: '#374151',
  },


  infoPopup: {
    position: 'absolute',
    top: 130,       // aligns near Product Type info icon
    right: 16,
    maxWidth: 260,
    backgroundColor: '#8B8B8B',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
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
