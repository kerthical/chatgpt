import { FlexForm } from '@/components/FlexForm';
import { SidebarChevron } from '@/components/SidebarChevron';
import { useTranslator } from '@/hooks/useTranslator';
import { AppShellMain, Center, Stack, Text, Textarea, Title } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { IconBrandOpenai } from '@tabler/icons-react';
import { memo } from 'react';

export const Main = memo(() => {
  const translate = useTranslator('main');
  const colorScheme = useColorScheme();

  return (
    <AppShellMain>
      <Stack gap="xs" h="calc(100dvh - var(--app-shell-header-height))" left={0} pos="relative" top={0} w="100%">
        <SidebarChevron />
        <Stack align="center" h="100%" justify="center" w="100%">
          <Center bg="white" h={72} style={{ borderRadius: 999 }} w={72}>
            <IconBrandOpenai color="black" height="80%" stroke={1.5} width="80%" />
          </Center>
          <Title c={colorScheme === 'dark' ? 'white' : 'black'} order={3}>
            {translate('welcome')}
          </Title>
        </Stack>
        <Stack
          align="center"
          px={{
            base: 'sm',
            sm: 'xl',
          }}
          w="100%"
        >
          <FlexForm align="center" justify="center" onSubmit={() => {}} w="100%">
            <Textarea
              autoFocus
              autosize
              maw={{ sm: '720px' }}
              placeholder={translate('send_message_placeholder')}
              radius="lg"
              size="lg"
              styles={{ input: { background: 'transparent' } }}
              w="100%"
            />
          </FlexForm>
        </Stack>
        <Text mb="xs" size="xs" ta="center">
          {translate('warning_hallucination')}
        </Text>
      </Stack>
    </AppShellMain>
  );
});

Main.displayName = 'Main';
