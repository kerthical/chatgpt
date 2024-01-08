import '@/styles/global.css';
import '@mantine/core/styles.css';
import * as classes from '@/pages/App/App.css.ts';
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
  ScrollArea,
  Stack,
  Text,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useClickOutside, useDisclosure, useListState, useMediaQuery } from '@mantine/hooks';
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
import { ReactNode, useState } from 'react';

import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

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
      id: 'gpt-4',
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

  const [generating, setGenerating] = useState(false);
  const [messages, handlers] = useListState<
    ChatCompletionMessageParam & {
      id?: string;
    }
  >();

  return (
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
              <ActionIcon c="white" p={6} size="lg" variant="default" visibleFrom="sm">
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
                      {models.find(m => m.id === model)!.version}
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
          <ActionIcon c="white" hiddenFrom="sm" size="sm" variant="transparent">
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
                >
                  <Group gap="xs">
                    <Center bg="white" className="rounded-full" h={28} w={28}>
                      <IconBrandOpenai color="black" height="80%" stroke={1} width="80%" />
                    </Center>
                    New chat
                  </Group>
                </Button>
                <Stack gap={0} w="100%">
                  {/*{mockHistory.map((history, index) => (*/}
                  {/*  <History key={index} name={history.name} selected={index === 0} />*/}
                  {/*))}*/}
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
                  <Menu.Item className={classes.accountMenuItem} leftSection={<IconSettings size={18} />}>
                    Settings
                  </Menu.Item>
                  <Menu.Item className={classes.accountMenuItem} leftSection={<IconLogout size={18} />}>
                    Logout
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
            <Box className={classes.sidebarChevronContainer} component="button" visibleFrom="sm" onClick={navbarToggle}>
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
              <Stack align="center" px="xl" w="100%">
                <Box maw={isMobile ? '100%' : '720px'} w="100%">
                  {messages.map((message, index) => (
                    <Message
                      key={message.id || index}
                      isLast={index === messages.length - 1}
                      message={{ role: message.role, content: message.content as string }}
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
                setGenerating(true);
                form.reset();

                handlers.append({
                  role: 'user',
                  content: message,
                });

                const openai = new OpenAI({
                  apiKey: localStorage.getItem('apiKey')!,
                  dangerouslyAllowBrowser: true,
                });

                const completion = await openai.chat.completions.create({
                  model,
                  stream: true,
                  messages: [
                    ...messages.map(m => ({
                      role: m.role,
                      content: m.content,
                    })),
                    {
                      role: 'user',
                      content: message,
                    },
                  ] as ChatCompletionMessageParam[],
                });

                let index = 0;
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
                  } else {
                    setGenerating(false);
                  }
                }
              })}
            >
              <Textarea
                autosize
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
                        // TODO: cancel generating
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
  );
}
