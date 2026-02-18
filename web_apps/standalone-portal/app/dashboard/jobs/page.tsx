'use client';

import { useState, useEffect } from 'react';
import { useAuth, searchJobs, myJobs, getJob } from '../../../lib/auth';
import { useRouter } from 'next/navigation';

interface Job {
  id: string;
  title: string;
  role: string;
  location: string;
  description: string;
  status?: string;
}

export default function JobsPage() {
  const { user, accessToken } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const isWorker = user?.userType === 'WORKER';
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadJobs();
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      if (isWorker) {
        // For workers: search published jobs
        const result = await searchJobs({ query: searchQuery, page: 1, pageSize: 20 });
        setJobs(result.items || []);
      } else {
        // For employers: my jobs
        const result = await myJobs(accessToken!);
        setJobs(result.items || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadJobs();
  };

  if (loading) return <div>Loading jobs...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {isWorker ? 'Job Listings & Viewing' : 'My Job Postings'}
      </h2>
      {isWorker && (
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs by title, role, location..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary">Search</button>
        </form>
      )}
      {error && <p className="error-text">{error}</p>}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <p>No jobs found. {isWorker ? 'Try searching' : 'Create one below.'}</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="card cursor-pointer hover:shadow-lg" onClick={() => router.push(`/dashboard/jobs/${job.id}`)}>
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.role} - {job.location}</p>
              <p className="mt-2">{job.description?.substring(0, 100)}...</p>
              {job.status && <span className="text-sm bg-gray-200 px-2 py-1 rounded">{job.status}</span>}
              <button className="btn-primary mt-4 text-sm">View Details</button>
            </div>
          ))
        )}
      </div>
      {!isWorker && <a href="/dashboard/jobs/new" className="btn-primary mt-6 inline-block">Create New Job</a>}
    </div>
  );
}
