import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserRole } from '@/lib/types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole[]) => boolean;
  hydrated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      hydrated: false,

      login: async (email: string) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          
          if (!response.ok) {
            throw new Error('Invalid credentials');
          }
          
          const user = await response.json();
          set({ user, isAuthenticated: true, hydrated: true });
        } catch (error) {
          throw error;
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      hasPermission: (requiredRoles: UserRole[]) => {
        const { user } = get();
        if (!user) return false;
        
        const roleHierarchy: Record<UserRole, number> = {
          'Admin': 4,
          'PrimeUser': 3,
          'RegularUser': 2,
          'Viewer': 1
        };
        
        const userRoleLevel = roleHierarchy[user.userRole];
        return requiredRoles.some(role => roleHierarchy[role] <= userRoleLevel);
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);