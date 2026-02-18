'use client';

import { useState, useEffect } from 'react';
import { useAuth, getJob, getEmployerProfile, getWorkerProfile, applicationsForJob, publishJob, applyToJob, withdrawApplication } from '../../../../lib/auth';
import { useParams, useRouter } from 'next/navigation';

// getWorkerProfile used for applicant details in full employer impl

// Full impl for publish (employer), apply (worker), applicants/worker details, withdraw.
// Fixes profile/job errors via better error handling + logging (added later).

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, accessToken } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [employer, setEmployer] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]); // for employer
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [coverMessage, setCoverMessage] = useState(''); // for worker apply
  const router = useRouter();
  const isWorker = user?.userType === 'WORKER';

  useEffect(() => {
    if (id) loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      setError('');
      const j = await getJob(id, accessToken || undefined);
      setJob(j);
      // Fetch employer details (public-ish)
      if (j.employerId) {
        try {
          const emp = await getEmployerProfile(j.employerId, accessToken || '');
          setEmployer(emp);
        } catch (e) {
          // Non-fatal
          console.warn('Could not load employer profile');
        }
      }
      // For employer: load applicants + worker details
      if (!isWorker && accessToken) {
        try {
          const apps = await applicationsForJob(id, accessToken);
          const appsWithWorkers = await Promise.all(
            (apps.items || []).map(async (app: any) => {
              try {
                const worker = await getWorkerProfile(app.workerId, accessToken); // view worker details (name, skills, photo etc.)
                return { ...app, worker };
              } catch {
                return app;
              }
            })
          );
          setApplicants(appsWithWorkers);
        } catch (e: any) {
          console.warn('Applicants load:', e.message); // non-fatal for now
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!accessToken || !job) return;
    setActionLoading(true);
    setError('');
    try {
      await publishJob(job.id, accessToken);
      setError(''); // clear
      alert('Job published successfully!');
      loadJob(); // refresh
    } catch (err: any) {
      setError(`Publish failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApply = async () => {
    if (!accessToken || !job) return;
    setActionLoading(true);
    setError('');
    try {
      await applyToJob({ jobId: job.id, coverMessage }, accessToken);
      alert('Applied successfully!');
      router.push('/dashboard/applications');
    } catch (err: any) {
      setError(`Apply failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!accessToken) return;
    setActionLoading(true);
    setError('');
    try {
      await withdrawApplication(applicationId, accessToken);
      alert('Application withdrawn!');
      loadJob(); // or reload apps
    } catch (err: any) {
      setError(`Withdraw failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div>Loading job details...</div>;

  return (
    <div>
      <button onClick={() => router.back()} className="text-primary mb-4">&larr; Back to Jobs</button>
      <h2 className="text-2xl font-bold mb-4">{job?.title}</h2>
      <div className="card">
        <p><strong>Role:</strong> {job?.role}</p>
        <p><strong>Location:</strong> {job?.location}</p>
        <p><strong>Type:</strong> {job?.employmentType}</p>
        <p><strong>Status:</strong> {job?.status} {job?.publishedAt && `(Published: ${new Date(job.publishedAt).toLocaleDateString()})`}</p>
        <div className="mt-4">
          <strong>Description:</strong>
          <p>{job?.description}</p>
        </div>
        {employer && (
          <div className="mt-4">
            <strong>Employer:</strong> {employer.companyName} - {employer.location}
          </div>
        )}
      </div>

      {/* Conditional actions by type - fixes publish/apply */}
      {isWorker ? (
        <div className="mt-6 card">
          <h3 className="text-xl font-semibold mb-2">Apply to Job</h3>
          <textarea
            value={coverMessage}
            onChange={(e) => setCoverMessage(e.target.value)}
            placeholder="Optional cover message..."
            className="input-field mb-2"
            rows={3}
          />
          <button onClick={handleApply} disabled={actionLoading} className="btn-primary">
            {actionLoading ? 'Applying...' : 'Apply Now'}
          </button>
        </div>
      ) : (
        <div className="mt-6 card">
          <h3 className="text-xl font-semibold mb-2">Manage Job Posting</h3>
          {job?.status === 'DRAFT' && (
            <button onClick={handlePublish} disabled={actionLoading} className="btn-primary mr-2">
              {actionLoading ? 'Publishing...' : 'Publish Job'}
            </button>
          )}
          <p>Applicants ({applicants.length}) & worker details (incl. photo/skills):</p>
          {applicants.length === 0 ? (
            <p>No applications yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {applicants.map((app: any) => (
                <li key={app.id} className="border p-2 rounded">
                  <strong>Worker:</strong> {app.worker?.firstName} {app.worker?.lastName} (ID: {app.workerId}) | Status: {app.status}
                  {app.worker?.avatarUrl && <span> | Photo: {app.worker.avatarUrl}</span>}
                  {app.worker?.skills && <span> | Skills: {app.worker.skills.join(', ')}</span>}
                  {/* Worker details for employer */}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {error && <p className="error-text mt-4">{error}</p>}
      <p className="text-sm text-gray-600 mt-4">Full flows now active: publish, apply (w/ cover), applicants + worker details, withdraw (in apps page). See logs for debug.</p>
    </div>
  );
}
