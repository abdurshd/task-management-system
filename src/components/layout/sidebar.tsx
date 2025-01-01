'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/auth-store';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <div className={cn(
      "h-screen bg-[#289b9b] transition-all duration-300",
      collapsed ? "w-[60px]" : "w-[240px]"
    )}>
      <div className="flex justify-end p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-white hover:bg-[#238377] rounded-lg"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      
      <nav className="space-y-2 p-4">
        {user?.userRole !== 'Viewer' && (
          <Link 
            href="/dashboard/users" 
            className={cn(
              "flex items-center text-white hover:bg-[#238377] rounded-lg p-2",
              pathname === '/dashboard/users' && "bg-[#1b6868]"
            )}
          >
            <Users className="h-5 w-5" />
            {!collapsed && <span className="ml-2">Users</span>}
          </Link>
        )}
        <Link 
          href="/dashboard/tasks" 
          className={cn(
            "flex items-center text-white hover:bg-[#238377] rounded-lg p-2",
            pathname === '/dashboard/tasks' && "bg-[#1b6868]"
          )}
        >
          <ClipboardList className="h-5 w-5" />
          {!collapsed && <span className="ml-2">Tasks</span>}
        </Link>
      </nav>
    </div>
  );
} 