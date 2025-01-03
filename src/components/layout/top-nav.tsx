'use client'

import { useState } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { usePathname, useRouter } from "next/navigation"
import { UserRound } from 'lucide-react'

export function TopNav() {
  const { user, logout } = useAuthStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    setIsDialogOpen(false)
    setIsDropdownOpen(false)
    router.push('/')
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex-1 flex items-center space-x-4 ml-4">
          {pathname === '/dashboard/tasks' && <h1 className="text-2xl font-bold">Task List</h1>}
          {pathname === '/dashboard/users' && <h1 className="text-2xl font-bold">User List</h1>}
        </div>
        
        <div className="flex items-center space-x-4 ml-auto">
          <span className="text-[#2d61f5]">{user?.userName}</span>
          <span className="text-sm text-[#2d61f5]">{user?.userRole}</span>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <UserRound className="text-black h-5 w-5" />
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
              <DropdownMenuItem onSelect={(e) => {
                e.preventDefault()
                setIsDialogOpen(true)
              }}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="w-[300px]">
              <DialogHeader className="flex justify-center items-center">
                <DialogTitle>Log out</DialogTitle>
                <DialogDescription>
                  Are you sure you want to log out?
                </DialogDescription>
              </DialogHeader>
              <div className="flex space-x-2 justify-center items-center">
                  <Button variant="destructive" onClick={handleLogout}>Log out</Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
} 