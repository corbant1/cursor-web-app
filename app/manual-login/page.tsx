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
} from '@chakra-ui/react';

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
    <Container maxW="2xl" py={10}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            M-Files Manual OAuth Login
          </Heading>
          <Text color="gray.600">
            Use this page to manually complete the OAuth login flow for M-Files Cloud.
          </Text>
        </Box>

        <Box>
          <Button
            colorScheme="blue"
            onClick={handleOpenLogin}
            size="lg"
            width="full"
          >
            Open M-Files Login
          </Button>
          <Text fontSize="sm" color="gray.600" mt={2}>
            This will open the M-Files login page in a new tab. Complete the login there.
          </Text>
        </Box>

        <Box>
          <Text mb={2} fontWeight="medium">
            Paste the final redirect URL here:
          </Text>
          <Textarea
            value={redirectUrl}
            onChange={(e) => setRedirectUrl(e.target.value)}
            placeholder="Paste the full URL from the M-Files login tab here..."
            rows={4}
            fontFamily="mono"
            fontSize="sm"
          />
        </Box>

        <Button
          colorScheme="green"
          onClick={handleCompleteLogin}
          isLoading={isLoading}
          loadingText="Completing login..."
          size="lg"
          width="full"
        >
          Complete Login
        </Button>

        {status && (
          <Alert
            status={status.type}
            borderRadius="md"
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

        <Divider />

        <Box>
          <Text mb={2} fontWeight="medium">
            Test Authentication:
          </Text>
          <Button
            colorScheme="purple"
            onClick={handleTestAuth}
            isLoading={isTestingAuth}
            loadingText="Testing..."
            size="md"
            width="full"
          >
            Test /api/mfiles/me
          </Button>
          {userInfo !== null && (
            <Box mt={4} p={4} bg="gray.50" borderRadius="md">
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                {(userInfo as { error?: string })?.error ? 'Error Details:' : 'User Info:'}
              </Text>
              <Code display="block" whiteSpace="pre-wrap" p={2} fontSize="xs" overflowX="auto">
                {JSON.stringify(userInfo, null, 2)}
              </Code>
            </Box>
          )}
        </Box>

        <Box mt={4} p={4} bg="gray.50" borderRadius="md">
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Instructions:
          </Text>
          <VStack align="stretch" spacing={2} fontSize="sm">
            <Text>1. Click &quot;Open M-Files Login&quot; to start the OAuth flow</Text>
            <Text>2. Complete the login in the new tab</Text>
            <Text>3. After login, copy the final URL from the address bar</Text>
            <Text>4. Paste it into the textarea above</Text>
            <Text>5. Click &quot;Complete Login&quot; to finish</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
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
