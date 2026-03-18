// src/services/postService.js
import { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  startAfter, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const POSTS_COLLECTION = 'posts';

export const postService = {
  /**
   * 게시물 작성
   */
  createPost: async (postData) => {
    try {
      return await addDoc(collection(db, POSTS_COLLECTION), {
        ...postData,
        groupId: postData.groupId || null,
        likes: 0,
        commentCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  /**
   * 게시물 단건 조회
   */
  getPost: async (postId) => {
    try {
      const postRef = doc(db, POSTS_COLLECTION, postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        return { id: postSnap.id, ...postSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  },

  /**
   * 게시물 목록 조회 (최근순, 페이지네이션 지원)
   */
  getPosts: async (lastVisible = null, pageSize = 10, groupId = null) => {
    try {
      let constraints = [orderBy('createdAt', 'desc'), limit(pageSize)];
      
      if (groupId) {
        constraints.unshift(where('groupId', '==', groupId));
      }
      
      let q = query(collection(db, POSTS_COLLECTION), ...constraints);

      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];

      return { posts, lastDoc };
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  },

  /**
   * 유저별 게시물 조회
   */
  getUserPosts: async (uid) => {
    try {
      const q = query(
        collection(db, POSTS_COLLECTION),
        where('authorId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting user posts:', error);
      throw error;
    }
  },

  /**
   * 게시물 수정
   */
  updatePost: async (postId, updateData) => {
    try {
      const postRef = doc(db, POSTS_COLLECTION, postId);
      return await updateDoc(postRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  /**
   * 게시물 삭제
   */
  deletePost: async (postId) => {
    try {
      return await deleteDoc(doc(db, POSTS_COLLECTION, postId));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
};

