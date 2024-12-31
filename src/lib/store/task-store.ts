import { create } from 'zustand';
import { Task, TaskStatus, TaskType } from '../types/task';

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  statusFilter: TaskStatus | 'ALL';
  typeFilter: TaskType | 'ALL';
  searchTerm: string;
  setTasks: (tasks: Task[]) => void;
  setStatusFilter: (status: TaskStatus | 'ALL') => void;
  setTypeFilter: (type: TaskType | 'ALL') => void;
  setSearchTerm: (term: string) => void;
  createTask: (task: Omit<Task, 'createdAt' | 'completedAt'>) => void;
  filterTasks: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  filteredTasks: [],
  statusFilter: 'ALL',
  typeFilter: 'ALL',
  searchTerm: '',
  
  setTasks: (tasks) => {
    set({ tasks });
    get().filterTasks();
  },
  
  setStatusFilter: (status) => {
    set({ statusFilter: status });
    get().filterTasks();
  },
  
  setTypeFilter: (type) => {
    set({ typeFilter: type });
    get().filterTasks();
  },
  
  setSearchTerm: (term) => {
    set({ searchTerm: term });
    get().filterTasks();
  },
  
  createTask: (task) => {
    const newTask = {
      ...task,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    set(state => ({ tasks: [...state.tasks, newTask] }));
    get().filterTasks();
  },
  
  filterTasks: () => {
    const { tasks, statusFilter, typeFilter, searchTerm } = get();
    
    let filtered = tasks;
    
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(task => task.taskType === typeFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    set({ filteredTasks: filtered });
  },
}));