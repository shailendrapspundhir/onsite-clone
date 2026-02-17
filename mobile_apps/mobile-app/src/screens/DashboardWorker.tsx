import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function DashboardWorker() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Worker Dashboard</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
