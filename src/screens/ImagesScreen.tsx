import {
  Box,
  Container,
  Heading,
  VStack,
  Switch,
  FormControl,
  FormLabel,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  HStack,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import DragDropZone from '../components/upload/DragDropZone';
import StatusBadge from '../components/upload/StatusBadge';
import ProgressSummary from '../components/upload/ProgressSummary';
import ImageDetailsPanel from '../components/images/ImageDetailsPanel';
import { useImagesUpload } from '../hooks/useImagesUpload';
import { formatFileSize } from '../utils/format';

export default function ImagesScreen() {
  const {
    items,
    useMetadataTemplate,
    setUseMetadataTemplate,
    addFiles,
    retryFailed,
    stats,
  } = useImagesUpload();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const toast = useToast();

  const selectedItem = items.find((item) => item.id === selectedItemId);

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
            Bulk upload site photos as Image objects with correct metadata and EXIF Date Taken
          </Heading>
        </Box>

        <DragDropZone
          onFilesSelected={addFiles}
          accept="image/*"
          description="Drag image files here or click to browse"
          supportedFormats="Supports JPG, PNG, TIFF, and other common image formats"
        />

        <FormControl display="flex" alignItems="center">
          <Switch
            id="metadata-template"
            isChecked={useMetadataTemplate}
            onChange={(e) => setUseMetadataTemplate(e.target.checked)}
            mr={3}
          />
          <FormLabel htmlFor="metadata-template" mb={0}>
            Use first image to capture metadata template
          </FormLabel>
        </FormControl>
        <Text fontSize="sm" color="gray.600" ml={10}>
          First image opens an M-Files dialog to set metadata. Remaining images
          automatically inherit this metadata template for faster bulk processing.
        </Text>

        {items.length > 0 && (
          <HStack spacing={4} align="flex-start">
            <Box flex="1">
              <Heading size="sm" mb={4}>
                Uploaded Images ({items.length})
              </Heading>
              <Box bg="white" borderRadius="md" overflow="hidden" border="1px" borderColor="gray.200">
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Preview</Th>
                      <Th>Filename</Th>
                      <Th>Date Taken</Th>
                      <Th>Size</Th>
                      <Th>Status</Th>
                      <Th>Object ID</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {items.map((item) => (
                      <Tr
                        key={item.id}
                        cursor="pointer"
                        onClick={() => setSelectedItemId(item.id)}
                        bg={selectedItemId === item.id ? 'blue.50' : 'white'}
                        _hover={{ bg: 'gray.50' }}
                      >
                        <Td>
                          {item.previewUrl && (
                            <Image
                              src={item.previewUrl}
                              alt={item.filename}
                              boxSize="50px"
                              objectFit="cover"
                              borderRadius="md"
                            />
                          )}
                        </Td>
                        <Td>{item.filename}</Td>
                        <Td>{item.dateTaken || '-'}</Td>
                        <Td>{formatFileSize(item.size)}</Td>
                        <Td>
                          <StatusBadge status={item.status} />
                        </Td>
                        <Td>{item.objectId || '-'}</Td>
                        <Td>
                          {item.objectId && (
                            <IconButton
                              aria-label="Open in M-Files"
                              icon={<ExternalLinkIcon />}
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
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

            {selectedItem && (
              <Box width="400px">
                <ImageDetailsPanel item={selectedItem} />
              </Box>
            )}
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

