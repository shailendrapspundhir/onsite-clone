import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { applyToJob } from '../api/job';

export default function ApplyScreen({ route, navigation }: any) {
  const { id } = route.params;
  const [message, setMessage] = useState('');

  async function onApply() {
    try {
      await applyToJob({ jobId: id, coverMessage: message });
      navigation.goBack();
    } catch (err) {
      console.warn('apply', err);
    }
  }

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Text style={{ fontSize: 18, marginBottom: 8 }}>Apply to Job</Text>
      <TextInput placeholder="Cover message" value={message} onChangeText={setMessage} multiline style={{ borderWidth: 1, padding: 8, height: 120 }} />
      <Button title="Submit Application" onPress={onApply} />
    </View>
  );
}
