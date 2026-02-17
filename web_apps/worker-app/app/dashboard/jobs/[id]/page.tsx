'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@onsite360/web-ui-shared';
import { Card, CardHeader, CardTitle, Button, ErrorMessage, LoadingSpinner } from '@onsite360/web-ui-shared';
import { graphql, getJobUrl, getUserUrl } from '@/lib/graphql';

interface Job {
  id: string;
  title: string;
  description: string;
  role: string;
  employmentType: string;
  location: string;
  employerId: string;
  salaryMin?: number;
  salaryMax?: number;
  publishedAt?: string;
}

interface EmployerProfile {
  companyName: string;
  industry?: string;
  location?: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user, accessToken } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [employer, setEmployer] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [coverMessage, setCoverMessage] = useState('');
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const jobUrl = getJobUrl();
    graphql<{ job: Job }>(jobUrl, `query Job($id: String!) { job(id: $id) { id title description role employmentType location employerId salaryMin salaryMax publishedAt } }`, { id })
      .then((data) => {
        setJob(data.job);
        const userUrl = getUserUrl();
        return graphql<{ employerProfile: EmployerProfile }>(
          userUrl,
          `query EmployerProfile($userId: String!) { employerProfile(userId: $userId) { companyName industry location } }`,
          { userId: data.job.employerId }
        );
      })
      .then((data) => setEmployer(data.employerProfile))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load job'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !id) return;
    setError('');
    setApplying(true);
    try {
      const jobUrl = getJobUrl();
      await graphql(
        jobUrl,
        `mutation ApplyToJob($input: CreateApplicationInput!) {
          applyToJob(input: $input) { id status }
        }`,
        { input: { jobId: id, coverMessage: coverMessage || undefined } },
        accessToken
      );
      setApplied(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply');
    } finally {
      setApplying(false);
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
        ← Back to jobs
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>{job.title}</CardTitle>
          <p className="text-sm text-gray-500">
            {job.role} • {job.employmentType} • {job.location}
            {employer && ` • ${employer.companyName}`}
          </p>
        </CardHeader>
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
        </div>
        {(job.salaryMin != null || job.salaryMax != null) && (
          <p className="mt-2 text-sm text-gray-600">
            Salary: {job.salaryMin != null && job.salaryMax != null
              ? `${job.salaryMin} – ${job.salaryMax}`
              : job.salaryMin != null
                ? `From ${job.salaryMin}`
                : `Up to ${job.salaryMax}`}
          </p>
        )}
      </Card>
      {employer && (
        <Card>
          <CardHeader>
            <CardTitle>Employer</CardTitle>
            <p className="text-sm text-gray-500">{employer.companyName}</p>
            {(employer.industry || employer.location) && (
              <p className="text-sm text-gray-600">
                {[employer.industry, employer.location].filter(Boolean).join(' • ')}
              </p>
            )}
          </CardHeader>
        </Card>
      )}
      {user && !applied && (
        <Card>
          <CardHeader>
            <CardTitle>Apply for this job</CardTitle>
            <p className="mt-1 text-sm text-gray-500">Add a short cover message (optional).</p>
          </CardHeader>
          <form onSubmit={handleApply} className="space-y-4">
            {error && <ErrorMessage message={error} />}
            <textarea
              placeholder="Cover message..."
              value={coverMessage}
              onChange={(e) => setCoverMessage(e.target.value)}
              rows={3}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
            />
            <Button type="submit" isLoading={applying}>
              Submit application
            </Button>
          </form>
        </Card>
      )}
      {applied && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          Application submitted successfully.
        </div>
      )}
    </div>
  );
}
