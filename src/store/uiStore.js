// src/store/uiStore.js
import { create } from 'zustand';

export const useUIStore = create((set) => ({
  toasts: [],

  /**
   * 알림 메시지 추가
   * @param {string} message - 표시할 메시지
   * @param {'success' | 'error' | 'info' | 'warning'} type - 알림 타입
   * @param {number} duration - 표시 시간 (ms)
   */
  addToast: (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    // 자동 삭제
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  /**
   * 특정 알림 삭제
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
