/**
 * ============================================================================
 * TÊN FILE: app/(tabs)/search.tsx
 * MỤC ĐÍCH: Màn hình Kết quả Tìm kiếm.
 * CHỨC NĂNG CHÍNH:
 * - Render kết quả tìm kiếm khách sạn (Mock data).
 * - Hiển thị Tóm tắt tìm kiếm ở trên cùng (có thể nhấn vào để mở lại `searchModal`).
 * ============================================================================
 */
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { PropertyCard, Property } from '../../components/PropertyCard';
import { useSearchStore } from '../../store/useSearchStore';

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Vinpearl Resort & Spa',
    location: 'Bãi Cháy, Hạ Long',
    price: 250,
    rating: 4.9,
    reviews: 120,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
  },
  {
    id: '2',
    title: 'Wyndham Legend',
    location: 'Hòn Gai, Hạ Long',
    price: 180,
    rating: 4.7,
    reviews: 85,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-c6a4d14b8fc9',
  },
  {
    id: '3',
    title: 'FLC Grand Hotel',
    location: 'Cao Xanh, Hạ Long',
    price: 210,
    rating: 4.8,
    reviews: 92,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
  },
];

export default function SearchResultsScreen() {
  const router = useRouter();
  const { location, checkInDate, checkOutDate, guests } = useSearchStore();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.logo}>NoWayHome</Text>
        <View style={styles.avatar} />
      </View>

      {/* Search Summary */}
      <View style={styles.searchSummaryContainer}>
        <TouchableOpacity style={styles.searchSummary} activeOpacity={0.8} onPress={() => router.push('/searchModal' as any)}>
          <View style={styles.searchIconBg}>
            <Ionicons name="search" size={20} color={Colors.primary} />
          </View>
          <View style={styles.searchTexts}>
            <Text style={styles.searchDest}>{location}</Text>
            <Text style={styles.searchDetails}>{checkInDate} - {checkOutDate} • {guests.adults + guests.children} guests</Text>
          </View>
          <Ionicons name="pencil" size={20} color={Colors.light.textSecondary} />
        </TouchableOpacity>

        {/* Filters */}
        <View style={styles.filtersScroll}>
          <TouchableOpacity style={[styles.filterChip, { borderColor: Colors.light.border }]}>
            <Ionicons name="options-outline" size={16} color={Colors.light.text} />
            <Text style={styles.filterText}>Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Price</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Star Rating</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.filtersScroll, { marginTop: Spacing.sm }]}>
          <TouchableOpacity style={[styles.filterChip, { backgroundColor: Colors.secondary, borderColor: Colors.secondary }]}>
            <Ionicons name="water-outline" size={16} color={Colors.primary} />
            <Text style={[styles.filterText, {color: Colors.primary}]}>Pool</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Ionicons name="wifi-outline" size={16} color={Colors.light.text} />
            <Text style={styles.filterText}>WiFi</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={mockProperties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <Text style={styles.listTitle}>Available Retreats</Text>
        )}
        renderItem={({ item }) => (
          <PropertyCard 
            property={item} 
            onPress={() => router.push(`/room/${item.id}` as any)} 
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
  logo: { ...Typography.h2, color: Colors.primary, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#D9D9D9' },
  searchSummaryContainer: { paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  searchSummary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', padding: Spacing.sm, borderRadius: BorderRadius.md, marginBottom: Spacing.md },
  searchIconBg: { backgroundColor: '#E0E0FF', padding: 8, borderRadius: 20 },
  searchTexts: { flex: 1, marginLeft: Spacing.sm },
  searchDest: { ...Typography.body1, fontWeight: '600' },
  searchDetails: { ...Typography.caption, color: Colors.light.textSecondary },
  filtersScroll: { flexDirection: 'row', gap: Spacing.sm },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: BorderRadius.pill, borderWidth: 1, borderColor: Colors.light.border, backgroundColor: 'white' },
  filterText: { marginLeft: 4, ...Typography.caption, fontWeight: '600' },
  listContent: { padding: Spacing.md, paddingTop: 0 },
  listTitle: { ...Typography.h2, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: Spacing.md },
});
