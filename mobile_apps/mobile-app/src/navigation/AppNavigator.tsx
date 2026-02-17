import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardWorker from '../screens/DashboardWorker';
import DashboardEmployer from '../screens/DashboardEmployer';
import JobsListScreen from '../screens/JobsListScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import ApplyScreen from '../screens/ApplyScreen';
import WorkerProfileScreen from '../screens/WorkerProfileScreen';
import EmployerProfileScreen from '../screens/EmployerProfileScreen';
import ApplicationsScreen from '../screens/ApplicationsScreen';
import ApplicantsScreen from '../screens/ApplicantsScreen';
import { useAuthStore } from '../store/authStore';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const user = useAuthStore((s) => s.user);

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : user.userType === 'WORKER' ? (
        <>
          <Stack.Screen name="WorkerHome" component={DashboardWorker} />
          <Stack.Screen name="Jobs" component={JobsListScreen} />
          <Stack.Screen name="JobDetail" component={JobDetailScreen} />
          <Stack.Screen name="Apply" component={ApplyScreen} />
          <Stack.Screen name="WorkerProfile" component={WorkerProfileScreen} />
          <Stack.Screen name="Applications" component={ApplicationsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="EmployerHome" component={DashboardEmployer} />
          <Stack.Screen name="Jobs" component={JobsListScreen} />
          <Stack.Screen name="JobDetail" component={JobDetailScreen} />
          <Stack.Screen name="EmployerProfile" component={EmployerProfileScreen} />
          <Stack.Screen name="Applicants" component={ApplicantsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
