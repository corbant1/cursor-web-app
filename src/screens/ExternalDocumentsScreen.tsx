import {
  Box,
  Container,
  Heading,
  VStack,
  Radio,
  RadioGroup,
  Stack,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  IconButton,
  Badge,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import DragDropZone from '../components/upload/DragDropZone';
import StatusBadge from '../components/upload/StatusBadge';
import ProgressSummary from '../components/upload/ProgressSummary';
import ExternalDocMetadataPanel from '../components/external-docs/ExternalDocMetadataPanel';
import { useExternalDocsUpload } from '../hooks/useExternalDocsUpload';
import { formatFileSize } from '../utils/format';

export default function ExternalDocumentsScreen() {
  const {
    items,
    namingRule,
    setNamingRule,
    customPattern,
    setCustomPattern,
    addFiles,
    retryFailed,
    stats,
  } = useExternalDocsUpload();
  const toast = useToast();

  const handleExport = () => {
    // TODO: Implement CSV export
    toast({
      title: 'Export',
      description: 'CSV export functionality will be implemented',
      status: 'info',
      duration: 3000,
    });
  };

  return (
    <Container maxW="full" py={6} px={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2}>
            Bulk upload client PDFs, DWGs, letters, etc. as External Document objects.
          </Heading>
        </Box>

        <DragDropZone
          onFilesSelected={addFiles}
          description="Drag files here or click to browse"
        />
        <Text fontSize="sm" color="gray.600" textAlign="center">
          First file will open the M-Files metadata dialog; remaining files use the same template metadata.
        </Text>

        <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="gray.200">
          <Heading size="sm" mb={4}>
            Naming & Classification Options
          </Heading>
          <RadioGroup value={namingRule} onChange={(value) => setNamingRule(value as 'filename' | 'custom')}>
            <Stack spacing={4}>
              <Radio value="filename">
                <VStack align="start" spacing={1}>
                  <FormLabel mb={0}>Title from filename (default)</FormLabel>
                  <Text fontSize="xs" color="gray.500" fontFamily="mono">
                    &quot;LDE-NC-DRW-001-Rev-A.pdf&quot; → &quot;LDE-NC-DRW-001-Rev-A&quot;
                  </Text>
                </VStack>
              </Radio>
              <Radio value="custom">
                <VStack align="start" spacing={2}>
                  <FormLabel mb={0}>Custom naming rule</FormLabel>
                  <Input
                    size="sm"
                    value={customPattern}
                    onChange={(e) => setCustomPattern(e.target.value)}
                    placeholder="[ProjectCode] - [FilenameWithoutExtension]"
                    fontFamily="mono"
                    maxW="400px"
                  />
                  <Text fontSize="xs" color="gray.500">
                    Example: &quot;[ProjectCode] - [FilenameWithoutExtension]&quot;
                  </Text>
                </VStack>
              </Radio>
            </Stack>
          </RadioGroup>
        </Box>

        {items.length > 0 && (
          <HStack spacing={4} align="flex-start">
            <Box flex="1">
              <Heading size="sm" mb={4}>
                External Documents ({items.length})
              </Heading>
              <Box bg="white" borderRadius="md" overflow="hidden" border="1px" borderColor="gray.200">
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Filename</Th>
                      <Th>File Type</Th>
                      <Th>Size</Th>
                      <Th>Status</Th>
                      <Th>Title in M-Files</Th>
                      <Th>Object ID</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((item) => (
                      <Tr key={item.id}>
                        <Td>{item.filename}</Td>
                        <Td>
                          <Badge>{item.fileType}</Badge>
                        </Td>
                        <Td>{formatFileSize(item.size)}</Td>
                        <Td>
                          <StatusBadge status={item.status} />
                        </Td>
                        <Td>{item.titleInMFiles || '-'}</Td>
                        <Td>{item.objectId || '-'}</Td>
                        <Td>
                          {item.objectId && (
                            <IconButton
                              aria-label="Open"
                              icon={<ExternalLinkIcon />}
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                // TODO: Open in M-Files
                                toast({
                                  title: 'Open in M-Files',
                                  description: 'This will open the object in M-Files',
                                  status: 'info',
                                });
                              }}
                            />
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>

            <Box width="400px">
              <ExternalDocMetadataPanel />
            </Box>
          </HStack>
        )}

        {items.length > 0 && (
          <ProgressSummary
            total={stats.total}
            completed={stats.success}
            errors={stats.error}
            pending={stats.queued + stats.processing}
            onRetry={stats.error > 0 ? retryFailed : undefined}
            onExport={handleExport}
          />
        )}
      </VStack>
    </Container>
  );
}

