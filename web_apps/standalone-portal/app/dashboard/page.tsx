'use client';

import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isWorker = user?.userType === 'WORKER';

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome, {user?.email}!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Profile</h3>
          <p>Update your {isWorker ? 'worker' : 'employer'} profile with photo, name, age, skills, company info, etc.</p>
          <button
            onClick={() => router.push('/dashboard/profile')}
            className="btn-primary mt-4"
          >
            Go to Profile
          </button>
        </div>
        {isWorker && (
          <>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Find Jobs</h3>
              <p>Browse and view job listings for blue-collar work.</p>
              <button
                onClick={() => router.push('/dashboard/jobs')}
                className="btn-primary mt-4"
              >
                Search Jobs
              </button>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">My Applications</h3>
              <p>Track your job applications and status.</p>
              <button
                onClick={() => router.push('/dashboard/applications')}
                className="btn-primary mt-4"
              >
                View Applications
              </button>
            </div>
          </>
        )}
        {user?.userType === 'EMPLOYER' && (
          <>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Job Postings</h3>
              <p>Create and view your job postings.</p>
              <button
                onClick={() => router.push('/dashboard/jobs')}
                className="btn-primary mt-4"
              >
                Manage Jobs
              </button>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Worker Applications</h3>
              <p>View applicants (worker details) for your jobs.</p>
              <button
                onClick={() => router.push('/dashboard/jobs')}
                className="btn-primary mt-4"
              >
                View via Jobs
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
