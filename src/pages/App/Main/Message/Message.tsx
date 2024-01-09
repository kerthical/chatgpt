import 'highlight.js/styles/github-dark.css';
import * as classes from '@/pages/App/Main/Message/Message.css.ts';
import { Message as MessageType } from '@/types/Message.ts';
import { ActionIcon, Avatar, Button, Center, Group, Image, Stack, Text, Textarea, Tooltip } from '@mantine/core';
import { IconBrandOpenai, IconClipboard, IconEdit, IconReload } from '@tabler/icons-react';
import hljs from 'highlight.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { useState } from 'react';

export default function Message(props: {
  isLast: boolean;
  message: MessageType;
  onEdit: (newContent: string) => void;
  onReload: () => void;
}) {
  const { message, isLast, onEdit, onReload } = props;
  const marked = new Marked(
    markedHighlight({
      highlight(code, lang, _info) {
        return lang && hljs.getLanguage(lang)
          ? hljs.highlight(code, {
              language: lang,
              ignoreIllegals: true,
            }).value
          : code;
      },
    }),
  );

  const image = Array.isArray(message.content) ? message.content.find(c => c.type === 'image_url') : undefined;
  const image_url = image?.type === 'image_url' ? image.image_url.url : undefined;
  const renderContent = Array.isArray(message.content)
    ? message.content[0]!.type === 'text'
      ? message.content[0]!.text
      : ''
    : message.content ?? '';

  const [content, setContent] = useState(renderContent);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Group align="start" className={classes.messageContainer} gap="xs" px="md" py="xs" w="100%" wrap="nowrap">
      {message.role === 'user' ? (
        <Avatar mih={26} miw={26} size={26} />
      ) : (
        <Center bg="#19c37d" className="rounded-full" h={26} mih={26} miw={26} w={26}>
          <IconBrandOpenai color="white" height="80%" stroke={1} width="80%" />
        </Center>
      )}
      <Stack gap={0} w="100%">
        <Text c="white" className="select-none" fw={700}>
          {message.role === 'user' ? 'あなた' : 'ChatGPT'}
        </Text>
        <Stack className="lg:w-[calc(100%-115px)]" gap="xs">
          {isEditing ? (
            <Textarea
              autosize
              leftSection={image_url && <Avatar src={image_url} />}
              value={content}
              onChange={e => setContent(e.currentTarget.value)}
              onKeyDown={e => {
                if (e.keyCode === 13 && e.ctrlKey) {
                  e.preventDefault();
                  setIsEditing(false);
                  onEdit(content);
                }
              }}
            />
          ) : (
            <>
              <Text
                c="gray"
                className={`prose prose-invert break-words ${classes.messageContent}`}
                dangerouslySetInnerHTML={{
                  __html: marked.parse(renderContent, {
                    gfm: true,
                    breaks: true,
                  }),
                }}
              />
              {image_url && <Image radius="md" src={image_url} />}
            </>
          )}
          {isEditing ? (
            <Group justify="center">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  onEdit(content);
                }}
              >
                保存して提出
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setContent(renderContent);
                }}
              >
                キャンセル
              </Button>
            </Group>
          ) : (
            <Group className={classes.messageActions} gap={4}>
              {message.role === 'user' ? (
                <>
                  <ActionIcon c="gray" size={20} variant="transparent" onClick={() => setIsEditing(true)}>
                    <IconEdit />
                  </ActionIcon>
                </>
              ) : (
                <>
                  <Tooltip withArrow bg="black" c="white" fw={700} label="Copy" position="bottom">
                    <ActionIcon
                      c="gray"
                      size={20}
                      variant="transparent"
                      onClick={async () => {
                        await navigator.clipboard.writeText(renderContent);
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
                </>
              )}
            </Group>
          )}
        </Stack>
      </Stack>
    </Group>
  );
}
