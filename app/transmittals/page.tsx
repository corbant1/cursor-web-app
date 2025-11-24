'use client';

import AppLayout from '@/src/components/layout/AppLayout';
import TransmittalsScreen from '@/src/screens/TransmittalsScreen';
import AuthGuard from '@/src/components/auth/AuthGuard';

export default function TransmittalsPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <TransmittalsScreen />
      </AppLayout>
    </AuthGuard>
  );
}

