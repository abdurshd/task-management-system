import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          {/* TODO: Add error image */}
          <Image src="/error.svg" alt="error svg" />
          <h2 className="text-2xl font-bold mb-4">Something went wrong. Please reload the page.</h2>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}