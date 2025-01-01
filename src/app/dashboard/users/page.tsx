import { UserList } from '@/components/users/user-list';

export default function UsersPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">User Management</h1>
      <UserList />
    </main>
  );
} 