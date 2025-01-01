// src/lib/store/task-store.ts
import { create } from 'zustand';
import { User, UserSearchFields, UserRole } from '@/lib/types/user';

interface UserState {
  users: User[];
  filteredUsers: User[];
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
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  filteredUsers: [],
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
    const response = await fetch('/api/users');
    const users = await response.json();
    set({ users });
  },
  setUsers: (users) => {
    set({ 
      users,
      filteredUsers: users
    });
  }
}));