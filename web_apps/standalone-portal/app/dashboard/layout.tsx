'use client';

import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // redirecting
  }

  const isWorker = user?.userType === 'WORKER';
  const isEmployer = user?.userType === 'EMPLOYER';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">OnSite Portal - {isWorker ? 'Worker' : 'Employer'} Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>{user?.email} ({user?.userType})</span>
            <button onClick={logout} className="bg-white text-primary px-3 py-1 rounded">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Nav based on user type */}
      <nav className="bg-white shadow p-4">
        <div className="max-w-7xl mx-auto flex gap-4 flex-wrap">
          <a href="/dashboard" className="text-primary hover:underline">Dashboard</a>
          <a href="/dashboard/profile" className="text-primary hover:underline">Profile</a>
          {isWorker && (
            <>
              <a href="/dashboard/jobs" className="text-primary hover:underline">Find Jobs</a>
              <a href="/dashboard/applications" className="text-primary hover:underline">My Applications</a>
              {/* Note: List of workers would require additional API; using applications for details */}
            </>
          )}
          {isEmployer && (
            <>
              <a href="/dashboard/jobs" className="text-primary hover:underline">My Job Postings</a>
              <a href="/dashboard/jobs/new" className="text-primary hover:underline">Create Job</a>
              {/* Worker list via applicants in job details */}
            </>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
