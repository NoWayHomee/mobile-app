import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 + (insets.bottom > 0 ? insets.bottom : Spacing.lg) }}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739' }} 
            style={styles.image} 
            contentFit="cover" 
          />
          <SafeAreaView edges={['top']} style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="share-outline" size={24} color={Colors.light.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="heart-outline" size={24} color={Colors.light.text} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[1,2,3,4,5].map(i => <Ionicons key={i} name="star" size={14} color={Colors.primary} />)}
            </View>
            <Text style={styles.ratingText}>5.0 (124 reviews)</Text>
          </View>

          <Text style={styles.title}>The Azure{'\n'}Cliffside{'\n'}Retreat</Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={18} color={Colors.primary} />
            <Text style={styles.locationText}>Oia, Santorini, Greece</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>
            Experience the epitome of quiet luxury clinging to the dramatic caldera cliffs. This exclusive sanctuary offers unbroken views of the Aegean Sea, blending traditional cycladic architecture with refined, modern minimalism. Designed for profound relaxation, every detail—from the artisanal linen bedding to the secluded infinity plunge pool—has been curated to disconnect you from the world and reconnect you with the rhythm of the tides.
          </Text>

          <Text style={styles.sectionTitle}>Curated Amenities</Text>
          <View style={styles.amenitiesGrid}>
            <View style={styles.amenityCard}>
              <Ionicons name="wifi" size={24} color={Colors.primary} />
              <Text style={styles.amenityText}>FREE WIFI</Text>
            </View>
            <View style={styles.amenityCard}>
              <Ionicons name="water-outline" size={24} color={Colors.primary} />
              <Text style={styles.amenityText}>SWIMMING{'\n'}POOL</Text>
            </View>
            <View style={styles.amenityCard}>
              <Ionicons name="leaf-outline" size={24} color={Colors.primary} />
              <Text style={styles.amenityText}>SPA</Text>
            </View>
            <View style={styles.amenityCard}>
              <Ionicons name="snow-outline" size={24} color={Colors.primary} />
              <Text style={styles.amenityText}>AIR{'\n'}CONDITIONING</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom > 0 ? insets.bottom : Spacing.lg }]}>
        <View>
          <Text style={styles.startingFrom}>Starting from</Text>
          <Text style={styles.price}>$1,250 <Text style={styles.perNight}>/ night</Text></Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={() => router.push('/payment' as any)}>
          <Text style={styles.bookButtonText}>Đặt ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  imageContainer: { width: width, height: width * 1.1, position: 'relative' },
  image: { width: '100%', height: '100%' },
  headerButtons: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.md },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  content: { padding: Spacing.xl },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  stars: { flexDirection: 'row', marginRight: Spacing.sm },
  ratingText: { ...Typography.body2, color: Colors.light.textSecondary },
  title: { ...Typography.h1, fontSize: 40, lineHeight: 48, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', color: Colors.light.text, marginBottom: Spacing.md },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  locationText: { ...Typography.body1, color: Colors.primary, marginLeft: Spacing.sm },
  divider: { height: 1, backgroundColor: Colors.light.border, marginVertical: Spacing.lg },
  description: { ...Typography.body1, color: Colors.light.textSecondary, lineHeight: 28, marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.h2, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginBottom: Spacing.lg },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  amenityCard: { width: (width - Spacing.xl * 2 - Spacing.md) / 2, padding: Spacing.lg, backgroundColor: '#F8F9FA', borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.light.border },
  amenityText: { ...Typography.caption, fontWeight: '700', marginTop: Spacing.sm, textAlign: 'center', color: Colors.light.text },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.light.border },
  startingFrom: { ...Typography.caption, color: Colors.light.textSecondary },
  price: { ...Typography.h2, color: Colors.primary, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  perNight: { ...Typography.body2, color: Colors.light.textSecondary },
  bookButton: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md, borderRadius: BorderRadius.pill },
  bookButtonText: { ...Typography.button, color: 'white' }
});
