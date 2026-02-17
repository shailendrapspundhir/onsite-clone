import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import { fetchWorkerProfile, createWorkerProfile } from '../api/user';
import { useAuthStore } from '../store/authStore';

export default function WorkerProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!user) return;
    setLoading(true);
    try {
      const p = await fetchWorkerProfile(user.id);
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
        <Text>No profile found. Create one:</Text>
        <Button title="Create Sample Profile" onPress={async () => {
          const input = { firstName: 'First', lastName: 'Last', skills: ['plumbing'], availability: [{ employmentType: 'FULL_TIME', role: 'General' }] };
          try { const res = await createWorkerProfile(input); setProfile(res); } catch (e) { console.warn(e); }
        }} />
      </View>
    );
  }

  return (
    <View style={{ padding: 12 }}>
      <Text style={{ fontSize: 18 }}>{profile.firstName} {profile.lastName}</Text>
      <Text>Skills: {(profile.skillsStorage || []).join(', ')}</Text>
      <Text>Location: {profile.location}</Text>
    </View>
  );
}
