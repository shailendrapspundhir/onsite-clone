'use client';

import { useState, useEffect } from 'react';
import { useAuth, getWorkerProfile, getEmployerProfile, saveWorkerProfile, saveEmployerProfile } from '../../../lib/auth';

interface ProfileForm {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string; // profile photo
  dateOfBirth?: string; // for age
  skills?: string[]; // for worker
  bio?: string;
  companyName?: string; // for employer
  logoUrl?: string; // company photo
  industry?: string;
  location?: string;
  // add more as needed
}

export default function ProfilePage() {
  const { user, accessToken } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState<ProfileForm>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isWorker = user?.userType === 'WORKER';

  useEffect(() => {
    if (!accessToken || !user) return;
    loadProfile();
  }, [accessToken, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      if (isWorker) {
        const prof = await getWorkerProfile(user!.id, accessToken!);
        setProfile(prof);
        setForm({
          firstName: prof?.firstName,
          lastName: prof?.lastName,
          avatarUrl: prof?.avatarUrl,
          dateOfBirth: prof?.dateOfBirth,
          skills: prof?.skills || [],
          bio: prof?.bio,
          location: prof?.location,
        });
      } else {
        const prof = await getEmployerProfile(user!.id, accessToken!);
        setProfile(prof);
        setForm({
          companyName: prof?.companyName,
          logoUrl: prof?.logoUrl,
          industry: prof?.industry,
          location: prof?.location,
        });
      }
    } catch (err) {
      // Profile may not exist yet - ok for new users
      console.log('No profile yet, starting with empty form');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      if (isWorker) {
        // Uses updated saveWorkerProfile: explicit get + branch (update/create) to fix 'already exists' error
        // Passes userId from auth for existence check
        await saveWorkerProfile(
          {
            firstName: form.firstName,
            lastName: form.lastName,
            avatarUrl: form.avatarUrl, // profile photo
            dateOfBirth: form.dateOfBirth, // age
            skills: form.skills,
            bio: form.bio,
            location: form.location,
          },
          accessToken!,
          user!.id // required for existence check
        );
      } else {
        // For employer, explicit check + minimal required fields
        await saveEmployerProfile(
          {
            companyName: form.companyName,
            logoUrl: form.logoUrl, // company photo
            industry: form.industry,
            location: form.location,
            contactEmail: `${user?.email}`, // derive from user
            desiredRoles: ['OTHER'], // minimal required
          },
          accessToken!,
          user!.id // required for existence check
        );
      }
      setSuccess('Profile updated successfully!');
      await loadProfile(); // reload
    } catch (err: any) {
      setError(err.message || 'Failed to save profile. Check required fields like names, skills/roles.');
    } finally {
      setSaving(false);
    }
  };

  const updateForm = (field: keyof ProfileForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Update Your Profile</h2>
      <div className="card max-w-2xl">
        <p className="mb-4">Update usual information like profile photo (URL), name, age, skills, company name, etc.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isWorker ? (
            // Worker fields
            <>
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  value={form.firstName || ''}
                  onChange={(e) => updateForm('firstName', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  value={form.lastName || ''}
                  onChange={(e) => updateForm('lastName', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profile Photo URL (avatarUrl)</label>
                <input
                  type="url"
                  value={form.avatarUrl || ''}
                  onChange={(e) => updateForm('avatarUrl', e.target.value)}
                  className="input-field"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth (for age)</label>
                <input
                  type="date"
                  value={form.dateOfBirth || ''}
                  onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={form.skills?.join(', ') || ''}
                  onChange={(e) => updateForm('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="input-field"
                  placeholder="COOK, CLEANER, SECURITY_GUARD"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={form.bio || ''}
                  onChange={(e) => updateForm('bio', e.target.value)}
                  className="input-field"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={form.location || ''}
                  onChange={(e) => updateForm('location', e.target.value)}
                  className="input-field"
                />
              </div>
            </>
          ) : (
            // Employer fields
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  value={form.companyName || ''}
                  onChange={(e) => updateForm('companyName', e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Logo URL (profile photo for company)</label>
                <input
                  type="url"
                  value={form.logoUrl || ''}
                  onChange={(e) => updateForm('logoUrl', e.target.value)}
                  className="input-field"
                  placeholder="https://example.com/logo.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <input
                  type="text"
                  value={form.industry || ''}
                  onChange={(e) => updateForm('industry', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={form.location || ''}
                  onChange={(e) => updateForm('location', e.target.value)}
                  className="input-field"
                />
              </div>
            </>
          )}
          {error && <p className="error-text">{error}</p>}
          {success && <p className="text-success text-sm">{success}</p>}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">Note: Photo uses URL field (upload not implemented). For profile create (first time), may need backend adjustment if update fails.</p>
      </div>
    </div>
  );
}
