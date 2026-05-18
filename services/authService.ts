/**
 * ============================================================================
 * TÊN FILE: services/authService.ts
 * MỤC ĐÍCH: Lớp Dịch Vụ (Service Layer) chuyên xử lý giao tiếp API với Backend
 * cho phân hệ Xác thực (Authentication) như Đăng nhập, Đăng ký, Quên mật khẩu.
 * ============================================================================
 */

import apiClient from './apiClient';

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU (INTERFACES) ---
// Giúp TypeScript kiểm tra lỗi ngay trong lúc code, đảm bảo truyền đúng và đủ tham số

export interface LoginPayload { 
  email: string; 
  password?: string; 
}

export interface RegisterPayload { 
  fullName: string; 
  email: string; 
  phone: string; 
  password?: string; 
}

export interface User { 
  id: string; 
  fullName: string; 
  email: string; 
  phone?: string; 
  avatar?: string; 
  role?: string; 
}

export interface AuthResponse { 
  user: User; 
  access_token: string; 
}

export interface ChangePasswordPayload { 
  oldPassword?: string; 
  newPassword?: string; 
}

// Dữ liệu User ảo (Mock Data) dùng tạm thời khi chưa có Backend thật
const MOCK_USER: User = {
  id: 'user_12345',
  fullName: 'Kiet Nguyen',
  email: 'test@nowayhome.com',
  phone: '0123456789',
};

// --- CÁC HÀM XỬ LÝ GỌI API (SERVICE METHODS) ---
export const authService = {
  
  /**
   * Gọi API Đăng nhập
   * @param payload chứa email và password
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    // Giả lập mạng chậm 1.5 giây để hiện Loading UI cho đẹp
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Giả lập logic bắt lỗi: Nếu mật khẩu < 6 ký tự thì quăng lỗi từ server
    if (payload.password && payload.password.length < 6) {
      throw new Error('Sai tài khoản hoặc mật khẩu!');
    }
    
    // Trả về dữ liệu ảo
    return { user: MOCK_USER, access_token: 'mock_jwt_token_xxxx_yyyy_zzzz' };
    
    // 💡 CODE THẬT (Mở ra khi đã có Backend thật):
    // return apiClient.post('/auth/login', payload);
  },

  /**
   * Gọi API Đăng ký tài khoản
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Trả về dữ liệu ảo kết hợp với thông tin user vừa nhập
    return { 
      user: { ...MOCK_USER, fullName: payload.fullName, email: payload.email }, 
      access_token: 'mock_jwt_token_register' 
    };
    
    // 💡 CODE THẬT:
    // return apiClient.post('/auth/register', payload);
  },

  /**
   * Gọi API Gửi yêu cầu quên mật khẩu
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Giả lập lỗi nếu email lạ
    if (email !== 'test@nowayhome.com') {
      throw new Error('Email này chưa được đăng ký trong hệ thống!');
    }
    
    return { message: 'Thành công' };
    
    // 💡 CODE THẬT:
    // return apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Gọi API Đổi mật khẩu
   */
  changePassword: async (payload: ChangePasswordPayload): Promise<{ message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { message: 'Đổi mật khẩu thành công' };
    
    // 💡 CODE THẬT:
    // return apiClient.post('/auth/change-password', payload);
  },
};
