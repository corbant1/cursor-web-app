import { Box, Progress, Text, HStack, Button } from '@chakra-ui/react';

interface ProgressSummaryProps {
  total: number;
  completed: number;
  errors: number;
  pending: number;
  onRetry?: () => void;
  onExport?: () => void;
}

export default function ProgressSummary({
  total,
  completed,
  errors,
  pending,
  onRetry,
  onExport,
}: ProgressSummaryProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Box p={4} bg="white" borderTop="1px" borderColor="gray.200">
      <Progress value={percentage} colorScheme="brand" mb={4} />
      <HStack justify="space-between">
        <Text fontSize="sm" color="gray.600">
          {errors > 0 && `${errors} errors`}
          {errors > 0 && pending > 0 && ' • '}
          {pending > 0 && `${pending} pending`}
          {errors === 0 && pending === 0 && completed > 0 && 'All completed'}
        </Text>
        <HStack spacing={2}>
          {errors > 0 && onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              Retry failures
            </Button>
          )}
          {onExport && (
            <Button size="sm" variant="outline" onClick={onExport}>
              Export results to CSV
            </Button>
          )}
        </HStack>
      </HStack>
    </Box>
  );
}

