// src/hooks/usePosts.js
import { useState, useCallback } from 'react';
import { postService } from '../services/postService';
import { usePostStore } from '../store/postStore';

export const usePosts = () => {
  const { 
    feedPosts: posts, 
    lastDoc, 
    hasMore, 
    isInitialized, 
    setFeedPosts, 
    appendFeedPosts, 
    resetFeed,
    removeLocalPost
  } = usePostStore();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 초기 게시물 로드
   * isInitialized가 false이거나 forceRefresh가 true일 때만 호출
   */
  const fetchInitialPosts = useCallback(async (pageSize = 10, forceRefresh = false) => {
    if (isInitialized && !forceRefresh) return;

    setLoading(true);
    setError(null);
    try {
      const { posts: fetchedPosts, lastDoc: last } = await postService.getPosts(null, pageSize);
      setFeedPosts(fetchedPosts, last, fetchedPosts.length === pageSize);
    } catch (err) {
      console.error(err);
      setError('게시물을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [isInitialized, setFeedPosts]);

  /**
   * 추가 게시물 로드 (무한 스크롤 등)
   */
  const fetchMorePosts = useCallback(async (pageSize = 10) => {
    if (!lastDoc || !hasMore || loading) return;

    setLoading(true);
    try {
      const { posts: fetchedPosts, lastDoc: last } = await postService.getPosts(lastDoc, pageSize);
      appendFeedPosts(fetchedPosts, last, fetchedPosts.length === pageSize);
    } catch (err) {
      console.error(err);
      setError('게시물을 추가로 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [lastDoc, hasMore, loading, appendFeedPosts]);

  /**
   * 유저별 게시물 로드 (캐싱 대상 아님)
   */
  const fetchUserPosts = useCallback(async (uid) => {
    setLoading(true);
    setError(null);
    try {
      return await postService.getUserPosts(uid);
    } catch (err) {
      console.error(err);
      setError('유저 게시물을 불러오는 중 오류가 발생했습니다.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 게시물 삭제 시 로컬 상태도 업데이트
   */
  const deletePostExtended = async (postId) => {
    try {
      await postService.deletePost(postId);
      removeLocalPost(postId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    posts,
    loading,
    error,
    hasMore,
    fetchInitialPosts,
    fetchMorePosts,
    fetchUserPosts,
    resetFeed,
    createPost: postService.createPost,
    updatePost: postService.updatePost,
    deletePost: deletePostExtended,
    getPost: postService.getPost,
  };
};

