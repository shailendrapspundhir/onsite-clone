'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@onsite360/web-ui-shared';
import { Button, Input, Card, CardHeader, CardTitle, ErrorMessage, LoadingSpinner } from '@onsite360/web-ui-shared';
import { graphql, getUserUrl } from '@/lib/graphql';
import { JobRole } from '@onsite360/types';

interface EmployerProfile {
  id: string;
  userId: string;
  companyName: string;
  industry?: string;
  description?: string;
  website?: string;
  location?: string;
  contactEmail: string;
  contactPhone?: string;
  desiredRolesStorage: string[];
}

const JOB_ROLES: { value: JobRole; label: string }[] = [
  { value: JobRole.SECURITY_GUARD, label: 'Security Guard' },
  { value: JobRole.COOK, label: 'Cook' },
  { value: JobRole.CLEANER, label: 'Cleaner' },
  { value: JobRole.DRIVER, label: 'Driver' },
  { value: JobRole.RECEPTIONIST, label: 'Receptionist' },
  { value: JobRole.MAINTENANCE, label: 'Maintenance' },
  { value: JobRole.OTHER, label: 'Other' },
];

export default function ProfilePage() {
  const { user, accessToken } = useAuth();
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [desiredRoles, setDesiredRoles] = useState<JobRole[]>([]);

  useEffect(() => {
    if (!user?.id || !accessToken) return;
    const url = getUserUrl();
    graphql<{ employerProfile: EmployerProfile | null }>(
      url,
      `query EmployerProfile($userId: String!) {
        employerProfile(userId: $userId) {
          id userId companyName industry description website location contactEmail contactPhone desiredRolesStorage
        }
      }`,
      { userId: user.id },
      accessToken
    )
      .then((data) => {
        const p = data.employerProfile;
        setProfile(p ?? null);
        if (p) {
          setCompanyName(p.companyName);
          setIndustry(p.industry ?? '');
          setDescription(p.description ?? '');
          setWebsite(p.website ?? '');
          setLocation(p.location ?? '');
          setContactEmail(p.contactEmail);
          setContactPhone(p.contactPhone ?? '');
          setDesiredRoles((p.desiredRolesStorage as JobRole[]) ?? []);
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
          `mutation UpdateEmployerProfile($input: UpdateEmployerProfileInput!) {
            updateEmployerProfile(input: $input) { id companyName }
          }`,
          {
            input: {
              companyName,
              industry: industry || undefined,
              description: description || undefined,
              website: website || undefined,
              location: location || undefined,
              contactEmail,
              contactPhone: contactPhone || undefined,
              desiredRoles: desiredRoles.length ? desiredRoles : undefined,
            },
          },
          accessToken
        );
      } else {
        await graphql(
          url,
          `mutation CreateEmployerProfile($input: CreateEmployerProfileInput!) {
            createEmployerProfile(input: $input) { id companyName }
          }`,
          {
            input: {
              companyName,
              contactEmail,
              industry: industry || undefined,
              description: description || undefined,
              website: website || undefined,
              location: location || undefined,
              contactPhone: contactPhone || undefined,
              desiredRoles: desiredRoles.length ? desiredRoles : [JobRole.OTHER],
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

  const toggleRole = (role: JobRole) => {
    setDesiredRoles((prev) =>
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
        <CardTitle>{profile ? 'Edit Profile' : 'Create Company Profile'}</CardTitle>
        <p className="mt-1 text-sm text-gray-500">
          {profile ? 'Update your employer profile.' : 'Complete your company profile to post jobs.'}
        </p>
      </CardHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorMessage message={error} />}
        <Input
          label="Company name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          fullWidth
        />
        <Input
          label="Industry (optional)"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          fullWidth
        />
        <Input
          label="Contact email"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
          fullWidth
        />
        <Input
          label="Contact phone (optional)"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          fullWidth
        />
        <Input
          label="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
        />
        <Input
          label="Website (optional)"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          fullWidth
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Roles you hire for</label>
          <div className="flex flex-wrap gap-2">
            {JOB_ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => toggleRole(r.value)}
                className={`rounded-full px-3 py-1 text-sm ${
                  desiredRoles.includes(r.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" isLoading={saving}>
          {profile ? 'Update profile' : 'Create profile'}
        </Button>
      </form>
    </Card>
  );
}
