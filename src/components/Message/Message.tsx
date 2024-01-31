import type {
  AssistantMessage as AssistantMessageType,
  Message as MessageType,
  UserMessage as UserMessageType,
} from '@/types/message.ts';
import type { PrimitiveAtom } from 'jotai';

import { useTranslator } from '@/hooks/useTranslator.ts';
import { Avatar, Center, Group, Stack, Text } from '@mantine/core';
import { IconBrandOpenai } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { memo } from 'react';

interface UserMessageProps {
  message: UserMessageType;
}

const UserMessage = (props: UserMessageProps) => {
  const translate = useTranslator('main');

  return (
    <Group align="start" gap="12px" px="20px" py="xs" w="100%" wrap="nowrap">
      <Avatar mih={26} miw={26} size={26} />
      <Stack flex={1} gap={0} w="100%">
        <Text c="white" fw={700} style={{ userSelect: 'none' }}>
          {translate('message_user')}
        </Text>
        <Stack
          gap="xs"
          w={{
            md: '100%',
            lg: 'calc(100%-115px)',
          }}
        >
          <Text c="gray">{props.message.content}</Text>
        </Stack>
      </Stack>
    </Group>
  );
};

interface AssistantMessageProps {
  message: AssistantMessageType;
}

const AssistantMessage = (props: AssistantMessageProps) => {
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
        <Text c="white" fw={700} style={{ userSelect: 'none' }}>
          ChatGPT
        </Text>
        <Stack
          gap="xs"
          w={{
            md: '100%',
            lg: 'calc(100%-115px)',
          }}
        >
          <Text c="gray">{props.message.content}</Text>
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
