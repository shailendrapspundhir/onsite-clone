'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@onsite360/web-ui-shared';
import { Card, CardHeader, CardTitle, LoadingSpinner } from '@onsite360/web-ui-shared';
import { graphql, getJobUrl } from '@/lib/graphql';
import { ApplicationStatus } from '@onsite360/types';

interface Application {
  id: string;
  jobId: string;
  workerId: string;
  status: string;
  coverMessage?: string;
  appliedAt: string;
  job?: { id: string; title: string; location: string; role: string };
}

interface MyApplicationsResult {
  myApplications: {
    items: Application[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const STATUS_LABELS: Record<string, string> = {
  [ApplicationStatus.PENDING]: 'Pending',
  [ApplicationStatus.SHORTLISTED]: 'Shortlisted',
  [ApplicationStatus.REJECTED]: 'Rejected',
  [ApplicationStatus.HIRED]: 'Hired',
  [ApplicationStatus.WITHDRAWN]: 'Withdrawn',
};

export default function ApplicationsPage() {
  const { accessToken } = useAuth();
  const [data, setData] = useState<MyApplicationsResult['myApplications'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    if (!accessToken) return;
    const url = getJobUrl();
    graphql<MyApplicationsResult>(
      url,
      `query MyApplications($page: Int, $pageSize: Int) {
        myApplications(page: $page, pageSize: $pageSize) {
          items { id jobId workerId status coverMessage appliedAt job { id title location role } }
          total page pageSize totalPages
        }
      }`,
      { page, pageSize },
      accessToken
    )
      .then((res) => setData(res.myApplications))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load applications'))
      .finally(() => setLoading(false));
  }, [accessToken, page]);

  if (!accessToken) {
    return (
      <Card>
        <p className="text-gray-600">Please log in to view your applications.</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Applications</CardTitle>
        <p className="mt-1 text-sm text-gray-500">
          Track the status of your job applications.
        </p>
      </CardHeader>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
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
              <p className="text-gray-500">No applications yet. <Link href="/dashboard/jobs" className="text-blue-600 hover:text-blue-500">Search jobs</Link> to apply.</p>
            ) : (
              data.items.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <Link href={`/dashboard/jobs/${app.jobId}`} className="font-medium text-blue-600 hover:text-blue-500">
                      {app.job?.title ?? 'Job'}
                    </Link>
                    {app.job && (
                      <p className="text-sm text-gray-500">
                        {app.job.role} • {app.job.location}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Applied {new Date(app.appliedAt).toLocaleDateString()} • Status:{' '}
                      <span className="font-medium">{STATUS_LABELS[app.status] ?? app.status}</span>
                    </p>
                  </div>
                  <Link href={`/dashboard/jobs/${app.jobId}`}>
                    <span className="text-sm text-blue-600 hover:text-blue-500">View job →</span>
                  </Link>
                </div>
              ))
            )}
          </div>
          {data.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600">
                Page {data.page} of {data.totalPages} ({data.total} total)
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded border border-gray-300 bg-white px-3 py-1 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded border border-gray-300 bg-white px-3 py-1 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : null}
    </Card>
  );
}
