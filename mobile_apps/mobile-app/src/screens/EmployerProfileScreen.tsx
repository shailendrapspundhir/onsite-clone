import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { fetchEmployerProfile, createEmployerProfile } from '../api/user';
import { useAuthStore } from '../store/authStore';

export default function EmployerProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      const p = await fetchEmployerProfile(user.id);
      setProfile(p);
    } catch (err) {
      console.warn(err);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [user]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (!profile) {
    return (
      <View style={{ padding: 12 }}>
        <Text>No company profile. Create one:</Text>
        <Button title="Create Sample Company" onPress={async () => {
          const input = { companyName: 'ACME', contactEmail: 'hr@acme.test', desiredRoles: ['Engineer'] };
          try { const res = await createEmployerProfile(input); setProfile(res); } catch (e) { console.warn(e); }
        }} />
      </View>
    );
  }

  return (
    <View style={{ padding: 12 }}>
      <Text style={{ fontSize: 18 }}>{profile.companyName}</Text>
      <Text>Industry: {profile.industry}</Text>
      <Text>Location: {profile.location}</Text>
    </View>
  );
}
