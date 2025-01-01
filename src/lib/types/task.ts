export type TaskStatus = 'Created' | 'In Progress' | 'Done' | 'Delayed';
export type TaskType = '물품구매' | '택배요청';
export type TaskSearchFields = 'taskName' | 'reporter' | 'taskDescription' | 'assignee';


export interface Task {
  taskType: TaskType;
  taskName: string;
  taskDescription: string;
  assignee: string;
  reporter: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  completedAt: string | null;
}
