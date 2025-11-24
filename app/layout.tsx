import { ChakraProvider } from '@chakra-ui/react';

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
        <ChakraProvider>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}

