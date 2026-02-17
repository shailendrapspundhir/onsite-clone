'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@onsite360/web-ui-shared';
import { Button, Input, Card, CardHeader, CardTitle, ErrorMessage, LoadingSpinner } from '@onsite360/web-ui-shared';
import { graphql, getUserUrl } from '@/lib/graphql';
import { JobRole, EmploymentType } from '@onsite360/types';

const JOB_ROLES: { value: JobRole; label: string }[] = [
  { value: JobRole.SECURITY_GUARD, label: 'Security Guard' },
  { value: JobRole.COOK, label: 'Cook' },
  { value: JobRole.CLEANER, label: 'Cleaner' },
  { value: JobRole.DRIVER, label: 'Driver' },
  { value: JobRole.RECEPTIONIST, label: 'Receptionist' },
  { value: JobRole.MAINTENANCE, label: 'Maintenance' },
  { value: JobRole.OTHER, label: 'Other' },
];

const EMPLOYMENT_TYPES = [
  { value: EmploymentType.FULL_TIME, label: 'Full time' },
  { value: EmploymentType.PART_TIME, label: 'Part time' },
  { value: EmploymentType.CONTRACT, label: 'Contract' },
  { value: EmploymentType.TEMPORARY, label: 'Temporary' },
];

interface WorkerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  location?: string;
  bio?: string;
  experienceYears?: number;
  skills: string[];
}

export default function ProfilePage() {
  const { user, accessToken } = useAuth();
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState<number | ''>('');
  const [skills, setSkills] = useState<JobRole[]>([]);
  const [availability, setAvailability] = useState<Array<{ role: JobRole; employmentType: string }>>([
    { role: JobRole.CLEANER, employmentType: EmploymentType.FULL_TIME },
  ]);

  useEffect(() => {
    if (!user?.id || !accessToken) return;
    const url = getUserUrl();
    graphql<{ workerProfile: WorkerProfile | null }>(
      url,
      `query WorkerProfile($userId: String!) {
        workerProfile(userId: $userId) {
          id userId firstName lastName location bio experienceYears skills
        }
      }`,
      { userId: user.id },
      accessToken
    )
      .then((data) => {
        const p = data.workerProfile;
        setProfile(p ?? null);
        if (p) {
          setFirstName(p.firstName);
          setLastName(p.lastName);
          setLocation(p.location ?? '');
          setBio(p.bio ?? '');
          setExperienceYears(p.experienceYears ?? '');
          setSkills((p.skills as JobRole[]) ?? []);
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, [user?.id, accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const url = getUserUrl();
    try {
      if (profile) {
        await graphql(
          url,
          `mutation UpdateWorkerProfile($input: UpdateWorkerProfileInput!) {
            updateWorkerProfile(input: $input) {
              id firstName lastName
            }
          }`,
          {
            input: {
              firstName,
              lastName,
              ...(location ? { location } : {}),
              ...(bio ? { bio } : {}),
              ...(experienceYears !== '' ? { experienceYears: Number(experienceYears) } : {}),
              ...(skills.length ? { skills } : {}),
            },
          },
          accessToken
        );
      } else {
        await graphql(
          url,
          `mutation CreateWorkerProfile($input: CreateWorkerProfileInput!) {
            createWorkerProfile(input: $input) {
              id firstName lastName
            }
          }`,
          {
            input: {
              firstName,
              lastName,
              skills: skills.length ? skills : [JobRole.OTHER],
              availability: availability.map((a) => ({ role: a.role, employmentType: a.employmentType })),
              ...(location ? { location } : {}),
              ...(bio ? { bio } : {}),
              ...(experienceYears !== '' ? { experienceYears: Number(experienceYears) } : {}),
            },
          },
          accessToken
        );
      }
      setError('');
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const toggleSkill = (role: JobRole) => {
    setSkills((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{profile ? 'Edit Profile' : 'Create Profile'}</CardTitle>
        <p className="mt-1 text-sm text-gray-500">
          {profile ? 'Update your worker profile.' : 'Complete your profile to apply for jobs.'}
        </p>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorMessage message={error} />}
        <Input
          label="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          fullWidth
        />
        <Input
          label="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          fullWidth
        />
        <Input
          label="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
          <input
            type="number"
            min={0}
            max={70}
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value === '' ? '' : Number(e.target.value))}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio (optional)</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
          />
        </div>
        {!profile && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills (select at least one)</label>
              <div className="flex flex-wrap gap-2">
                {JOB_ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => toggleSkill(r.value)}
                    className={`rounded-full px-3 py-1 text-sm ${
                      skills.includes(r.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              {availability.map((a, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <select
                    value={a.role}
                    onChange={(e) =>
                      setAvailability((prev) => {
                        const next = [...prev];
                        next[i] = { ...next[i], role: e.target.value as JobRole };
                        return next;
                      })
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  >
                    {JOB_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                  <select
                    value={a.employmentType}
                    onChange={(e) =>
                      setAvailability((prev) => {
                        const next = [...prev];
                        next[i] = { ...next[i], employmentType: e.target.value };
                        return next;
                      })
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2"
                  >
                    {EMPLOYMENT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </>
        )}
        {profile && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills (update)</label>
            <div className="flex flex-wrap gap-2">
              {JOB_ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => toggleSkill(r.value)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    skills.includes(r.value)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <Button type="submit" isLoading={saving}>
          {profile ? 'Update profile' : 'Create profile'}
        </Button>
      </form>
    </Card>
  );
}
