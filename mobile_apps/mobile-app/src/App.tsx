import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

export default function App() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => { if (initialize) { initialize(); } }, [initialize]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
