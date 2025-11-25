'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Heading,
  Textarea,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  Divider,
  Spinner,
  Icon,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { LockIcon, CheckCircleIcon, InfoIcon } from '@chakra-ui/icons';

function ManualLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectUrl, setRedirectUrl] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingAuth, setIsTestingAuth] = useState(false);
  const [userInfo, setUserInfo] = useState<unknown>(null);

  const handleOpenLogin = () => {
    // Simply open the endpoint - the browser will follow the redirect
    // If there's an error, it will show in the new tab
    window.open('/api/mfiles/login', '_blank');
  };

  const handleTestAuth = async () => {
    setIsTestingAuth(true);
    setStatus(null);
    setUserInfo(null);

    try {
      const response = await fetch('/api/mfiles/me');
      const data = await response.json();

      if (response.ok) {
        setUserInfo(data);
        setStatus({ type: 'success', message: 'Authentication verified! User info retrieved successfully.' });
      } else {
        const errorMsg = data.error || data.details || `Failed to verify authentication: ${response.status}`;
        const fullError = data.statusText ? `${errorMsg} (${data.statusText})` : errorMsg;
        setStatus({
          type: 'error',
          message: fullError,
        });
        // Also set userInfo to show the error details
        setUserInfo(data);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setStatus({
        type: 'error',
        message: `Error: ${errorMessage}`,
      });
    } finally {
      setIsTestingAuth(false);
    }
  };

  const handleCompleteLogin = async () => {
    if (!redirectUrl.trim()) {
      setStatus({ type: 'error', message: 'Please paste the redirect URL' });
      return;
    }

    setIsLoading(true);
    setStatus(null);

    try {
      const response = await fetch('/api/mfiles/complete-oauth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ redirectUrl }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        setStatus({ type: 'success', message: 'Login successful! Redirecting to app...' });
        setRedirectUrl('');
        
        // Redirect to the return URL or home page after successful login
        const returnTo = searchParams.get('returnTo') || '/';
        setTimeout(() => {
          router.push(returnTo);
        }, 1500);
      } else {
        setStatus({
          type: 'error',
          message: data.error || data.details || `Login failed: ${response.status}`,
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setStatus({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gradient-to-br" bgGradient="linear(to-br, blue.50, purple.50)">
      <Container maxW="2xl" py={12}>
        <VStack spacing={8} align="stretch">
          {/* Header Card */}
          <Box bg="white" shadow="xl" borderRadius="xl" overflow="hidden" border="1px" borderColor="gray.200">
            <Box bgGradient="linear(to-r, blue.500, purple.500)" p={6} color="white">
              <HStack spacing={3} mb={2}>
                <Icon as={LockIcon} boxSize={6} />
                <Heading size="lg">M-Files Authentication</Heading>
              </HStack>
              <Text fontSize="md" opacity={0.9}>
                Complete the OAuth login flow to access your M-Files vault
              </Text>
            </Box>
            <Box p={6}>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Button
                    colorScheme="blue"
                    onClick={handleOpenLogin}
                    size="lg"
                    width="full"
                    leftIcon={<LockIcon />}
                    bgGradient="linear(to-r, blue.500, blue.600)"
                    _hover={{ bgGradient: 'linear(to-r, blue.600, blue.700)' }}
                    shadow="md"
                  >
                    Open M-Files Login
                  </Button>
                  <Text fontSize="sm" color="gray.600" mt={3} textAlign="center">
                    This will open the M-Files login page in a new tab. Complete the login there.
                  </Text>
                </Box>

                <Divider />

                <Box>
                  <HStack mb={3}>
                    <Icon as={InfoIcon} color="blue.500" />
                    <Text fontWeight="semibold" fontSize="md">
                      Paste the final redirect URL here:
                    </Text>
                  </HStack>
                  <Textarea
                    value={redirectUrl}
                    onChange={(e) => setRedirectUrl(e.target.value)}
                    placeholder="Paste the full URL from the M-Files login tab here..."
                    rows={4}
                    fontFamily="mono"
                    fontSize="sm"
                    borderRadius="md"
                    borderColor="gray.300"
                    _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                  />
                </Box>

                <Button
                  colorScheme="green"
                  onClick={handleCompleteLogin}
                  isLoading={isLoading}
                  loadingText="Completing login..."
                  size="lg"
                  width="full"
                  leftIcon={<CheckCircleIcon />}
                  bgGradient="linear(to-r, green.500, green.600)"
                  _hover={{ bgGradient: 'linear(to-r, green.600, green.700)' }}
                  shadow="md"
                >
                  Complete Login
                </Button>
              </VStack>
            </Box>
          </Box>

          {status && (
            <Alert
              status={status.type}
              borderRadius="lg"
              variant="left-accent"
              shadow="sm"
            >
              <AlertIcon />
              <Box>
                <AlertTitle>
                  {status.type === 'success' ? 'Success' : 'Error'}
                </AlertTitle>
                <AlertDescription>{status.message}</AlertDescription>
              </Box>
            </Alert>
          )}

          {/* Test Authentication Card */}
          <Box bg="white" shadow="lg" borderRadius="xl" border="1px" borderColor="gray.200">
            <Box p={6} pb={3} borderBottom="1px" borderColor="gray.100">
              <Text fontWeight="semibold" fontSize="lg">
                Test Authentication
              </Text>
            </Box>
            <Box p={6} pt={4}>
              <VStack spacing={4} align="stretch">
                <Button
                  colorScheme="purple"
                  onClick={handleTestAuth}
                  isLoading={isTestingAuth}
                  loadingText="Testing..."
                  size="md"
                  width="full"
                  variant="outline"
                >
                  Test /api/mfiles/me
                </Button>
                {userInfo !== null && (
                  <Box p={4} bg="gray.50" borderRadius="md" border="1px" borderColor="gray.200">
                    <HStack mb={2}>
                      <Badge colorScheme={(userInfo as { error?: string })?.error ? 'red' : 'green'}>
                        {(userInfo as { error?: string })?.error ? 'Error Details' : 'User Info'}
                      </Badge>
                    </HStack>
                    <Code 
                      display="block" 
                      whiteSpace="pre-wrap" 
                      p={3} 
                      fontSize="xs" 
                      overflowX="auto"
                      borderRadius="md"
                      bg="white"
                    >
                      {JSON.stringify(userInfo, null, 2)}
                    </Code>
                  </Box>
                )}
              </VStack>
            </Box>
          </Box>

          {/* Instructions Card */}
          <Box bg="white" shadow="lg" borderRadius="xl" border="1px" borderColor="gray.200">
            <Box p={6} pb={3} borderBottom="1px" borderColor="gray.100">
              <HStack>
                <Icon as={InfoIcon} color="blue.500" />
                <Text fontWeight="semibold" fontSize="lg">
                  Instructions
                </Text>
              </HStack>
            </Box>
            <Box p={6} pt={4}>
              <VStack align="stretch" spacing={3} fontSize="sm">
                <HStack align="start">
                  <Badge colorScheme="blue" borderRadius="full" minW={6} h={6} display="flex" alignItems="center" justifyContent="center">
                    1
                  </Badge>
                  <Text flex={1}>Click &quot;Open M-Files Login&quot; to start the OAuth flow</Text>
                </HStack>
                <HStack align="start">
                  <Badge colorScheme="blue" borderRadius="full" minW={6} h={6} display="flex" alignItems="center" justifyContent="center">
                    2
                  </Badge>
                  <Text flex={1}>Complete the login in the new tab</Text>
                </HStack>
                <HStack align="start">
                  <Badge colorScheme="blue" borderRadius="full" minW={6} h={6} display="flex" alignItems="center" justifyContent="center">
                    3
                  </Badge>
                  <Text flex={1}>After login, copy the final URL from the address bar</Text>
                </HStack>
                <HStack align="start">
                  <Badge colorScheme="blue" borderRadius="full" minW={6} h={6} display="flex" alignItems="center" justifyContent="center">
                    4
                  </Badge>
                  <Text flex={1}>Paste it into the textarea above</Text>
                </HStack>
                <HStack align="start">
                  <Badge colorScheme="blue" borderRadius="full" minW={6} h={6} display="flex" alignItems="center" justifyContent="center">
                    5
                  </Badge>
                  <Text flex={1}>Click &quot;Complete Login&quot; to finish</Text>
                </HStack>
              </VStack>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default function ManualLoginPage() {
  return (
    <Suspense
      fallback={
        <Container maxW="2xl" py={10}>
          <VStack spacing={6}>
            <Spinner size="xl" />
            <Text>Loading...</Text>
          </VStack>
        </Container>
      }
    >
      <ManualLoginContent />
    </Suspense>
  );
}
