'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@onsite360/web-ui-shared';
import { Card, CardHeader, CardTitle, LoadingSpinner, Select, SelectOption, Button } from '@onsite360/web-ui-shared';
import { graphql, getJobUrl } from '../../lib/graphql';
import { JobRole, EmploymentType } from '@onsite360/types';

interface Job {
  id: string;
  title: string;
  description: string;
  role: string;
  employmentType: string;
  location: string;
  status: string;
  employerId: string;
  publishedAt?: string;
}

interface JobsSearchResult {
  jobsSearch: {
    items: Job[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

const ROLE_OPTIONS: SelectOption[] = [
  { value: '', label: 'Any role' },
  { value: JobRole.SECURITY_GUARD, label: 'Security Guard' },
  { value: JobRole.COOK, label: 'Cook' },
  { value: JobRole.CLEANER, label: 'Cleaner' },
  { value: JobRole.DRIVER, label: 'Driver' },
  { value: JobRole.RECEPTIONIST, label: 'Receptionist' },
  { value: JobRole.MAINTENANCE, label: 'Maintenance' },
  { value: JobRole.OTHER, label: 'Other' },
];

const EMPLOYMENT_OPTIONS: SelectOption[] = [
  { value: '', label: 'Any type' },
  { value: EmploymentType.FULL_TIME, label: 'Full time' },
  { value: EmploymentType.PART_TIME, label: 'Part time' },
  { value: EmploymentType.CONTRACT, label: 'Contract' },
  { value: EmploymentType.TEMPORARY, label: 'Temporary' },
];

export default function JobsPage() {
  const {  } = useAuth();
  const [data, setData] = useState<JobsSearchResult['jobsSearch'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [location, setLocation] = useState('');
  const pageSize = 10;

  useEffect(() => {
    const url = getJobUrl();
    graphql<JobsSearchResult>(
      url,
      `query JobsSearch($input: JobSearchInput!) {
        jobsSearch(input: $input) {
          items { id title description role employmentType location status employerId publishedAt }
          total page pageSize totalPages hasNext hasPrevious
        }
      }`,
      {
        input: {
          page,
          pageSize,
          ...(query ? { query } : {}),
          ...(role ? { role } : {}),
          ...(employmentType ? { employmentType } : {}),
          ...(location ? { location } : {}),
        },
      }
    )
      .then((res) => setData(res.jobsSearch))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load jobs'))
      .finally(() => setLoading(false));
  }, [page, query, role, employmentType, location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setLoading(true);
    const url = getJobUrl();
    graphql<JobsSearchResult>(
      url,
      `query JobsSearch($input: JobSearchInput!) {
        jobsSearch(input: $input) {
          items { id title description role employmentType location status employerId publishedAt }
          total page pageSize totalPages hasNext hasPrevious
        }
      }`,
      {
        input: {
          page: 1,
          pageSize,
          ...(query ? { query } : {}),
          ...(role ? { role } : {}),
          ...(employmentType ? { employmentType } : {}),
          ...(location ? { location } : {}),
        },
      }
    )
      .then((res) => setData(res.jobsSearch))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load jobs'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Jobs</CardTitle>
          <p className="mt-1 text-sm text-gray-500">
            Filter by role, employment type, and location.
          </p>
        </CardHeader>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <input
              type="text"
              placeholder="Search by title..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-base"
            />
            <Select
              options={ROLE_OPTIONS}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Role"
            />
            <Select
              options={EMPLOYMENT_OPTIONS}
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              placeholder="Employment type"
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-base"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </Card>
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
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {data.total} job{data.total !== 1 ? 's' : ''} found.
          </p>
          <div className="space-y-3">
            {data.items.map((job) => (
              <Card key={job.id} padding="md">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">
                      {job.role} • {job.employmentType} • {job.location}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{job.description}</p>
                  </div>
                  <Link href={`/dashboard/jobs/${job.id}`}>
                    <Button size="sm">View & Apply</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              Page {data.page} of {data.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!data.hasPrevious}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.hasNext}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
