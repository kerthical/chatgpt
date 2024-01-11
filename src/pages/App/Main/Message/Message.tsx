import 'highlight.js/styles/github-dark.css';
import * as classes from '@/pages/App/Main/Message/Message.css.ts';
import { useGeneratingTask } from '@/hooks/useGeneratingTask.ts';
import { useHistories } from '@/hooks/useHistories.ts';
import { useModel } from '@/hooks/useModel.ts';
import Attachment from '@/pages/App/Main/Attachment/Attachment.tsx';
import {
  AssistantMessage as AssistantMessageType,
  Message as MessageType,
  ToolMessage as ToolMessageType,
  UserMessage as UserMessageType,
} from '@/types/Message.ts';
import { models } from '@/utils/constants.tsx';
import { marked } from '@/utils/utils.ts';
import { ActionIcon, Avatar, Button, Center, Collapse, Group, Stack, Text, Textarea, Tooltip } from '@mantine/core';
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
              onChange={e => setEditingContent(e.currentTarget.value)}
              value={editingContent}
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
            <Group h="100%" w="100%" wrap="nowrap">
              {message.files.map((attachment, i) => (
                <Attachment key={i} attachment={attachment} type="message" />
              ))}
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
              <ActionIcon c="gray" onClick={() => setIsEditing(true)} size={20} variant="transparent">
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
  const { isGenerating } = useGeneratingTask();
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
              __html: marked.parse(message.content + (isGenerating ? '●' : ''), {
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
                <ActionIcon c="gray" onClick={onReload} size={20} variant="transparent">
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
        <IconTool size={18} />
      </Avatar>
      <Stack gap="xs" w="100%">
        <Tooltip withArrow bg="black" c="white" fw={700} label={isExpanded ? '閉じる' : '開く'} position="bottom-start">
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
      return <AssistantMessage isLast={isLast} message={message as AssistantMessageType} onReload={onReload} />;
    case 'tool':
      return <ToolMessage message={message as ToolMessageType} />;
    default:
      return null;
  }
}
