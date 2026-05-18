/**
 * ============================================================================
 * TÊN FILE: app/(tabs)/trips.tsx
 * MỤC ĐÍCH: Màn hình Quản lý Chuyến đi (Trips Screen).
 * CHỨC NĂNG CHÍNH:
 * - Hiển thị chuyến đi Sắp tới và Đã qua.
 * - Nút "Đánh giá chuyến đi" chuyển hướng vào Modal review `app/review/[id].tsx`.
 * ============================================================================
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { useRouter } from 'expo-router';

export default function TripsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');

  const tabs = [
    { id: 'upcoming', label: 'Sắp đi' },
    { id: 'past', label: 'Đã qua' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];

  const trips = [
    { id: '1', name: 'Amanoi Resort Vinh Hy', date: '12 - 15 Thg 11, 2023', status: 'ĐÃ XÁC NHẬN', statusColor: Colors.secondary },
    { id: '2', name: 'Topas Ecolodge', date: '05 - 08 Thg 12, 2023', status: 'CHỜ THANH TOÁN', statusColor: '#E0E0E0' },
    { id: '3', name: 'Six Senses Ninh Van Bay', date: '22 - 26 Thg 12, 2023', status: 'ĐÃ XÁC NHẬN', statusColor: Colors.secondary },
  ];

  const pastTrips = [
    { id: '101', name: 'The Azure Cliffside Retreat', date: '10 - 12 Thg 08, 2023', status: 'HOÀN TẤT', statusColor: '#E0E0FF' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chuyến đi của tôi</Text>
      
      {/* Top Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab.id} 
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={activeTab === 'upcoming' ? trips : activeTab === 'past' ? pastTrips : []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardImage} />
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <View style={styles.cardInfo}>
                <Text style={styles.hotelName}>{item.name}</Text>
                <Text style={styles.date}>{item.date}</Text>
                <View style={[styles.badge, { backgroundColor: item.statusColor }]}>
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              </View>
              {activeTab === 'past' && (
                <TouchableOpacity 
                  style={styles.reviewBtn}
                  onPress={() => router.push(`/review/${item.id}` as any)}
                >
                  <Text style={styles.reviewBtnText}>Đánh giá chuyến đi</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có chuyến đi nào trong danh sách này.</Text>
        }
        ListFooterComponent={
          activeTab === 'upcoming' ? <Text style={styles.footerText}>Bạn đã xem hết danh sách chuyến đi sắp tới.</Text> : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  title: { ...Typography.h1, textAlign: 'center', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginVertical: Spacing.md },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.light.border, marginHorizontal: Spacing.lg, marginBottom: Spacing.lg },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  tabText: { ...Typography.body1, color: Colors.light.textSecondary },
  activeTabText: { color: Colors.primary, fontWeight: '700' },
  listContent: { paddingHorizontal: Spacing.lg },
  card: { flexDirection: 'row', backgroundColor: 'white', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.md, ...Shadows.sm, borderWidth: 1, borderColor: '#F0F0F0' },
  cardImage: { width: 80, height: 80, borderRadius: BorderRadius.md, backgroundColor: Colors.primary },
  cardInfo: { flex: 1, marginLeft: Spacing.md, justifyContent: 'center' },
  hotelName: { ...Typography.h3, color: Colors.light.text, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  date: { ...Typography.body2, color: Colors.light.textSecondary, marginVertical: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.pill },
  badgeText: { fontSize: 10, fontWeight: '700', color: Colors.primary },
  emptyText: { textAlign: 'center', marginTop: 40, color: Colors.light.textSecondary },
  footerText: { textAlign: 'center', color: Colors.light.textSecondary, marginTop: Spacing.xl, marginBottom: Spacing.xxl },
  reviewBtn: { marginTop: Spacing.md, paddingVertical: 8, borderWidth: 1, borderColor: Colors.primary, borderRadius: BorderRadius.md, alignItems: 'center' },
  reviewBtnText: { ...Typography.button, color: Colors.primary, fontSize: 12 },
});
