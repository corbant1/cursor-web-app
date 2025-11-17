import { Box, Flex, Text, HStack, useColorModeValue } from '@chakra-ui/react';

export default function StatusBar() {
  const bgColor = useColorModeValue('gray.100', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      borderTop="1px"
      borderColor={borderColor}
      px={6}
      py={2}
    >
      <Flex justify="space-between" align="center">
        <HStack spacing={4}>
          <Text fontSize="sm" color="gray.600">
            Status: Connected
          </Text>
          <Text fontSize="sm" color="gray.600">
            •
          </Text>
          <Text fontSize="sm" color="gray.600">
            Ready
          </Text>
        </HStack>
        <Text fontSize="sm" color="gray.600">
          M-Files API v1.0
        </Text>
      </Flex>
    </Box>
  );
}

