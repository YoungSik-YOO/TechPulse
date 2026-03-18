// src/services/storageService.js
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { storage } from './firebaseConfig';

export const storageService = {
  /**
   * 이미지 업로드
   * @param {File} file 파일 객체
   * @param {string} path 저장 경로 (예: 'profiles/uid/avatar.png')
   */
  uploadImage: async (file, path) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  },

  /**
   * 프로필 이미지 업로드 전용
   */
  uploadProfileImage: async (uid, file) => {
    const extension = file.name.split('.').pop();
    const path = `profiles/${uid}/avatar_${Date.now()}.${extension}`;
    return await storageService.uploadImage(file, path);
  },

  /**
   * 프로필 배경 이미지 업로드 전용
   */
  uploadCoverImage: async (uid, file) => {
    const extension = file.name.split('.').pop();
    const path = `profiles/${uid}/cover_${Date.now()}.${extension}`;
    return await storageService.uploadImage(file, path);
  },

  /**
   * 게시물 이미지 업로드 전용
   */
  uploadPostImage: async (uid, file) => {
    const extension = file.name.split('.').pop();
    const path = `posts/${uid}/${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
    return await storageService.uploadImage(file, path);
  }
};
