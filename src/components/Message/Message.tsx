import type {
  AssistantMessage as AssistantMessageType,
  Message as MessageType,
  UserMessage as UserMessageType,
} from '@/types/message.ts';
import type { PrimitiveAtom } from 'jotai';

import { useTranslator } from '@/hooks/useTranslator.ts';
import { Avatar, Box, Center, Group, Stack, Text } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { IconBrandOpenai } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import 'katex/dist/katex.min.css';
import { memo } from 'react';
import Markdown from 'react-markdown';
import { Prism } from 'react-syntax-highlighter';
import { materialDark as darkStyle, materialLight as lightStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import * as classes from './Message.css.ts';

interface UserMessageProps {
  message: UserMessageType;
}

const UserMessage = (props: UserMessageProps) => {
  const translate = useTranslator('main');
  const colorScheme = useColorScheme();

  return (
    <Group align="start" gap="12px" px="20px" py="xs" w="100%" wrap="nowrap">
      <Avatar mih={26} miw={26} size={26} />
      <Stack flex={1} gap={0} w="100%">
        <Text c={colorScheme === 'dark' ? 'white' : 'black'} fw={700} style={{ userSelect: 'none' }}>
          {translate('message_user')}
        </Text>
        <Stack
          gap="xs"
          w={{
            md: '100%',
            lg: 'calc(100%-115px)',
          }}
        >
          <Text c={colorScheme === 'dark' ? 'gray' : 'black'}>{props.message.content}</Text>
        </Stack>
      </Stack>
    </Group>
  );
};

interface AssistantMessageProps {
  message: AssistantMessageType;
}

const AssistantMessage = (props: AssistantMessageProps) => {
  const colorScheme = useColorScheme();

  return (
    <Group align="start" gap="xs" px="20px" py="xs" w="100%" wrap="nowrap">
      <Center
        bg="#ffffff"
        h={26}
        mih={26}
        miw={26}
        style={{
          borderRadius: '999px',
        }}
        w={26}
      >
        <IconBrandOpenai color="#000000" height="80%" stroke={1} width="80%" />
      </Center>
      <Stack gap={0} w="100%">
        <Text c={colorScheme === 'dark' ? 'white' : 'black'} fw={700} style={{ userSelect: 'none' }}>
          ChatGPT
        </Text>
        <Stack
          gap="xs"
          w={{
            md: '100%',
            lg: 'calc(100%-115px)',
          }}
        >
          <Box c={colorScheme === 'dark' ? 'gray' : 'black'} className={classes.prose}>
            <Markdown
              components={{
                code({ className, children }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return match ? (
                    <Prism
                      PreTag="div"
                      language={match[1]}
                      style={(colorScheme === 'dark' ? darkStyle : lightStyle) as never}
                    >
                      {String(children).replace(/\n$/, '')}
                    </Prism>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
              }}
              rehypePlugins={[rehypeKatex]}
              remarkPlugins={[remarkGfm, remarkMath]}
            >
              {props.message.content}
            </Markdown>
          </Box>
        </Stack>
      </Stack>
    </Group>
  );
};

interface MessageProps {
  message: PrimitiveAtom<MessageType>;
}

export const Message = memo<MessageProps>((props: MessageProps) => {
  const message = useAtomValue(props.message);

  switch (message.role) {
    case 'user':
      return <UserMessage message={message} />;
    case 'assistant':
      return <AssistantMessage message={message} />;
    default:
      return null;
  }
});

Message.displayName = 'Message';
