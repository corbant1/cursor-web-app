'use client';

import { useState, useEffect } from 'react';
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
  Spinner,
  Code,
  Divider,
} from '@chakra-ui/react';

export default function ManualLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [redirectUrl, setRedirectUrl] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTestingAuth, setIsTestingAuth] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

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
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: `Error: ${error.message}`,
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
    } catch (error: any) {
      setStatus({
        type: 'error',
        message: error.message || 'An error occurred',
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
          {userInfo && (
            <Box mt={4} p={4} bg="gray.50" borderRadius="md">
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                {userInfo.error ? 'Error Details:' : 'User Info:'}
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
