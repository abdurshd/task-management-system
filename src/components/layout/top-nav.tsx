'use client'

import { useAuthStore } from "@/lib/store/auth-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "next/navigation"

export function TopNav() {
  const { user, logout } = useAuthStore()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 justify-between">
        <div className="flex items-center space-x-4">
          {pathname === '/dashboard/tasks' && <h1 className="text-2xl font-bold">Tasks</h1>}
          {pathname === '/dashboard/users' && <h1 className="text-2xl font-bold">Users</h1>}
        </div>
        
        <div className="flex items-center space-x-4">
          <span>{user?.userName}</span>
          <span className="text-sm text-muted-foreground">{user?.userRole}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user?.userName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.userRole}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
} 