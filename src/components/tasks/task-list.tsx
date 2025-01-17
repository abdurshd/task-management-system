'use client'

import React, { useEffect, useState } from 'react';
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
import { ChevronUp, ChevronDown, CopyCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
type SortDirection = 'asc' | 'desc' | null;
type SortConfig = {
  column: string;
  direction: SortDirection;
};

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
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    column: '', 
    direction: null 
  });

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

  const handleSort = (column: string) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig.column === column) {
      if (sortConfig.direction === 'asc') direction = 'desc';
      else if (sortConfig.direction === 'desc') direction = null;
      else direction = 'asc';
    }
    
    setSortConfig({ column, direction });
  };

  const getSortedTasks = () => {
    if (!sortConfig.direction) return filteredTasks;

    return [...filteredTasks].sort((a, b) => {
      const aValue = a[sortConfig.column as keyof typeof a] ?? '';
      const bValue = b[sortConfig.column as keyof typeof b] ?? '';

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  };

  const getSortIcon = (column: string) => {
    const isActive = sortConfig.column === column;
    return (
      <div className="ml-2">
          <div className="flex flex-col">
              <ChevronUp className={cn(
                  "h-3 w-3 -mb-1",
                  isActive && sortConfig.direction === 'asc' ? "text-[#000000] text-bold" : "text-gray-400"
              )} />
              <ChevronDown className={cn(
                  "h-3 w-3",
                  isActive && sortConfig.direction === 'desc' ? "text-[#000000]  text-bold" : "text-gray-400"
              )} />
          </div>
      </div>
    );
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
          <h3 className="font-bold">상태</h3>
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
      <hr className="border-t border-[#e2e2e2] w-full p-0 m-0 pb-10" />
      
      <div className="max-h-[55vh] overflow-y-auto border-b-[2px] border-[#b3b3b3]">
        <div className="sticky top-0 bg-white z-50">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  { key: 'taskName', label: 'Task Name', width: '11%' },
                  { key: 'taskType', label: 'Type', width: '7%' },
                  { key: 'createdAt', label: 'Created At', width: '15%' },
                  { key: 'dueDate', label: 'Due Date', width: '16%' },
                  { key: 'reporter', label: 'Reporter', width: '14%' },
                  { key: 'taskDescription', label: 'Description', width: '15%' },
                  { key: 'assignee', label: '담당자(Assignee)', width: '12%' },
                  { key: 'status', label: '상태(Status)', width: '12%' }
                ].map(({ key, label, width }) => (
                  <TableHead key={key} style={{ width }}>
                    <Button
                        variant="ghost"
                        onClick={() => handleSort(key)}
                        className={cn(
                            "w-full flex items-center justify-center gap-1 hover:text-[#289b9b] text-[#000000] font-bold",
                            sortConfig.column === key && sortConfig.direction && "text-[#289b9b] font-bold"
                        )}
                    >
                      {label === 'Task Name' ? (
                        <div className="flex items-center gap-1">
                          <CopyCheck className="w-4 h-4 text-[#289b9b]" />
                          <span>Task Name</span>
                        </div>
                      ) : label}
                      {getSortIcon(key)}
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <Table>
          <TableBody>
            {getSortedTasks().map((task) => (
              <TableRow key={`${task.taskName}-${task.createdAt}`}>
                <TableCell className="text-center w-[15%] whitespace-nowrap overflow-hidden text-ellipsis">{task.taskName}</TableCell>
                <TableCell className="text-center w-[10%] whitespace-nowrap overflow-hidden text-ellipsis">{task.taskType}</TableCell>
                <TableCell className="text-center w-[12%] whitespace-nowrap overflow-hidden text-ellipsis">{task.createdAt}</TableCell>
                <TableCell className="text-center w-[12%] whitespace-nowrap overflow-hidden text-ellipsis">{task.dueDate}</TableCell>
                <TableCell className="text-center w-[12%] whitespace-nowrap overflow-hidden text-ellipsis">{task.reporter}</TableCell>
                <TableCell className="text-center w-[15%] whitespace-nowrap overflow-hidden text-ellipsis">{task.taskDescription}</TableCell>
                <TableCell className="text-center w-[12%] whitespace-nowrap overflow-hidden text-ellipsis">{task.assignee}</TableCell>
                <TableCell className="text-center w-[12%] whitespace-nowrap overflow-hidden text-ellipsis">{task.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}