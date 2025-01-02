'use client'

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserRole, UserSearchFields } from '@/lib/types/user';
import { useUserStore } from '@/lib/store/user-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';


export function UserList() {
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState<UserSearchFields>('userName');
    const { setUsers, filteredUsers, setFilters } = useUserStore();


    const [initialRoles, setInitialRoles] = useState<UserRole[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (user?.userRole === 'Viewer') {
            router.push('/dashboard/tasks');
        }
    }, [user, router]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) throw new Error('Failed to fetch users');
                const users = await response.json();
                
                let filteredUsers = users;
                if (user?.userRole === 'RegularUser') {
                    filteredUsers = users.filter((u: User) => u.userEmail === user.userEmail);
                } else if (user?.userRole === 'Viewer') {
                    filteredUsers = [];
                } else {
                    filteredUsers = users;
                }

                setUsers(filteredUsers);
                
                // Set initial roles from fetched data
                const roles = Array.from(new Set(filteredUsers.map((u: User) => u.userRole))) as UserRole[];
                setInitialRoles(roles);
                setSelectedRoles(roles);
                setFilters({ role: roles });
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, [setUsers, user, setFilters]);
    
      // Only show controls for Admin and PrimeUser
      const showControls = user?.userRole === 'Admin' || user?.userRole === 'PrimeUser';
    

      const handleRoleChange = (role: UserRole | 'ALL', checked: boolean) => {
        const newRoles = role === 'ALL'
            ? (checked ? initialRoles : [])
            : (checked
                ? [...selectedRoles, role]
                : selectedRoles.filter(r => r !== role));
        
        setSelectedRoles(newRoles);
        setFilters({ role: newRoles });
    };

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
        setFilters({ searchTerm: newSearchTerm });
    };

    const handleSearchFieldChange = (value: UserSearchFields) => {
        setSearchField(value);
        setFilters({ searchField: value });
    };

    return (
        <div className="space-y-4">
            {showControls && (
            <div className="flex justify-between items-center">
                <div className="flex flex-row items-center gap-4">
                <Select 
                    value={searchField}
                    onValueChange={handleSearchFieldChange}
                >
                    <SelectTrigger>
                    <SelectValue defaultValue="userName"/>
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="userName">User Name</SelectItem>
                    <SelectItem value="userEmail">User Email</SelectItem>
                    <SelectItem value="userPhone">User Phone</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    placeholder="Search"
                    className="w-[200px]"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                />
                <Button disabled={user?.userRole === 'PrimeUser'}>Invite User</Button>
                </div>
            </div>
            )}

            {showControls && (
                <>
                <div className="flex items-center text-[#289b9b] font-bold">
                    <span>Selected</span>
                    <span className="ml-1 flex items-center justify-center border-2 border-[#289b9b] rounded-full text-sm px-1">
                        {filteredUsers.length}
                    </span>
                </div>

                <hr className="border-t-[3px] border-[#949494] w-full p-0 m-0" />

                <div className="flex gap-4">
                {user?.userRole === 'Admin' && (
                    <>
                        <div className="flex items-center gap-2">
                        <Checkbox
                            id="role-all"
                            checked={selectedRoles.length === initialRoles.length}
                            onCheckedChange={(checked) => handleRoleChange('ALL', checked as boolean)}
                        />
                        <label htmlFor="role-all" className="text-sm font-medium leading-none">
                            ALL
                        </label>
                        </div>
                        {initialRoles.map((role) => (
                        <div key={role} className="flex items-center gap-2">
                            <Checkbox
                            id={`role-${role}`}
                            checked={selectedRoles.includes(role)}
                            onCheckedChange={(checked) => handleRoleChange(role, checked as boolean)}
                            />
                            <label htmlFor={`role-${role}`} className="text-sm font-medium leading-none">
                            {role}
                            </label>
                        </div>
                        ))}
                    </>
                )}
                </div>
                </>
            )}

            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>User Name</TableHead>
                    <TableHead>User Email</TableHead>
                    <TableHead>User Role</TableHead>
                    <TableHead>User Phone</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Last Logged In At</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredUsers.map((user) => (
                    <TableRow key={user.userEmail}>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.userEmail}</TableCell>
                    <TableCell>{user.userRole}</TableCell>
                    <TableCell>{user.userPhone}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{new Date(user.lastLoggedInAt).toLocaleString()}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
    );
} 