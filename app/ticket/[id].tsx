import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { Image } from 'expo-image';

export default function TicketScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>E-Voucher</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.scanText}>QUÉT TẠI QUẦY LỄ TÂN</Text>
          <View style={styles.qrContainer}>
            {/* Placeholder for QR Code */}
            <Image source={{uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=NWH-7829A'}} style={styles.qrCode} />
          </View>
          <Text style={styles.codeText}>Mã: NWH-7829A</Text>

          {/* Ticket Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.notchRight} />
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>TÊN KHÁCH</Text>
              <Text style={styles.infoValue}>Nguyễn Văn A</Text>
            </View>
            <View style={styles.solidDivider} />

            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>LOẠI PHÒNG</Text>
              <Text style={styles.infoValue}>Phòng Standard - Hướng Vườn</Text>
            </View>
            <View style={styles.solidDivider} />

            <View style={styles.datesRow}>
              <View style={styles.dateCol}>
                <Text style={styles.infoLabel}>NHẬN PHÒNG</Text>
                <Text style={styles.infoValue}>14:00</Text>
                <Text style={styles.infoSubValue}>15/10/2023</Text>
              </View>
              <View style={styles.dateCol}>
                <Text style={styles.infoLabel}>TRẢ PHÒNG</Text>
                <Text style={styles.infoValue}>12:00</Text>
                <Text style={styles.infoSubValue}>17/10/2023</Text>
              </View>
            </View>
            <View style={styles.solidDivider} />

            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>ĐỊA CHỈ CHỖ NGHỈ</Text>
              <Text style={styles.infoValue}>NoWayHome Boutique Resort</Text>
              <Text style={styles.infoAddress}>123 Đường Bờ Biển, Phường X,{'\n'}Thành phố Y, Việt Nam</Text>
            </View>

            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="headset-outline" size={20} color="white" style={{marginRight: 8}} />
              <Text style={styles.contactButtonText}>Liên hệ chỗ nghỉ</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footerText}>Vui lòng xuất trình mã này khi đến.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
  headerTitle: { ...Typography.h3, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  content: { padding: Spacing.lg },
  card: { backgroundColor: 'white', borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.light.border, ...Shadows.sm },
  scanText: { ...Typography.body1, textAlign: 'center', color: Colors.light.textSecondary, letterSpacing: 1, marginTop: Spacing.xl },
  qrContainer: { alignSelf: 'center', backgroundColor: '#F0F0F0', padding: Spacing.lg, borderRadius: BorderRadius.md, marginVertical: Spacing.md },
  qrCode: { width: 120, height: 120 },
  codeText: { ...Typography.body2, textAlign: 'center', color: Colors.light.textSecondary, marginBottom: Spacing.xl },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', height: 20 },
  notchLeft: { width: 10, height: 20, borderTopRightRadius: 10, borderBottomRightRadius: 10, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: Colors.light.border, borderLeftWidth: 0 },
  notchRight: { width: 10, height: 20, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, backgroundColor: '#FAFAFA', borderWidth: 1, borderColor: Colors.light.border, borderRightWidth: 0 },
  dashedLine: { flex: 1, height: 1, borderWidth: 1, borderColor: Colors.light.border, borderStyle: 'dashed', borderRadius: 1 },
  infoSection: { padding: Spacing.xl },
  infoBlock: { marginBottom: Spacing.md },
  infoLabel: { ...Typography.caption, color: Colors.light.textSecondary, marginBottom: 4 },
  infoValue: { ...Typography.body1, color: Colors.light.text },
  infoSubValue: { ...Typography.body2, color: Colors.light.textSecondary, marginTop: 2 },
  infoAddress: { ...Typography.body2, color: Colors.light.text, marginTop: 4, lineHeight: 20 },
  solidDivider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: Spacing.md },
  datesRow: { flexDirection: 'row', marginBottom: Spacing.md },
  dateCol: { flex: 1 },
  contactButton: { backgroundColor: Colors.primary, flexDirection: 'row', padding: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.lg },
  contactButtonText: { ...Typography.button, color: 'white' },
  footerText: { ...Typography.body2, color: Colors.light.textSecondary, textAlign: 'center', marginTop: Spacing.xl },
});
