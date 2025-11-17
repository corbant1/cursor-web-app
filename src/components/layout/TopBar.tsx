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
      py={3}
      shadow="sm"
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="xl" fontWeight="bold" color="brand.600">
            M-Files Uploader & Transmittal Builder
          </Text>
          <Text fontSize="sm" color="gray.600">
            Vault: LDE Production
          </Text>
        </Box>
        <HStack spacing={2}>
          <IconButton
            aria-label="Settings"
            icon={<SettingsIcon />}
            variant="ghost"
            size="sm"
          />
          <IconButton
            aria-label="Help"
            icon={<QuestionIcon />}
            variant="ghost"
            size="sm"
          />
          <Avatar size="sm" name="User" />
        </HStack>
      </Flex>
    </Box>
  );
}

