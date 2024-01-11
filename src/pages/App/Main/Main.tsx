import * as classes from '@/pages/App/Main/Main.css.ts';
import { useGenerate } from '@/hooks/useGenerate.tsx';
import { useGeneratingTask } from '@/hooks/useGeneratingTask.ts';
import { useMessages } from '@/hooks/useMessages.ts';
import { useModel } from '@/hooks/useModel.ts';
import { useNavbar } from '@/hooks/useNavbar.ts';
import Message from '@/pages/App/Main/Message/Message.tsx';
import { Message as MessageType, UserMessage } from '@/types/Message.ts';
import { getUrl } from '@/utils/file.ts';
import {
  ActionIcon,
  AppShell,
  Box,
  Center,
  FileButton,
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { randomId, useFocusWithin } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { IconArrowUp, IconBrandOpenai, IconPlaystationCircle, IconTrash } from '@tabler/icons-react';

export function Main() {
  const { isNavbarOpened, toggleNavbar } = useNavbar();
  const { messages, setMessages } = useMessages();
  const { isGenerating, cancelGeneration } = useGeneratingTask();
  const { generate } = useGenerate();
  const { model } = useModel();
  const { ref: messageInputRef, focused: messageInputFocused } = useFocusWithin();
  const form = useForm({
    initialValues: {
      message: '',
      files: [] as {
        name: string;
        url: string;
      }[],
    },
    validate: {
      message: value => value.trim().length <= 0,
    },
    validateInputOnChange: true,
  });

  async function generateWithNewMessage() {
    form.reset();
    await generate([...messages, new UserMessage(randomId(), form.values.message, form.values.files)] as MessageType[]);
  }

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
                w="100%"
                maw={{
                  xs: '100%',
                  sm: '720px',
                }}
              >
                {messages.map((m, i) => (
                  <Message
                    key={m.id || i}
                    isLast={i === messages.length - 1}
                    message={m}
                    onEdit={async newContent => {
                      const newState = messages.slice(0, i + 1);
                      if (Array.isArray(newState[i].content)) {
                        newState[0].content = newContent;
                      } else {
                        newState[i].content = newContent;
                      }
                      setMessages(newState);
                      await generate(newState);
                    }}
                    onReload={async () => {
                      const newState = messages.slice(0, i);
                      setMessages(newState);
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
          w="100%"
          px={{
            base: 'sm',
            sm: 'xl',
          }}
        >
          <form className="flex w-full flex-col items-center" onSubmit={form.onSubmit(generateWithNewMessage)}>
            {model?.name === 'GPT-4' && form.values.files.length > 0 && (
              <Group
                className={messageInputFocused ? classes.messageFileAreaFocused : classes.messageFileAreaUnfocused}
                h={128}
                p="md"
                w="100%"
                wrap="nowrap"
                maw={{
                  xs: '100%',
                  sm: '720px',
                }}
              >
                {form.values.files.map((file, i) => (
                  <Box key={i} bg="dark.8" className={classes.messageFileContainer} h="100%" p="xs" pos="relative">
                    <Image
                      className={classes.messageFileImage}
                      h="100%"
                      radius="md"
                      src={file.url}
                      onClick={() =>
                        modals.open({
                          children: <Image h="100%" radius="md" src={file.url} />,
                          centered: true,
                          withCloseButton: false,
                          size: 'xl',
                        })
                      }
                    />
                    <ActionIcon
                      className={classes.messageFileActionIcon}
                      radius="sm"
                      size={28}
                      onClick={() => {
                        form.setFieldValue(
                          'files',
                          form.values.files.filter((_, j) => i !== j),
                        );
                      }}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </Box>
                ))}
              </Group>
            )}
            <Textarea
              ref={messageInputRef}
              autoFocus
              autosize
              className={model?.name === 'GPT-4' && form.values.files.length > 0 ? classes.messageInputWithFile : ''}
              placeholder="ChatGPTにメッセージを送る..."
              radius="lg"
              size="lg"
              w="100%"
              leftSection={
                model?.name === 'GPT-4' && (
                  <FileButton
                    multiple
                    onChange={async e => {
                      form.setFieldValue('files', [
                        ...form.values.files,
                        ...(await Promise.all(e.map(async f => ({ name: f.name, url: await getUrl(f) })))),
                      ]);
                    }}
                  >
                    {props => (
                      <ActionIcon c="white" radius="md" size={30} variant="transparent" {...props}>
                        <IconArrowUp />
                      </ActionIcon>
                    )}
                  </FileButton>
                )
              }
              maw={{
                sm: '720px',
              }}
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
              styles={{
                input: {
                  background: 'transparent',
                },
              }}
              onKeyDown={async e => {
                if (e.keyCode === 13 && !e.shiftKey && !isGenerating) {
                  e.preventDefault();
                  await generateWithNewMessage();
                } else if (e.keyCode === 13 && e.shiftKey) {
                  e.preventDefault();
                  form.setFieldValue('message', form.values.message + '\n');
                }
              }}
              onPaste={async e => {
                const items = e.clipboardData.items;
                if (items.length > 0 && items[0].type.indexOf('image') !== -1) {
                  const file = items[0].getAsFile();
                  if (file) {
                    form.setFieldValue('files', [
                      ...form.values.files,
                      {
                        name: file.name,
                        url: await getUrl(file),
                      },
                    ]);
                  }
                } else {
                  const file = e.clipboardData.files[0];
                  if (file && file.type.indexOf('image') !== -1) {
                    form.setFieldValue('files', [
                      ...form.values.files,
                      {
                        name: file.name,
                        url: await getUrl(file),
                      },
                    ]);
                  }
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
