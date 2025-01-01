'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

export default function LoginModal() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const { user } = useAuthStore();
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email);
      toast({
        title: "Login successful",
        description: "Redirecting to dashboard...",
        variant: "success"
      });
      if (user?.userRole === 'Viewer') {
        router.push('/dashboard/tasks');
      } else {
        router.push('/dashboard/users');
      }
    } catch (error: unknown) {
      console.error(error);
      toast({
        title: "Login failed",
        description: "Invalid email address. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>이메일</Label>
            <Input
              type="email"
              placeholder="이메일 주소를 입력해 주세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={email && !isValidEmail ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {email && !isValidEmail && (
              <p className="text-sm text-red-500">Please enter a valid email address</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>비밀번호</Label>
            <Input
              type="password"
              placeholder="비밀번호를 입력해 주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // className={password && !isValidPassword ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {/* {password && !isValidPassword && (
              <p className="text-sm text-red-500">Please enter a valid password</p>
            )} */}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isValidEmail || isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? "Loading..." : "Log-In"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}