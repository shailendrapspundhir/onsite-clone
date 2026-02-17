import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { applicationsForJob } from '../api/job';

export default function ApplicantsScreen({ route }: any) {
  const { jobId } = route.params || {};
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await applicationsForJob(jobId || '');
      setApps(res.items || []);
    } catch (err) { console.warn(err); } finally { setLoading(false); }
  }

  useEffect(() => { if (jobId) load(); }, [jobId]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList data={apps} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={{ padding: 12, borderBottomWidth: 1 }}>
          <Text>Worker: {item.workerId}</Text>
          <Text>Status: {item.status}</Text>
          <Text>Message: {item.coverMessage}</Text>
        </View>
      )} />
    </View>
  );
}
