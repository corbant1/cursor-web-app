import {
  Box,
  VStack,
  Heading,
  Text,
  Divider,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';

export default function ExternalDocMetadataPanel() {
  return (
    <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="gray.200" shadow="sm">
      <HStack justify="space-between" mb={2}>
        <Heading size="sm">External Document Metadata</Heading>
        <IconButton
          aria-label="Edit metadata"
          icon={<EditIcon />}
          size="xs"
          variant="ghost"
        />
      </HStack>
      <Text fontSize="xs" color="gray.500" mb={4}>
        Template metadata applied to all uploaded documents.
      </Text>
      <VStack align="stretch" spacing={3}>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Project
          </Text>
          <Text fontSize="sm">LDE North Campus</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Discipline
          </Text>
          <Text fontSize="sm">Structural Engineering</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Document Type
          </Text>
          <Text fontSize="sm">External Document</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Class
          </Text>
          <Text fontSize="sm">Client Correspondence</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Revision
          </Text>
          <Text fontSize="sm">A</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Received Date
          </Text>
          <Text fontSize="sm">2025-11-13</Text>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.500" mb={1}>
            Comments
          </Text>
          <Text fontSize="sm">
            Batch upload of external design documents received from client November 2025
          </Text>
        </Box>
        <Divider />
        <Text fontSize="xs" color="gray.500" fontStyle="italic">
          These are template values that will be applied to all documents. Edit via M-Files metadata dialog when uploading the first file.
        </Text>
      </VStack>
    </Box>
  );
}

