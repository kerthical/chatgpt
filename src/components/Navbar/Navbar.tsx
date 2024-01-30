import { useResponsive } from '@/hooks/useResponsive';
import { isNavbarOpenAtom } from '@/stores/navbar';
import { AppShellNavbar, Button, Center, Group, Stack } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { IconBrandOpenai, IconEdit } from '@tabler/icons-react';
import { useSetAtom } from 'jotai/index';
import { memo } from 'react';

import * as classes from './Navbar.css.ts';

export const Navbar = memo(() => {
  const { isMobile } = useResponsive();
  const setIsNavbarOpen = useSetAtom(isNavbarOpenAtom);
  const navbarRef = useClickOutside(() => isMobile && setIsNavbarOpen(false));

  return (
    <AppShellNavbar bg="rgba(0, 0, 0, 0.2)">
      <Group align="start" gap={0} h="100%" w="100%">
        <Stack
          bg="black"
          h="100%"
          px="sm"
          py="md"
          ref={navbarRef}
          w={{
            base: 320,
            sm: 260,
          }}
        >
          <Stack flex={1} w="100%">
            {/* TODO: newHistory */}
            <Button
              c="white"
              className={classes.newChatButton}
              h={40}
              justify="space-between"
              px="xs"
              rightSection={<IconEdit size={18} />}
              variant="subtle"
              w="100%"
            >
              <Group gap="xs">
                <Center bg="white" h={28} style={{ borderRadius: 999 }} w={28}>
                  <IconBrandOpenai color="black" height="80%" stroke={1} width="80%" />
                </Center>
                New Chat
              </Group>
            </Button>
            {/* TODO: histories */}
          </Stack>
        </Stack>
      </Group>
    </AppShellNavbar>
  );
});

Navbar.displayName = 'Navbar';
