import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  Divider,
} from '@chakra-ui/react';
import type { ImageUploadItem } from '../../types';

interface ImageDetailsPanelProps {
  item: ImageUploadItem;
}

export default function ImageDetailsPanel({ item }: ImageDetailsPanelProps) {
  return (
    <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="gray.200" shadow="sm">
      <Heading size="sm" mb={4}>
        Image Details
      </Heading>
      {item.previewUrl && (
        <Image
          src={item.previewUrl}
          alt={item.filename}
          borderRadius="md"
          mb={4}
          maxH="300px"
          objectFit="contain"
        />
      )}
      <VStack align="stretch" spacing={3}>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Filename
          </Text>
          <Text fontSize="sm" fontWeight="medium">
            {item.filename}
          </Text>
        </Box>
        <Divider />
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Date Taken (EXIF)
          </Text>
          <Text fontSize="sm">{item.dateTaken || '-'}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Project
          </Text>
          <Text fontSize="sm">{item.metadata?.project || 'LDE North Campus'}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Site
          </Text>
          <Text fontSize="sm">{item.metadata?.site || 'Building A - Foundation'}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Site Visit
          </Text>
          <Text fontSize="sm">{item.metadata?.siteVisit || 'Visit #23 - Nov 2025'}</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            GPS Coordinates
          </Text>
          <Text fontSize="sm">{item.metadata?.gpsCoordinates || '51.5074° N, 0.1278° W'}</Text>
        </Box>
        <Divider />
        <Text fontSize="xs" color="gray.500" fontStyle="italic">
          Metadata is set via M-Files; this panel is for review only.
        </Text>
      </VStack>
    </Box>
  );
}

