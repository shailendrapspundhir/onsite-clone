'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@onsite360/web-ui-shared';
import { Card, CardHeader, CardTitle, Button, LoadingSpinner, ErrorMessage } from '@onsite360/web-ui-shared';
import { graphql, getJobUrl, getUserUrl } from '../../../lib/graphql';
import { ApplicationStatus, JobStatus } from '@onsite360/types';

interface Job {
  id: string;
  title: string;
  description: string;
  role: string;
  employmentType: string;
  location: string;
  status: string;
  publishedAt?: string;
  employerId: string;
}

interface Application {
  id: string;
  jobId: string;
  workerId: string;
  status: string;
  coverMessage?: string;
  appliedAt: string;
}

interface WorkerProfile {
  id: string;
  firstName: string;
  lastName: string;
  location?: string;
  bio?: string;
  skills: string[];
  experienceYears?: number;
}

const STATUS_OPTIONS = [
  { value: ApplicationStatus.PENDING, label: 'Pending' },
  { value: ApplicationStatus.SHORTLISTED, label: 'Shortlisted' },
  { value: ApplicationStatus.REJECTED, label: 'Rejected' },
  { value: ApplicationStatus.HIRED, label: 'Hired' },
  { value: ApplicationStatus.WITHDRAWN, label: 'Withdrawn' },
];

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { accessToken } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [workers, setWorkers] = useState<Record<string, WorkerProfile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !accessToken) return;
    const jobUrl = getJobUrl();
    graphql<{ job: Job }>(
      jobUrl,
      `query Job($id: String!) { job(id: $id) { id title description role employmentType location status publishedAt employerId } }`,
      { id }
    )
      .then((data) => {
        setJob(data.job);
        return graphql<{ applicationsForJob: { items: Application[] } }>(
          jobUrl,
          `query ApplicationsForJob($jobId: String!) {
            applicationsForJob(jobId: $jobId) {
              items { id jobId workerId status coverMessage appliedAt }
            }
          }`,
          { jobId: id },
          accessToken
        );
      })
      .then((data) => {
        setApplications(data.applicationsForJob.items);
        const userIds = [...new Set(data.applicationsForJob.items.map((a) => a.workerId))];
        if (userIds.length === 0) return;
        const userUrl = getUserUrl();
        return Promise.all(
          userIds.map((userId) =>
            graphql<{ workerProfile: WorkerProfile | null }>(
              userUrl,
              `query WorkerProfile($userId: String!) { workerProfile(userId: $userId) { id firstName lastName location bio skills experienceYears } }`,
              { userId },
              accessToken
            ).then((res) => ({ userId, profile: res.workerProfile }))
          )
        ).then((results) => {
          const map: Record<string, WorkerProfile> = {};
          results.forEach((r) => {
            if (r.profile) map[r.userId] = r.profile;
          });
          setWorkers(map);
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id, accessToken]);

  const handlePublish = async () => {
    if (!id || !accessToken) return;
    setError('');
    setPublishing(true);
    try {
      const jobUrl = getJobUrl();
      await graphql(
        jobUrl,
        `mutation PublishJob($id: String!) { publishJob(id: $id) { id status publishedAt } }`,
        { id },
        accessToken
      );
      setJob((prev) => (prev ? { ...prev, status: JobStatus.PUBLISHED } : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  };

  const handleUpdateStatus = async (applicationId: string, status: ApplicationStatus) => {
    if (!accessToken) return;
    setUpdatingStatus(applicationId);
    try {
      const jobUrl = getJobUrl();
      await graphql(
        jobUrl,
        `mutation UpdateApplicationStatus($applicationId: String!, $input: UpdateApplicationStatusInput!) {
          updateApplicationStatus(applicationId: $applicationId, input: $input) { id status }
        }`,
        { applicationId, input: { status } },
        accessToken
      );
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status } : a))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  if (loading || !job) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/jobs" className="text-sm text-blue-600 hover:text-blue-500">
        ← Back to my jobs
      </Link>
      {error && <ErrorMessage message={error} />}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{job.title}</CardTitle>
            <p className="text-sm text-gray-500">
              {job.role} • {job.employmentType} • {job.location} • Status: {job.status}
              {job.publishedAt && ` • Published ${new Date(job.publishedAt).toLocaleDateString()}`}
            </p>
          </div>
          {job.status === JobStatus.DRAFT && (
            <Button onClick={handlePublish} isLoading={publishing}>
              Publish job
            </Button>
          )}
        </CardHeader>
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Applicants ({applications.length})</CardTitle>
          <p className="mt-1 text-sm text-gray-500">
            View worker profiles and update application status.
          </p>
        </CardHeader>
        {applications.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const worker = workers[app.workerId];
              return (
                <div
                  key={app.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {worker ? `${worker.firstName} ${worker.lastName}` : 'Worker'}
                      </p>
                      {worker && (
                        <p className="text-sm text-gray-500">
                          {worker.location ?? 'No location'} • {worker.experienceYears != null ? `${worker.experienceYears} years exp` : ''}
                          {worker.skills?.length ? ` • Skills: ${(worker.skills as string[]).join(', ')}` : ''}
                        </p>
                      )}
                      {app.coverMessage && (
                        <p className="mt-1 text-sm text-gray-600">{app.coverMessage}</p>
                      )}
                      <p className="text-sm text-gray-500">
                        Applied {new Date(app.appliedAt).toLocaleDateString()} • Status: {app.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleUpdateStatus(app.id, e.target.value as ApplicationStatus)
                        }
                        disabled={updatingStatus === app.id}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        {STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      {updatingStatus === app.id && (
                        <LoadingSpinner size="sm" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
