'use client';

import { TaskList } from '@/components/tasks/task-list';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ErrorPage } from '@/components/errors/error-page';

export default function TasksPage() {
  const router = useRouter();
  const { isAuthenticated, hydrated } = useAuthStore();

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, hydrated, router]);

  // Show loading or error state while hydrating
  if (!hydrated) {
    return null;
  }

  // if (!isAuthenticated) {
  //   return (
  //     <ErrorPage
  //       title="Access Denied"
  //       description="Please log in to access this page"
  //       imageUrl="/unauthorized.svg"
  //       showBackButton={false}
  //     />
  //   );
  // }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Task Management</h1>
      <TaskList />
    </main>
  );
} 