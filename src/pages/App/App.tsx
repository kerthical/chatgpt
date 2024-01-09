import * as classes from '@/pages/App/App.css.ts';
import History from '@/pages/App/History/History.tsx';
import Message from '@/pages/App/Message/Message.tsx';
import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Button,
  Center,
  Group,
  Menu,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useClickOutside, useDisclosure, useListState, useMediaQuery } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconArrowUp,
  IconBolt,
  IconBrandOpenai,
  IconChevronDown,
  IconCircle,
  IconCircleCheckFilled,
  IconEdit,
  IconLogout,
  IconMenu,
  IconPlaystationCircle,
  IconSettings,
  IconSparkles,
  IconX,
} from '@tabler/icons-react';
import { OpenAI } from 'openai';
import { Stream } from 'openai/streaming';
import { ReactNode, useEffect, useState } from 'react';

import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;
import ChatCompletionChunk = OpenAI.Chat.ChatCompletionChunk;

function Model(props: { name: string; description: string; icon: ReactNode; selected: boolean; onClick: () => void }) {
  const { name, description, icon, selected, onClick } = props;
  return (
    <Menu.Item className={classes.modelSelectorItem} onClick={onClick}>
      <Group align="center" justify="space-between" wrap="nowrap">
        <Group>
          {icon}
          <Stack gap={0}>
            <Text c="white" size="sm">
              {name}
            </Text>
            <Text c="gray.6" size="sm">
              {description}
            </Text>
          </Stack>
        </Group>
        {selected ? (
          <IconCircleCheckFilled color="white" size={18} />
        ) : (
          <IconCircle color="gray" size={18} stroke={2} />
        )}
      </Group>
    </Menu.Item>
  );
}

