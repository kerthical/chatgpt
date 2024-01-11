import 'highlight.js/styles/github-dark.css';
import * as classes from '@/pages/App/Main/Message/Message.css.ts';
import { useHistories } from '@/hooks/useHistories.ts';
import { useModel } from '@/hooks/useModel.ts';
import {
  AssistantMessage as AssistantMessageType,
  Message as MessageType,
  ToolMessage as ToolMessageType,
  UserMessage as UserMessageType,
} from '@/types/Message.ts';
import { models } from '@/utils/constants.tsx';
import { marked } from '@/utils/file.ts';
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Center,
  Collapse,
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconBrandOpenai,
  IconClipboard,
  IconEdit,
  IconReload,
  IconTool,
  IconTriangleFilled,
} from '@tabler/icons-react';
import { useState } from 'react';

function UserMessage(props: { message: UserMessageType; onEdit: (newContent: string) => void }) {
  const { message, onEdit } = props;
  const [editingContent, setEditingContent] = useState(message.content);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Group align="start" className={classes.messageContainer} gap="xs" px="md" py="xs" w="100%" wrap="nowrap">
      <Avatar mih={26} miw={26} size={26} />
      <Stack gap={0} w="100%">
        <Text c="white" className="select-none" fw={700}>
          あなた
        </Text>
        <Stack className="lg:w-[calc(100%-115px)]" gap="xs">
          {isEditing ? (
            <Textarea
              autosize
              value={editingContent}
              onChange={e => setEditingContent(e.currentTarget.value)}
              onKeyDown={e => {
                if (e.keyCode === 13 && e.ctrlKey) {
                  e.preventDefault();
                  setIsEditing(false);
                  onEdit(editingContent);
                }
              }}
            />
          ) : (
            <Text
              c="gray"
              className={`prose prose-invert break-words ${classes.messageContent}`}
              dangerouslySetInnerHTML={{
                __html: marked.parse(message.content, {
                  gfm: true,
                  breaks: true,
                }),
              }}
            />
          )}
          {message.files.length > 0 && (
            <Group w="100%" wrap="nowrap">
              {message.files.map((file, i) =>
                file.url.startsWith('data:image/') ? (
                  <Box key={i} bg="dark.8" className={classes.messageFileContainer} w={256} h={256}>
                    <Image
                      h="100%"
                      radius="md"
                      src={file.url}
                      onClick={() =>
                        modals.open({
                          children: <Image h="100%" radius="md" src={file.url} w="100%" />,
                          centered: true,
                          withCloseButton: false,
                          size: 'xl',
                        })
                      }
                    />
                  </Box>
                ) : (
                  <Box
                    key={i}
                    bg="dark.8"
                    className={classes.messageFileContainer}
                    h={64}
                    w={128}
                    onClick={() =>
                      modals.open({
                        children: (
                          <Box
                            h="100%"
                            w="100%"
                            mt="lg"
                            className="prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: marked.parse(
                                '```' +
                                  file.name.split('.').pop() +
                                  '\n' +
                                  atob(file.url.split(',')[1])
                                    .split('\n')
                                    .map(line => line.replace(/\r/g, ''))
                                    .join('\n') +
                                  '\n```',
                                {
                                  gfm: true,
                                  breaks: true,
                                },
                              ),
                            }}
                          />
                        ),
                        title: file.name,
                        centered: true,
                        withCloseButton: false,
                        size: 'lg',
                        scrollAreaComponent: ScrollArea.Autosize,
                      })
                    }
                  >
                    <Center h="100%">
                      <Text c="white" size="xs">
                        {file.name}
                      </Text>
                    </Center>
                  </Box>
                ),
              )}
            </Group>
          )}
          {isEditing ? (
            <Group justify="center">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  onEdit(editingContent);
                }}
              >
                保存して提出
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditingContent(message.content);
                }}
              >
                キャンセル
              </Button>
            </Group>
          ) : (
            <Group className={classes.messageActions} gap={4}>
              <ActionIcon c="gray" size={20} variant="transparent" onClick={() => setIsEditing(true)}>
                <IconEdit />
              </ActionIcon>
            </Group>
          )}
        </Stack>
      </Stack>
    </Group>
  );
}

