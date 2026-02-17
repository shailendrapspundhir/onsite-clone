'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@onsite360/web-ui-shared';
import { Card, LoadingSpinner, Button } from '@onsite360/web-ui-shared';
import { graphql, getJobUrl } from '../../lib/graphql';
import { JobStatus } from '@onsite360/types';

interface Job {
  id: string;
  title: string;
  role: string;
  employmentType: string;
  location: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
}

interface MyJobsResult {
  myJobs: {
    items: Job[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const STATUS_LABELS: Record<string, string> = {
  [JobStatus.DRAFT]: 'Draft',
  [JobStatus.PUBLISHED]: 'Published',
  [JobStatus.CLOSED]: 'Closed',
  [JobStatus.CANCELLED]: 'Cancelled',
};

export default function MyJobsPage() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<MyJobsResult['myJobs'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    if (!accessToken) return;
    const url = getJobUrl();
    graphql<MyJobsResult>(
      url,
      `query MyJobs($page: Int, $pageSize: Int) {
        myJobs(page: $page, pageSize: $pageSize) {
          items { id title role employmentType location status publishedAt createdAt }
          total page pageSize totalPages
        }
      }`,
      { page, pageSize },
      accessToken
    )
      .then((res) => setData(res.myJobs))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load jobs'))
      .finally(() => setLoading(false));
  }, [accessToken, page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">My Jobs</h2>
        <Link href="/dashboard/jobs/new">
          <Button>Post a job</Button>
        </Link>
      </div>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : data ? (
        <>
          <div className="space-y-3">
            {data.items.length === 0 ? (
              <Card>
                <p className="text-gray-500">No jobs yet. <Link href="/dashboard/jobs/new" className="text-blue-600 hover:text-blue-500">Post your first job</Link>.</p>
              </Card>
            ) : (
              data.items.map((job) => (
                <Card key={job.id} padding="md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <Link href={`/dashboard/jobs/${job.id}`} className="font-medium text-blue-600 hover:text-blue-500">
                        {job.title}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {job.role} • {job.employmentType} • {job.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status: {STATUS_LABELS[job.status] ?? job.status}
                        {job.publishedAt && ` • Published ${new Date(job.publishedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button variant="outline" size="sm">View & manage applicants</Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600">
                Page {data.page} of {data.totalPages} ({data.total} total)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
