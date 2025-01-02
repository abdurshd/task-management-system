'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/auth-store';
import { ClipboardCheck } from 'lucide-react';
import { PanesIcon } from '@/components/ui/panes-icon';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  return (
    <div className={cn(
      "flex flex-col bg-[#289b9b] min-h-screen transition-all duration-300 relative",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="absolute -right-4 top-12">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-white bg-[#1b6868] hover:bg-[#238377] rounded-full w-8 h-8 flex items-center justify-center"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      
      <nav className="space-y-2 p-4 mt-16 font-bold">
        {user?.userRole !== 'Viewer' && (
          <Link 
            href="/dashboard/users" 
            className={cn(
              "flex items-center text-white hover:bg-[#238377] rounded-lg p-2",
              pathname === '/dashboard/users' && "bg-[#1b6868]"
            )}
          >
            <PanesIcon className={`text-white ${collapsed ? "h-4 w-4 m-0" : "h-5 w-5"}`}  />
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
          <ClipboardCheck className={`text-white ${collapsed ? "h-4 w-4 m-0" : "h-5 w-5"}`} />
          {!collapsed && <span className="ml-2">Tasks</span>}
        </Link>
      </nav>
    </div>
  );
} 