/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';

/* SVGs */
import SideMenuIcon from '../../assets/sidemenu.svg';
import SapLogo from '../../assets/logo_sap.svg';
import FilterIcon from '../../assets/dashboard_filter_img.svg';
import InfoIcon from '../../assets/metrics_info.svg';

/* API */
import {
  fetchDashboardData,
  fetchDashboardByProduct,
} from '../../api/marvinApi';

import { Tenant } from '../../models/DashboardModels';
import { ProductType, ProductTypeConfig } from '../../constants/ProductType';

type Props = {
  openMenu: () => void;
};

/* ================= DONUT CONSTANTS ================= */
const SIZE = 220;
const STROKE_WIDTH = 30;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CENTER = SIZE / 2;

/* COLORS (matches iOS) */
const COLORS = {
  INFRA: '#2F6FED',
  SERVICE: '#6BCB63',
  APPLICATION: '#F28200',
};

/* ================= ARC PATH ================= */
const calculateArc = (
  startAngle: number,
  endAngle: number,
  innerRadius: number,
  outerRadius: number,
) => {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;

  const x1 = CENTER + outerRadius * Math.cos(startRad);
  const y1 = CENTER + outerRadius * Math.sin(startRad);
  const x2 = CENTER + outerRadius * Math.cos(endRad);
  const y2 = CENTER + outerRadius * Math.sin(endRad);

  const x3 = CENTER + innerRadius * Math.cos(endRad);
  const y3 = CENTER + innerRadius * Math.sin(endRad);
  const x4 = CENTER + innerRadius * Math.cos(startRad);
  const y4 = CENTER + innerRadius * Math.sin(startRad);

  const largeArc = endRad - startRad > Math.PI ? 1 : 0;

  return `
    M ${x1} ${y1}
    A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
    L ${x3} ${y3}
    A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
    Z
  `;
};

