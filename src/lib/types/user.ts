export type UserRole = 'Admin' | 'PrimeUser' | 'RegularUser' | 'Viewer';

export interface User {
  userName: string;
  userPhone: string;
  userEmail: string;
  userRole: UserRole;
  createdAt: string;
  lastLoggedInAt: string;
}

export type UserSearchFields = 'userName' | 'userEmail' | 'userPhone';

export type Assignee = {
  userName: string;
  userRole: UserRole;
};
