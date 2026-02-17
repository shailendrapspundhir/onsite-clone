'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@onsite360/web-ui-shared';
import { LoginFlow } from '@onsite360/web-ui-shared';

export default function LoginPage() {
  const { loginWithMobile, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogin = async (mobile: string, otp: string, userType: string) => {
    await loginWithMobile(mobile, otp, userType);
    router.replace('/onboarding');
  };

  if (isAuthenticated) {
    router.replace('/dashboard');
    return null;
  }

  return <LoginFlow defaultUserType="worker" onLogin={handleLogin} />;
}
