import { TaskList } from '@/components/tasks/task-list';

export default function DashboardPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Task Management Dashboard</h1>
      <TaskList />
    </main>
  );
} 