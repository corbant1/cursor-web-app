import {
  Box,
  Text,
  Icon,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { AttachmentIcon } from '@chakra-ui/icons';

interface DragDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  description?: string;
  supportedFormats?: string;
}

export default function DragDropZone({
  onFilesSelected,
  accept,
  multiple = true,
  description = 'Drag files here or click to browse',
  supportedFormats,
}: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const activeBgColor = useColorModeValue('blue.50', 'blue.900');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      onFilesSelected(files);
    },
    [onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFilesSelected(files);
      }
      // Reset input
      e.target.value = '';
    },
    [onFilesSelected]
  );

  return (
    <Box
      border="2px dashed"
      borderColor={isDragging ? 'brand.500' : borderColor}
      borderRadius="md"
      p={8}
      bg={isDragging ? activeBgColor : bgColor}
      transition="all 0.2s"
      cursor="pointer"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
      _hover={{
        borderColor: 'brand.500',
        bg: activeBgColor,
      }}
    >
      <input
        id="file-input"
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={handleFileInput}
      />
      <VStack spacing={4}>
        <Icon as={AttachmentIcon} boxSize={12} color="gray.400" />
        <Text fontSize="md" fontWeight="medium">
          {description}
        </Text>
        {supportedFormats && (
          <Text fontSize="sm" color="gray.500">
            {supportedFormats}
          </Text>
        )}
      </VStack>
    </Box>
  );
}

