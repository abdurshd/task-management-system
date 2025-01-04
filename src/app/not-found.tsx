import { ErrorPage } from '@/components/errors/error-page';

export default function NotFound() {
  return (
    <ErrorPage
      title="Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      imageUrl="/error.svg"
    />
  );
}