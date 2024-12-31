export type UserRole = 'Admin' | 'PrimeUser' | 'RegularUser' | 'Viewer';

export interface User {
  userName: string;
  userPhone: string;
  userEmail: string;
  userRole: UserRole;
  createdAt: string;
  lastLoggedInAt: string;
}