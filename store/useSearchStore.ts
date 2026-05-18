/**
 * ============================================================================
 * TÊN FILE: store/useSearchStore.ts
 * MỤC ĐÍCH: Nơi quản lý trạng thái Bộ lọc Tìm kiếm toàn cục bằng Zustand.
 * Giúp dữ liệu tìm kiếm (địa điểm, ngày, số khách) đồng bộ giữa Trang chủ, 
 * Modal tìm kiếm và màn hình Kết quả Tìm kiếm.
 * ============================================================================
 */
import { create } from 'zustand';

export interface Guests {
  adults: number;
  children: number;
  rooms: number;
}

interface SearchState {
  location: string;
  checkInDate: string;
  checkOutDate: string;
  guests: Guests;
  setLocation: (location: string) => void;
  setDates: (checkInDate: string, checkOutDate: string) => void;
  setGuests: (guests: Partial<Guests>) => void;
  resetSearch: () => void;
}

const initialGuests: Guests = {
  adults: 2,
  children: 0,
  rooms: 1,
};

// Set default values mimicking the initial design mockup
export const useSearchStore = create<SearchState>((set) => ({
  location: 'Thành phố Hạ Long',
  checkInDate: '2026-04-25',
  checkOutDate: '2026-04-26',
  guests: initialGuests,

  setLocation: (location) => set({ location }),
  
  setDates: (checkInDate, checkOutDate) => set({ checkInDate, checkOutDate }),
  
  setGuests: (newGuests) => 
    set((state) => ({ 
      guests: { ...state.guests, ...newGuests } 
    })),
    
  resetSearch: () => set({
    location: 'Thành phố Hạ Long',
    checkInDate: '2026-04-25',
    checkOutDate: '2026-04-26',
    guests: initialGuests,
  }),
}));
