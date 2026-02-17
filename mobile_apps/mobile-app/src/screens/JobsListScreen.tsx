import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { jobsSearch } from '../api/job';

export default function JobsListScreen({ navigation }: any) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await jobsSearch({ page: 1, pageSize: 20 });
      setJobs(res.items || []);
    } catch (err) {
      console.warn('jobsSearch', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={jobs}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('JobDetail', { id: item.id })} style={{ padding: 12, borderBottomWidth: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
            <Text>{item.role} • {item.location}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
