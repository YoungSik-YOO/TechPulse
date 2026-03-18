// src/hooks/useAuthInit.js
import { useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { useAuthStore } from '../store/authStore';

export const useAuthInit = () => {
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (firebaseUser) => {
      const state = useAuthStore.getState();

      if (firebaseUser) {
        if (state.user?.uid === firebaseUser.uid && !state.loading) return;

        useAuthStore.setState({ loading: true });

        try {
          const basicData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          };

          let profileData = await userService.getUserProfile(firebaseUser.uid);

          if (!profileData) {
            await userService.createUserProfile(firebaseUser.uid, basicData);
            profileData = await userService.getUserProfile(firebaseUser.uid);
          }

          useAuthStore.getState().setUser({ ...basicData, ...profileData });
        } catch (error) {
          console.error('Failed to sync user profile:', error);
          useAuthStore.getState().setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        }
      } else {
        if (state.isLoggedIn || state.user) {
          useAuthStore.getState().clearUser();
        } else {
          useAuthStore.setState({ loading: false });
        }
      }
    });

    return () => unsubscribe();
  }, []);
};

