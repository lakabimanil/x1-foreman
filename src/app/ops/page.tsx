'use client';

import { useRouter } from 'next/navigation';
import { PlatformOpsDashboard } from '@/components/platform-ops';

export default function OpsPage() {
  const router = useRouter();

  return (
    <div className="h-screen bg-black">
      <PlatformOpsDashboard onBack={() => router.push('/')} />
    </div>
  );
}
