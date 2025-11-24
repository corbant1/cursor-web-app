'use client';

import { Box, Flex, Link, useColorModeValue } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

export default function MainNav() {
  const pathname = usePathname();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeColor = 'brand.600';
  const inactiveColor = 'gray.600';

  const navItems = [
    { path: '/', label: 'Images' },
    { path: '/external-documents', label: 'External Documents' },
    { path: '/transmittals', label: 'Transmittals' },
  ];

  return (
    <Box bg={bgColor} borderBottom="1px" borderColor={borderColor} px={6}>
      <Flex gap={8}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              px={4}
              py={3}
              borderBottom="2px"
              borderColor={isActive ? activeColor : 'transparent'}
              color={isActive ? activeColor : inactiveColor}
              fontWeight={isActive ? 'semibold' : 'normal'}
              _hover={{
                color: activeColor,
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </Flex>
    </Box>
  );
}

