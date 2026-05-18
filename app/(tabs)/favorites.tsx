/**
 * ============================================================================
 * TÊN FILE: app/(tabs)/favorites.tsx
 * MỤC ĐÍCH: Màn hình Yêu thích (Favorites Screen).
 * CHỨC NĂNG CHÍNH:
 * - Hiển thị danh sách các phòng/khách sạn đã thả tim bằng `FlatList`.
 * - Các `PropertyCard` được truyền cờ `isFavorite={true}` để bật icon Trái tim.
 * ============================================================================
 */
import React from 'react';
import { View, Text, StyleSheet, Platform, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { PropertyCard, Property } from '../../components/PropertyCard';
import { useRouter } from 'expo-router';

const favoriteProperties: Property[] = [
  {
    id: 'fav-1',
    title: 'The Azure Cliffside Retreat',
    location: 'Oia, Santorini, Greece',
    price: 1250,
    rating: 5.0,
    reviews: 124,
    imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739',
  },
  {
    id: 'fav-2',
    title: 'Aman Tokyo – Deluxe Room',
    location: 'Tokyo, Japan',
    price: 850,
    rating: 4.9,
    reviews: 210,
    imageUrl: 'https://images.unsplash.com/photo-1542314831-c6a4d14b8fc9',
  },
];

export default function FavoritesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Yêu thích của bạn</Text>
      
      <FlatList
        data={favoriteProperties}
        keyExtractor={(item: Property) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: Property }) => (
          <PropertyCard 
            property={item} 
            isFavorite={true}
            onPress={() => router.push(`/room/${item.id}` as any)}
            onFavoritePress={() => {
              console.log('Unfavorite clicked for', item.id);
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  title: { ...Typography.h1, textAlign: 'center', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', marginVertical: Spacing.md, color: Colors.primary },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
});
