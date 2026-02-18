'use client';

import { useState } from 'react';
import { useAuth, createJob } from '../../../../lib/auth';
import { useRouter } from 'next/navigation';

export default function NewJobPage() {
  const { accessToken } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    role: 'OTHER',
    employmentType: 'FULL_TIME',
    location: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await createJob(form, accessToken!);
      router.push('/dashboard/jobs');
    } catch (err: any) {
      setError(err.message || 'Failed to create job');
    } finally {
      setSaving(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Create New Job Posting</h2>
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateForm('title', e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateForm('description', e.target.value)}
              className="input-field"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => updateForm('role', e.target.value)}
              className="input-field"
            >
              <option value="SECURITY_GUARD">Security Guard</option>
              <option value="COOK">Cook</option>
              <option value="CLEANER">Cleaner</option>
              <option value="OTHER">Other</option>
              {/* Add more from enum */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employment Type</label>
            <select
              value={form.employmentType}
              onChange={(e) => updateForm('employmentType', e.target.value)}
              className="input-field"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              {/* etc */}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => updateForm('location', e.target.value)}
              className="input-field"
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Creating...' : 'Create Job (as Draft)'}
          </button>
        </form>
      </div>
    </div>
  );
}
