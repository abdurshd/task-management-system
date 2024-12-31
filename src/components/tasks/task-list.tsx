'use client'

import { useEffect } from 'react';
import { useTaskStore } from '@/lib/store/task-store';
import { useAuthStore } from '@/lib/store/auth-store';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TaskStatus = 'ALL' | 'Created' | 'In Progress' | 'Done' | 'Delayed';
type TaskType = 'ALL' | '물품구매' | '택배요청';

export function TaskList() {
  const user = useAuthStore(state => state.user);
  const { 
    filteredTasks, 
    setTasks,
    setStatusFilter,
    setTypeFilter,
    setSearchTerm 
  } = useTaskStore();

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/api/tasks');
      const tasks = await response.json();
      setTasks(tasks);
    };
    fetchTasks();
  }, [setTasks]);

  const canCreateTask = user?.userRole !== 'Viewer';

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Select onValueChange={(value: TaskStatus | 'ALL') => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="Created">Created</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
              <SelectItem value="Delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value: TaskType | 'ALL') => setTypeFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="물품구매">물품구매</SelectItem>
              <SelectItem value="택배요청">택배요청</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Search tasks..."
            className="w-[200px]"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {canCreateTask && (
          <Button>Create Task</Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => (
            <TableRow key={task.taskName}>
              <TableCell>{task.taskName}</TableCell>
              <TableCell>{task.taskType}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}