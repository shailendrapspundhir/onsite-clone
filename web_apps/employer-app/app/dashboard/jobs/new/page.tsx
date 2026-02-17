'use client';

import { useRouter } from 'next/navigation';
import { JobPostingFlow } from '@onsite360/web-ui-shared';

export default function NewJobPage() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/dashboard');
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  return <JobPostingFlow onComplete={handleComplete} onBack={handleBack} />;
}
