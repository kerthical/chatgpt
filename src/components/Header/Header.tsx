import { ModelSelector } from '@/components/ModelSelector';
import { newConversationAtom } from '@/stores/conversation.ts';
import { isNavbarOpenAtom } from '@/stores/navbar';
import { ActionIcon, AppShellHeader, Group } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { IconEdit, IconMenu } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { useSetAtom } from 'jotai/index';
import { memo } from 'react';

export const Header = memo(() => {
  const [isNavbarOpen, setNavbarOpen] = useAtom(isNavbarOpenAtom);
  const newConversation = useSetAtom(newConversationAtom);
  const colorScheme = useColorScheme();

  return (
    <AppShellHeader>
      <Group h="100%" justify="space-between" p={0} px={8} w="100%">
        <ActionIcon
          c={colorScheme === 'dark' ? 'white' : 'black'}
          hiddenFrom="sm"
          onClick={() => setNavbarOpen(prev => !prev)}
          size="xs"
          variant="transparent"
        >
          <IconMenu size="100%" />
        </ActionIcon>
        <Group gap="xs">
          {!isNavbarOpen && (
            <ActionIcon
              ml="xs"
              bg="transparent"
              c={colorScheme === 'dark' ? 'white' : 'black'}
              onClick={() => newConversation()}
              p={6}
              size={36}
              style={{
                borderColor: 'rgba(217, 217, 227, 0.15)',
              }}
              variant="default"
              visibleFrom="sm"
            >
              <IconEdit size="100%" />
            </ActionIcon>
          )}
          <ModelSelector />
        </Group>
        <ActionIcon
          c={colorScheme === 'dark' ? 'white' : 'black'}
          hiddenFrom="sm"
          onClick={() => newConversation()}
          size="xs"
          variant="transparent"
        >
          <IconEdit size="100%" />
        </ActionIcon>
      </Group>
    </AppShellHeader>
  );
});

Header.displayName = 'Header';
