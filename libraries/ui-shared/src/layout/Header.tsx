'use client';

import { type ReactNode } from 'react';

export interface HeaderProps {
  children?: ReactNode;
  logo?: ReactNode;
  nav?: ReactNode;
  right?: ReactNode;
  className?: string;
}

export function Header({ logo, nav, right, children, className = '' }: HeaderProps) {
  return (
    <header
      className={`flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6 ${className}`}
    >
      {children ?? (
        <>
          <div className="flex items-center gap-6">
            {logo && <div className="flex-shrink-0">{logo}</div>}
            {nav && <nav className="hidden sm:flex items-center gap-4">{nav}</nav>}
          </div>
          {right && <div className="flex items-center gap-2">{right}</div>}
        </>
      )}
    </header>
  );
}
