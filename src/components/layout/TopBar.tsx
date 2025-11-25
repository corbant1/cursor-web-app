import {
  Box,
  Flex,
  Text,
  IconButton,
  Avatar,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { SettingsIcon, QuestionIcon } from '@chakra-ui/icons';

export default function TopBar() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={6}
      py={4}
      shadow="md"
      bgGradient="linear(to-r, white, gray.50)"
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="xl" fontWeight="bold" bgGradient="linear(to-r, brand.600, brand.500)" bgClip="text">
            M-Files Uploader & Transmittal Builder
          </Text>
          <Text fontSize="sm" color="gray.600" mt={1}>
            Vault: LDE Production
          </Text>
        </Box>
        <HStack spacing={3}>
          <IconButton
            aria-label="Settings"
            icon={<SettingsIcon />}
            variant="ghost"
            size="md"
            borderRadius="md"
            _hover={{ bg: 'gray.100' }}
          />
          <IconButton
            aria-label="Help"
            icon={<QuestionIcon />}
            variant="ghost"
            size="md"
            borderRadius="md"
            _hover={{ bg: 'gray.100' }}
          />
          <Avatar size="md" name="User" bg="brand.500" />
        </HStack>
      </Flex>
    </Box>
  );
}

