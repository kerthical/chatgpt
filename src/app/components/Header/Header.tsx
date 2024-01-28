import { ModelSelector } from '@/app/components';
import { isNavbarOpenAtom } from '@/app/stores/navbar';
import { ActionIcon, AppShellHeader, Group } from '@mantine/core';
import { IconEdit, IconMenu } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { memo } from 'react';

export const Header = memo(() => {
  const [isNavbarOpen, setNavbarOpen] = useAtom(isNavbarOpenAtom);

  return (
    <AppShellHeader>
      <Group h="100%" justify="space-between" p={8} w="100%">
        {/* TODO: newHistory */}
        <ActionIcon
          c="white"
          hiddenFrom="sm"
          onClick={() => setNavbarOpen(prev => !prev)}
          size="sm"
          variant="transparent"
        >
          <IconMenu />
        </ActionIcon>
        <Group gap="xs">
          {!isNavbarOpen && (
            <ActionIcon c="white" p={6} size="lg" variant="default" visibleFrom="sm">
              <IconEdit />
            </ActionIcon>
          )}
          <ModelSelector />
        </Group>
        {/* TODO: newHistory */}
        <ActionIcon c="white" hiddenFrom="sm" size="sm" variant="transparent">
          <IconEdit />
        </ActionIcon>
      </Group>
    </AppShellHeader>
  );
});

Header.displayName = 'Header';
