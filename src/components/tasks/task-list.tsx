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

export function TaskList() {
  const { 
    filteredTasks, 
    setTasks,
    setFilters 
  } = useTaskStore();    
  const { user } = useAuthStore();

  const statuses: TaskStatus[] = Array.from(new Set(filteredTasks.map(task => task.status))); // TODO: this is supposed to be dynamic statuses instead of hardcoded statuses. the statuses should be unique statuses from the filteredTasks list's status field. Now it is not working well.
  const types: TaskType[] = Array.from(new Set(filteredTasks.map(task => task.taskType))); // TODO: this is supposed to be dynamic types instead of hardcoded types. the types should be unique types from the filteredTasks list's taskType field. Now it is not working well. 
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>(statuses);
  const [selectedTypes, setSelectedTypes] = useState<TaskType[]>(types);
  const [searchField, setSearchField] = useState<TaskSearchFields>('taskName');

  useEffect(() => {
    setFilters({ 
      status: statuses,
      type: types 
    });
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try { 
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const tasks = await response.json();

        let filteredTasks = tasks;

        // RegularUser 본인이 생성한 Task 리스트 노출
        if (user?.userRole === 'RegularUser') {
          filteredTasks = tasks.filter((t: Task) => t.reporter === user.userName);
          // Viewer  본인한테 할당된 Task 만 노출
        } else if (user?.userRole === 'Viewer') {
          filteredTasks = tasks.filter((t: Task) => t.assignee === user.userName);
        }
  
        setTasks(filteredTasks);

        setFilters({ 
          status: selectedStatuses,
          type: selectedTypes 
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [setTasks, user, selectedStatuses, selectedTypes, setFilters]);

  const handleStatusChange = (status: TaskStatus | 'ALL', checked: boolean) => {
    const newStatuses = status === 'ALL'
      ? (checked ? statuses : [])
      : (checked
        ? [...selectedStatuses, status]
        : selectedStatuses.filter(s => s !== status));
    
    setSelectedStatuses(newStatuses);
    setFilters({ status: newStatuses }); 
  };

  const handleTypeChange = (type: TaskType | 'ALL', checked: boolean) => {
    const newTypes = type === 'ALL'
      ? (checked ? types : [])
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
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={user?.userRole === 'Viewer'}>Create Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create a new task.
                </DialogDescription>
              </DialogHeader>
              <TaskForm />
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
              checked={selectedTypes.length === types.length}
              onCheckedChange={(checked) => handleTypeChange('ALL', checked as boolean)}
            />
            <label htmlFor="type-all">ALL</label>
          </div>
          {types.map((type) => (
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
              checked={selectedStatuses.length === statuses.length}
              onCheckedChange={(checked) => handleStatusChange('ALL', checked as boolean)}
            />
            <label htmlFor="status-all">ALL</label>
          </div>
          {statuses.map((status) => (
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
              <TableCell>{task.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}