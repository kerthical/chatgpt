import { Message } from '@/components/Message';
import { SidebarChevron } from '@/components/SidebarChevron';
import { TextArea } from '@/components/TextArea';
import { useTranslator } from '@/hooks/useTranslator';
import { messagesAtom } from '@/stores/message';
import { AppShellMain, Box, Center, ScrollArea, Stack, Text, Title } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { IconBrandOpenai } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { memo } from 'react';

export const Main = memo(() => {
  const translate = useTranslator('main');
  const colorScheme = useColorScheme();
  const messages = useAtomValue(messagesAtom);

  return (
    <AppShellMain>
      <Stack gap={0} h="calc(100dvh - var(--app-shell-header-height))" left={0} pos="relative" top={0} w="100%">
        <SidebarChevron />
        {messages.length === 0 ? (
          <Stack align="center" h="100%" justify="center" w="100%">
            <Center bg="white" h={72} style={{ borderRadius: 999 }} w={72}>
              <IconBrandOpenai color="black" height="80%" stroke={1.5} width="80%" />
            </Center>
            <Title c={colorScheme === 'dark' ? 'white' : 'black'} order={3}>
              {translate('welcome')}
            </Title>
          </Stack>
        ) : (
          <ScrollArea h="100%" scrollbarSize={6} w="100%">
            <Stack align="center" gap={0} px="16px" w="100%">
              <Box
                maw={{
                  xs: '100%',
                  sm: '720px',
                }}
                w="100%"
              >
                {messages.map((m, index) => (
                  <Message key={index} message={m} />
                ))}
              </Box>
            </Stack>
          </ScrollArea>
        )}
        <TextArea />
        <Text my={8} size="xs" ta="center">
          {translate('warning_hallucination')}
        </Text>
      </Stack>
    </AppShellMain>
  );
});

Main.displayName = 'Main';
