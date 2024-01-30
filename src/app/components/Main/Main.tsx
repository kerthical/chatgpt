import { FlexForm } from '@/app/components';
import { useTranslator } from '@/app/hooks';
import { isNavbarOpenAtom } from '@/app/stores';
import { AppShellMain, Box, Center, Stack, Text, Textarea, Title, Tooltip } from '@mantine/core';
import { IconBrandOpenai } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { memo } from 'react';

import classes from './Main.module.css';

export const Main = memo(() => {
  const [isNavbarOpen, setIsNavbarOpen] = useAtom(isNavbarOpenAtom);
  const translate = useTranslator('main');

  return (
    <AppShellMain>
      <Stack gap="xs" h="calc(100dvh - var(--app-shell-header-height))" left={0} pos="relative" top={0} w="100%">
        <Tooltip
          bg="black"
          c="white"
          fw={700}
          label={isNavbarOpen ? translate('close_sidebar') : translate('open_sidebar')}
          position="right"
          withArrow
        >
          <Box
            className={classes['sidebar-chevron-container']}
            component="button"
            onClick={() => setIsNavbarOpen(prev => !prev)}
            visibleFrom="sm"
          >
            <div
              className={
                isNavbarOpen ? classes['sidebar-chevron-upper-opened'] : classes['sidebar-chevron-upper-closed']
              }
            />
            <div
              className={
                isNavbarOpen ? classes['sidebar-chevron-lower-opened'] : classes['sidebar-chevron-lower-closed']
              }
            />
          </Box>
        </Tooltip>
        <Stack align="center" h="100%" justify="center" w="100%">
          <Center bg="white" h={72} style={{ borderRadius: 999 }} w={72}>
            <IconBrandOpenai color="black" height="80%" stroke={1.5} width="80%" />
          </Center>
          <Title c="white" order={3}>
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
