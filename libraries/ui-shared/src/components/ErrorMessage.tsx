'use client';

import { type HTMLAttributes } from 'react';

export interface ErrorMessageProps extends HTMLAttributes<HTMLDivElement> {
  message: string;
}

export function ErrorMessage({ message, className = '', ...props }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className={`rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 ${className}`}
      {...props}
    >
      {message}
    </div>
  );
}
