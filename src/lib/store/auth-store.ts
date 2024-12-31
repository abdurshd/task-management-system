import { create } from 'zustand';
import { User } from '../types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const user = await response.json();
      set({ user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },
  logout: () => set({ user: null, isAuthenticated: false })
}));