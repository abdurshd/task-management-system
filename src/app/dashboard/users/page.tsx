'use client';

import { UserList } from '@/components/users/user-list';
import { useAuthStore } from '@/lib/store/auth-store';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function UsersPage() {
  const {isAuthenticated} = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/');
    }
  }, [isAuthenticated]);

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">User Management</h1>
      <UserList />
    </main>
  );
} 