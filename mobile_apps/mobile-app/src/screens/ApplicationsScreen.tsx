import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { myApplications } from '../api/job';

export default function ApplicationsScreen() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await myApplications();
      setApps(res.items || []);
    } catch (err) { console.warn(err); } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList data={apps} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={{ padding: 12, borderBottomWidth: 1 }}>
          <Text>Job: {item.jobId}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )} />
    </View>
  );
}
