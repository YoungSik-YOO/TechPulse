// src/store/authStore.js
import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: true,

  // 유저 정보 설정
  setUser: (user) => {
    const currentState = get();
    // 중복 업데이트 및 루프 방지를 위한 비교
    if (
      JSON.stringify(currentState.user) === JSON.stringify(user) && 
      currentState.isLoggedIn === !!user && 
      !currentState.loading
    ) {
      return;
    }
    set({ user, isLoggedIn: !!user, loading: false });
  },

  // 로딩 상태 설정
  setLoading: (loading) => {
    if (get().loading === loading) return;
    set({ loading });
  },

  // 유저 정보 초기화 (로그아웃 등)
  clearUser: () => {
    const currentState = get();
    if (!currentState.user && !currentState.isLoggedIn && !currentState.loading) return;
    set({ user: null, isLoggedIn: false, loading: false });
  },
}));

export default useAuthStore;
