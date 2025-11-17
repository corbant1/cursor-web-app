import { useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Badge,
  IconButton,
  Alert,
  AlertIcon,
  AlertDescription,
  Link,
  Tabs,
  TabList,
  Tab,
  Text,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useTransmittalBuilder } from '../hooks/useTransmittalBuilder';

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'document':
      return 'blue';
    case 'image':
      return 'green';
    case 'external':
      return 'purple';
    default:
      return 'gray';
  }
};

export default function TransmittalsScreen() {
  const {
    header,
    setHeader,
    selectedItems,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    vaultItems,
    isCreating,
    createdTransmittalId,
    performSearch,
    toggleItemSelection,
    removeSelectedItem,
    handleCreateTransmittal,
    stats,
  } = useTransmittalBuilder();

  // Perform initial search on mount
  useEffect(() => {
    performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    performSearch();
  };

  return (
    <Container maxW="full" py={6} px={8}>
      <VStack spacing={6} align="stretch">
        {createdTransmittalId && (
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            <AlertDescription>
              Transmittal created successfully!{' '}
              <Link href="#" textDecoration="underline">
                Open in M-Files
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="gray.200">
          <Heading size="md" mb={4}>
            Transmittal Header Information
          </Heading>
          <HStack spacing={4} align="flex-start">
            <VStack flex="1" spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Project *</FormLabel>
                <Select
                  value={header.project}
                  onChange={(e) => setHeader({ ...header, project: e.target.value })}
                >
                  <option>LDE North Campus</option>
                  <option>LDE South Campus</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Revision</FormLabel>
                <Input
                  value={header.revision}
                  onChange={(e) => setHeader({ ...header, revision: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Recipient *</FormLabel>
                <Select
                  value={header.recipient}
                  onChange={(e) => setHeader({ ...header, recipient: e.target.value })}
                >
                  <option>ABC Construction Ltd.</option>
                  <option>XYZ Engineering</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Comments / Notes</FormLabel>
                <Textarea
                  value={header.comments}
                  onChange={(e) => setHeader({ ...header, comments: e.target.value })}
                  rows={4}
                />
              </FormControl>
            </VStack>
            <VStack flex="1" spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Transmittal Number *</FormLabel>
                <Input
                  value={header.transmittalNumber}
                  onChange={(e) => setHeader({ ...header, transmittalNumber: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Date *</FormLabel>
                <Input
                  type="date"
                  value={header.date}
                  onChange={(e) => setHeader({ ...header, date: e.target.value })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Sender *</FormLabel>
                <Select
                  value={header.sender}
                  onChange={(e) => setHeader({ ...header, sender: e.target.value })}
                >
                  <option>LDE Engineering Team</option>
                  <option>LDE Design Team</option>
                </Select>
              </FormControl>
            </VStack>
          </HStack>
        </Box>

        <HStack spacing={4} align="flex-start">
          <Box flex="1" bg="white" p={6} borderRadius="md" border="1px" borderColor="gray.200">
            <Heading size="sm" mb={4}>
              Select Items to Include
            </Heading>
            <VStack spacing={4} align="stretch">
              <Input
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Tabs
                index={filterType === 'all' ? 0 : filterType === 'document' ? 1 : filterType === 'image' ? 2 : 3}
                onChange={(index) => {
                  const types = ['all', 'document', 'image', 'external'] as const;
                  setFilterType(types[index]);
                }}
              >
                <TabList>
                  <Tab>All</Tab>
                  <Tab>Documents</Tab>
                  <Tab>Images</Tab>
                  <Tab>External</Tab>
                </TabList>
              </Tabs>
              <Box maxH="400px" overflowY="auto">
                <Table variant="simple" size="sm">
                  <Thead bg="gray.50" position="sticky" top={0}>
                    <Tr>
                      <Th width="40px"></Th>
                      <Th>Type</Th>
                      <Th>Title</Th>
                      <Th>Project</Th>
                      <Th>Last Modified</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {vaultItems.map((item) => {
                      const isSelected = selectedItems.some((si) => si.vaultItemId === item.id);
                      return (
                        <Tr
                          key={item.id}
                          cursor="pointer"
                          onClick={() => toggleItemSelection(item)}
                          bg={isSelected ? 'blue.50' : 'white'}
                          _hover={{ bg: 'gray.50' }}
                        >
                          <Td>
                            <Checkbox isChecked={isSelected} />
                          </Td>
                          <Td>
                            <Badge colorScheme={getTypeBadgeColor(item.type)}>
                              {item.type}
                            </Badge>
                          </Td>
                          <Td>{item.title}</Td>
                          <Td>{item.project}</Td>
                          <Td>{item.lastModified}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </Box>

          <Box flex="1" bg="white" p={6} borderRadius="md" border="1px" borderColor="gray.200">
            <Heading size="sm" mb={4}>
              Transmittal Contents
            </Heading>
            {selectedItems.length === 0 ? (
              <VStack spacing={4} py={12}>
                <Text fontSize="6xl">✈️</Text>
                <Text color="gray.500">No items selected</Text>
                <Text fontSize="sm" color="gray.400">
                  Select items from the list on the left
                </Text>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Text fontSize="sm" color="gray.600">
                    Documents: {stats.documents} Images: {stats.images} External: {stats.external}
                  </Text>
                </HStack>
                <Box maxH="400px" overflowY="auto">
                  <Table variant="simple" size="sm">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>Title</Th>
                        <Th>Type</Th>
                        <Th>Project</Th>
                        <Th width="60px"></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {selectedItems.map((item) => (
                        <Tr key={item.id}>
                          <Td>{item.title}</Td>
                          <Td>
                            <Badge colorScheme={getTypeBadgeColor(item.type)}>
                              {item.type}
                            </Badge>
                          </Td>
                          <Td>{item.project}</Td>
                          <Td>
                            <IconButton
                              aria-label="Remove"
                              icon={<DeleteIcon />}
                              size="xs"
                              variant="ghost"
                              onClick={() => removeSelectedItem(item.id)}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            )}
          </Box>
        </HStack>

        <HStack justify="flex-end" spacing={4}>
          <Button variant="outline">Cancel</Button>
          <Button
            colorScheme="brand"
            onClick={handleCreateTransmittal}
            isLoading={isCreating}
            isDisabled={selectedItems.length === 0}
          >
            Create Transmittal
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
}

