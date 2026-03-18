// src/hooks/useAuth.js
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isLoggedIn, loading } = useAuthStore();

  return {
    user,
    isLoggedIn,
    loading,
    login: authService.signInWithEmail,
    signup: async (email, password, nickname) => {
      const userCredential = await authService.signUpWithEmail(email, password);
      const firebaseUser = userCredential.user;
      
      // 가입 즉시 프로필 생성 (닉네임 포함)
      await userService.createUserProfile(firebaseUser.uid, {
        email: firebaseUser.email,
        displayName: nickname || 'TechRunner',
      });
      
      return userCredential;
    },
    loginWithGoogle: authService.signInWithGoogle,
    loginWithGithub: authService.signInWithGithub,
    logout: authService.logout,
  };
};
