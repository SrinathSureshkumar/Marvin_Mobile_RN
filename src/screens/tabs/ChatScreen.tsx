import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  Linking,
  FlatList,
} from 'react-native';

/* API */
import { fetchCatchpointStackMap } from '../../api/marvinApi';
import { CatchpointStackMapItem } from '../../models/CatchpointStackMapModels';

/* SVGs */
import SideMenuIcon from '../../assets/sidemenu.svg';
import SapLogo from '../../assets/logo_sap.svg';
import MoreIcon from '../../assets/more.svg';
import SearchIcon from '../../assets/search_icon.svg';

type Props = {
  openMenu: () => void;
};

/* 🔗 GLOBAL STACK MAPS URL */
let STACK_MAPS_URL = 'https://catchpoint.com/stack-maps';

const ChatScreen = ({ openMenu }: Props) => {
  const [searchText, setSearchText] = useState('');
  const [expandedTenant, setExpandedTenant] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CatchpointStackMapItem[]>([]);

  useEffect(() => {
    loadStackMaps();
  }, []);

  const loadStackMaps = async () => {
    try {
      setLoading(true);
      const json = await fetchCatchpointStackMap();
      setItems(json.responseBody ?? []);
    } catch (e) {
      console.log('❌ StackMap load failed', e);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.displayName.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }: { item: CatchpointStackMapItem }) => {
    const expanded = expandedTenant === item.tenant;
    STACK_MAPS_URL = item.dashboardLink;

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: item.imageBase64 }}
          style={styles.stackImage}
          resizeMode="stretch"
        />

        <View style={styles.cardFooter}>
          <View style={styles.companyRow}>
            <Text style={styles.companyName}>{item.displayName}</Text>

            <TouchableOpacity
              onPress={() =>
                setExpandedTenant(expanded ? null : item.tenant)
              }
            >
              <MoreIcon width={20} height={20} />
            </TouchableOpacity>
          </View>

          {expanded && (
            <View style={styles.metaContainer}>
              <Text style={styles.metaText}>Tenant: {item.tenant}</Text>
              <Text style={styles.metaText}>
                Last updated: {item.lastUpdateUTC}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => Linking.openURL(item.dashboardLink)}
          >
            <Text style={styles.buttonText}>View live stack map</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔒 FIXED HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={openMenu}>
          <SideMenuIcon width={28} height={28} />
        </TouchableOpacity>
        <SapLogo width={90} height={48} />
        <Text style={styles.userText}>Hello, User</Text>
      </View>

      <View style={styles.divider} />

      {/* 🔒 FIXED TITLE + LINK */}
      <View style={styles.titleAndLink}>
        <Text style={styles.title}>Catchpoint</Text>

        <TouchableOpacity onPress={() => Linking.openURL(STACK_MAPS_URL)}>
          <Text style={styles.link}>Visit available stack maps</Text>
        </TouchableOpacity>
      </View>

      {/* 🔒 FIXED SEARCH */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <SearchIcon width={18} height={18} />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* 📜 ONLY CARDS SCROLL */}
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.tenant}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default ChatScreen;

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#F5F6F8',
  },

  userText: {
    fontSize: 14,
    fontWeight: '500',
  },

  titleAndLink: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  link: {
    color: '#0070F2',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },

  searchWrapper: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#89919A',
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
  
    /* ANDROID */
    elevation: 8,
  
    /* IOS */
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  

  stackImage: {
    width: '100%',
    height: 140,
    marginBottom: 16,
  },

  cardFooter: {
    alignItems: 'flex-start',
  },

  companyRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  companyName: {
    fontSize: 18,
    fontWeight: '600',
  },

  metaContainer: {
    marginBottom: 12,
  },

  metaText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },

  cardButton: {
    backgroundColor: '#2F6DF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#c2c2c2',
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