function AssistantMessage(props: { message: AssistantMessageType; isLast: boolean; onReload: () => void }) {
  const { message, isLast, onReload } = props;
  const { model } = useModel();
  const { histories } = useHistories();
  const historyModel = histories.find(h => h.messages.some(m => m.id === message?.id))?.model;
  const modelName = historyModel ? models.find(m => m.id === historyModel)?.name : model?.name;

  return (
    <Group align="start" className={classes.messageContainer} gap="xs" px="md" py="xs" w="100%" wrap="nowrap">
      <Center
        bg={modelName === 'GPT-4' ? '#ffffff' : '#19c37d'}
        className="rounded-full"
        h={26}
        mih={26}
        miw={26}
        w={26}
      >
        <IconBrandOpenai color={modelName === 'GPT-4' ? '#000000' : '#ffffff'} height="80%" stroke={1} width="80%" />
      </Center>
      <Stack gap={0} w="100%">
        <Text c="white" className="select-none" fw={700}>
          ChatGPT
        </Text>
        <Stack className="lg:w-[calc(100%-115px)]" gap="xs">
          <Text
            c="gray"
            className={`prose prose-invert break-words ${classes.messageContent}`}
            dangerouslySetInnerHTML={{
              __html: marked.parse(message.content, {
                gfm: true,
                breaks: true,
              }),
            }}
          />
          <Group className={classes.messageActions} gap={4}>
            <Tooltip withArrow bg="black" c="white" fw={700} label="Copy" position="bottom">
              <ActionIcon
                c="gray"
                size={20}
                variant="transparent"
                onClick={async () => {
                  await navigator.clipboard.writeText(message.content);
                }}
              >
                <IconClipboard />
              </ActionIcon>
            </Tooltip>
            {isLast && (
              <Tooltip withArrow bg="black" c="white" fw={700} label="Regenerate" position="bottom">
                <ActionIcon c="gray" size={20} variant="transparent" onClick={onReload}>
                  <IconReload />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Stack>
      </Stack>
    </Group>
  );
}

function ToolMessage(props: { message: ToolMessageType }) {
  const { message } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Group align="start" className={classes.messageContainer} gap="xs" px="md" py="xs" w="100%" wrap="nowrap">
      <Avatar mih={26} miw={26} size={26}>
        <IconTool />
      </Avatar>
      <Stack gap="xs" w="100%">
        <Tooltip withArrow label={isExpanded ? '閉じる' : '開く'} position="bottom-start" bg="black" c="white" fw={700}>
          <Group align="center" className={classes.collapseArea} gap="xs" onClick={() => setIsExpanded(!isExpanded)}>
            <Text c="white" className="select-none" fw={700}>
              ツール実行
            </Text>
            <ActionIcon c="gray" size={16} variant="transparent">
              <IconTriangleFilled className={isExpanded ? classes.collapseIconOpened : classes.collapseIconClosed} />
            </ActionIcon>
          </Group>
        </Tooltip>
        <Collapse className="lg:w-[calc(100%-115px)]" in={isExpanded}>
          <Text
            c="gray"
            className={`prose prose-invert break-words ${classes.messageContent}`}
            dangerouslySetInnerHTML={{
              __html: marked.parse('```\n' + message.content + '\n```', {
                gfm: true,
                breaks: true,
              }),
            }}
          />
        </Collapse>
      </Stack>
    </Group>
  );
}

export default function Message(props: {
  isLast: boolean;
  message: MessageType;
  onEdit: (newContent: string) => void;
  onReload: () => void;
}) {
  const { isLast, message, onEdit, onReload } = props;

  if (message.content === '') return null;

  switch (message.role) {
    case 'user':
      return <UserMessage message={message as UserMessageType} onEdit={onEdit} />;
    case 'assistant':
      return <AssistantMessage message={message as AssistantMessageType} isLast={isLast} onReload={onReload} />;
    case 'tool':
      return <ToolMessage message={message as ToolMessageType} />;
    default:
      return null;
  }
}
