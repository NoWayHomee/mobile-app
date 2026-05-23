/**
 * ============================================================================
 * TÊN FILE: app/payment/index.tsx
 * MỤC ĐÍCH: Màn hình Xác nhận và Thanh toán (Checkout Screen).
 * CHỨC NĂNG CHÍNH:
 * - Hiển thị thông tin phòng đã chọn (ảnh, tên, ngày, số khách, tiện ích).
 * - Form nhập thông tin liên hệ (react-hook-form + Zod validation).
 * - Yêu cầu đặc biệt & Dịch vụ thêm (checkboxes).
 * - Phương thức thanh toán dạng Accordion (Thẻ tín dụng / Ví điện tử / CK).
 * - Hàm tự động tính giá (BasePrice + Fees - Discount = FinalTotal).
 * - Overlay "Thanh toán thành công" khi hoàn tất.
 * ============================================================================
 */
import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  Platform, Alert, ActivityIndicator, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { useSearchStore } from '../../store/useSearchStore';

// Hàm format ngày từ "2026-04-25" thành "25/04/2026"
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '--';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

// Hàm tính số đêm giữa 2 ngày
const calcNights = (checkIn: string, checkOut: string): number => {
  if (!checkIn || !checkOut) return 1;
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  const nights = Math.round(diff / msPerDay);
  return nights > 0 ? nights : 1;
};

