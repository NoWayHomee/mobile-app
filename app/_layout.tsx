/**
 * ============================================================================
 * TÊN FILE: app/_layout.tsx
 * MỤC ĐÍCH: Root Layout của toàn bộ ứng dụng (File chạy đầu tiên).
 * Định nghĩa cấu trúc điều hướng (Navigation Stack) ở cấp độ cao nhất.
 * ============================================================================
 */
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  // Lấy chế độ màu hiện tại của hệ thống (Dark/Light mode)
  const colorScheme = useColorScheme();

  return (
    // ThemeProvider giúp áp dụng màu nền, màu chữ theo chế độ màn hình sáng/tối
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Nhóm (tabs): Chứa các màn hình có thanh Bottom Tab (Trang chủ, Yêu thích...) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Nhóm (auth): Chứa các màn hình Xác thực (Đăng nhập, Đăng ký...) */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        
        {/* Màn hình Tìm kiếm nâng cao: Cài đặt hiển thị dưới dạng Modal trượt từ dưới lên */}
        <Stack.Screen name="searchModal" options={{ presentation: 'fullScreenModal', headerShown: false }} />
        
        {/* Màn hình Chỉnh sửa hồ sơ */}
        <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
      </Stack>
      
      {/* Cấu hình thanh trạng thái (cục pin, giờ) tự động đổi màu tương phản */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
