'use client';

import { UserList } from '@/components/users/user-list';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ErrorPage } from '@/components/errors/error-page';

export default function UsersPage() {
  const router = useRouter()
  const { user } = useAuthStore();
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

  // if (user?.userRole === 'Viewer') {
  //   return (
  //     <ErrorPage
  //       title="Access Denied"
  //       description="You are not authorized to access this page"
  //       imageUrl="/unauthorized.svg"
  //     />
  //   );
  // }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">User Management</h1>
      <UserList />
    </main>
  );
} 