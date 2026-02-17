'use client';

import { useRouter } from 'next/navigation';
import { AIOnboarding } from '@onsite360/web-ui-shared';

export default function OnboardingPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.replace('/dashboard');
  };

  return <AIOnboarding onComplete={handleComplete} />;
}