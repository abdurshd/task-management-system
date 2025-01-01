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

type UserRole = 'Admin' | 'PrimeUser' | 'RegularUser' | 'Viewer';

interface User {
  userName: string;
  userEmail: string;
  userRole: UserRole;
  userPhone: string;
  createdAt: string;
  lastLoggedInAt: string;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<'userName' | 'userEmail' | 'userPhone'>('userName');

  const roles: UserRole[] = ['Admin', 'PrimeUser', 'RegularUser', 'Viewer'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const users = await response.json();
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [setUsers]);

  const handleRoleChange = (role: UserRole | 'ALL', checked: boolean) => {
    if (role === 'ALL') {
      setSelectedRoles(checked ? roles : []);
    } else {
      const newRoles = checked
        ? [...selectedRoles, role]
        : selectedRoles.filter(r => r !== role);
      setSelectedRoles(newRoles);
    }
  };

  const filteredUsers = users.filter(user => {
    if (selectedRoles.length > 0 && !selectedRoles.includes(user.userRole)) {
      return false;
    }
    if (searchTerm) {
      return user[searchField].toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-center gap-4">
          <Select 
            value={searchField}
            onValueChange={(value) => setSearchField(value as 'userName' | 'userEmail' | 'userPhone')}
          >
            <SelectTrigger>
              <SelectValue defaultValue="userName" placeholder="Search by..." />
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="role-all"
                checked={selectedRoles.length === roles.length}
                onCheckedChange={(checked) => handleRoleChange('ALL', checked as boolean)}
              />
              <label htmlFor="role-all" className="text-sm font-medium leading-none">
                ALL
              </label>
            </div>
            {roles.map((role) => (
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
          </div>
        </div>
        <Button>Invite User</Button>
      </div>

      <div className="text-sm text-muted-foreground">
        Selected ({selectedRoles.length})
      </div>

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