/**
 * ============================================================================
 * TÊN FILE: app/(tabs)/index.tsx
 * MỤC ĐÍCH: Màn hình Trang Chủ (Home Screen).
 * CHỨC NĂNG CHÍNH:
 * - Hiển thị lời chào.
 * - Thanh tìm kiếm giả (nút bấm để gọi Modal Tìm Kiếm `searchModal.tsx`).
 * - Hiển thị danh mục địa điểm, khách sạn nổi bật.
 * ============================================================================
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { useSearchStore } from '../../store/useSearchStore';

export default function HomeScreen() {
  const router = useRouter();
  const { location, checkInDate, checkOutDate, guests } = useSearchStore();

  const handleSearchClick = () => {
    router.push('/searchModal' as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Top Dark Section */}
        <View style={styles.topSection}>
          <SafeAreaView edges={['top']}>
            <View style={styles.header}>
              <Ionicons name="menu" size={28} color="white" />
              <Text style={styles.logo}>NoWayHome</Text>
              <View style={styles.headerRight}>
                <Ionicons name="notifications-outline" size={24} color={Colors.primary} style={styles.bellBg} />
                <View style={styles.avatar} />
              </View>
            </View>
            <Text style={styles.heroText}>Chạm đến bình yên, khám phá những điều kỳ diệu.</Text>

            {/* Search Box */}
            <TouchableOpacity style={styles.searchBox} onPress={handleSearchClick} activeOpacity={0.9}>
              <View style={styles.searchRow}>
                <Ionicons name="location-outline" size={20} color={Colors.light.icon} />
                <View style={styles.searchInputContainer}>
                  <Text style={styles.searchLabel}>ĐIỂM ĐẾN</Text>
                  <Text style={styles.searchValue}>{location}</Text>
                </View>
              </View>
              <View style={styles.searchDivider} />
              <View style={styles.searchRow}>
                <Ionicons name="calendar-outline" size={20} color={Colors.light.icon} />
                <View style={styles.searchInputContainer}>
                  <Text style={styles.searchLabel}>NGÀY ĐI - NGÀY VỀ</Text>
                  <Text style={styles.searchValue}>{checkInDate} - {checkOutDate}</Text>
                </View>
              </View>
              <View style={styles.searchDivider} />
              <View style={styles.searchRow}>
                <Ionicons name="people-outline" size={20} color={Colors.light.icon} />
                <View style={styles.searchInputContainer}>
                  <Text style={styles.searchLabel}>KHÁCH</Text>
                  <Text style={styles.searchValue}>{guests.adults + guests.children} khách, {guests.rooms} phòng</Text>
                </View>
              </View>
              <View style={styles.searchButton}>
                <Ionicons name="search" size={20} color="white" />
                <Text style={styles.searchButtonText}>Tìm kiếm</Text>
              </View>
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
          <TouchableOpacity style={[styles.categoryBtn, styles.categoryActive]}>
            <Ionicons name="bed" size={16} color="white" />
            <Text style={[styles.categoryText, { color: 'white' }]}>Khách sạn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryBtn}>
            <Ionicons name="airplane" size={16} color={Colors.light.text} />
            <Text style={styles.categoryText}>Vé máy bay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryBtn}>
            <Ionicons name="car" size={16} color={Colors.light.text} />
            <Text style={styles.categoryText}>Phương tiện di chuyển</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Promos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chương trình khuyến mại chỗ ở</Text>
            <TouchableOpacity><Text style={styles.seeAll}>Xem tất cả &rarr;</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.md }}>
            <View style={styles.promoCard}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4' }} style={styles.promoImg} contentFit="cover" />
              <View style={styles.promoOverlay}>
                <View style={styles.promoBadge}><Text style={styles.promoBadgeText}>ƯU ĐÃI MÙA HÈ</Text></View>
                <Text style={styles.promoTitle}>Giảm 30% cho Resort ven biển</Text>
                <Text style={styles.promoSubtitle}>Tận hưởng không gian nghỉ dưỡng đẳng cấp với mức giá ưu đãi.</Text>
              </View>
            </View>
            <View style={styles.promoCard}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1551882547-ff40c0d1398c' }} style={styles.promoImg} contentFit="cover" />
              <View style={styles.promoOverlay}>
                <View style={styles.promoBadge}><Text style={styles.promoBadgeText}>FLASH SALE</Text></View>
                <Text style={styles.promoTitle}>Đêm cuối tuần giá sốc</Text>
                <Text style={styles.promoSubtitle}>Đặt phòng phút chót tại các khách sạn trung tâm.</Text>
              </View>
            </View>
          </ScrollView>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  topSection: { backgroundColor: '#000', paddingBottom: 80 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
  logo: { ...Typography.h2, color: 'white', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  bellBg: { backgroundColor: 'white', borderRadius: 20, padding: 4, overflow: 'hidden' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#D9D9D9' },
  heroText: { ...Typography.h1, color: 'white', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', paddingHorizontal: Spacing.lg, marginVertical: Spacing.lg, textAlign: 'center' },
  searchBox: { backgroundColor: 'white', marginHorizontal: Spacing.lg, borderRadius: BorderRadius.lg, padding: Spacing.md, ...Shadows.lg, marginTop: Spacing.sm, marginBottom: -100 },
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  searchInputContainer: { marginLeft: Spacing.sm, flex: 1 },
  searchLabel: { ...Typography.caption, color: Colors.light.textSecondary, fontWeight: '700' },
  searchValue: { ...Typography.body1, color: Colors.light.text, marginTop: 4 },
  searchDivider: { height: 1, backgroundColor: Colors.light.border, marginVertical: Spacing.xs },
  searchButton: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Spacing.md, borderRadius: BorderRadius.md, marginTop: Spacing.md },
  searchButtonText: { ...Typography.button, color: 'white', marginLeft: Spacing.sm },
  categories: { padding: Spacing.md, gap: Spacing.sm, marginTop: 60 },
  categoryBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.pill, borderWidth: 1, borderColor: Colors.light.border, backgroundColor: 'white' },
  categoryActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryText: { marginLeft: Spacing.sm, ...Typography.body2 },
  section: { marginVertical: Spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: Spacing.md, marginBottom: Spacing.md },
  sectionTitle: { ...Typography.h1, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', flex: 1 },
  seeAll: { ...Typography.body2, color: Colors.primary, fontWeight: '600' },
  promoCard: { width: 320, height: 220, borderRadius: BorderRadius.lg, overflow: 'hidden', marginRight: Spacing.md },
  promoImg: { width: '100%', height: '100%' },
  promoOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', padding: Spacing.md, justifyContent: 'flex-end' },
  promoBadge: { backgroundColor: 'white', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: Spacing.sm },
  promoBadgeText: { fontSize: 10, fontWeight: 'bold', color: Colors.primary },
  promoTitle: { ...Typography.h3, color: 'white', marginBottom: 4 },
  promoSubtitle: { ...Typography.caption, color: 'white', opacity: 0.9 },
});
