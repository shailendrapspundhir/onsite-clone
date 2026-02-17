'use client';

import { type ReactNode } from 'react';

export interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full',
};

export function PageLayout({
  children,
  title,
  maxWidth = 'lg',
  className = '',
}: PageLayoutProps) {
  return (
    <div className={`mx-auto px-4 py-8 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}>
      {title && (
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
      )}
      {children}
    </div>
  );
}
