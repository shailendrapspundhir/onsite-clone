import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import { jobById } from '../api/job';

export default function JobDetailScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await jobById(id);
      setJob(res);
    } catch (err) {
      console.warn('jobById', err);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (!job) return <View><Text>Not found</Text></View>;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }}>{job.title}</Text>
      <Text style={{ marginVertical: 8 }}>{job.description}</Text>
      <Text>Role: {job.role}</Text>
      <Text>Location: {job.location}</Text>
      <Button title="Apply" onPress={() => navigation.navigate('Apply', { id: job.id })} />
    </View>
  );
}
