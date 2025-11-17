import { Box, Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';
import TopBar from './TopBar';
import MainNav from './MainNav';
import StatusBar from './StatusBar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Flex direction="column" height="100vh" overflow="hidden">
      <TopBar />
      <MainNav />
      <Box flex="1" overflow="auto" bg="gray.50">
        {children}
      </Box>
      <StatusBar />
    </Flex>
  );
}

