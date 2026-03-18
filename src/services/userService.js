// src/services/userService.js
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';

export const userService = {
  /**
   * 유저 프로필 생성 또는 초기화
   */
  createUserProfile: async (uid, userData) => {
    const userRef = doc(db, 'users', uid);
    const initialData = {
      uid,
      displayName: userData.displayName || 'TechRunner',
      email: userData.email,
      photoURL: userData.photoURL || '',
      bio: '',
      techStacks: [],
      career: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    return await setDoc(userRef, initialData, { merge: true });
  },

  /**
   * 유저 프로필 조회
   */
  getUserProfile: async (uid) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  },

  /**
   * 유저 프로필 업데이트
   */
  updateUserProfile: async (uid, updateData) => {
    const userRef = doc(db, 'users', uid);
    const dataWithTimestamp = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };
    return await updateDoc(userRef, dataWithTimestamp);
  }
};
