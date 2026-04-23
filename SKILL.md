---
name: mobile-app-coding-standards
description: Hướng dẫn lập trình cho dự án mobile-app sử dụng React Native, Expo và Expo Router. Tập trung vào hiệu năng giao diện, điều hướng an toàn, và xử lý lỗi network để tránh crash app khi demo. Sử dụng rule này khi cần sửa code, thêm màn hình, tối ưu danh sách, hoặc xử lý API/loading.
---

# Kỹ năng Lập trình cho Mobile App

Tập trung vào hiệu năng, tính ổn định và bảo vệ ứng dụng không bị crash khi demo trực tiếp (Đảm bảo tiêu chí CLO1).

## 1. Giao diện và hiệu năng (UI & Performance)

- Sử dụng `flexbox` cho mọi layout.
- KHÔNG fix cứng `width`/`height` bằng pixel trừ khi có yêu cầu đặc thù từ thiết kế.
- BẮT BUỘC dùng `<FlatList>` kèm `keyExtractor` cho các danh sách (như danh sách phòng, lịch sử đặt phòng) để tối ưu bộ nhớ.
- Tuyệt đối KHÔNG dùng `<ScrollView>` kết hợp `.map()` để render mảng dữ liệu lớn nhằm tránh giật lag (performance drop).
- Luôn bao bọc màn hình bằng `<SafeAreaView>` ở component gốc để tránh giao diện bị lẹm vào status bar hoặc "tai thỏ" (notch) trên thiết bị thật.

## 2. Điều hướng (Navigation với Expo Router)

- Sử dụng component `<Link>` của `expo-router` hoặc hook `useRouter()` để chuyển trang.
- Các tham số (parameters) truyền qua URL (ví dụ: `id` của phòng) phải được kiểm tra (validate) và ép kiểu (parse) cẩn thận trước khi đưa vào logic xử lý.

## 3. Gọi API và xử lý lỗi (Data Fetching & Error Handling)

- Khi gọi API, bắt buộc phải quản lý state `isLoading`.
- Hiển thị `<ActivityIndicator>` (hoặc giao diện Skeleton) cho người dùng trong thời gian chờ dữ liệu từ server.
- Phải bọc mọi lời gọi Axios trong `try/catch`.
- Xử lý lỗi ngoại tuyến (Offline): Nếu `error.message === 'Network Error'`, phải hiển thị thông báo Alert/Toast với nội dung: `"Vui lòng kiểm tra kết nối mạng"`.
- TUYỆT ĐỐI KHÔNG để ứng dụng bị văng (crash/fatal error) khi xảy ra lỗi kết nối.

## 4. Triết lý Thực chiến (Sinh tồn khi Bảo vệ Đồ án)

- **Viết code tường minh, dễ hiểu (Explicit):** Tuyệt đối không sử dụng các thủ thuật viết tắt (One-liners) hoặc logic lồng ghép phức tạp. Mọi đoạn code sinh ra phải đủ đơn giản để một sinh viên đại học có thể đọc hiểu và giải thích trôi chảy trước hội đồng bảo vệ.
- **Không trừu tượng hóa sớm (No Premature Abstraction):** Chỉ tạo các class/component dùng chung (Base/Generic) khi đoạn code đó bị lặp lại từ 3 lần trở lên (Quy tắc DRY thực tế). Tập trung vào việc code chạy đúng chức năng thay vì vẽ ra kiến trúc quá phức tạp.
- **Đóng gói UI Component (Self-contained):** Giữ cho các UI Component có tính đóng gói cao. Cấm chia nhỏ Component quá mức (Micro-components) trừ khi nó chắc chắn được tái sử dụng ở nhiều màn hình khác nhau. Tránh việc file rác tràn ngập dự án.
