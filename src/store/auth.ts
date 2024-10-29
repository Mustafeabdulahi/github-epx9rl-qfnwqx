import { create } from 'zustand';
import { AuthState } from '../types';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { email: userEmail, uid } = userCredential.user;
      
      set({ 
        user: {
          id: uid,
          email: userEmail!,
          name: 'Admin User',
          role: 'admin'
        }, 
        isLoading: false 
      });
      
      toast.success('Successfully logged in!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null });
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error logging out');
    }
  },

  clearError: () => set({ error: null }),
}));