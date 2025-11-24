'use client';

import AppLayout from '@/src/components/layout/AppLayout';
import ExternalDocumentsScreen from '@/src/screens/ExternalDocumentsScreen';
import AuthGuard from '@/src/components/auth/AuthGuard';

export default function ExternalDocumentsPage() {
  return (
    <AuthGuard>
      <AppLayout>
        <ExternalDocumentsScreen />
      </AppLayout>
    </AuthGuard>
  );
}

