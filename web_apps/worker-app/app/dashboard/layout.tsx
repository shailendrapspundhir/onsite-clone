'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@onsite360/web-ui-shared';
import { Header, Button, PageLayout } from '@onsite360/web-ui-shared';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        logo={
          <Link href="/dashboard" className="text-lg font-semibold text-gray-900">
            OnSite360 Worker
          </Link>
        }
        nav={
          <>
            <Link
              href="/dashboard/jobs"
              className={`text-sm font-medium ${pathname?.startsWith('/dashboard/jobs') ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Jobs
            </Link>
            <Link
              href="/dashboard/profile"
              className={`text-sm font-medium ${pathname === '/dashboard/profile' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Profile
            </Link>
            <Link
              href="/dashboard/applications"
              className={`text-sm font-medium ${pathname === '/dashboard/applications' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              My Applications
            </Link>
          </>
        }
        right={
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        }
      />
      <main className="flex-1">
        <PageLayout>{children}</PageLayout>
      </main>
    </div>
  );
}
