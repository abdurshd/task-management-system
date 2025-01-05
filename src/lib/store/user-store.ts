// src/lib/store/task-store.ts
import { create } from 'zustand';
import { User, UserSearchFields, UserRole, Assignee } from '@/lib/types/user';
import { useAuthStore } from './auth-store';

interface UserState {
  users: User[];
  filteredUsers: User[];
  assignees: Assignee[];
  isLoading: boolean;
  error: Error | null;
  filters: {
    role: UserRole[];
    searchTerm: string;
    searchField: UserSearchFields;
  };
  setFilters: (filters: Partial<UserState['filters']>) => void;
  fetchUsers: () => Promise<void>;
  setUsers: (users: User[]) => void;
  getAssignees: () => Assignee[];
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  filteredUsers: [],
  assignees: [],
  isLoading: false,
  error: null,
  filters: {
    role: [],
    searchTerm: '',
    searchField: 'userName'
  },
  
  setFilters: (newFilters) => {
    const { users } = get();
    const filters = { ...get().filters, ...newFilters };
  
    let filtered = [...users];
  
    if (filters.role) {
      if (filters.role.length === 0) {
        filtered = [];
      } else if (filters.role.length > 0) {
        filtered = filtered.filter(user => filters.role.includes(user.userRole));
      }
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user[filters.searchField].toLowerCase().includes(term)
      );
    }
    
    set({ filters, filteredUsers: filtered }); 
  },

  fetchUsers: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/users');
      const users = await response.json();
      set({ users, filteredUsers: users });
      
      // Update assignees based on current user's role
      const currentUser = useAuthStore.getState().user;
      let assignees = users.map((user: User) => ({
        userName: user.userName,
        userRole: user.userRole
      }));

      if (currentUser?.userRole === 'RegularUser') {
        assignees = users.filter((u: User) => 
          u.userEmail === currentUser?.userEmail
        ).map((u: User) => ({
          userName: u.userName,
          userRole: u.userRole
        }));
      } else if (currentUser?.userRole === 'Viewer') {
        assignees = [];
      }

      set({ assignees });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  setUsers: (users) => {
    set({ 
      users,
      filteredUsers: users
    });
  },

  getAssignees: () => {
    return get().assignees;
  }
}));