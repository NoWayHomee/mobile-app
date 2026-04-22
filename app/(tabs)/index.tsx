import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const [connectionStatus, setConnectionStatus] = useState<string>(
    "⏳ Đang ping tới Backend...",
  );

  useEffect(() => {
    const testPing = async () => {
      try {
        // NestJS mặc định có một route GET / trả về "Hello World!"
        // Nếu bạn đã set baseURL là /api/v1 thì nó sẽ gọi vào /api/v1
        const response = await apiClient.get("/");
        setConnectionStatus(
          `✅ Kết nối thành công!\nPhản hồi: ${JSON.stringify(response)}`,
        );
      } catch (error: any) {
        // Nếu ra lỗi 404 thì vẫn là THÀNH CÔNG về mặt Network (đã chạm tới server nhưng sai đường dẫn)
        // Nếu ra lỗi Network Request Failed là THẤT BẠI (sai IP hoặc server chưa bật)
        setConnectionStatus(`❌ Trạng thái mạng: ${error.message}`);
      }
    };

    testPing();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trạm Kiểm Thử NoWayHome</Text>
      <Text style={styles.status}>{connectionStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  status: { fontSize: 16, textAlign: "center", color: "#333" },
});
