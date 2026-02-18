'use client';

import { useState } from 'react';
import { useAuth, RegisterInput } from '../../lib/auth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'WORKER' | 'EMPLOYER'>('WORKER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const input: RegisterInput = {
        email,
        password,
        userType,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      };
      await register(input);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="card max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">I am a</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as 'WORKER' | 'EMPLOYER')}
              className="input-field"
            >
              <option value="WORKER">Worker (Job Seeker)</option>
              <option value="EMPLOYER">Employer (Job Poster)</option>
            </select>
            <p className="text-sm text-gray-600 mt-1">This determines your dashboard layout and pages</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
              minLength={8}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">First Name (optional)</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Last Name (optional)</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input-field"
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center">
          Have account? <a href="/login" className="text-primary hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
