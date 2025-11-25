import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/src/theme';

export const metadata = {
  title: 'M-Files Uploader',
  description: 'M-Files Uploader & Transmittal Builder',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}

