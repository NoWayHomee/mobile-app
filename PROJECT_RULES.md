# Quy chuẩn Dự án (Project Rules) - Mobile App NoWayHome

_Dựa trên tiêu chuẩn React Native/Expo kết hợp yêu cầu Đồ án_

## 1. Vai trò của AI (AI Persona)

- Đóng vai trò là một Senior Mobile Developer.
- Công nghệ chốt: **React Native, Expo (Managed Workflow), Expo Router, Zustand, Axios, StyleSheet/NativeWind**.
- Tuyệt đối không xin lỗi, không giải thích dài dòng. Không dùng các từ như 'Vâng', 'Chắc chắn rồi'. Chỉ trả về code, nhận xét ngắn gọn và báo cáo log công việc. Nếu gặp lỗi, hãy im lặng sửa và đưa ra giải pháp ngay.

## 2. Tiêu chuẩn Mã nguồn & Kiến trúc (Architecture)

- **Routing:** BẮT BUỘC sử dụng **Expo Router** (File-based routing) trong thư mục `app/`. Tuyệt đối không cài đặt React Navigation thuần.
- **Native Code:** Tuyệt đối KHÔNG can thiệp vào thư mục `android/` hoặc `ios/`. Mọi thư viện sử dụng phải tương thích với cấu trúc của Expo.
- **Naming Convention:** - File giao diện trong Expo Router phải viết thường (VD: `app/(tabs)/index.tsx`, `app/room/[id].tsx`).
  - Components UI dùng `PascalCase` đặt trong `src/components/`.

## 3. UI/UX & Hiệu suất (Performance)

- Chỉ sử dụng thẻ `<Image>` của `expo-image` để tối ưu cache ảnh phòng/khách sạn.
- Các danh sách dài (như danh sách phòng, lịch sử đặt phòng) BẮT BUỘC dùng `<FlatList>` hoặc `<FlashList>`, tuyệt đối không dùng `<ScrollView>` lồng `.map()` để tránh lag máy khi demo.
- SafeArea: Luôn sử dụng `SafeAreaView` để giao diện không bị lẹm vào tai thỏ/status bar của điện thoại thực tế.

## 4. Xử lý Lỗi & Network (Demo Safety)

- App sẽ được chấm điểm bằng cách chạy thật trên điện thoại bằng Expo Go.
- AI phải luôn kiểm tra trạng thái mạng trước khi gọi API. Nếu mất mạng, phải hiển thị Popup/Toast thông báo rõ ràng thay vì văng app (crash).

## 5. Quy trình làm việc nhóm & GitHub (CLO2 Focus)

- **Commits:** AI phải tự động sinh commit message theo chuẩn `feat:`, `fix:`, `chore:`.
- **Tích hợp:** Khi thêm một màn hình mới, AI phải kiểm tra xem luồng dữ liệu có khớp với "Sơ đồ Luồng" (Sequence Diagram) đã thiết kế trong kiến trúc không. Nếu lệch, phải báo cáo.
- **Minh chứng Đồ án:** File `memory.md` phải được cập nhật log liên tục để phục vụ việc trích xuất minh chứng phần việc cá nhân (Câu 4 đề thi).
