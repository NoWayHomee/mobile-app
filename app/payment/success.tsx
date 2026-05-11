import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

export default function PaymentSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hoàn tất</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark" size={60} color="white" />
        </View>

        <Text style={styles.title}>Đặt phòng thành công!</Text>
        <Text style={styles.bookingCode}>Mã đặt phòng: #NWH-9928</Text>
        <Text style={styles.description}>
          Chúng tôi đã gửi email xác nhận{'\n'}cùng vé điện tử đến địa chỉ email{'\n'}của bạn. Cảm ơn bạn đã lựa{'\n'}chọn NoWayHome.
        </Text>

        <View style={styles.card}>
          <View style={styles.roomInfoRow}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1542314831-c6a4d14b8fc9' }} style={styles.roomImage} />
            <View style={styles.roomTexts}>
              <Text style={styles.roomTitle}>Aman Tokyo –{'\n'}Deluxe Room</Text>
              <Text style={styles.roomLocation}><Ionicons name="location-outline" size={14} /> Tokyo, Japan</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.datesRow}>
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>NHẬN PHÒNG</Text>
              <Text style={styles.dateValue}>12/10/2023</Text>
              <Text style={styles.timeValue}>14:00</Text>
            </View>
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>TRẢ PHÒNG</Text>
              <Text style={styles.dateValue}>15/10/2023</Text>
              <Text style={styles.timeValue}>12:00</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng tiền</Text>
            <Text style={styles.totalValue}>12,500,000 đ</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/ticket/NWH-9928' as any)}>
          <Ionicons name="receipt-outline" size={20} color="white" style={{marginRight: 8}} />
          <Text style={styles.primaryButtonText}>Xem vé điện tử</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/(tabs)' as any)}>
          <Ionicons name="home-outline" size={20} color={Colors.primary} style={{marginRight: 8}} />
          <Text style={styles.secondaryButtonText}>Về trang chủ</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
  headerTitle: { ...Typography.body1, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  content: { padding: Spacing.xl, alignItems: 'center' },
  iconContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#2E7D32', justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl },
  title: { ...Typography.h2, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: Colors.light.text, marginBottom: Spacing.sm },
  bookingCode: { ...Typography.body1, color: Colors.light.text, marginBottom: Spacing.md },
  description: { ...Typography.body1, color: Colors.light.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: Spacing.xl },
  card: { width: '100%', backgroundColor: 'white', borderRadius: BorderRadius.lg, padding: Spacing.lg, ...Shadows.sm, borderWidth: 1, borderColor: Colors.light.border, marginBottom: Spacing.xl },
  roomInfoRow: { flexDirection: 'row' },
  roomImage: { width: 60, height: 80, borderRadius: BorderRadius.sm },
  roomTexts: { flex: 1, marginLeft: Spacing.md, justifyContent: 'center' },
  roomTitle: { ...Typography.h3, color: Colors.light.text, marginBottom: 4 },
  roomLocation: { ...Typography.body2, color: Colors.light.textSecondary },
  divider: { height: 1, backgroundColor: Colors.light.border, marginVertical: Spacing.md },
  datesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dateCol: { flex: 1 },
  dateLabel: { ...Typography.caption, color: Colors.light.textSecondary, marginBottom: 4 },
  dateValue: { ...Typography.body1, fontWeight: '700', color: Colors.light.text, marginBottom: 2 },
  timeValue: { ...Typography.body2, color: Colors.light.textSecondary },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { ...Typography.body1, color: Colors.light.textSecondary },
  totalValue: { ...Typography.h3, color: Colors.primary },
  primaryButton: { width: '100%', backgroundColor: Colors.primary, flexDirection: 'row', padding: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  primaryButtonText: { ...Typography.button, color: 'white' },
  secondaryButton: { width: '100%', backgroundColor: 'white', flexDirection: 'row', padding: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary },
  secondaryButtonText: { ...Typography.button, color: Colors.primary },
});