export default function App() {
  const isMobile = useMediaQuery('(max-width: 48em)');
  const navbarRef = useClickOutside(() => isMobile && navbarClose());
  const [navbarOpened, { close: navbarClose, toggle: navbarToggle }] = useDisclosure(!isMobile);
  const [modelSelectorOpened, setModelSelectorOpened] = useState(false);
  const [accountMenuOpened, setAccountMenuOpened] = useState(false);
  const models = [
    {
      id: 'gpt-3.5-turbo-1106',
      name: 'GPT-3.5',
      version: '3.5',
      description: '日常のタスクに最適',
      icon: <IconBolt color="white" size={18} stroke={2} />,
    },
    {
      id: 'gpt-4-1106-preview',
      name: 'GPT-4',
      version: '4',
      description: '私たちの最も賢く、最も能力のあるモデル。',
      icon: <IconSparkles color="white" size={18} stroke={2} />,
    },
  ];
  const [model, setModel] = useState(models[0].id);
  const form = useForm({
    initialValues: {
      message: '',
    },
    validate: {
      message: value => value.trim().length <= 0,
    },
    validateInputOnChange: true,
  });
  const [images, setImages] = useState<(string | ArrayBuffer | File)[]>([]);

  const [generatingTask, setGeneratingTask] = useState<Stream<ChatCompletionChunk> | null>(null);
  const [generating, setGenerating] = useState(false);
  const [messages, handlers] = useListState<
    ChatCompletionMessageParam & {
      id: string;
    }
  >();
  const [selectedHistory, setSelectedHistory] = useState<string | null>();
  const [history, setHistory] = useState<
    {
      id: string;
      name: string;
      model: string;
      messages: (ChatCompletionMessageParam & {
        id: string;
      })[];
    }[]
  >();
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);

  function newChat() {
    generatingTask?.controller.abort();
    setGeneratingTask(null);
    setGenerating(false);
    setSelectedHistory(null);
    handlers.setState([]);
  }

  useEffect(() => {
    setHistory(JSON.parse(localStorage.getItem('history') || '[]'));
  }, []);

  useEffect(() => {
    if (history && selectedHistory) {
      const selected = history.find(h => h.id === selectedHistory);
      if (selected) {
        document.title = `ChatGPT - ${selected.name}`;
        setModel(selected.model);
        handlers.setState(selected.messages);
      }
    }
  }, [selectedHistory]);

  async function generate(
    historyId: string | null | undefined,
    messages: (ChatCompletionMessageParam & { id: string })[],
  ) {
    try {
      setGenerating(true);
      const openai = new OpenAI({
        apiKey: localStorage.getItem('apiKey')!,
        dangerouslyAllowBrowser: true,
      });

      handlers.setState(messages);

      const completion = await openai.chat.completions.create({
        model: images.length > 0 ? 'gpt-4-vision-preview' : model,
        max_tokens: 4096,
        stream: true,
        messages: messages.map((m, i) => ({
          role: m.role,
          content:
            i === messages.length - 1 && images.length > 0
              ? [
                  {
                    type: 'text',
                    text: m.content,
                  },
                  ...images
                    .filter(image => image.toString().startsWith('data:image/'))
                    .map(image => ({
                      type: 'image_url',
                      image_url: {
                        url: image as string,
                        detail: 'high',
                      },
                    })),
                ]
              : m.content,
        })) as ChatCompletionMessageParam[],
      });

      setGeneratingTask(completion);

      let index = 0;
      let content = '';
      let assistantId = '';
      for await (const chunk of completion) {
        const id = chunk.id;
        const delta = chunk.choices[0].delta.content;
        if (delta) {
          if (index === 0) {
            handlers.append({
              id,
              role: 'assistant',
              content: delta,
            });
          } else {
            handlers.applyWhere(
              item => item.id === id,
              item => ({
                ...item,
                content: item.content + delta,
              }),
            );
          }
          index++;
          content += delta;
          assistantId = id;
        }
      }

      setGenerating(false);
      setGeneratingTask(null);

      const conversation = [
        ...messages.map((m, i) => ({
          id: m.id,
          role: m.role,
          content:
            i === messages.length - 1 && images.length > 0
              ? [
                  {
                    type: 'text',
                    text: m.content,
                  },
                  ...images
                    .filter(image => image.toString().startsWith('data:image/'))
                    .map(image => ({
                      type: 'image_url',
                      image_url: {
                        url: image as string,
                        detail: 'high',
                      },
                    })),
                ]
              : m.content,
        })),
        {
          id: assistantId,
          role: 'assistant',
          content: content,
        },
      ];
      const history = JSON.parse(localStorage.getItem('history') || '[]');
      if (historyId) {
        history.find((h: { id: string }) => h.id === historyId)!.messages = conversation;
      } else {
        const summarizeCompletion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo-1106',
          messages: [
            {
              role: 'user',
              content:
                'Create an appropriate head title of 3~5 words that summarizes this conversation. The response should only include the title content, no other information.\n\n' +
                conversation.map(m => `${m.role}:\n${m.content}\n`).join('\n---\n'),
            },
          ],
        });
        const id = Math.random().toString(36).substring(2, 9);
        history.push({
          id,
          name: summarizeCompletion.choices[0].message.content,
          model,
          messages: conversation,
        });
        setSelectedHistory(id);
      }

      setHistory(history);
      localStorage.setItem('history', JSON.stringify(history));
    } catch (e) {
      notifications.show({
        title: 'An error occurred while generating the message.',
        message: 'Error details have been logged to the console.',
      });
      console.error(e);
    } finally {
      setGenerating(false);
      setGeneratingTask(null);
    }
  }

  return (
    <>
      <Modal centered opened={modalOpened} title="設定" onClose={closeModal}>
        <Button
          fullWidth
          onClick={() => {
            localStorage.removeItem('history');
            setHistory([]);
          }}
        >
          会話履歴をすべて削除
        </Button>
      </Modal>
      <AppShell
        header={{
          height: 60,
        }}
        layout="alt"
        navbar={{
          width: {
            base: 320,
            sm: 260,
          },
          breakpoint: 'sm',
          collapsed: {
            desktop: !navbarOpened,
            mobile: !navbarOpened,
          },
        }}
        transitionDuration={200}
        withBorder={false}
      >
        <AppShell.Header>
          <Group align="center" h="100%" justify="space-between" p={8} w="100%">
            <ActionIcon c="white" hiddenFrom="sm" size="sm" variant="transparent" onClick={navbarToggle}>
              <IconMenu />
            </ActionIcon>
            <Group align="center" gap="xs">
              {!navbarOpened && (
                <ActionIcon c="white" p={6} size="lg" variant="default" visibleFrom="sm" onClick={newChat}>
                  <IconEdit />
                </ActionIcon>
              )}
              <Menu
                opened={modelSelectorOpened}
                position={isMobile ? 'bottom' : 'bottom-start'}
                onChange={setModelSelectorOpened}
              >
                <Menu.Target>
                  <Group
                    align="center"
                    className={
                      modelSelectorOpened ? classes.modelSelectorButtonOpened : classes.modelSelectorButtonClosed
                    }
                    component="button"
                    gap={2}
                  >
                    <Text c="white" fw={700} size="lg">
                      ChatGPT {` `}
                      <Text span c="gray" fw={700}>
                        {models.find(m => m.id === model)?.version ?? model}
                      </Text>
                    </Text>
                    <IconChevronDown color="gray" size={16} stroke={3} />
                  </Group>
                </Menu.Target>
                <Menu.Dropdown className={classes.modelSelector}>
                  {models.map(m => (
                    <Model
                      key={m.id}
                      description={m.description}
                      icon={m.icon}
                      name={m.name}
                      selected={m.id === model}
                      onClick={() => setModel(m.id)}
                    />
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Group>
            <ActionIcon c="white" hiddenFrom="sm" size="sm" variant="transparent" onClick={newChat}>
              <IconEdit />
            </ActionIcon>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar bg="rgba(0, 0, 0, 0.2)">
          <Group align="start" gap={0} h="100%" w="100%">
            <Box ref={navbarRef} bg="black" h="100%" px="sm" py="md" w={isMobile ? 320 : 260}>
              <Stack align="center" h="100%">
                <Stack className="flex-1" w="100%">
                  <Button
                    c="white"
                    className={classes.newChatButton}
                    h={40}
                    justify="space-between"
                    px="xs"
                    rightSection={<IconEdit size={18} />}
                    variant="subtle"
                    w="100%"
                    onClick={newChat}
                  >
                    <Group gap="xs">
                      <Center bg="white" className="rounded-full" h={28} w={28}>
                        <IconBrandOpenai color="black" height="80%" stroke={1} width="80%" />
                      </Center>
                      New chat
                    </Group>
                  </Button>
                  <Stack gap={0} w="100%">
                    {history?.map(h => (
                      <History
                        key={h.id}
                        name={h.name}
                        selected={h.id === selectedHistory}
                        selectedHistoryId={selectedHistory}
                        onClick={() => setSelectedHistory(h.id)}
                        onRemove={() => {
                          const newHistory = [...history];
                          newHistory.splice(
                            newHistory.findIndex((hi: { id: string }) => hi.id === h.id),
                            1,
                          );
                          setHistory(newHistory);
                          localStorage.setItem('history', JSON.stringify(newHistory));
                          if (h.id === selectedHistory) {
                            newChat();
                          }
                        }}
                        onRename={newName => {
                          const newHistory = [...history];
                          newHistory.find((hi: { id: string }) => hi.id === h.id)!.name = newName;
                          setHistory(newHistory);
                          localStorage.setItem('history', JSON.stringify(newHistory));
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>
                <Menu
                  opened={accountMenuOpened}
                  position="top"
                  transitionProps={{
                    transition: 'pop',
                  }}
                  width={236}
                  onChange={setAccountMenuOpened}
                >
                  <Menu.Target>
                    <Button
                      c="white"
                      className={accountMenuOpened ? classes.accountMenuButtonOpened : classes.accountMenuButtonClosed}
                      h={44}
                      justify="space-between"
                      px="xs"
                      variant="subtle"
                      w="100%"
                    >
                      <Group gap="xs">
                        <Avatar radius="xl" size={28} />
                        <Text size="sm">Account</Text>
                      </Group>
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown className={classes.accountMenu}>
                    <Menu.Item
                      className={classes.accountMenuItem}
                      leftSection={<IconSettings size={18} />}
                      onClick={() => {
                        openModal();
                        setAccountMenuOpened(false);
                      }}
                    >
                      設定
                    </Menu.Item>
                    <Menu.Item
                      className={classes.accountMenuItem}
                      leftSection={<IconLogout size={18} />}
                      onClick={() => {
                        localStorage.removeItem('apiKey');
                        localStorage.removeItem('history');
                        window.location.reload();
                      }}
                    >
                      ログアウト
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Stack>
            </Box>
            <Box hiddenFrom="sm" p="sm">
              <ActionIcon c="white" size="sm" variant="transparent" onClick={navbarToggle}>
                <IconX />
              </ActionIcon>
            </Box>
          </Group>
        </AppShell.Navbar>
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
              label={navbarOpened ? 'サイドバーを閉じる' : 'サイドバーを開く'}
              position="right"
            >
              <Box
                className={classes.sidebarChevronContainer}
                component="button"
                visibleFrom="sm"
                onClick={navbarToggle}
              >
                <div className={navbarOpened ? classes.sidebarChevronUpperOpened : classes.sidebarChevronUpperClosed} />
                <div className={navbarOpened ? classes.sidebarChevronLowerOpened : classes.sidebarChevronLowerClosed} />
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
                  <Box maw={isMobile ? '100%' : '720px'} w="100%">
                    {messages.map((message, index) => (
                      <Message
                        key={message.id || index}
                        isLast={index === messages.length - 1}
                        message={message}
                        onEdit={async newContent => {
                          let newState = [...messages];
                          newState[index].content = newContent;
                          newState = newState.slice(0, index + 1);
                          handlers.setState(newState);
                          await generate(selectedHistory!, newState);
                        }}
                        onReload={async () => {
                          let newState = [...messages];
                          newState = newState.slice(0, index);
                          handlers.setState(newState);
                          await generate(selectedHistory!, newState);
                        }}
                      />
                    ))}
                  </Box>
                </Stack>
              </ScrollArea>
            )}
            <Stack align="center" px={isMobile ? 'sm' : 'xl'} w="100%">
              <form
                className="flex w-full flex-col items-center"
                onSubmit={form.onSubmit(async ({ message }) => {
                  form.reset();
                  setImages([]);
                  await generate(selectedHistory, [
                    ...messages,
                    {
                      id: Math.random().toString(36).substring(2, 9),
                      role: 'user',
                      content: message,
                    },
                  ]);
                })}
              >
                <Textarea
                  autosize
                  disabled={generating}
                  leftSection={
                    images.length > 0 ? (
                      <ActionIcon c="white" radius="md" size={30} variant="transparent" onClick={() => setImages([])}>
                        <Avatar src={images[0] as string} />
                      </ActionIcon>
                    ) : (
                      <ActionIcon
                        c="white"
                        radius="md"
                        size={30}
                        variant="transparent"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.multiple = true;
                          input.onchange = () => {
                            const files = Array.from(input.files!);
                            const images = files.filter(f => f.type.startsWith('image/'));
                            if (images.length > 0) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setImages([reader.result, ...images]);
                                }
                              };
                              reader.readAsDataURL(images[0]);
                            }
                          };
                          input.click();
                        }}
                      >
                        <IconArrowUp />
                      </ActionIcon>
                    )
                  }
                  maw={isMobile ? '100%' : '720px'}
                  placeholder="ChatGPTにメッセージを送る..."
                  radius="lg"
                  rightSection={
                    generating ? (
                      <ActionIcon
                        c="white"
                        radius="md"
                        size={30}
                        variant="transparent"
                        onClick={() => {
                          if (generatingTask) {
                            generatingTask.controller.abort();
                          }
                        }}
                      >
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
                      setImages([]);
                      e.preventDefault();
                      await generate(selectedHistory, [
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
                  onPaste={e => {
                    if (e.clipboardData.files.length > 0) {
                      e.preventDefault();
                      const files = Array.from(e.clipboardData.files);
                      const images = files.filter(f => f.type.startsWith('image/'));
                      if (images.length > 0) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            setImages([reader.result, ...images]);
                          }
                        };
                        reader.readAsDataURL(images[0]);
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
      </AppShell>
    </>
  );
}
