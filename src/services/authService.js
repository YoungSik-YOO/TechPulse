// src/services/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export const authService = {
  // 이메일 회원가입
  signUpWithEmail: async (email, password) => {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  // 이메일 로그인
  signInWithEmail: async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  // Google 로그인
  signInWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        error.friendlyMessage = '브라우저에서 팝업이 차단되었습니다. 팝업을 허용한 뒤 다시 시도해주세요.';
      }
      console.error('Error with Google login:', error);
      throw error;
    }
  },

  // GitHub 로그인
  signInWithGithub: async () => {
    try {
      const provider = new GithubAuthProvider();
      return await signInWithPopup(auth, provider);
    } catch (error) {
      if (error.code === 'auth/popup-blocked') {
        error.friendlyMessage = '브라우저에서 팝업이 차단되었습니다. 팝업을 허용한 뒤 다시 시도해주세요.';
      }
      console.error('Error with Github login:', error);
      throw error;
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      return await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // 인증 상태 리스너
  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};
