// src/lib/store/task-store.ts
import { create } from 'zustand';
import { Task, TaskSearchFields, TaskStatus, TaskType } from '@/lib/types/task';
// import { UserRole } from '@/lib/types/user';
import { useAuthStore } from './auth-store';
import { useErrorHandler } from '@/hooks/use-error-handler';

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  error: Error | null;
  filters: {
    status: TaskStatus[];
    type: TaskType[];
    searchTerm: string;
    searchField: TaskSearchFields;
  };
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  createTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  fetchTasks: () => Promise<void>;
  setTasks: (tasks: Task[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  isLoading: false,
  error: null,
  filters: {
    status: [],
    type: [],
    searchTerm: '',
    searchField: 'taskName'
  },
  
  setFilters: (newFilters) => {
    const { tasks } = get();
    const filters = { ...get().filters, ...newFilters };
    
    let filtered = [...tasks];
    
    // 테스크 필터링 - 모든 상태나 모든 유형 비선택시 테스크 표시 안함
    if (filters.status.length === 0 || filters.type.length === 0) {
      filtered = [];
    } else {
      // 테스크 상태 필터링 - 모든 상태 선택 시 모든 테스크 표시
      if (filters.status.length) {
        filtered = filtered.filter(task => filters.status.includes(task.status));
      }
      
      if (filters.type.length) {
        filtered = filtered.filter(task => filters.type.includes(task.taskType));
      }
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task[filters.searchField].toLowerCase().includes(term)
      );
    }
    
    // Role-based filtering
    const user = useAuthStore.getState().user;
    if (user?.userRole !== 'Admin' && user?.userRole !== 'PrimeUser') {
      filtered = filtered.filter(task => {
        if (user?.userRole === 'RegularUser') {
          return task.reporter === user?.userName;
        }
        return task.assignee === user?.userName;
      });
    }
    
    set({ filters, filteredTasks: filtered });
  },
  
  createTask: async (task) => {
    let retryCount = 0;
    const maxRetries = 3;

    const attemptCreate = async () => {
      try {
        set({ isLoading: true });
        
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to create task');
        }
        
        await get().fetchTasks();
        return data;
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          throw error;
        } else {
          throw error;
        }
      } finally {
        set({ isLoading: false });
      }
    };

    return attemptCreate();
  },
  
  fetchTasks: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const tasks = await response.json();
      set({ tasks, filteredTasks: tasks });
      get().setFilters({}); // Reapply filters
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
    
  setTasks: (tasks) => {
    set({ 
      tasks,
      filteredTasks: tasks
    });
  },
  
  setIsLoading: (loading: boolean) => set({ isLoading: loading })
}));