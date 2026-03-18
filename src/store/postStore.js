// src/store/postStore.js
import { create } from 'zustand';

export const usePostStore = create((set) => ({
  feedPosts: [],
  lastDoc: null,
  hasMore: true,
  isInitialized: false,

  /**
   * 피드 데이터 설정 (초기 로드)
   */
  setFeedPosts: (posts, lastDoc, hasMore) => set({
    feedPosts: posts,
    lastDoc: lastDoc,
    hasMore: hasMore,
    isInitialized: true
  }),

  /**
   * 피드 데이터 추가 (더 불러오기)
   */
  appendFeedPosts: (posts, lastDoc, hasMore) => set((state) => ({
    feedPosts: [...state.feedPosts, ...posts],
    lastDoc: lastDoc,
    hasMore: hasMore
  })),

  /**
   * 로컬 상태에서 게시물 업데이트 (좋아요 등 반영용)
   */
  updateLocalPost: (postId, updateData) => set((state) => ({
    feedPosts: state.feedPosts.map(post => 
      post.id === postId ? { ...post, ...updateData } : post
    )
  })),

  /**
   * 로컬 상태에서 게시물 삭제
   */
  removeLocalPost: (postId) => set((state) => ({
    feedPosts: state.feedPosts.filter(post => post.id !== postId)
  })),

  /**
   * 상태 초기화 (강제 새로고침 시 사용)
   */
  resetFeed: () => set({
    feedPosts: [],
    lastDoc: null,
    hasMore: true,
    isInitialized: false
  })
}));
