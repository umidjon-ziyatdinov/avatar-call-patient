'use client';

import { useFormStatus } from 'react-dom';
import { LoaderIcon } from '@/components/icons';
import { Button } from './ui/button';

export function SubmitButton({
  children,
  isSuccessful,
  isLoading,
  loadingText = 'Loading...',
  className = '',
}: {
  children: React.ReactNode;
  isSuccessful?: boolean;
  isLoading: boolean;
  loadingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  const isDisabled = pending || isSuccessful || isLoading;

  return (
    <Button
      type={isDisabled ? 'button' : 'submit'}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      className={`relative  flex items-center justify-center ${className}"`}
    >
      {isDisabled ? loadingText : children}

      {isDisabled && (
        <span className="animate-spin absolute right-4">
          <LoaderIcon />
        </span>
      )}

      <output aria-live="polite" className="sr-only">
        {isDisabled ? loadingText : 'Submit form'}
      </output>
    </Button>
  );
}