// ============================================================================
// 1. ZOD VALIDATION SCHEMA
// ============================================================================
const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ và tên'),
  phone: z.string().min(9, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  // Trường thẻ tín dụng (chỉ validate khi chọn phương thức credit_card)
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

// ============================================================================
// 2. DỮ LIỆU GIẢ LẬP (MOCK DATA)
// ============================================================================
const MOCK_ROOM = {
  hotelName: 'The Azure Retreat',
  roomType: 'Deluxe Ocean View',
  imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739',
  pricePerNight: 200,
  amenities: ['Pool', 'Kitchen', 'WiFi', 'Bathtub'],
};

// Danh sách yêu cầu đặc biệt
const SPECIAL_REQUESTS = [
  'Phòng trên tầng cao',
  'Phòng yên tĩnh',
  'Gần/Xa thang máy',
  'Thuê xe máy/ô tô',
  'Gửi hành lý trước',
  'Đón sân bay',
];

// ============================================================================
// 3. COMPONENT CHÍNH
// ============================================================================
export default function PaymentScreen() {
  const router = useRouter();

  // --- Lấy dữ liệu ngày & khách từ Zustand Store ---
  const { checkInDate, checkOutDate, guests } = useSearchStore();
  const numberOfNights = calcNights(checkInDate, checkOutDate);
  const numberOfRooms = guests.rooms;
  const numberOfGuests = guests.adults + guests.children;

  // --- State quản lý giao diện ---
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit_card');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  // --- Cấu hình react-hook-form ---
  const { control, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fullName: '', phone: '', email: '', cardNumber: '', cardExpiry: '', cardCvv: '' },
  });

  // ============================================================================
  // 4. HÀM TÍNH GIÁ TỰ ĐỘNG
  // ============================================================================
  const priceDetails = useMemo(() => {
    // Tính giá dựa trên số phòng và số đêm THẬT từ Store
    const basePrice = numberOfRooms * numberOfNights * MOCK_ROOM.pricePerNight;
    const serviceFee = Math.round(basePrice * 0.10);   // Phí dịch vụ 10%
    const tax = Math.round(basePrice * 0.05);           // Thuế 5%
    const totalFees = serviceFee + tax;
    const additionalServices = 0; // Tất cả yêu cầu đặc biệt đều là dịch vụ không tính phí
    const discount = 50; // Giá trị voucher giảm giá cố định (mock)
    const finalTotal = basePrice + totalFees + additionalServices - discount;

    return { basePrice, serviceFee, tax, totalFees, additionalServices, discount, finalTotal };
  }, [selectedRequests, numberOfNights, numberOfRooms]);

  // ============================================================================
  // 5. HÀM XỬ LÝ KHI BẤM "XÁC NHẬN THANH TOÁN"
  // ============================================================================
  const onSubmit = async (data: CheckoutForm) => {
    // Validate thêm cho thẻ tín dụng
    if (selectedPaymentMethod === 'credit_card') {
      if (!data.cardNumber || data.cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ số thẻ (16 chữ số).');
        return;
      }
      if (!data.cardCvv || data.cardCvv.length < 3) {
        Alert.alert('Lỗi', 'Vui lòng nhập mã CVV (3 chữ số).');
        return;
      }
    }

    setIsLoading(true);
    try {
      // Giả lập gọi API thanh toán (chờ 2 giây)
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Hiện Overlay thành công rồi chuyển sang trang Success
      setIsPaymentSuccess(true);
      // Sau 1.5 giây hiển thị overlay, tự động chuyển sang trang success.tsx
      setTimeout(() => {
        setIsPaymentSuccess(false);
        router.push('/payment/success' as any);
      }, 1500);
    } catch (error) {
      Alert.alert('Lỗi thanh toán', 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Hàm toggle checkbox ---
  const toggleRequest = (item: string) => {
    setSelectedRequests(prev =>
      prev.includes(item) ? prev.filter(r => r !== item) : [...prev, item]
    );
  };

  // Hàm hiển thị lỗi khi form chưa điền đủ thông tin bắt buộc
  const onFormError = (formErrors: any) => {
    const messages: string[] = [];
    if (formErrors.fullName) messages.push('• ' + formErrors.fullName.message);
    if (formErrors.phone) messages.push('• ' + formErrors.phone.message);
    if (formErrors.email) messages.push('• ' + formErrors.email.message);
    Alert.alert('Vui lòng điền đầy đủ thông tin', messages.join('\n'));
  };

  // ============================================================================
  // 6. RENDER GIAO DIỆN
  // ============================================================================
  return (
    <SafeAreaView style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận và Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ===== THÔNG TIN PHÒNG ĐÃ CHỌN ===== */}
        <View style={styles.roomCard}>
          <Image source={{ uri: MOCK_ROOM.imageUrl }} style={styles.roomImage} contentFit="cover" transition={300} />
          <Text style={styles.hotelName}>{MOCK_ROOM.hotelName}</Text>
          <Text style={styles.roomType}>{MOCK_ROOM.roomType}</Text>

          {/* Ngày nhận / Ngày trả */}
          <View style={styles.datesRow}>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>NHẬN PHÒNG</Text>
              <Text style={styles.dateValue}>{formatDate(checkInDate)}</Text>
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.dateLabel}>TRẢ PHÒNG</Text>
              <Text style={styles.dateValue}>{formatDate(checkOutDate)}</Text>
            </View>
          </View>

          {/* Số khách & Số đêm */}
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={16} color={Colors.light.textSecondary} />
            <Text style={styles.infoText}>{numberOfGuests} Người lớn  •  {numberOfNights} đêm nghỉ</Text>
          </View>

          {/* Tiện ích (Amenities) */}
          <View style={styles.amenitiesRow}>
            {MOCK_ROOM.amenities.map((a, i) => (
              <View key={i} style={styles.amenityChip}>
                <Ionicons
                  name={a === 'Pool' ? 'water-outline' : a === 'Kitchen' ? 'restaurant-outline' : a === 'WiFi' ? 'wifi-outline' : 'water-outline'}
                  size={12} color={Colors.primary}
                />
                <Text style={styles.amenityText}>{a}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ===== THÔNG TIN LIÊN HỆ (CONTACT INFO) ===== */}
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.sectionCard}>
          {/* Full Name */}
          <Text style={styles.inputLabel}>Full Name</Text>
          <Controller control={control} name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Enter your full name" placeholderTextColor="#B0B0B0"
                onBlur={onBlur} onChangeText={onChange} value={value} />
            )} />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName.message}</Text>}

          {/* Phone */}
          <Text style={styles.inputLabel}>Phone</Text>
          <Controller control={control} name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Phone number" placeholderTextColor="#B0B0B0"
                keyboardType="phone-pad" onBlur={onBlur} onChangeText={onChange} value={value} />
            )} />
          {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

          {/* Email */}
          <Text style={styles.inputLabel}>Email</Text>
          <Controller control={control} name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email address" placeholderTextColor="#B0B0B0"
                keyboardType="email-address" autoCapitalize="none"
                onBlur={onBlur} onChangeText={onChange} value={value} />
            )} />
          {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
        </View>

        {/* ===== YÊU CẦU ĐẶC BIỆT & DỊCH VỤ THÊM ===== */}
        <Text style={styles.sectionTitle}>Yêu cầu đặc biệt & Dịch vụ thêm</Text>
        <View style={styles.sectionCard}>
          {SPECIAL_REQUESTS.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.checkboxRow} onPress={() => toggleRequest(item)}>
              <View style={[styles.checkbox, selectedRequests.includes(item) && styles.checkboxActive]}>
                {selectedRequests.includes(item) && <Ionicons name="checkmark" size={14} color="white" />}
              </View>
              <Text style={styles.checkboxLabel}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ===== PHƯƠNG THỨC THANH TOÁN ===== */}
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <View style={styles.sectionCard}>
          {/* --- Option 1: Thẻ tín dụng --- */}
          <TouchableOpacity
            style={[styles.paymentOption, selectedPaymentMethod === 'credit_card' && styles.paymentOptionActive]}
            onPress={() => setSelectedPaymentMethod('credit_card')}>
            <Ionicons name="card-outline" size={20} color={Colors.primary} />
            <Text style={styles.paymentOptionText}>Credit Card</Text>
            <Ionicons
              name={selectedPaymentMethod === 'credit_card' ? 'radio-button-on' : 'radio-button-off'}
              size={22} color={selectedPaymentMethod === 'credit_card' ? Colors.primary : Colors.light.textSecondary} />
          </TouchableOpacity>

          {/* Accordion: Form thẻ tín dụng (chỉ hiện khi được chọn) */}
          {selectedPaymentMethod === 'credit_card' && (
            <View style={styles.creditCardForm}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <Controller control={control} name="cardNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput style={styles.input} placeholder="0000 0000 0000 0000"
                    placeholderTextColor="#B0B0B0" keyboardType="number-pad" maxLength={19}
                    onBlur={onBlur} onChangeText={onChange} value={value} />
                )} />
              <View style={styles.cardRow}>
                <View style={{ flex: 1, marginRight: Spacing.sm }}>
                  <Text style={styles.inputLabel}>Expiry</Text>
                  <Controller control={control} name="cardExpiry"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput style={styles.input} placeholder="MM/YY"
                        placeholderTextColor="#B0B0B0" keyboardType="number-pad" maxLength={5}
                        onBlur={onBlur} onChangeText={onChange} value={value} />
                    )} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <Controller control={control} name="cardCvv"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput style={styles.input} placeholder="123"
                        placeholderTextColor="#B0B0B0" keyboardType="number-pad" maxLength={4}
                        secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} />
                    )} />
                </View>
              </View>
            </View>
          )}

          {/* --- Option 2: Ví điện tử --- */}
          <TouchableOpacity
            style={[styles.paymentOption, selectedPaymentMethod === 'ewallet' && styles.paymentOptionActive]}
            onPress={() => setSelectedPaymentMethod('ewallet')}>
            <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
            <Text style={styles.paymentOptionText}>E-Wallet (MoMo/ZaloPay)</Text>
            <Ionicons
              name={selectedPaymentMethod === 'ewallet' ? 'radio-button-on' : 'radio-button-off'}
              size={22} color={selectedPaymentMethod === 'ewallet' ? Colors.primary : Colors.light.textSecondary} />
          </TouchableOpacity>

          {/* --- Option 3: Chuyển khoản --- */}
          <TouchableOpacity
            style={[styles.paymentOption, selectedPaymentMethod === 'bank' && styles.paymentOptionActive]}
            onPress={() => setSelectedPaymentMethod('bank')}>
            <Ionicons name="business-outline" size={20} color={Colors.primary} />
            <Text style={styles.paymentOptionText}>Bank Transfer</Text>
            <Ionicons
              name={selectedPaymentMethod === 'bank' ? 'radio-button-on' : 'radio-button-off'}
              size={22} color={selectedPaymentMethod === 'bank' ? Colors.primary : Colors.light.textSecondary} />
          </TouchableOpacity>

          {/* Placeholder QR cho Ví điện tử / Chuyển khoản */}
          {(selectedPaymentMethod === 'ewallet' || selectedPaymentMethod === 'bank') && (
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code-outline" size={80} color={Colors.primary} />
              <Text style={styles.qrText}>Quét mã QR để thanh toán</Text>
            </View>
          )}
        </View>

        {/* ===== CHI TIẾT THANH TOÁN (PRICE BREAKDOWN) ===== */}
        <View style={styles.priceCard}>
          <Text style={styles.priceCardTitle}>Chi tiết thanh toán</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Giá phòng ({numberOfRooms} phòng x {numberOfNights} đêm)</Text>
            <Text style={styles.priceValue}>${priceDetails.basePrice}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Phí</Text>
            <Text style={styles.priceValue}>${priceDetails.serviceFee + priceDetails.tax}</Text>
          </View>
          <View style={styles.priceSubRow}>
            <Text style={styles.priceSubLabel}>Phí dịch vụ</Text>
            <Text style={styles.priceSubValue}>${priceDetails.serviceFee}</Text>
          </View>
          <View style={styles.priceSubRow}>
            <Text style={styles.priceSubLabel}>Thuế</Text>
            <Text style={styles.priceSubValue}>${priceDetails.tax}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: Colors.light.success }]}>🏷 Voucher giảm giá</Text>
            <Text style={[styles.priceValue, { color: Colors.light.success }]}>-${priceDetails.discount}</Text>
          </View>

          <View style={styles.divider} />

          {/* Tổng tiền */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng tiền</Text>
            <Text style={styles.totalValue}>${priceDetails.finalTotal}</Text>
          </View>
        </View>

        {/* ===== NÚT XÁC NHẬN THANH TOÁN ===== */}
        <TouchableOpacity
          style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]}
          disabled={isLoading}
          onPress={handleSubmit(onSubmit, onFormError)}>
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <View style={styles.confirmButtonContent}>
              <Ionicons name="lock-closed-outline" size={18} color="white" />
              <Text style={styles.confirmButtonText}>XÁC NHẬN THANH TOÁN</Text>
            </View>
          )}
        </TouchableOpacity>

      </ScrollView>

      {/* ===== OVERLAY THANH TOÁN THÀNH CÔNG ===== */}
      <Modal visible={isPaymentSuccess} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-circle" size={72} color={Colors.light.success} />
            </View>
            <Text style={styles.successTitle}>Thanh toán thành công!</Text>
            <Text style={styles.successSubtitle}>
              Đơn đặt phòng của bạn đã được xác nhận.{'\n'}Chi tiết đã gửi qua email.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ============================================================================
