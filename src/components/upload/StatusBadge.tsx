import { Badge } from '@chakra-ui/react';
import type { UploadStatus } from '../../types';

interface StatusBadgeProps {
  status: UploadStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colorSchemes: Record<UploadStatus, string> = {
    queued: 'gray',
    processing: 'blue',
    success: 'green',
    error: 'red',
  };

  return (
    <Badge colorScheme={colorSchemes[status]} variant="subtle">
      {status === 'queued' && 'Queued'}
      {status === 'processing' && 'Processing'}
      {status === 'success' && 'Success'}
      {status === 'error' && 'Error'}
    </Badge>
  );
}

