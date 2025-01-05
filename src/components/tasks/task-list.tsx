'use client'

import { useEffect, useState } from 'react';
import { useTaskStore } from '@/lib/store/task-store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { TaskForm } from './taskForm';
import { TaskStatus, TaskType, TaskSearchFields, Task } from '@/lib/types/task';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/lib/store/auth-store';
import { useErrorHandler } from '@/hooks/use-error-handler';
import { ErrorBoundary } from '@/components/errors/error-boundary';


export function TaskList() {
  const { filteredTasks, setTasks, setFilters } = useTaskStore();    
  const { user } = useAuthStore();
  const [searchField, setSearchField] = useState<TaskSearchFields>('taskName');
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TaskType[]>([]);
  
  // New state for storing initial options
  const [initialStatuses, setInitialStatuses] = useState<TaskStatus[]>([]);
  const [initialTypes, setInitialTypes] = useState<TaskType[]>([]);
  const { handleError } = useErrorHandler();
  const [isOpen, setIsOpen] = useState(false);
  // Fetch data only once on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const tasks = await response.json();

        let filteredTasks = tasks;
        if (user?.userRole === 'RegularUser') {
          filteredTasks = tasks.filter((t: Task) => t.reporter === user.userName);
        } else if (user?.userRole === 'Viewer') {
          filteredTasks = tasks.filter((t: Task) => t.assignee === user.userName);
        }

        setTasks(filteredTasks);
        
        // Set initial options from all tasks
        const statuses = Array.from(new Set(filteredTasks.map((t: Task) => t.status))) as TaskStatus[];
        const types = Array.from(new Set(filteredTasks.map((t: Task) => t.taskType))) as TaskType[];
        
        setInitialStatuses(statuses);
        setInitialTypes(types);
        setSelectedStatuses(statuses);
        setSelectedTypes(types);
        setFilters({ status: statuses, type: types });
      } catch (error) {
        await handleError({
          type: 'API',
          message: 'Failed to fetch tasks. Please try again.',
          action: 'RETRY',
          retryCallback: () => fetchTasks()
        });
      }
    };
    fetchTasks();
  }, [user, setTasks, setFilters]);

  const handleStatusChange = (status: TaskStatus | 'ALL', checked: boolean) => {
    const newStatuses = status === 'ALL'
      ? (checked ? initialStatuses : [])
      : (checked
        ? [...selectedStatuses, status]
        : selectedStatuses.filter(s => s !== status));
    
    setSelectedStatuses(newStatuses);
    setFilters({ status: newStatuses }); 
  };

  const handleTypeChange = (type: TaskType | 'ALL', checked: boolean) => {
    const newTypes = type === 'ALL'
      ? (checked ? initialTypes : [])
      : (checked
        ? [...selectedTypes, type]
        : selectedTypes.filter(t => t !== type));
    
    setSelectedTypes(newTypes);
    setFilters({ type: newTypes});
  };

  const handleSearchFieldChange = (value: TaskSearchFields) => {
    setSearchField(value);
    setFilters({ searchField: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-center gap-4">
          <Select 
            value={searchField}
            onValueChange={(value) => handleSearchFieldChange(value as TaskSearchFields)}
          >
            <SelectTrigger>
              <SelectValue defaultValue="taskName"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="taskName">Task Name</SelectItem>
              <SelectItem value="reporter">Reporter</SelectItem>
              <SelectItem value="taskDescription">Description</SelectItem>
              <SelectItem value="assignee">담당자 (Assignee)</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Search"
            className="w-[200px]"
            onChange={(e) => setFilters({ searchTerm: e.target.value })}
          />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button disabled={user?.userRole === 'Viewer'}>Create Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Task 생성</DialogTitle>
                <DialogDescription className="invisible">
                  Fill in the details below to create a new task.
                </DialogDescription>
              </DialogHeader>
              <ErrorBoundary>
                <TaskForm onClose={() => setIsOpen(false)} />
              </ErrorBoundary>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center text-[#289b9b] font-bold">
        <span>Selected</span>
        <span className="ml-1 flex items-center justify-center border-2 border-[#289b9b] rounded-full text-sm px-1">
          {filteredTasks.length}
        </span>
      </div>

      <hr className="border-t-[3px] border-[#949494] w-full p-0 m-0" />

      <div className="flex flex-col">
        <div className="flex space-x-2 mb-2">
          <h3 className="font-medium">Task Type</h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="type-all"
              checked={selectedTypes.length === initialTypes.length}
              onCheckedChange={(checked) => handleTypeChange('ALL', checked as boolean)}
            />
            <label htmlFor="type-all">ALL</label>
          </div>
          {initialTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onCheckedChange={(checked) => handleTypeChange(type, checked as boolean)}
              />
              <label htmlFor={`type-${type}`}>{type}</label>
            </div>
          ))}
        </div>

        <hr className="border-t border-[#e2e2e2] w-full p-0 m-0" />

        <div className="flex space-x-2 mt-2">
          <h3 className="font-medium">상태</h3>
          <div className="flex fl items-center space-x-2">
            <Checkbox
              id="status-all"
              checked={selectedStatuses.length === initialStatuses.length}
              onCheckedChange={(checked) => handleStatusChange('ALL', checked as boolean)}
            />
            <label htmlFor="status-all">ALL</label>
          </div>
          {initialStatuses.map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={selectedStatuses.includes(status)}
                onCheckedChange={(checked) => handleStatusChange(status, checked as boolean)}
              />
              <label htmlFor={`status-${status}`}>{status}</label>
            </div>
          ))}
        </div>
      </div>
      <hr className="border-t border-[#e2e2e2] w-full p-0 m-0" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => (
            <TableRow key={`${task.taskName}-${task.createdAt}`}>
              <TableCell>{task.taskName}</TableCell>
              <TableCell>{task.taskType}</TableCell>
              <TableCell>{new Date(task.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>{task.reporter}</TableCell>
              <TableCell>{task.taskDescription}</TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell> {task.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}