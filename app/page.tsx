'use client';

import AppLayout from '@/src/components/layout/AppLayout';
import ImagesScreen from '@/src/screens/ImagesScreen';
import AuthGuard from '@/src/components/auth/AuthGuard';

export default function HomePage() {
  return (
    <AuthGuard>
      <AppLayout>
        <ImagesScreen />
      </AppLayout>
    </AuthGuard>
  );
}

