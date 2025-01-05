import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type ErrorType = 'AUTH' | 'API' | 'VALIDATION' | 'NETWORK';

interface ErrorConfig {
  type: ErrorType;
  message: string;
  action?: 'REDIRECT' | 'RETRY' | 'TOAST';
  redirectPath?: string;
  retryCallback?: () => Promise<void>;
}

export function useErrorHandler() {
  const router = useRouter();

  const handleError = async ({ type, message, action, redirectPath, retryCallback }: ErrorConfig) => {
    // Log error for monitoring
    // console.error(`[${type}] ${message}`);

    switch (action) {
      case 'REDIRECT':
        if (redirectPath) {
          router.push(redirectPath);
        }
        break;
      
      case 'RETRY':
        if (retryCallback) {
          try {
            await retryCallback();
          } catch (error) {
            toast({
              title: 'Operation failed',
              description: 'Please try again later',
              variant: 'destructive',
            });
          }
        }
        break;
      
      case 'TOAST':
      default:
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
    }
  };

  return { handleError };
} 