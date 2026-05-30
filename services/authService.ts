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
  refresh_token?: string;
}

export interface ChangePasswordPayload { 
  oldPassword?: string; 
  newPassword?: string; 
}

interface BackendAuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User & {
    userType?: string;
    status?: string;
  };
}

function mapAuthResponse(response: BackendAuthResponse): AuthResponse {
  return {
    user: response.user,
    access_token: response.accessToken,
    refresh_token: response.refreshToken,
  };
}

// --- CÁC HÀM XỬ LÝ GỌI API (SERVICE METHODS) ---
export const authService = {
  
  /**
   * Gọi API Đăng nhập
   * @param payload chứa email và password
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<BackendAuthResponse, BackendAuthResponse>('/auth/login', payload);
    return mapAuthResponse(response);
  },

  /**
   * Gọi API Đăng ký tài khoản
   */
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await apiClient.post<BackendAuthResponse, BackendAuthResponse>(
      '/customer/auth/register',
      payload,
    );
    return mapAuthResponse(response);
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