const MetricsScreen = ({ openMenu }: Props) => {
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductType>(ProductType.ALL);

  const [tenants, setTenants] = useState<Tenant[]>([]);

  /* ================= LOAD DATA ================= */
  const loadMetrics = async (product: ProductType) => {
    setLoading(true);
    try {
      const json =
        product === ProductType.ALL
          ? await fetchDashboardData()
          : await fetchDashboardByProduct(product);

      const flat: Tenant[] =
        json?.responseBody?.flatMap(p => p.responseBody) ?? [];

      setTenants(flat);
    } catch {
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics(selectedProduct);
  }, []);

  /* ================= METRICS LOGIC ================= */
  const metrics = useMemo(() => {
    let infra = 0;
    let service = 0;
    let app = 0;
    let total = 0;

    tenants.forEach(t => {
      t.brief?.forEach(b => {
        total++;
        switch (b.impactLevel?.toUpperCase()) {
          case 'INFRASTRUCTURE':
            infra++;
            break;
          case 'SERVICES':
            service++;
            break;
          case 'APPLICATION':
            app++;
            break;
        }
      });
    });

    return { infra, service, app, total };
  }, [tenants]);

  /* ================= CHART DATA ================= */
  const chartData = [
    { label: 'Infrastructure', value: metrics.infra, color: COLORS.INFRA },
    { label: 'Service', value: metrics.service, color: COLORS.SERVICE },
    { label: 'Application', value: metrics.app, color: COLORS.APPLICATION },
  ];

  const segments = chartData.filter(i => i.value > 0);

  /* ================= ANGLES ================= */
  let currentAngle = -90;
  const angles = segments.map(item => {
    const angle = (item.value / metrics.total) * 360;
    const start = currentAngle;
    const end = currentAngle + angle;
    currentAngle = end;
    return { start, end };
  });

  /* ================= RENDER ================= */
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={openMenu}>
          <SideMenuIcon width={26} height={26} />
        </TouchableOpacity>
        <SapLogo width={90} height={48} />
        <Text>Hello, User</Text>
      </View>

      {/* TITLE */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>Metrics</Text>
        <TouchableOpacity onPress={() => setFilterVisible(true)}>
          <FilterIcon width={22} height={22} />
        </TouchableOpacity>
      </View>

      {/* PRODUCT */}
      <View style={styles.productRow}>
        <Text style={styles.productText}>
          Product Type:{' '}
          <Text style={styles.bold}>
            {ProductTypeConfig[selectedProduct].displayName}
          </Text>
        </Text>
        <TouchableOpacity onPress={() => setInfoVisible(true)}>
          <InfoIcon width={18} height={18} />
        </TouchableOpacity>
      </View>

      {/* DATE CARD */}
      <View style={styles.card}>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
        <Text style={styles.sub}>Date</Text>

        <View style={styles.divider} />

        <View style={styles.rowBetween}>
          <Text style={styles.sub}>Current Observed Problems</Text>
          <Text style={styles.count}>{metrics.total}</Text>
        </View>
      </View>

      {/* DONUT CARD */}
      <View style={styles.card}>
        <Text style={styles.sub}>Impact Type</Text>
        <Text style={styles.overview}>Overview</Text>

        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.chartWrapper}>
            <Svg width={SIZE} height={SIZE}>
              {/* GREY BASE */}
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                stroke="#E5E7EB"
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />

              {/* SEGMENTS + NUMBERS */}
{segments.map((item, index) => {
  const { start, end } = angles[index];
  const midAngle = (start + end) / 2;
  const rad = (midAngle * Math.PI) / 180;

  // ✅ EXACT CENTER OF COLOR BAND
  const labelRadius = RADIUS;

  const labelX = CENTER + labelRadius * Math.cos(rad);
  const labelY = CENTER + labelRadius * Math.sin(rad);

  return (
    <React.Fragment key={item.label}>
      <Path
        d={calculateArc(
          start,
          end,
          RADIUS - STROKE_WIDTH / 2,
          RADIUS + STROKE_WIDTH / 2,
        )}
        fill={item.color}
      />

      <SvgText
        x={labelX}
        y={labelY + 5}
        fontSize="16"
        fontWeight="700"
        fill="#FFFFFF"
        textAnchor="middle"
      >
        {item.value}
      </SvgText>
    </React.Fragment>
  );
})}


              {/* CENTER HOLE */}
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS - STROKE_WIDTH}
                fill="#FFFFFF"
              />
            </Svg>
          </View>
        )}

        {/* LEGEND */}
        <View style={styles.legendRow}>
          {chartData.map(item => (
            <View key={item.label} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: item.color },
                ]}
              />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* INFO */}
      <Modal visible={infoVisible} transparent animationType="fade">
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setInfoVisible(false)}
        />
        <View style={styles.infoPopup}>
          <Text style={styles.infoText}>
            Statistics are calculated from the LIVE data
          </Text>
        </View>
      </Modal>

      {/* FILTER */}
      <Modal visible={filterVisible} transparent animationType="fade">
        <Pressable
          style={styles.backdrop}
          onPress={() => setFilterVisible(false)}
        />
        <View style={styles.filterPopup}>
          {Object.values(ProductType).map(p => (
            <TouchableOpacity
              key={p}
              style={styles.filterItem}
              onPress={() => {
                setSelectedProduct(p);
                setFilterVisible(false);
                loadMetrics(p);
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  p === selectedProduct && styles.selectedText,
                ]}
              >
                {ProductTypeConfig[p].displayName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

export default MetricsScreen;

/* ================= STYLES ================= */
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
    justifyContent: 'space-between',
  },
  titleRow: {
    marginTop: 24,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    borderRadius: 18,
    padding: 20,
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
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 16,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
    color: '#374151',
  },
  infoPopup: {
    position: 'absolute',
    top: 130,
    right: 16,
    backgroundColor: '#8B8B8B',
    padding: 12,
    borderRadius: 10,
  },
  infoText: {
    color: '#FFFFFF',
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
