import * as classes from '@/pages/App/Main/Main.css.ts';
import { useGenerate } from '@/hooks/useGenerate.ts';
import { useMessages } from '@/hooks/useMessages.ts';
import { useNavbar } from '@/hooks/useNavbar.ts';
import Message from '@/pages/App/Main/Message/Message.tsx';
import { ActionIcon, AppShell, Box, Center, ScrollArea, Stack, Text, Textarea, Title, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { IconArrowUp, IconBrandOpenai, IconPlaystationCircle } from '@tabler/icons-react';

export function Main() {
  const { isNavbarOpened, toggleNavbar } = useNavbar();
  const { messages, messageHandlers } = useMessages();
  const { generate, isGenerating, cancelGeneration } = useGenerate();
  const form = useForm({
    initialValues: {
      message: '',
    },
    validate: {
      message: value => value.trim().length <= 0,
    },
    validateInputOnChange: true,
  });

  return (
    <AppShell.Main>
      <Stack
        align="center"
        gap="xs"
        h="calc(100dvh - var(--app-shell-header-height))"
        left={0}
        pos="relative"
        top={0}
        w="100%"
      >
        <Tooltip
          withArrow
          bg="black"
          c="white"
          fw={700}
          label={isNavbarOpened ? 'サイドバーを閉じる' : 'サイドバーを開く'}
          position="right"
        >
          <Box className={classes.sidebarChevronContainer} component="button" visibleFrom="sm" onClick={toggleNavbar}>
            <div className={isNavbarOpened ? classes.sidebarChevronUpperOpened : classes.sidebarChevronUpperClosed} />
            <div className={isNavbarOpened ? classes.sidebarChevronLowerOpened : classes.sidebarChevronLowerClosed} />
          </Box>
        </Tooltip>
        {messages.length === 0 ? (
          <Stack align="center" h="100%" justify="center" w="100%">
            <Center bg="white" className="rounded-full" h={72} w={72}>
              <IconBrandOpenai color="black" height="80%" stroke={1.5} width="80%" />
            </Center>
            <Title c="white" order={2}>
              今日は何をお手伝いしましょうか？
            </Title>
          </Stack>
        ) : (
          <ScrollArea h="100%" scrollbarSize={6} w="100%">
            <Stack align="center" gap={0} px="xl" w="100%">
              <Box
                maw={{
                  xs: '100%',
                  sm: '720px',
                }}
                w="100%"
              >
                {messages.map((m, i) => (
                  <Message
                    key={m.id || i}
                    isLast={i === messages.length - 1}
                    message={m}
                    onEdit={async newContent => {
                      const newState = messages.slice(0, i + 1);
                      newState[i].content = newContent;
                      messageHandlers.setState(newState);
                      await generate(newState);
                    }}
                    onReload={async () => {
                      const newState = messages.slice(0, i);
                      messageHandlers.setState(newState);
                      await generate(newState);
                    }}
                  />
                ))}
              </Box>
            </Stack>
          </ScrollArea>
        )}
        <Stack
          align="center"
          px={{
            xs: 'sm',
            sm: 'xl',
          }}
          w="100%"
        >
          <form
            className="flex w-full flex-col items-center"
            onSubmit={form.onSubmit(async ({ message }) => {
              form.reset();
              await generate([
                ...messages,
                {
                  id: randomId(),
                  role: 'user',
                  content: message,
                },
              ]);
            })}
          >
            <Textarea
              autosize
              disabled={isGenerating}
              maw={{
                xs: '100%',
                sm: '720px',
              }}
              placeholder="ChatGPTにメッセージを送る..."
              radius="lg"
              rightSection={
                isGenerating ? (
                  <ActionIcon c="white" radius="md" size={30} variant="transparent" onClick={cancelGeneration}>
                    <IconPlaystationCircle />
                  </ActionIcon>
                ) : (
                  <Tooltip withArrow bg="black" c="white" fw={700} label="メッセージを送信">
                    <ActionIcon
                      c="black"
                      className={classes.sendButton}
                      disabled={!form.isValid()}
                      radius="md"
                      size={30}
                      type="submit"
                      variant="white"
                    >
                      <IconArrowUp className={classes.sendButtonIcon} />
                    </ActionIcon>
                  </Tooltip>
                )
              }
              size="lg"
              styles={{
                input: {
                  background: 'transparent',
                },
              }}
              w="100%"
              onKeyDown={async e => {
                if (e.keyCode === 13 && !e.shiftKey) {
                  form.reset();
                  e.preventDefault();
                  await generate([
                    ...messages,
                    {
                      id: Math.random().toString(36).substring(2, 9),
                      role: 'user',
                      content: form.values.message,
                    },
                  ]);
                } else if (e.keyCode === 13 && e.shiftKey) {
                  e.preventDefault();
                  form.setFieldValue('message', form.values.message + '\n');
                }
              }}
              {...form.getInputProps('message', {
                withError: false,
              })}
            />
          </form>
        </Stack>
        <Text mb="xs" size="xs">
          ChatGPTは間違いを犯すことがあります。重要な情報は確認をお考えください。
        </Text>
      </Stack>
    </AppShell.Main>
  );
}
