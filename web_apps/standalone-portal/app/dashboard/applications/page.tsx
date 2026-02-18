'use client';

import { useState, useEffect } from 'react';
import { useAuth, myApplications, withdrawApplication } from '../../../lib/auth';
import { useRouter } from 'next/navigation';

export default function ApplicationsPage() {
  const { accessToken } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null); // track per-app
  const router = useRouter();

  useEffect(() => {
    loadApplications();
  }, [accessToken]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await myApplications(accessToken!);
      setApplications(result.items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!accessToken || !confirm('Withdraw this application?')) return;
    setActionLoading(applicationId);
    setError('');
    try {
      await withdrawApplication(applicationId, accessToken);
      alert('Withdrawn successfully!');
      loadApplications(); // refresh list
    } catch (err: any) {
      setError(`Withdraw failed: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div>Loading applications...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Applications (Worker)</h2>
      {error && <p className="error-text mb-4">{error}</p>}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <p>No applications yet. Browse jobs to apply.</p>
        ) : (
          applications.map((app) => (
            <div key={app.id} className="card">
              <p><strong>Job ID:</strong> {app.jobId}</p>
              <p><strong>Status:</strong> {app.status}</p>
              <p><strong>Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
              {/* Withdraw if not final */}
              {['PENDING', 'SHORTLISTED'].includes(app.status) && (
                <button
                  onClick={() => handleWithdraw(app.id)}
                  disabled={actionLoading === app.id}
                  className="bg-danger text-white px-3 py-1 rounded mr-2 text-sm"
                >
                  {actionLoading === app.id ? 'Withdrawing...' : 'Withdraw'}
                </button>
              )}
              {/* View job details */}
              <button
                onClick={() => router.push(`/dashboard/jobs/${app.jobId}`)}
                className="btn-primary mt-2 text-sm"
              >
                View Job
              </button>
            </div>
          ))
        )}
      </div>
      <p className="text-sm text-gray-600 mt-4">Employer views apps + worker details (photo/skills) in job detail page. Withdraw uses new API.</p>
    </div>
  );
}