// 7. STYLES
// ============================================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  
  // --- Header ---
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  headerTitle: { ...Typography.h3, color: Colors.light.text, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  // --- Room Card (Thông tin phòng) ---
  roomCard: { backgroundColor: 'white', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg, ...Shadows.sm },
  roomImage: { width: '100%', height: 160, borderRadius: BorderRadius.md, marginBottom: Spacing.sm },
  hotelName: { ...Typography.caption, color: Colors.light.textSecondary, fontWeight: '600' },
  roomType: { ...Typography.h2, color: Colors.light.text, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: Spacing.md },
  datesRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  dateBox: { flex: 1, backgroundColor: '#F3EEFF', borderRadius: BorderRadius.md, padding: Spacing.sm },
  dateLabel: { ...Typography.caption, color: Colors.primary, fontWeight: '700', marginBottom: 2 },
  dateValue: { ...Typography.body2, color: Colors.primary, fontWeight: '600' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  infoText: { ...Typography.body2, color: Colors.light.textSecondary },
  amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  amenityChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F3EEFF', borderRadius: BorderRadius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  amenityText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },

  // --- Section Card (Contact, Requests, Payment) ---
  sectionTitle: { ...Typography.h3, color: Colors.primary, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: Spacing.sm, marginTop: Spacing.sm },
  sectionCard: { backgroundColor: 'white', borderRadius: BorderRadius.lg, padding: Spacing.md, marginBottom: Spacing.lg, ...Shadows.sm },

  // --- Input fields ---
  inputLabel: { ...Typography.caption, fontWeight: '700', color: Colors.light.text, marginBottom: 4, marginTop: Spacing.sm },
  input: { borderWidth: 1, borderColor: Colors.light.border, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: 10, ...Typography.body1, color: Colors.light.text },
  inputError: { borderColor: Colors.light.error },
  errorText: { ...Typography.caption, color: Colors.light.error, marginTop: 2 },

  // --- Checkboxes ---
  checkboxRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1.5, borderColor: Colors.light.border, marginRight: Spacing.sm, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkboxLabel: { ...Typography.body1, color: Colors.light.text },

  // --- Payment Methods ---
  paymentOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: Spacing.sm, borderWidth: 1, borderColor: Colors.light.border, borderRadius: BorderRadius.md, marginBottom: Spacing.sm },
  paymentOptionActive: { borderColor: Colors.primary, backgroundColor: '#F9F8FF' },
  paymentOptionText: { flex: 1, marginLeft: Spacing.sm, ...Typography.body1, color: Colors.light.text },
  creditCardForm: { paddingHorizontal: Spacing.xs, marginBottom: Spacing.sm },
  cardRow: { flexDirection: 'row' },
  qrPlaceholder: { alignItems: 'center', paddingVertical: Spacing.xl },
  qrText: { ...Typography.body2, color: Colors.light.textSecondary, marginTop: Spacing.sm },

  // --- Price Card ---
  priceCard: { backgroundColor: Colors.primary, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.lg },
  priceCardTitle: { ...Typography.h3, color: 'white', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: Spacing.md },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  priceLabel: { ...Typography.body2, color: '#D0CCFF' },
  priceValue: { ...Typography.body2, color: 'white', fontWeight: '700' },
  priceSubRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, paddingLeft: Spacing.md },
  priceSubLabel: { ...Typography.caption, color: '#B0ABDD' },
  priceSubValue: { ...Typography.caption, color: '#D0CCFF' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: Spacing.md },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { ...Typography.body1, color: '#D0CCFF' },
  totalValue: { fontSize: 32, fontWeight: '700', color: 'white' },

  // --- Confirm Button ---
  confirmButton: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: BorderRadius.pill, alignItems: 'center', marginBottom: Spacing.lg },
  confirmButtonDisabled: { opacity: 0.7 },
  confirmButtonContent: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  confirmButtonText: { ...Typography.button, color: 'white', fontWeight: '700', letterSpacing: 1 },

  // --- Success Overlay ---
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.lg },
  successCard: { backgroundColor: 'white', borderRadius: BorderRadius.xl, padding: Spacing.xl, alignItems: 'center', width: '100%' },
  successIconCircle: { marginBottom: Spacing.md },
  successTitle: { ...Typography.h2, color: Colors.primary, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: Spacing.sm },
  successSubtitle: { ...Typography.body1, color: Colors.light.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xl },
  homeButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primary, paddingHorizontal: Spacing.xl, paddingVertical: 14, borderRadius: BorderRadius.pill },
  homeButtonText: { ...Typography.button, color: 'white', fontWeight: '700' },
});
