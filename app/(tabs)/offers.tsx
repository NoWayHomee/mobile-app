/**
 * ============================================================================
 * TÊN FILE: app/(tabs)/offers.tsx
 * MỤC ĐÍCH: Màn hình Ưu đãi (Offers Screen).
 * CHỨC NĂNG CHÍNH:
 * - Có bộ lọc ngang dạng viên thuốc (Pill tabs) để lọc mã giảm giá.
 * - Render các thẻ `CouponCard` theo dạng vé đứt nét.
 * ============================================================================
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { CouponCard } from '../../components/CouponCard';

const mockCoupons = [
  { id: '1', discount: 'Giảm 20%', subtitle: 'Dành cho khách sạn 5 sao', expiry: '30/05/2026', type: 'hotel' },
  { id: '2', discount: 'Giảm 500k', subtitle: 'Chuyến bay khứ hồi nội địa', expiry: '15/06/2026', type: 'flight' },
  { id: '3', discount: 'Giảm 10%', subtitle: 'Khi đặt trước 30 ngày', expiry: '31/12/2026', type: 'all' },
  { id: '4', discount: 'Ưu đãi hè', subtitle: 'Phòng hướng biển giảm sốc', expiry: '31/08/2026', type: 'hotel' },
];

export default function OffersScreen() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredCoupons = mockCoupons.filter(coupon => 
    activeTab === 'all' ? true : coupon.type === activeTab || coupon.type === 'all'
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ưu đãi của bạn</Text>
      
      {/* Category Pills */}
      <View style={styles.pillContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: Spacing.sm }}>
          <TouchableOpacity 
            style={[styles.pill, activeTab === 'all' && styles.pillActive]} 
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.pillText, activeTab === 'all' && styles.pillTextActive]}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, activeTab === 'hotel' && styles.pillActive]} 
            onPress={() => setActiveTab('hotel')}
          >
            <Text style={[styles.pillText, activeTab === 'hotel' && styles.pillTextActive]}>Khách sạn</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.pill, activeTab === 'flight' && styles.pillActive]} 
            onPress={() => setActiveTab('flight')}
          >
            <Text style={[styles.pillText, activeTab === 'flight' && styles.pillTextActive]}>Chuyến bay</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Coupons List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredCoupons.map((coupon) => (
          <CouponCard 
            key={coupon.id}
            discount={coupon.discount}
            subtitle={coupon.subtitle}
            expiry={coupon.expiry}
            onSave={() => console.log('Saved coupon', coupon.id)}
          />
        ))}
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  title: { ...Typography.h1, textAlign: 'center', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginVertical: Spacing.md, color: Colors.primary },
  pillContainer: { marginBottom: Spacing.lg },
  pill: { paddingHorizontal: Spacing.lg, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.light.border, backgroundColor: 'white' },
  pillActive: { backgroundColor: Colors.secondary, borderColor: Colors.primary },
  pillText: { ...Typography.body2, color: Colors.light.textSecondary },
  pillTextActive: { color: Colors.primary, fontWeight: '700' },
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.xl },
});
