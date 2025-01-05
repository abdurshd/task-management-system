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
  DialogDescription,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { useErrorHandler } from '@/hooks/use-error-handler';

export default function LoginModal() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore(state => state.login);
  const { user } = useAuthStore();
  const [password, setPassword] = useState('');
  const { handleError } = useErrorHandler();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email);
      toast({
        title: "로그인 성공",
        description: "대시보드로 이동합니다.",
        variant: "success"
      });
      
      if (user?.userRole === 'Viewer') {
        router.push('/dashboard/tasks');
      } else {
        router.push('/dashboard/users');
      }
    } catch (error) {
      await handleError({
        type: 'AUTH',
        message: '이메일 주소 또는 비밀번호가 올바르지 않습니다.',
        action: 'TOAST'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = password.length >= 6;
  
  return (
    <Dialog open>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Login</DialogTitle>
          <DialogDescription className="invisible">
          태스크 생성 및 관리가 가능한 웹사이트 로그인 페이지입니다.
          </DialogDescription>
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
              <p className="text-sm text-red-500">이메일 주소를 올바르게 입력해주세요.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>비밀번호</Label>
            <Input
              type="password"
              placeholder="비밀번호를 입력해 주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={password && !isValidPassword ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {password && !isValidPassword && (
              <p className="text-sm text-red-500">비밀번호는 최소 6자 이상이어야 합니다.</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button">
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={!isValidEmail || isLoading || !isValidPassword}
              className="min-w-[100px]"
            >
              {isLoading ? "로딩중..." : "로그인"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}