'use client';

import { TaskList } from '@/components/tasks/task-list';
import { useAuthStore } from '@/lib/store/auth-store';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function TasksPage() {
  const {isAuthenticated} = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login');
    }
  }, [isAuthenticated]);
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Task Management</h1>
      <TaskList />
    </main>
  );
} 