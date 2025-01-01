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
import { TaskStatus, TaskType } from '@/lib/types/task';

export function TaskList() {
  const { 
    filteredTasks, 
    setTasks,
    setFilters 
  } = useTaskStore();
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TaskType[]>([]);

  const statuses: TaskStatus[] = ['Created', 'In Progress', 'Done', 'Delayed'];
  const types: TaskType[] = ['물품구매', '택배요청'];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const tasks = await response.json();
        setTasks(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [setTasks]);

  const handleStatusChange = (status: TaskStatus | 'ALL', checked: boolean) => {
    const newStatuses = status === 'ALL'
      ? (checked ? statuses : [])
      : (checked
        ? [...selectedStatuses, status]
        : selectedStatuses.filter(s => s !== status));
    
    setSelectedStatuses(newStatuses);
    setFilters({ status: newStatuses.length ? newStatuses : [] });
  };

  const handleTypeChange = (type: TaskType | 'ALL', checked: boolean) => {
    const newTypes = type === 'ALL'
      ? (checked ? types : [])
      : (checked
        ? [...selectedTypes, type]
        : selectedTypes.filter(t => t !== type));
    
    setSelectedTypes(newTypes);
    setFilters({ type: newTypes.length ? newTypes : [] });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-center gap-4">
          <Input
            placeholder="Search tasks..."
            className="w-[200px]"
            onChange={(e) => setFilters({ searchTerm: e.target.value })}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#2A9D8F] hover:bg-[#238377]">Create Task</Button>
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

      <div className="flex gap-8">
        <div className="space-y-2">
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

        <div className="space-y-2">
          <h3 className="font-medium">Status</h3>
          <div className="flex items-center space-x-2">
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