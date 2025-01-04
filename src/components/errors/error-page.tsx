'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ErrorPageProps {
  title: string;
  description: string;
  imageUrl: string;
  showBackButton?: boolean;
}

export function ErrorPage({ 
  title, 
  description, 
  imageUrl, 
  showBackButton = true 
}: ErrorPageProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Image 
        src={imageUrl} 
        alt="error illustration" 
        width={300}
        height={300}
        priority
      />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      {showBackButton && (
        <Button onClick={() => router.back()}>
          Go Back
        </Button>
      )}
    </div>
  );
} 