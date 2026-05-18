import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState('');

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.overlay} onTouchEnd={() => router.back()} />
        
        {/* Bottom Sheet */}
        <View style={[styles.sheet, { paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.xl }]}>
          <View style={styles.handle} />
          
          <Text style={styles.title}>Đánh giá chuyến đi</Text>
          <Text style={styles.subtitle}>Vui lòng chia sẻ trải nghiệm của bạn với chúng tôi</Text>

          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons 
                  name={star <= rating ? "star" : "star-outline"} 
                  size={40} 
                  color={star <= rating ? Colors.primary : Colors.light.border} 
                  style={{ marginHorizontal: 4 }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              placeholderTextColor={Colors.light.textSecondary}
              multiline
              textAlignVertical="top"
              value={review}
              onChangeText={setReview}
            />
          </View>

          <TouchableOpacity style={styles.addPhotoButton}>
            <Ionicons name="camera-outline" size={20} color={Colors.primary} style={{marginRight: 8}} />
            <Text style={styles.addPhotoText}>Thêm ảnh</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.submitButton} onPress={() => router.back()}>
            <Text style={styles.submitButtonText}>Gửi đánh giá ▹</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  overlay: { flex: 1 },
  sheet: { backgroundColor: '#FAFAFA', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: Spacing.xl },
  handle: { width: 40, height: 4, backgroundColor: '#D9D9D9', borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.lg },
  title: { ...Typography.h1, textAlign: 'center', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: Colors.light.text, marginBottom: Spacing.sm },
  subtitle: { ...Typography.body1, textAlign: 'center', color: Colors.light.textSecondary, marginBottom: Spacing.xl },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: Spacing.xl },
  inputContainer: { borderWidth: 1, borderColor: Colors.light.border, borderRadius: BorderRadius.md, backgroundColor: 'white', height: 120, marginBottom: Spacing.lg },
  input: { flex: 1, padding: Spacing.md, ...Typography.body1 },
  addPhotoButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 10, borderRadius: BorderRadius.pill, borderWidth: 1, borderColor: '#E0E0FF', backgroundColor: 'white' },
  addPhotoText: { ...Typography.body2, color: Colors.primary },
  divider: { height: 1, backgroundColor: Colors.light.border, marginVertical: Spacing.xl },
  submitButton: { backgroundColor: Colors.primary, padding: Spacing.md, borderRadius: BorderRadius.md, alignItems: 'center' },
  submitButtonText: { ...Typography.button, color: 'white' },
});
