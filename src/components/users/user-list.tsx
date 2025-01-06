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
import { useErrorHandler } from '@/hooks/use-error-handler';
import {  ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortDirection = 'asc' | 'desc' | null;
type SortConfig = {
  column: string;
  direction: SortDirection;
};

export function UserList() {
    const { user } = useAuthStore();
    const { handleError } = useErrorHandler();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState<UserSearchFields>('userName');
    const { setUsers, filteredUsers, setFilters } = useUserStore();


    const [initialRoles, setInitialRoles] = useState<UserRole[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);

    const [sortConfig, setSortConfig] = useState<SortConfig>({ 
      column: '', 
      direction: null 
    });

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
                await handleError({
                    type: 'API',
                    message: 'Failed to fetch users. Please try again.',
                    action: 'RETRY',
                    retryCallback: () => fetchUsers()
                });
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

    const handleSort = (column: string) => {
        let direction: SortDirection = 'asc';
        
        if (sortConfig.column === column) {
            if (sortConfig.direction === 'asc') direction = 'desc';
            else if (sortConfig.direction === 'desc') direction = null;
            else direction = 'asc';
        }
        
        setSortConfig({ column, direction });
    };

    const getSortedUsers = () => {
        if (!sortConfig.direction) return filteredUsers;

        return [...filteredUsers].sort((a, b) => {
            const aValue = a[sortConfig.column as keyof typeof a] ?? '';
            const bValue = b[sortConfig.column as keyof typeof b] ?? '';

            if (sortConfig.direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            return aValue < bValue ? 1 : -1;
        });
    };

    const getSortIcon = (column: string) => {
        const isActive = sortConfig.column === column;
        return (
            <div className="ml-2">
                <div className="flex flex-col">
                    <ChevronUp className={cn(
                        "h-3 w-3 -mb-1",
                        isActive && sortConfig.direction === 'asc' ? "text-[#000000] text-bold" : "text-gray-400"
                    )} />
                    <ChevronDown className={cn(
                        "h-3 w-3",
                        isActive && sortConfig.direction === 'desc' ? "text-[#000000]  text-bold" : "text-gray-400"
                    )} />
                </div>
            </div>
        );
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
                <h3 className="font-bold">사용자 권한</h3>
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

            <hr className="border-t border-[#e2e2e2] w-full p-0 m-0 pb-10" />

            <div className="max-h-[55vh] overflow-y-auto border-b-[2px] border-[#b3b3b3]">
                <div className="sticky top-0 bg-white z-50">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {[
                                    { key: 'userName', label: 'User Name' },
                                    { key: 'userEmail', label: 'User Email' },
                                    { key: 'userRole', label: 'User Role' },
                                    { key: 'userPhone', label: 'User Phone' },
                                    { key: 'createdAt', label: 'Created At' },
                                    { key: 'lastLoggedInAt', label: 'Last Logged In At' }
                                ].map(({ key, label }) => (
                                    <TableHead key={key}>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort(key)}
                                            className={cn(
                                                "flex items-center gap-1 hover:text-[#289b9b] text-[#000000] font-bold",
                                                sortConfig.column === key && sortConfig.direction && "text-[#289b9b] font-bold"
                                            )}
                                        >
                                            {label}
                                            {getSortIcon(key)}
                                        </Button>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                    </Table>
                </div>

                <Table>
                    <TableBody>
                        {getSortedUsers().map((user) => (
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
        </div>
    );
} 